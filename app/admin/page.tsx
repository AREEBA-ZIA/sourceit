"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

interface Request {
  id: string;
  product_name: string;
  description: string;
  budget: number;
  status: string;
  email?: string;
}

export default function AdminPage() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    const fetchRequests = async () => {
      const { data, error } = await supabase
        .from("requests")
        .select("*")
        .order("created_at", { ascending: false });

      console.log("REQUESTS DATA:", data);

      if (error) {
        console.error("FETCH ERROR:", error);
        return;
      }

      setRequests(data || []);
    };

    fetchRequests();
  }, []);

  const updateStatus = async (
    id: string,
    status: string,
    email: string | undefined,
    productName: string,
    reason?: string,
  ) => {
    console.log("EMAIL FROM REQUEST:", email);

    const { error } = await supabase
      .from("requests")
      .update({ status })
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    setRequests((prev) =>
      prev.map((request) =>
        request.id === id ? { ...request, status } : request,
      ),
    );

    if (!email) {
      alert("No email found for this request.");
      return;
    }

    try {
      await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          productName,
          status,
          reason,
        }),
      });
    } catch (err) {
      console.error("EMAIL ERROR:", err);
    }
  };

  const filteredRequests = requests.filter((req) => {
    if (filter === "All") return true;
    return req.status === filter;
  });

  return (
    <div className="p-10">
      <h1 className="text-4xl font-bold mb-6">Admin Dashboard</h1>

      <div className="flex gap-2 mb-6">
        {["All", "Pending", "Approved", "Rejected"].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-3 py-1 rounded border transition ${
              filter === tab
                ? "bg-gray-800 text-white border-gray-600"
                : "bg-gray-900 text-gray-300 border-gray-700 hover:bg-gray-800"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {filteredRequests.map((request) => (
        <div
          key={request.id}
          className="border border-gray-700 bg-gray-900 text-white p-4 rounded-lg mb-4"
        >
          <h2 className="font-bold text-lg">{request.product_name}</h2>

          <p className="text-gray-300 mt-1">{request.description}</p>

          <p className="mt-2 text-gray-300">
            Budget: Rs. {request.budget}
          </p>

          <p className="mt-2 text-gray-300">
            Email: {request.email || "NO EMAIL FOUND"}
          </p>

          <p className="mt-2 font-medium">
            Status:{" "}
            <span
              className={
                request.status === "Approved"
                  ? "text-green-500"
                  : request.status === "Rejected"
                  ? "text-red-500"
                  : "text-yellow-500"
              }
            >
              {request.status}
            </span>
          </p>

          <div className="mt-3 flex gap-2">
            <button
              onClick={() =>
                updateStatus(
                  request.id,
                  "Approved",
                  request.email,
                  request.product_name,
                )
              }
              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
            >
              Approve
            </button>

            <button
              onClick={() => {
                const reason = prompt("Enter rejection reason:");

                if (!reason) return;

                updateStatus(
                  request.id,
                  "Rejected",
                  request.email,
                  request.product_name,
                  reason,
                );
              }}
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
            >
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}