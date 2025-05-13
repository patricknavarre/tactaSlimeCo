'use client';

import React, { useState, useEffect } from 'react';
import { signIn, useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import bcrypt from 'bcryptjs';

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState('signup');
  const [signupError, setSignupError] = useState('');
  const [loginError, setLoginError] = useState('');
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { data: session } = useSession();
  const router = useRouter();

  // Fetch user orders when session is available
  useEffect(() => {
    async function fetchUserOrders() {
      if (session && session.user) {
        try {
          setIsLoading(true);
          setError('');
          
          const response = await fetch('/api/orders/user');
          
          if (!response.ok) {
            throw new Error(`Failed to fetch orders: ${response.status}`);
          }
          
          const data = await response.json();
          console.log('Fetched user orders:', data);
          
          if (data.success && data.orders) {
            setOrders(data.orders);
          } else {
            throw new Error(data.message || 'Failed to fetch orders');
          }
        } catch (err) {
          console.error('Error fetching orders:', err);
          setError('Failed to load your orders. Please try again later.');
        } finally {
          setIsLoading(false);
        }
      }
    }
    
    fetchUserOrders();
  }, [session]);

  // If logged in, show dashboard
  if (session && session.user) {
    return (
      <div className="container-custom py-16 min-h-[60vh]">
        <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl p-8">
          <h1 className="text-3xl font-bold mb-6 text-tacta-pink text-center">My Account</h1>
          
          {/* Account Info Card */}
          <div className="mb-10 bg-gray-50 rounded-2xl p-6 border-2 border-tacta-pink/20">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Account Information</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600 text-sm">Email Address</p>
                <p className="font-medium">{session.user.email}</p>
              </div>
              {session.user.name && (
                <div>
                  <p className="text-gray-600 text-sm">Name</p>
                  <p className="font-medium">{session.user.name}</p>
                </div>
              )}
            </div>
            
            <div className="mt-6 flex flex-wrap gap-3">
              <button 
                onClick={() => signOut({ callbackUrl: '/' })}
                className="btn-secondary cartoon-btn text-sm"
              >
                Log Out
              </button>
            </div>
          </div>
          
          {/* Order History */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Order History</h2>
            
            {isLoading ? (
              <div className="text-center py-8">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-tacta-pink border-r-transparent"></div>
                <p className="mt-2 text-gray-600">Loading your orders...</p>
              </div>
            ) : error ? (
              <div className="text-center py-8 bg-red-50 rounded-lg">
                <p className="text-red-600">{error}</p>
              </div>
            ) : orders.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-100 border-b-2 border-gray-200">
                      <th className="py-3 px-4 text-left">Order #</th>
                      <th className="py-3 px-4 text-left">Date</th>
                      <th className="py-3 px-4 text-left">Status</th>
                      <th className="py-3 px-4 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order._id || order.orderId} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <span className="font-medium">{order.orderId}</span>
                        </td>
                        <td className="py-3 px-4">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                            order.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                            order.status === 'Shipped' ? 'bg-purple-100 text-purple-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          ${parseFloat(order.total).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-10 bg-gray-50 rounded-lg border-2 border-dashed border-tacta-pink/30">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-tacta-pink/70 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <h3 className="text-xl font-bold text-gray-800 mb-2">No Orders Yet!</h3>
                <p className="text-gray-600 mb-6 max-w-sm mx-auto">Your order history is empty. Discover our amazing slime collection and start your slime adventure!</p>
                <button 
                  onClick={() => router.push('/products')}
                  className="btn-primary cartoon-btn px-6"
                >
                  Shop Now
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Handle Sign Up
  async function handleSignup(e) {
    e.preventDefault();
    setSignupError('');
    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;
    try {
      // Call API to create user
      const res = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!data.success) {
        setSignupError(data.error || 'Failed to create account');
        return;
      }
      // Auto-login after signup
      const loginRes = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });
      if (loginRes.ok) {
        router.refresh();
      } else {
        setSignupError('Account created, but failed to log in. Please try logging in.');
      }
    } catch (err) {
      setSignupError('Error creating account.');
    }
  }

  // Handle Log In
  async function handleLogin(e) {
    e.preventDefault();
    setLoginError('');
    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;
    const res = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });
    if (res.ok) {
      router.refresh();
    } else {
      setLoginError('Invalid email or password');
    }
  }

  return (
    <div className="container-custom py-16 min-h-[60vh] flex flex-col items-center justify-center">
      <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-14 flex flex-col items-center max-w-md w-full mx-4">
        <div className="flex mb-8 w-full">
          <button
            className={`flex-1 py-2 rounded-l-full font-bold text-lg transition-colors ${activeTab === 'signup' ? 'bg-tacta-pink text-white' : 'bg-gray-100 text-tacta-pink'}`}
            onClick={() => setActiveTab('signup')}
          >
            Sign Up
          </button>
          <button
            className={`flex-1 py-2 rounded-r-full font-bold text-lg transition-colors ${activeTab === 'login' ? 'bg-tacta-pink text-white' : 'bg-gray-100 text-tacta-pink'}`}
            onClick={() => setActiveTab('login')}
          >
            Log In
          </button>
        </div>
        {activeTab === 'signup' ? (
          <form className="w-full flex flex-col gap-4" onSubmit={handleSignup} autoComplete="off">
            <input name="email" type="email" placeholder="Email" className="input-field" required autoComplete="off" />
            <input name="password" type="password" placeholder="Password" className="input-field" required autoComplete="off" />
            <button type="submit" className="btn-primary cartoon-btn w-full py-3 mt-2">Create Account</button>
            {signupError && <p className="text-red-500 text-sm mt-2">{signupError}</p>}
          </form>
        ) : (
          <form className="w-full flex flex-col gap-4" onSubmit={handleLogin} autoComplete="off">
            <input name="email" type="email" placeholder="Email" className="input-field" required autoComplete="off" />
            <input name="password" type="password" placeholder="Password" className="input-field" required autoComplete="off" />
            <button type="submit" className="btn-primary cartoon-btn w-full py-3 mt-2">Log In</button>
            {loginError && <p className="text-red-500 text-sm mt-2">{loginError}</p>}
          </form>
        )}
      </div>
    </div>
  );
} 