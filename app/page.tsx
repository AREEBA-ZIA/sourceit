"use client";

import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#EEEBDA] text-[#2B2B4A] flex flex-col">
      {/* HERO SECTION */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6">
        <h2 className="text-5xl font-bold mb-4">Source Anything, Easily.</h2>

        <p className="text-lg text-gray-700 max-w-xl">
          SourceIt helps you request products, get quotations, and track orders
          from suppliers — all in one place.
        </p>

        <div className="flex gap-4 mt-8">
          <button
            onClick={() => router.push("/signup")}
            className="px-6 py-3 bg-[#2B2B4A] text-white rounded-xl hover:opacity-90"
          >
            Get Started
          </button>

          <button
            onClick={() => router.push("/login")}
            className="px-6 py-3 border border-[#2B2B4A] rounded-xl hover:bg-white"
          >
            I already have account
          </button>
        </div>
      </main>

      {/* FEATURES SECTION */}
      <section className="grid md:grid-cols-3 gap-6 px-10 pb-16">
        <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
          <h3 className="font-bold text-xl mb-2">Create Requests</h3>
          <p className="text-gray-600">
            Easily request any product with budget and details.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
          <h3 className="font-bold text-xl mb-2">Track Status</h3>
          <p className="text-gray-600">
            See real-time updates: Pending, Approved, Rejected.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
          <h3 className="font-bold text-xl mb-2">Get Quotes</h3>
          <p className="text-gray-600">
            Receive pricing from suppliers instantly.
          </p>
        </div>
      </section>
    </div>
  );
}
