"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../../lib/supabase";
const CATEGORIES = [
  {
    group: "Lifestyle & Apparel",
    options: ["Clothes", "Shoes", "Accessories", "Jewelry"],
  },
  {
    group: "Home & Living",
    options: ["Furniture", "Home & Kitchen", "Garden & Outdoor"],
  },
  {
    group: "Tech & Electronics",
    options: ["Electronics", "Software & Digital", "Office Supplies"],
  },
  {
    group: "Health & Personal Care",
    options: ["Beauty", "Health & Wellness", "Baby Products"],
  },
  {
    group: "Food & Organic",
    options: ["Organic", "Food & Beverages"],
  },
  {
    group: "Leisure & Other",
    options: [
      "Sports & Fitness",
      "Toys & Games",
      "Books & Stationery",
      "Music Instruments",
      "Pet Supplies",
      "Automotive",
      "Industrial & Tools",
      "Other",
    ],
  },
];

export default function Dashboard() {
  const router = useRouter();

  const [category, setCategory] = useState("Organic");
  const [productName, setProductName] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [quality, setQuality] = useState("Medium");
  const [preview, setPreview] = useState<string | null>(null);
  const [budget, setBudget] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const DESCRIPTION_LIMIT = 400;

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
        category,
        product_name: productName,
        quantity,
        quality,
        budget: Number(budget),
        description,
      },
    ]);

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    setSuccess(true);
    setProductName("");
    setQuantity(1);
    setQuality("Medium");
    setPreview(null);
    setBudget("");
    setDescription("");
    setErrors({});

    setTimeout(() => {
      setSuccess(false);
      router.push("/requests");
    }, 1200);
  };

  return (
    <div className="min-h-screen py-10 px-4 relative overflow-hidden" style={{ backgroundColor: "#EEEBDA" }}>
      {/* Ambient blobs, same brand language as Home/New Request */}
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

      <div className="max-w-6xl mx-auto relative">
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-5xl font-bold text-[#2B2B4A] mb-3">
            Create Product Request
          </h1>

          <p className="text-gray-600 mb-10">
            Tell us exactly what product you need and we will source it for you.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-[1.5fr_1fr] gap-8">
          {/* FORM */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-3xl shadow-xl p-8"
          >
            {/* Category */}
            <div className="mb-6">
              <label className="block font-semibold mb-2 text-gray-800">
                Category
              </label>

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border rounded-xl p-4 text-gray-800"
              >
                {CATEGORIES.map((group) => (
                  <optgroup key={group.group} label={group.group}>
                    {group.options.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>

            {/* Product + Quantity */}
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block font-semibold mb-2 text-gray-800">
                  Product Name
                </label>

                <input
                  type="text"
                  placeholder="Gaming Laptop"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className={`w-full border rounded-xl p-4 text-gray-800 outline-none transition focus:ring-2 focus:ring-[#2B2B4A]/30 ${
                    errors.productName ? "border-red-400" : "border-gray-300"
                  }`}
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
                <label className="block font-semibold mb-2 text-gray-800">
                  Quantity
                </label>

                <div className="flex items-center gap-4 border rounded-xl p-3 border-gray-300">
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="bg-gray-200 px-4 py-2 rounded-lg"
                  >
                    -
                  </motion.button>

                  <motion.span
                    key={quantity}
                    initial={{ scale: 1.3, opacity: 0.5 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-xl font-bold w-10 text-center"
                  >
                    {quantity}
                  </motion.span>

                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setQuantity(quantity + 1)}
                    className="bg-gray-200 px-4 py-2 rounded-lg"
                  >
                    +
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Quality */}
            <div className="mb-6">
              <label className="block font-semibold mb-3 text-gray-800">
                Quality
              </label>

              <div className="flex gap-4">
                {["Low", "Medium", "High"].map((item) => (
                  <motion.button
                    key={item}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setQuality(item)}
                    className={`px-6 py-3 rounded-xl border transition ${
                      quality === item
                        ? "bg-[#2B2B4A] text-white"
                        : "bg-white text-black border-gray-300"
                    }`}
                  >
                    {item}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Upload */}
            <div className="mb-6">
              <label className="block font-semibold mb-2 text-gray-800">
                Upload Reference Image
              </label>

              <label
                htmlFor="ref-image"
                className="flex flex-col items-center justify-center w-full border-2 border-dashed border-gray-300 rounded-xl p-6 cursor-pointer hover:bg-gray-50 transition"
              >
                <span className="text-gray-500 text-sm">
                  Click to upload, or drag an image here
                </span>
                <input
                  id="ref-image"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setPreview(URL.createObjectURL(file));
                  }}
                />
              </label>

              <AnimatePresence>
                {preview && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="mt-4 relative inline-block"
                  >
                    <img
                      src={preview}
                      alt="Preview"
                      className="h-40 rounded-xl object-cover"
                    />
                    <button
                      onClick={() => setPreview(null)}
                      className="absolute -top-2 -right-2 bg-[#2B2B4A] text-white w-6 h-6 rounded-full text-sm"
                    >
                      ×
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Budget */}
            <div className="mb-6">
              <label className="block font-semibold mb-2 text-gray-800">
                Budget (PKR)
              </label>

              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  Rs
                </span>
                <input
                  type="number"
                  min="0"
                  placeholder="5000"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className={`w-full border rounded-xl p-4 pl-10 text-gray-800 outline-none transition focus:ring-2 focus:ring-[#2B2B4A]/30 ${
                    errors.budget ? "border-red-400" : "border-gray-300"
                  }`}
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

            {/* Description */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <label className="block font-semibold text-gray-800">
                  Description
                </label>
                <span
                  className={`text-xs ${
                    description.length > DESCRIPTION_LIMIT ? "text-red-500" : "text-gray-400"
                  }`}
                >
                  {description.length}/{DESCRIPTION_LIMIT}
                </span>
              </div>

              <textarea
                rows={5}
                maxLength={DESCRIPTION_LIMIT}
                placeholder="Describe your product requirements..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={`w-full border rounded-xl p-4 text-gray-800 outline-none transition focus:ring-2 focus:ring-[#2B2B4A]/30 resize-none ${
                  errors.description ? "border-red-400" : "border-gray-300"
                }`}
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

            <motion.button
              whileHover={{ scale: loading ? 1 : 1.01 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-[#2B2B4A] hover:bg-[#1f1f38] text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? (
                <>
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full inline-block"
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
            className="bg-[#2B2B4A] text-white rounded-3xl shadow-xl p-8 h-fit"
          >
            <p className="text-xs uppercase tracking-wide text-white/50 mb-4">
              Live Preview
            </p>

            <h3 className="text-xl font-bold mb-1">
              {productName || "Your product name"}
            </h3>
            <p className="text-white/50 text-sm mb-4">{category}</p>

            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="w-full h-32 rounded-xl object-cover mb-4"
              />
            )}

            <p className="text-white/70 text-sm mb-4 whitespace-pre-wrap">
              {description || "Your description will appear here as you type."}
            </p>

            <div className="flex items-center justify-between border-t border-white/10 pt-4 mb-2">
              <span className="text-white/50 text-sm">Quantity</span>
              <span className="font-semibold">{quantity}</span>
            </div>

            <div className="flex items-center justify-between mb-2">
              <span className="text-white/50 text-sm">Quality</span>
              <span className="font-semibold">{quality}</span>
            </div>

            <div className="flex items-center justify-between border-t border-white/10 pt-4">
              <span className="text-white/50 text-sm">Budget</span>
              <span className="font-bold text-lg">
                {budget ? `Rs ${Number(budget).toLocaleString()}` : "—"}
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
              <p className="text-sm text-gray-500">We will start sourcing it for you.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}