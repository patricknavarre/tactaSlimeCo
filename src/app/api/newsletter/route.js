import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function POST(req) {
  const { email } = await req.json();
  if (!email) {
    return NextResponse.json({ success: false, error: 'Email required' }, { status: 400 });
  }

  try {
    // Store in MongoDB
    const { db } = await connectToDatabase();
    await db.collection('newsletter_signups').updateOne(
      { email },
      { $set: { email, date: new Date() } },
      { upsert: true }
    );

    // Log environment variables for debugging
    console.log('EMAILJS_SERVICE_ID:', process.env.EMAILJS_SERVICE_ID);
    console.log('EMAILJS_TEMPLATE_ID_SUBSCRIBER:', process.env.EMAILJS_TEMPLATE_ID_SUBSCRIBER);
    console.log('EMAILJS_USER_ID:', process.env.EMAILJS_USER_ID);
    console.log('EMAILJS_TEMPLATE_ID_ADMIN:', process.env.EMAILJS_TEMPLATE_ID_ADMIN);

    // Send confirmation to subscriber
    const subscriberRes = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        service_id: process.env.EMAILJS_SERVICE_ID,
        template_id: process.env.EMAILJS_TEMPLATE_ID_SUBSCRIBER,
        user_id: process.env.EMAILJS_USER_ID,
        template_params: {
          to_email: email,
        }
      })
    });
    const subscriberData = await subscriberRes.json();
    console.log('EmailJS subscriber response:', subscriberData);

    // Send notification to admin
    const adminRes = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        service_id: process.env.EMAILJS_SERVICE_ID,
        template_id: process.env.EMAILJS_TEMPLATE_ID_ADMIN,
        user_id: process.env.EMAILJS_USER_ID,
        template_params: {
          subscriber_email: email,
        }
      })
    });
    const adminData = await adminRes.json();
    console.log('EmailJS admin response:', adminData);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Newsletter API error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
} 