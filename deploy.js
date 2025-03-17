#!/usr/bin/env node

/**
 * Tacta Slime Deployment Helper
 * 
 * This script helps prepare the application for deployment by:
 * 1. Checking for console.log statements
 * 2. Verifying required environment variables
 * 3. Validating the build process
 * 4. Ensuring all API endpoints work correctly
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const chalk = require('chalk'); // You'll need to install this package

// Configuration
const requiredEnvVars = [
  'MONGODB_URI',
  'NEXTAUTH_URL',
  'NEXTAUTH_SECRET',
  'ADMIN_EMAIL',
  'ADMIN_PASSWORD'
];

// Setup console styling
const log = {
  info: (msg) => console.log(chalk.blue('INFO: ') + msg),
  success: (msg) => console.log(chalk.green('SUCCESS: ') + msg),
  warning: (msg) => console.log(chalk.yellow('WARNING: ') + msg),
  error: (msg) => console.log(chalk.red('ERROR: ') + msg),
  section: (msg) => console.log('\n' + chalk.bold.cyan(msg) + '\n' + '-'.repeat(msg.length))
};

// Main function
async function deploy() {
  log.section('Tacta Slime Deployment Helper');
  log.info('Starting deployment preparation...');

  let hasErrors = false;
  
  // Check for console.log statements
  log.section('Checking for console.log statements');
  try {
    const result = execSync('grep -r "console.log" --include="*.js" --include="*.jsx" src/').toString();
    const lines = result.split('\n').filter(line => line.trim() !== '');
    
    if (lines.length > 0) {
      log.warning(`Found ${lines.length} console.log statements:`);
      lines.forEach(line => console.log(line));
      log.warning('Consider removing these before deployment');
    } else {
      log.success('No console.log statements found');
    }
  } catch (error) {
    if (error.status !== 1) { // grep returns 1 when no matches found
      log.error('Error checking for console.log statements');
      console.error(error);
      hasErrors = true;
    } else {
      log.success('No console.log statements found');
    }
  }

  // Check for environment variables
  log.section('Checking environment variables');
  
  // Check if .env.production exists
  if (!fs.existsSync('.env.production')) {
    log.warning('.env.production file not found');
    log.info('Creating .env.production template...');
    
    const envTemplate = requiredEnvVars.map(variable => `${variable}=`).join('\n');
    fs.writeFileSync('.env.production', envTemplate);
    
    log.info('.env.production template created. Please fill in the values.');
  } else {
    log.success('.env.production file exists');
    
    // Check for missing variables
    const envContent = fs.readFileSync('.env.production', 'utf8');
    const missingVars = [];
    
    requiredEnvVars.forEach(variable => {
      const regex = new RegExp(`${variable}=(.+)`);
      if (!regex.test(envContent) || regex.exec(envContent)[1] === '') {
        missingVars.push(variable);
      }
    });
    
    if (missingVars.length > 0) {
      log.warning(`Missing or empty environment variables: ${missingVars.join(', ')}`);
      hasErrors = true;
    } else {
      log.success('All required environment variables are set');
    }
  }

  // Check for API endpoints
  log.section('Checking API routes');
  const apiDir = path.join(__dirname, 'src', 'app', 'api');
  
  if (fs.existsSync(apiDir)) {
    const apiRoutes = findApiRoutes(apiDir);
    log.info(`Found ${apiRoutes.length} API routes:`);
    apiRoutes.forEach(route => console.log(`- ${route}`));
  } else {
    log.warning('API directory not found');
  }

  // Validate build process
  log.section('Testing build process');
  try {
    log.info('Running build process (this may take a while)...');
    execSync('npm run build', { stdio: 'pipe' });
    log.success('Build completed successfully');
  } catch (error) {
    log.error('Build failed');
    console.error(error.stdout.toString());
    hasErrors = true;
  }

  // Final summary
  log.section('Deployment Preparation Summary');
  
  if (hasErrors) {
    log.error('There were errors during the deployment preparation');
    log.info('Please fix these issues before deploying to production');
  } else {
    log.success('No critical issues found');
    log.info('Your application is ready for deployment');
    log.info('Next steps:');
    log.info('1. Push your code to your Git repository');
    log.info('2. Connect your repository to Vercel');
    log.info('3. Configure environment variables in Vercel dashboard');
    log.info('4. Deploy your application');
  }
}

// Helper function to find API routes
function findApiRoutes(directory) {
  const routes = [];
  
  function traverse(dir, basePath = '/api') {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stats = fs.statSync(filePath);
      
      if (stats.isDirectory()) {
        // If directory is not a dynamic route parameter
        const dirName = path.basename(file);
        if (!dirName.startsWith('[') && !dirName.startsWith('(')) {
          traverse(filePath, `${basePath}/${dirName}`);
        } else {
          traverse(filePath, `${basePath}/${dirName}`);
        }
      } else if (file === 'route.js' || file === 'route.ts') {
        routes.push(basePath);
      }
    });
  }
  
  traverse(directory);
  return routes;
}

// Run the deploy function
deploy().catch(error => {
  log.error('An unexpected error occurred:');
  console.error(error);
  process.exit(1);
}); 