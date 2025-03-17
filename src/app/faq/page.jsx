import React from 'react';
import Link from 'next/link';
import Layout from '@/components/layout/Layout';

export default function FAQPage() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-tacta-pink-light to-tacta-peach-light py-16">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
              Slime Care Guide & FAQs
            </h1>
            <p className="text-lg mb-8 text-gray-700">
              Everything you need to know about caring for your Tacta Slime and getting the most out of your sensory experience!
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Content Section */}
      <section className="py-16">
        <div className="container-custom max-w-4xl">
          <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
            <h2 className="text-3xl font-bold mb-6 text-tacta-pink">Slime Basics</h2>
            <p className="text-gray-700 mb-6">
              New to the world of slime? Here's everything you need to know about our handcrafted slimes and how to care for them.
            </p>

            <div className="mb-12">
              <h3 className="text-xl font-bold mb-4 text-gray-800">What is Slime?</h3>
              <p className="text-gray-700 mb-4">
                Slime is a non-Newtonian fluid that provides a unique sensory experience. Our slimes are primarily made from glue and activator, which creates a stretchy, pliable substance that's incredibly fun to play with. Over time, the activator can evaporate, causing the slime to gradually return to a more liquid state.
              </p>
              <p className="text-gray-700 mb-4">
                Each of our slimes is handcrafted with high-quality ingredients and carefully formulated to maintain its texture for as long as possible. However, all slimes will eventually need reactivation, which is a normal part of slime care!
              </p>
            </div>

            <div className="mb-12">
              <h3 className="text-xl font-bold mb-4 text-gray-800">Slime Shelf Life</h3>
              <p className="text-gray-700 mb-4">
                For best results, we recommend playing with your slime within 1-2 months of purchase to ensure the optimal texture and experience. Different slime types have varying shelf lives:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4 space-y-2">
                <li><span className="font-semibold">Cloud Slimes & Icee Slimes:</span> These contain instant snow powder that helps them stay fresh longer (up to 3 months).</li>
                <li><span className="font-semibold">Butter Slimes:</span> These have a higher clay content which can dry out faster but are very easy to reactivate.</li>
                <li><span className="font-semibold">Clear & Glossy Slimes:</span> These may become sticky more quickly (within a few weeks) but can be easily revived with our activator solution.</li>
              </ul>
              <p className="text-gray-700">
                Even with multi-colored slimes, we recommend using them within the first month to prevent colors from mixing together over time.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
            <h2 className="text-3xl font-bold mb-6 text-tacta-pink">Most Popular Slime Types</h2>
            
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-3 text-gray-800">Cloud Dough Slime</h3>
              <p className="text-gray-700 mb-2">
                Our most beginner-friendly slime! Made with a blend of instant snow and soft clay for a holdable, doughy feel that's easy to play with. The texture is perfect for those new to slime and maintains its consistency longer than most other types.
              </p>
              <p className="text-gray-700 mb-4">
                <span className="font-semibold">Best for:</span> New slime enthusiasts, younger children, and those who prefer a less messy experience.
              </p>
              <div className="w-full h-48 bg-tacta-cream rounded-lg flex items-center justify-center">
                <p className="text-tacta-pink font-semibold">Cloud Dough Slime Image</p>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-bold mb-3 text-gray-800">Butter Slime</h3>
              <p className="text-gray-700 mb-2">
                Smooth, creamy, and incredibly satisfying to stretch! Our butter slimes have a silky texture that feels like actual butter. They're great for stress relief and offer a premium slime experience with excellent moldability.
              </p>
              <p className="text-gray-700 mb-4">
                <span className="font-semibold">Best for:</span> Those who enjoy a smoother texture and appreciate slimes with excellent stretchability.
              </p>
              <div className="w-full h-48 bg-tacta-cream rounded-lg flex items-center justify-center">
                <p className="text-tacta-pink font-semibold">Butter Slime Image</p>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-bold mb-3 text-gray-800">Glitter Slime</h3>
              <p className="text-gray-700 mb-2">
                For those who love all things sparkly! Our glitter slimes are packed with holographic and iridescent glitters that catch the light beautifully. These slimes provide both visual and tactile stimulation.
              </p>
              <p className="text-gray-700 mb-4">
                <span className="font-semibold">Best for:</span> Anyone who loves sparkle and shimmer, and wants an Instagram-worthy slime experience!
              </p>
              <div className="w-full h-48 bg-tacta-cream rounded-lg flex items-center justify-center">
                <p className="text-tacta-pink font-semibold">Glitter Slime Image</p>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-xl font-bold mb-3 text-gray-800">Clear Slime</h3>
              <p className="text-gray-700 mb-2">
                These transparent slimes are perfect for showcasing beautiful add-ins like glitters, charms, and beads. They're incredibly satisfying to stretch and provide stunning visual effects.
              </p>
              <p className="text-gray-700 mb-4">
                <span className="font-semibold">Best for:</span> Experienced slimers who appreciate the unique properties of clear slime. These require a bit more care but are worth it!
              </p>
              <div className="w-full h-48 bg-tacta-cream rounded-lg flex items-center justify-center">
                <p className="text-tacta-pink font-semibold">Clear Slime Image</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
            <h2 className="text-3xl font-bold mb-6 text-tacta-pink">Slime Care Tips</h2>

            <div className="bg-tacta-pink-light p-6 rounded-lg mb-8">
              <h3 className="text-xl font-bold mb-3 text-gray-800">Why Is My Slime Sticky?</h3>
              <p className="text-gray-700 mb-4">
                Sticky slime is normal and easily fixed! Here are the common causes and solutions:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li>Hand lotion, soap, or sanitizer on your hands can make slime sticky</li>
                <li>Leaving slime exposed to air for too long</li>
                <li>Natural deactivation over time as the slime ages</li>
              </ul>
              <p className="text-gray-700 font-semibold">Solution:</p>
              <p className="text-gray-700 mb-4">
                Wash and dry your hands thoroughly before playing. If your slime becomes sticky, you can reactivate it with a few drops of our activator solution (available for purchase). Add a few drops at a time, knead it in, and repeat until you reach your desired consistency.
              </p>
            </div>

            <div className="bg-tacta-peach-light p-6 rounded-lg mb-8">
              <h3 className="text-xl font-bold mb-3 text-gray-800">Preventing Slime From Drying Out</h3>
              <p className="text-gray-700 mb-4">
                To maximize the life of your slime:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Always store your slime in its airtight container when not in use</li>
                <li>Keep slime away from heat and direct sunlight</li>
                <li>Make sure container lids are sealed completely</li>
                <li>Store in a cool, dry place</li>
                <li>Always play with clean, dry hands</li>
              </ul>
            </div>

            <div className="bg-tacta-cream p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-3 text-gray-800">Why Is My Slime Shrinking?</h3>
              <p className="text-gray-700 mb-4">
                Slime doesn't actually decrease in size on its own, but during play, tiny bits can stick to surfaces or hands and get removed. Over many play sessions, this can result in a gradual reduction in overall mass.
              </p>
              <p className="text-gray-700 mb-4">
                This is especially common with snow-based slimes, where the instant snow powder might shed during manipulation. To minimize loss, use your slime itself to pick up any stray bits at the end of each play session!
              </p>
            </div>
          </div>

          <div className="text-center">
            <h2 className="text-3xl font-bold mb-6 text-tacta-pink">Ready to Experience Tacta Slime?</h2>
            <p className="text-gray-700 mb-8 text-lg">
              Now that you know all about our slimes, it's time to find your perfect match!
            </p>
            <Link href="/products" className="btn-primary cartoon-btn text-lg px-8 py-3">
              Shop Our Collection
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
} 