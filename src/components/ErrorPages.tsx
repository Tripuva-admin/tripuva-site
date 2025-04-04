import React from 'react';
import { Link } from 'react-router-dom';

function ErrorPage({ title, message, code }: { title: string; message: string; code: number }) {
  return (
    <div className="min-h-screen bg-background-light pt-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-9xl font-extrabold text-[#0a2472] mb-4">{code}</h1>
        <h2 className="text-4xl font-bold text-gray-900 mb-6">{title}</h2>
        <p className="text-xl text-gray-600 mb-8">{message}</p>
        <Link
          to="/"
          className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-[#0a2472] hover:bg-[#0a2472]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0a2472] transition-colors duration-200"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
}

export function NotFound() {
  return (
    <ErrorPage
      title="Page Not Found"
      message="The page you're looking for doesn't exist or has been moved."
      code={404}
    />
  );
}

export function ServerError() {
  return (
    <ErrorPage
      title="Server Error"
      message="Something went wrong on our end. Please try again later."
      code={500}
    />
  );
}

export function Unauthorized() {
  return (
    <ErrorPage
      title="Unauthorized"
      message="You don't have permission to access this page."
      code={401}
    />
  );
}

export function Forbidden() {
  return (
    <ErrorPage
      title="Forbidden"
      message="You don't have permission to access this resource."
      code={403}
    />
  );
}

export function BadRequest() {
  return (
    <ErrorPage
      title="Bad Request"
      message="The server could not understand your request."
      code={400}
    />
  );
} 