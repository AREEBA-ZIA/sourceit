"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";

const ADMIN_EMAIL = "areebazia715@gmail.com";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();

      setIsLoggedIn(!!data.user);
      setUserEmail(data.user?.email || "");
    };

    checkUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session?.user);
      setUserEmail(session?.user?.email || "");
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      alert(error.message);
      return;
    }

    setIsLoggedIn(false);
    setUserEmail("");

    router.push("/");
    router.refresh();
  };

  return (
    <nav
      className="flex justify-between items-center px-8 py-4"
      style={{
        backgroundColor: "#2B2B4A",
        color: "#EEEBDA",
      }}
    >
      <Link href="/" className="text-xl font-bold">
        SourceIt
      </Link>

      <div className="flex gap-6 items-center">
        {isLoggedIn ? (
          <>
            <Link href="/dashboard">Dashboard</Link>

            <Link href="/requests">My Requests</Link>

            <Link href="/requests/new">New Request</Link>

            {userEmail === ADMIN_EMAIL && (
              <Link href="/admin">Admin</Link>
            )}

            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              href="/login"
              className="px-5 py-2 rounded-xl border border-white"
            >
              Login
            </Link>

            <Link
              href="/signup"
              className="px-5 py-2 rounded-xl bg-white text-[#2B2B4A]"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}