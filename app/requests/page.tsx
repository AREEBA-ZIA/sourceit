"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

type Request = {
  id: string;
  product_name: string;
  description: string;
  budget: number;
  email: string;
  status: string;
};

export default function RequestsPage() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    const fetchRequests = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data, error } = await supabase
        .from("requests")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error(error);
        return;
      }

      setRequests(data || []);
    };

    fetchRequests();
  }, []);

  const filteredRequests = requests.filter((req) => {
    if (filter === "All") return true;
    return req.status === filter;
  });

  return (
    <div className="min-h-screen bg-[#EEEBDA] p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-[#2B2B4A] mb-6">
          My Requests
        </h1>

        {/* FILTERS */}
        <div className="flex flex-wrap gap-3 mb-8">
          {["All", "Pending", "Approved", "Rejected"].map((item) => (
            <button
              key={item}
              onClick={() => setFilter(item)}
              className={`px-5 py-2 rounded-xl border transition font-medium ${
                filter === item
                  ? "bg-[#2B2B4A] text-white"
                  : "bg-white text-[#2B2B4A]"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        {filteredRequests.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 shadow">
            <p className="text-gray-600">
              No requests found.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {filteredRequests.map((request) => (
              <div
                key={request.id}
                className="bg-white rounded-2xl shadow-lg p-6 border"
              >
                <h2 className="text-2xl font-bold text-[#2B2B4A]">
                  {request.product_name}
                </h2>

                <p className="mt-3 text-gray-700">
                  {request.description}
                </p>

                <p className="mt-4 text-[#2B2B4A]">
                  Budget:
                  <span className="font-bold ml-2">
                    Rs. {request.budget}
                  </span>
                </p>

                <div className="mt-3">
                  Status:
                  <span
                    className={`ml-2 font-bold ${
                      request.status === "Approved"
                        ? "text-green-600"
                        : request.status === "Rejected"
                        ? "text-red-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {request.status}
                  </span>
                </div>

                {/* PAYMENT BUTTON */}
                {request.status === "Approved" && (
                  <div className="mt-5">
                    <button className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-xl transition">
                      Proceed To Payment
                    </button>
                  </div>
                )}

                {/* REJECTED MESSAGE */}
                {request.status === "Rejected" && (
                  <div className="mt-4 bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl">
                    This request was rejected.
                  </div>
                )}

                {/* PENDING MESSAGE */}
                {request.status === "Pending" && (
                  <div className="mt-4 bg-yellow-50 border border-yellow-200 text-yellow-700 p-3 rounded-xl">
                    Waiting for admin approval.
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}