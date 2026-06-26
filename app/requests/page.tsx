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

  // 🔄 FETCH DATA
  useEffect(() => {
    const fetchRequests = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data, error } = await supabase
        .from("requests")
        .select("*")
        .eq("user_id", user.id);

      if (error) {
        console.error("Fetch error:", error);
        return;
      }

      setRequests(data || []);
    };

    fetchRequests();
  }, []);

  // ✉️ STATUS UPDATE + EMAIL TRIGGER
  const updateStatus = async (id: string, status: string, reason?: string) => {
    const { error } = await supabase
      .from("requests")
      .update({ status })
      .eq("id", id);

    if (error) {
      console.error("Update error:", error);
      return;
    }

    // 🔄 instant UI update
    setRequests((prev) =>
      prev.map((req) => (req.id === id ? { ...req, status } : req)),
    );

    // 📧 EMAIL CALL (backend API)
    await fetch("/api/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        requestId: id,
        status,
        reason: reason || "",
      }),
    });
  };

  // 🎯 FILTER
  const filteredRequests = requests.filter((req) => {
    if (filter === "All") return true;
    return req.status === filter;
  });

  return (
    <div className="p-10 bg-[#EEEBDA] min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-[#2B2B4A]">My Requests</h1>

      {/* FILTER BUTTONS */}
      <div className="flex gap-3 mb-6">
        {["All", "Pending", "Approved", "Rejected"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg border font-medium transition ${
              filter === f
                ? "bg-[#2B2B4A] text-white"
                : "bg-white text-[#2B2B4A]"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* LIST */}
      {filteredRequests.length === 0 ? (
        <p className="text-gray-600">No requests found.</p>
      ) : (
        <div className="space-y-4">
          {filteredRequests.map((request) => (
            <div
              key={request.id}
              className="border rounded-lg p-4 bg-white shadow-sm"
            >
              <h2 className="font-bold text-xl text-[#2B2B4A]">
                {request.product_name}
              </h2>

              <p className="text-gray-700 mt-1">{request.description}</p>

              <p className="mt-2 text-[#2B2B4A]">
                Budget: <b>Rs. {request.budget}</b>
              </p>

              {/* STATUS */}
              <p className="mt-2 text-[#2B2B4A]">
                Status: <span className="font-semibold">{request.status}</span>
              </p>

              {/* ACTION BUTTONS */}
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => updateStatus(request.id, "Approved")}
                  className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Approve
                </button>

                <button
                  onClick={() => {
                    const reason = prompt("Enter rejection reason:");
                    updateStatus(request.id, "Rejected", reason || "");
                  }}
                  className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
