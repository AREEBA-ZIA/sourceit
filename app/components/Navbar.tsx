"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav
      className="flex justify-between items-center px-8 py-4"
      style={{
        backgroundColor: "#2B2B4A",
        color: "#EEEBDA",
      }}
    >
      <h1 className="text-2xl font-bold">SourceIt</h1>

      <div className="flex gap-6">
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/requests">My Requests</Link>
        <Link href="/requests/new">New Request</Link>
      </div>
    </nav>
  );
}