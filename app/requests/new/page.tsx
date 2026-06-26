"use client";

import { useState } from "react";
import { supabase } from "../../../lib/supabase";

export default function NewRequestPage() {
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState("");

  const handleSubmit = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("Please login first");
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

    if (error) {
      alert(error.message);
    } else {
      alert("Request submitted successfully!");
      setProductName("");
      setDescription("");
      setBudget("");
    }
  };

  return (
    <div className="min-h-screen p-10">
      <h1 className="text-3xl font-bold mb-6">Create Request</h1>

      <div className="flex flex-col gap-4 max-w-lg">
        <input
          className="border p-3"
          placeholder="Product Name"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
        />

        <textarea
          className="border p-3"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <input
          className="border p-3"
          type="number"
          placeholder="Budget"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
        />

        <button
          onClick={handleSubmit}
          className="bg-black text-white p-3 rounded"
        >
          Submit Request
        </button>
      </div>
    </div>
  );
}