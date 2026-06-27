"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

interface Request {
  id: string;
  product_name: string;
  description: string;
  budget: number;
  status: string;
  email?: string;
  product_cost?: number;
  delivery_charges?: number;
  rejection_reason?: string;
}

const ADMIN_EMAIL = "areebazia715@gmail.com";

export default function AdminPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<Request[]>([]);
  const [filter, setFilter] = useState("All");

  const [productCosts, setProductCosts] = useState<Record<string, number>>({});
  const [deliveryCharges, setDeliveryCharges] = useState<
    Record<string, number>
  >({});

  useEffect(() => {
    const initialize = async () => {
      const { data: authData } = await supabase.auth.getUser();

      if (authData.user?.email !== ADMIN_EMAIL) {
        router.push("/");
        return;
      }

      const { data, error } = await supabase
        .from("requests")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error(error);
        return;
      }

      setRequests(data || []);
      setLoading(false);
    };

    initialize();
  }, [router]);

  const updateStatus = async (
    id: string,
    status: string,
    email?: string,
    productName?: string,
    reason?: string,
  ) => {
    const productCost = productCosts[id] || 0;
    const deliveryCharge = deliveryCharges[id] || 0;

    const { data: updatedRows, error } = await supabase
      .from("requests")
      .update({
        status,
        product_cost: productCost,
        delivery_charges: deliveryCharge,
        rejection_reason: status === "Rejected" ? reason : null,
      })
      .eq("id", id)
      .select();

    if (error) {
      alert(error.message);
      return;
    }

    if (!updatedRows || updatedRows.length === 0) {
      alert(
        "Update blocked — no rows changed. This is likely a Row Level Security (RLS) policy issue in Supabase."
      );
      return;
    }

    setRequests((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status,
              product_cost: productCost,
              delivery_charges: deliveryCharge,
              rejection_reason: status === "Rejected" ? reason : undefined,
            }
          : r,
      ),
    );

    if (status === "Approved" && email) {
      await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: email,
          subject: "Request Approved - SourceIt",
          html: `
            <h2>Your request has been approved 🎉</h2>

            <p><b>Product:</b> ${productName}</p>

            <p><b>Product Cost:</b> Rs. ${productCost}</p>

            <p><b>Delivery Charges:</b> Rs. ${deliveryCharge}</p>

            <p>
              Your request has been approved.
              Please proceed with payment.
            </p>

            <br/>

            <p>
              Regards,<br/>
              SourceIt Team
            </p>
          `,
        }),
      });
    }

    if (status === "Rejected" && email) {
      await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: email,
          subject: "Request Rejected - SourceIt",
          html: `
            <h2>Your request has been rejected</h2>

            <p><b>Product:</b> ${productName}</p>

            <p><b>Reason:</b> ${reason || "Not specified"}</p>

            <br/>

            <p>
              Regards,<br/>
              SourceIt Team
            </p>
          `,
        }),
      });
    }

    alert(`Request ${status} successfully`);
  };

  const filtered = requests.filter((r) =>
    filter === "All" ? true : r.status === filter,
  );

  if (loading) {
    return <div className="p-10 text-center text-xl">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

      <div className="flex gap-3 mb-8">
        {["All", "Pending", "Approved", "Rejected"].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-5 py-2 rounded-xl border font-medium transition ${
              filter === tab
                ? "bg-[#2B2B4A] text-white"
                : "bg-white text-[#2B2B4A] border-gray-300"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="space-y-5">
        {filtered.map((req) => (
          <div key={req.id} className="bg-white p-6 rounded-2xl shadow">
            <h2 className="text-2xl font-bold">{req.product_name}</h2>

            <p className="text-gray-700 mt-2">{req.description}</p>

            <p className="mt-2">
              Budget: <b>Rs. {req.budget}</b>
            </p>

            <p className="mt-2">Email: {req.email || "No Email"}</p>

            <p className="mt-2">
              Status: <b>{req.status}</b>
            </p>

            {req.status === "Rejected" && req.rejection_reason && (
              <p className="mt-2 text-red-600">
                Rejection Reason: <b>{req.rejection_reason}</b>
              </p>
            )}

            <div className="grid md:grid-cols-2 gap-3 mt-4">
              <input
                type="number"
                placeholder="Product Cost"
                className="border p-2 rounded text-black bg-white"
                onChange={(e) =>
                  setProductCosts({
                    ...productCosts,
                    [req.id]: Number(e.target.value),
                  })
                }
              />

              <input
                type="number"
                placeholder="Delivery Charges"
                className="border p-2 rounded text-black bg-white"
                onChange={(e) =>
                  setDeliveryCharges({
                    ...deliveryCharges,
                    [req.id]: Number(e.target.value),
                  })
                }
              />
            </div>

            <div className="flex gap-3 mt-4">
              <button
                onClick={() =>
                  updateStatus(req.id, "Approved", req.email, req.product_name)
                }
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Approve
              </button>

              <button
                onClick={() => {
                  const reason = prompt("Rejection reason?");
                  if (!reason) return;

                  updateStatus(
                    req.id,
                    "Rejected",
                    req.email,
                    req.product_name,
                    reason,
                  );
                }}
                className="bg-red-600 text-white px-4 py-2 rounded"
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
