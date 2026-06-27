"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../../lib/supabase";

type Request = {
  id: string;
  product_name: string;
  description: string;
  budget: number;
  email: string;
  status: string;
  category?: string;
  created_at?: string;
  rejection_reason?: string;
};

const STATUS_STYLES: Record<string, { text: string; bg: string; dot: string }> = {
  Approved: { text: "text-green-700", bg: "bg-green-50 border-green-200", dot: "bg-green-500" },
  Rejected: { text: "text-red-700", bg: "bg-red-50 border-red-200", dot: "bg-red-500" },
  Pending: { text: "text-yellow-700", bg: "bg-yellow-50 border-yellow-200", dot: "bg-yellow-500" },
};

export default function RequestsPage() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("requests")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error(error);
        setLoading(false);
        return;
      }

      setRequests(data || []);
      setLoading(false);
    };

    fetchRequests();
  }, []);

  const counts = {
    All: requests.length,
    Pending: requests.filter((r) => r.status === "Pending").length,
    Approved: requests.filter((r) => r.status === "Approved").length,
    Rejected: requests.filter((r) => r.status === "Rejected").length,
  };

  const filteredRequests = requests
    .filter((req) => (filter === "All" ? true : req.status === filter))
    .filter((req) =>
      req.product_name?.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <div className="min-h-screen bg-[#EEEBDA] p-8 relative overflow-hidden">
      {/* Ambient blobs — consistent with rest of the app */}
      <motion.div
        animate={{ y: [0, -25, 0] }}
        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
        className="absolute -top-20 -left-20 w-72 h-72 bg-[#2B2B4A]/10 rounded-full blur-3xl"
      />
      <motion.div
        animate={{ y: [0, 20, 0] }}
        transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }}
        className="absolute bottom-0 right-0 w-96 h-96 bg-[#2B2B4A]/5 rounded-full blur-3xl"
      />

      <div className="max-w-5xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8"
        >
          <div>
            <h1 className="text-4xl font-bold text-[#2B2B4A] mb-1">
              My Requests
            </h1>
            <p className="text-gray-600 text-sm">
              Track every product request you have submitted.
            </p>
          </div>

          <input
            type="text"
            placeholder="Search by product name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm w-full md:w-64 outline-none focus:ring-2 focus:ring-[#2B2B4A]/30 bg-white"
          />
        </motion.div>

        {/* FILTERS */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex flex-wrap gap-3 mb-8"
        >
          {(["All", "Pending", "Approved", "Rejected"] as const).map((item) => (
            <motion.button
              key={item}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilter(item)}
              className={`px-5 py-2 rounded-xl border transition font-medium flex items-center gap-2 ${
                filter === item
                  ? "bg-[#2B2B4A] text-white border-[#2B2B4A]"
                  : "bg-white text-[#2B2B4A] border-gray-300"
              }`}
            >
              {item}
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${
                  filter === item ? "bg-white/20" : "bg-gray-100"
                }`}
              >
                {counts[item]}
              </span>
            </motion.button>
          ))}
        </motion.div>

        {/* LOADING SKELETON */}
        {loading && (
          <div className="space-y-5">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl shadow p-6 border animate-pulse"
              >
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-4" />
                <div className="h-4 bg-gray-200 rounded w-full mb-2" />
                <div className="h-4 bg-gray-200 rounded w-2/3" />
              </div>
            ))}
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && filteredRequests.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-10 shadow text-center"
          >
            <p className="text-5xl mb-3">📭</p>
            <p className="text-gray-600 font-medium">
              {search
                ? "No requests match your search."
                : "No requests found in this category."}
            </p>
          </motion.div>
        )}

        {/* LIST */}
        {!loading && filteredRequests.length > 0 && (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.08 } },
            }}
            className="space-y-5"
          >
            <AnimatePresence>
              {filteredRequests.map((request) => {
                const style = STATUS_STYLES[request.status] || STATUS_STYLES.Pending;

                return (
                  <motion.div
                    key={request.id}
                    layout
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 },
                    }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    whileHover={{ y: -3 }}
                    className="bg-white rounded-2xl shadow-lg p-6 border transition-shadow hover:shadow-xl"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h2 className="text-2xl font-bold text-[#2B2B4A]">
                          {request.product_name}
                        </h2>
                        {request.category && (
                          <span className="inline-block mt-1 text-xs font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                            {request.category}
                          </span>
                        )}
                      </div>

                      <span
                        className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border ${style.bg} ${style.text}`}
                      >
                        <span className={`w-2 h-2 rounded-full ${style.dot}`} />
                        {request.status}
                      </span>
                    </div>

                    <p className="mt-3 text-gray-700">{request.description}</p>

                    <p className="mt-4 text-[#2B2B4A]">
                      Budget:
                      <span className="font-bold ml-2">
                        Rs. {Number(request.budget).toLocaleString()}
                      </span>
                    </p>

                    {/* PAYMENT BUTTON */}
                    {request.status === "Approved" && (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="mt-5 bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-xl transition"
                      >
                        Proceed To Payment
                      </motion.button>
                    )}

                    {/* REJECTED MESSAGE */}
                    {request.status === "Rejected" && (
                      <div className="mt-4 bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl">
                        <p className="font-semibold">This request was rejected.</p>
                        {request.rejection_reason && (
                          <p className="mt-1 text-sm">
                            Reason: {request.rejection_reason}
                          </p>
                        )}
                      </div>
                    )}

                    {/* PENDING MESSAGE */}
                    {request.status === "Pending" && (
                      <div className="mt-4 bg-yellow-50 border border-yellow-200 text-yellow-700 p-3 rounded-xl">
                        Waiting for admin approval.
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}