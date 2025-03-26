import React from 'react';
import { StarIcon, ArrowDownIcon } from '@heroicons/react/24/solid';

export default function About() {
  return (
    <div className="relative bg-gradient-to-b from-white to-gray-100 py-12">
      <div className="max-w-5xl mx-auto p-6 space-y-6 bg-white bg-opacity-80 rounded-lg shadow-lg">
        {/* Decorative animated stars */}
        <div className="flex justify-center space-x-2">
          <StarIcon className="h-6 w-6 text-rose-500 animate-bounce" />
          <StarIcon className="h-6 w-6 text-rose-500 animate-bounce delay-150" />
          <StarIcon className="h-6 w-6 text-rose-500 animate-bounce delay-300" />
        </div>
        
        <header className="text-center">
          <h1 className="text-3xl font-bold text-rose-700">
            Aunt Rosie's Management System
          </h1>
          <h2 className="text-2xl font-semibold text-gray-800">
            Internal Dashboard & Company Values
          </h2>
        </header>
        
        <hr className="border-gray-300" />

        <section className="space-y-4 text-lg text-gray-800">
          <p>
            Since the early 80’s, Aunt Rosie’s Homemade Pies and Preserves has been built on a foundation of passion, hard work, and unwavering commitment to quality. 
            From our humble beginnings at local farmers markets to our modern, commercial-grade kitchen, every step of our journey has been about perfecting our craft.
          </p>
          <p>
            This management system was developed specifically for our team—to streamline operations, track sales, manage ingredients, and monitor product inventory. 
            It’s designed to support you in upholding the high standards that have made Aunt Rosie’s a trusted name in the community.
          </p>
          <p>
            As you navigate through the dashboard, remember that our core values remain the same: attention to detail, a passion for excellence, and a commitment to delivering the best. 
            Whether you’re entering sales data, updating ingredient stocks, or managing product details, your efforts ensure that every customer receives a taste of our legacy.
          </p>
        </section>

        <footer className="mt-8 text-center">
          <blockquote className="italic text-gray-600">
            "Excellence in every detail, passion in every product."
          </blockquote>
          <div className="mt-4 flex justify-center">
            <ArrowDownIcon className="h-6 w-6 text-gray-500 animate-bounce" />
          </div>
        </footer>
      </div>
    </div>
  );
}
