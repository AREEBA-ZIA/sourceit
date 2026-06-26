"use client";

import { useState } from "react";

export default function Dashboard() {
  const [quantity, setQuantity] = useState(1);
  const [quality, setQuality] = useState("Medium");
  const [preview, setPreview] = useState<string | null>(null);

  return (
    <div
      className="min-h-screen py-10 px-4"
      style={{ backgroundColor: "#EEEBDA" }}
    >
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold text-[#2B2B4A] mb-3">
          Create Product Request
        </h1>

        <p className="text-gray-600 mb-10">
          Tell us exactly what product you need and we will source it for you.
        </p>

        <div className="bg-white rounded-3xl shadow-xl p-8">

          {/* Category */}
          <div className="mb-6">
            <label className="block font-semibold mb-2 text-gray-800">
              Category
            </label>

            <select className="w-full border rounded-xl p-4 text-gray-800">
              <option>Organic</option>
              <option>Clothes</option>
              <option>Shoes</option>
              <option>Accessories</option>
              <option>Electronics</option>
              <option>Beauty</option>
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
                className="w-full border rounded-xl p-4 text-gray-800"
              />
            </div>

            <div>
              <label className="block font-semibold mb-2 text-gray-800">
                Quantity
              </label>

              <div className="flex items-center gap-4 border rounded-xl p-3">

                <button
                  onClick={() =>
                    setQuantity(Math.max(1, quantity - 1))
                  }
                  className="bg-gray-200 px-4 py-2 rounded-lg"
                >
                  -
                </button>

                <span className="text-xl font-bold">
                  {quantity}
                </span>

                <button
                  onClick={() =>
                    setQuantity(quantity + 1)
                  }
                  className="bg-gray-200 px-4 py-2 rounded-lg"
                >
                  +
                </button>
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
                <button
                  key={item}
                  onClick={() => setQuality(item)}
                  className={`px-6 py-3 rounded-xl border transition ${
                    quality === item
                      ? "bg-[#2B2B4A] text-white"
                      : "bg-white text-black"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Upload */}
          <div className="mb-6">
            <label className="block font-semibold mb-2 text-gray-800">
              Upload Reference Image
            </label>

            <input
              type="file"
              accept="image/*"
              className="w-full border rounded-xl p-4"
              onChange={(e) => {
                const file = e.target.files?.[0];

                if (file) {
                  setPreview(URL.createObjectURL(file));
                }
              }}
            />

            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="mt-4 h-40 rounded-xl object-cover"
              />
            )}
          </div>

          {/* Budget */}
          <div className="mb-6">
            <label className="block font-semibold mb-2 text-gray-800">
              Budget (PKR)
            </label>

            <input
              type="number"
              placeholder="5000"
              className="w-full border rounded-xl p-4 text-gray-800"
            />
          </div>

          {/* Description */}
          <div className="mb-8">
            <label className="block font-semibold mb-2 text-gray-800">
              Description
            </label>

            <textarea
              rows={5}
              placeholder="Describe your product requirements..."
              className="w-full border rounded-xl p-4 text-gray-800"
            />
          </div>

          <button className="w-full bg-[#2B2B4A] hover:bg-[#1f1f38] text-white py-4 rounded-xl font-bold text-lg">
            Submit Request
          </button>

        </div>
      </div>
    </div>
  );
}