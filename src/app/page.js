"use client";

import LoginForm from './components/LoginForm';

export default function HomePage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-blue-700 mb-4">Welcome, Doctor!</h1>
        <p className="text-lg text-gray-700 mb-6">Please log in to access your dashboard and health programs.</p>
        <LoginForm />
      </div>
    </div>
  );
}
