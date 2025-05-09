'use client';

import React, { useState } from 'react';

export default function Home() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted! Email:", email);
    setSubmitted(true);
    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      console.log("Newsletter API response:", data);
      if (!data.success) {
        alert('There was an error signing up for the newsletter: ' + (data.error || 'Unknown error'));
        setSubmitted(false);
      }
    } catch (err) {
      console.error('Error submitting newsletter signup:', err);
      alert('There was an error signing up for the newsletter. Please try again later.');
      setSubmitted(false);
    }
  };

  console.log("Newsletter page loaded");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-tacta-pink via-tacta-peach to-tacta-cream">
      <div className="bg-white/80 rounded-3xl shadow-2xl p-8 md:p-14 flex flex-col items-center max-w-xl mx-4">
        <div className="text-6xl mb-4 animate-bounce">🛠️</div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-tacta-pink mb-2 text-center drop-shadow-lg">
          Coming Soon!
        </h1>
        <h2 className="text-2xl md:text-3xl font-semibold text-tacta-peach mb-4 text-center">
          Our site is under construction
        </h2>
        <p className="text-lg text-gray-700 text-center mb-6">
          We're working hard to bring you the magic of Tacta Slime.<br />
          Please check back soon!
        </p>
        {/* Instagram Link */}
        <a
          href="https://instagram.com/tactaslime" // <-- update to your actual handle if needed
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-tacta-pink to-tacta-peach text-white font-bold text-lg shadow-md hover:scale-105 transition-transform mb-2"
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5A4.25 4.25 0 0 0 20.5 16.25v-8.5A4.25 4.25 0 0 0 16.25 3.5zm4.25 3.25a5.25 5.25 0 1 1-5.25 5.25A5.25 5.25 0 0 1 12 6.75zm0 1.5a3.75 3.75 0 1 0 3.75 3.75A3.75 3.75 0 0 0 12 8.25zm5.13-.88a1.13 1.13 0 1 1-1.13 1.13 1.13 1.13 0 0 1 1.13-1.13z" />
          </svg>
          Follow us on Instagram
        </a>
      </div>
    </div>
  );
} 