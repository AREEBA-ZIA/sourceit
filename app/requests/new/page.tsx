"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../../../lib/supabase";

export default function NewRequestPage() {
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const DESCRIPTION_LIMIT = 300;

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!productName.trim()) newErrors.productName = "Product name is required";
    if (!description.trim()) newErrors.description = "Description is required";
    if (!budget || Number(budget) <= 0) newErrors.budget = "Enter a valid budget";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("Please login first");
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("requests").insert([
      {
        user_id: user.id,
        email: user.email,
        product_name: productName,
        description,
        budget: Number(budget),
      },
    ]);

    setLoading(false);

    if (error) {
      alert(error.message);
    } else {
      setSuccess(true);
      setProductName("");
      setDescription("");
      setBudget("");
      setErrors({});

      setTimeout(() => setSuccess(false), 2500);
    }
  };

  return (
    <div className="min-h-screen bg-[#EEEBDA] text-[#2B2B4A] relative overflow-hidden px-6 py-12">
      {/* Ambient decorative blobs, matching home page brand */}
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

      <div className="relative max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <p className="text-sm font-semibold tracking-wide uppercase text-[#2B2B4A]/50 mb-1">
            New Request
          </p>
          <h1 className="text-4xl font-bold">Create a Request</h1>
          <p className="text-gray-600 mt-2 max-w-md">
            Tell suppliers exactly what you need — they will send you quotes.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-[1.4fr_1fr] gap-8">
          {/* FORM */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-2xl shadow-md p-8 flex flex-col gap-5"
          >
            <div>
              <label className="block text-sm font-medium mb-1.5">Product Name</label>
              <input
                className={`w-full border rounded-xl p-3 outline-none transition focus:ring-2 focus:ring-[#2B2B4A]/30 ${
                  errors.productName ? "border-red-400" : "border-gray-300"
                }`}
                placeholder="e.g. Stainless steel water bottles"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
              />
              <AnimatePresence>
                {errors.productName && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-red-500 text-sm mt-1"
                  >
                    {errors.productName}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-sm font-medium">Description</label>
                <span
                  className={`text-xs ${
                    description.length > DESCRIPTION_LIMIT ? "text-red-500" : "text-gray-400"
                  }`}
                >
                  {description.length}/{DESCRIPTION_LIMIT}
                </span>
              </div>
              <textarea
                rows={4}
                maxLength={DESCRIPTION_LIMIT}
                className={`w-full border rounded-xl p-3 outline-none transition focus:ring-2 focus:ring-[#2B2B4A]/30 resize-none ${
                  errors.description ? "border-red-400" : "border-gray-300"
                }`}
                placeholder="Quantity, specs, materials, deadline — the more detail, the better the quotes."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <AnimatePresence>
                {errors.description && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-red-500 text-sm mt-1"
                  >
                    {errors.description}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Budget</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  $
                </span>
                <input
                  type="number"
                  min="0"
                  className={`w-full border rounded-xl p-3 pl-7 outline-none transition focus:ring-2 focus:ring-[#2B2B4A]/30 ${
                    errors.budget ? "border-red-400" : "border-gray-300"
                  }`}
                  placeholder="0.00"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                />
              </div>
              <AnimatePresence>
                {errors.budget && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-red-500 text-sm mt-1"
                  >
                    {errors.budget}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <motion.button
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              onClick={handleSubmit}
              disabled={loading}
              className="bg-[#2B2B4A] text-white p-3.5 rounded-xl font-semibold mt-2 flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? (
                <>
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                    className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full inline-block"
                  />
                  Submitting...
                </>
              ) : (
                "Submit Request"
              )}
            </motion.button>
          </motion.div>

          {/* LIVE PREVIEW */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-[#2B2B4A] text-white rounded-2xl shadow-md p-8 h-fit"
          >
            <p className="text-xs uppercase tracking-wide text-white/50 mb-4">
              Live Preview
            </p>

            <h3 className="text-xl font-bold mb-2">
              {productName || "Your product name"}
            </h3>

            <p className="text-white/70 text-sm mb-4 whitespace-pre-wrap">
              {description || "Your description will appear here as you type."}
            </p>

            <div className="flex items-center justify-between border-t border-white/10 pt-4">
              <span className="text-white/50 text-sm">Budget</span>
              <span className="font-bold text-lg">
                {budget ? `$${Number(budget).toLocaleString()}` : "—"}
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* SUCCESS TOAST */}
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, y: 40, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 40, x: "-50%" }}
            className="fixed bottom-8 left-1/2 bg-white shadow-lg rounded-2xl px-6 py-4 flex items-center gap-3"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
              className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white"
            >
              ✓
            </motion.div>
            <div>
              <p className="font-semibold">Request submitted!</p>
              <p className="text-sm text-gray-500">Suppliers will start sending quotes soon.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}