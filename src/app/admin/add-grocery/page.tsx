"use client";
import React, { ChangeEvent, FormEvent, useState } from "react";
import { ArrowLeft, PlusCircle, Upload } from "lucide-react";
import Link from "next/link";
import { motion } from "motion/react";
import Image from "next/image";
import axios from "axios";

export default function AddGrocery() {
  const categories = [
    "Fruits & Vegetables",
    "Dairy & Eggs",
    "Rice, Ata & Grains",
    "Snacks & Biscuits",
    "Spices & Masalas",
    "Beverages & Drinks",
    "Personal Care",
    "Household essentials",
    "Instant & Packaged Foods",
    "Baby & Pet Care",
  ];

  const units = ["kg", "g", "liter", "ml", "piece", "pack"];

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [unit, setUnit] = useState("");
  const [price, setPrice] = useState("");
  const [preview, setPreview] = useState<string | null>();
  const [backendImage, setBackendImage] = useState<File | null>();
  const [loading, setLoading] = useState(false); // 🔹 Loading state

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (!files || files.length === 0) {
      setPreview(null);
      setBackendImage(null);
      return;
    }
    const file = files[0];
    setBackendImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true); // 🔹 Start loading
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("category", category);
      formData.append("price", price);
      formData.append("unit", unit);

      if (backendImage) {
        formData.append("image", backendImage);
      }

      const result = await axios.post("/api/admin/add-grocery", formData, {
        withCredentials: true,
      });
      console.log(result.data);

      // Optional: Reset form after success
      setName("");
      setCategory("");
      setUnit("");
      setPrice("");
      setPreview(null);
      setBackendImage(null);
    } catch (error) {
      console.log("error in add-grocery", error);
    } finally {
      setLoading(false); // 🔹 Stop loading
    }
  };

  return (
    <div className="min-h-screen flex-center bg-linear-to-br from-green-50 to-white py-16 px-4 relative">
      <Link
        href={"/"}
        className="absolute top-6 left-6 flex items-center gap-2 text-green-700 font-semibold bg-white px-4 py-2 rounded-full shadow-md hover:bg-green-100 hover:shadow-lg transition-all"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="hidden md:flex">Back to home</span>
      </Link>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="bg-white w-full max-w-2xl shadow-2xl rounded-3xl border border-green-100 p-8"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-3">
            <PlusCircle className="w-8 h-8 text-green-600" />
            <h1>Add Your Grocery</h1>
          </div>
          <p className="text-gray-500 text-sm mt-2 text-center">
            Fill out the details below to add a new grocery item.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full">
          {/* Name */}
          <div>
            <label
              htmlFor="grocery-name"
              className="block text-gray-700 font-medium mb-1"
            >
              Grocery Name<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              placeholder="eg: Sweets, Milk ..."
              className="full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-400 transition-all"
              onChange={(e) => setName(e.target.value)}
              disabled={loading} // 🔹 Disable while loading
              value={name}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Category */}
            <div>
              <label
                htmlFor="category"
                className="block text-gray-700 font-medium mb-1"
              >
                Category<span className="text-red-500">*</span>
              </label>
              <select
                className="full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-400 transition-all bg-white"
                name="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                disabled={loading} // 🔹 Disable while loading
              >
                <option value="">Select Category</option>
                {categories.map((cat, idx) => (
                  <option key={idx} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Unit */}
            <div>
              <label
                htmlFor="unit"
                className="block text-gray-700 font-medium mb-1"
              >
                Unit<span className="text-red-500">*</span>
              </label>
              <select
                className="full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-400 transition-all bg-white"
                name="unit"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                disabled={loading} // 🔹 Disable while loading
              >
                <option value="">Select Unit</option>
                {units.map((unit, idx) => (
                  <option key={idx} value={unit}>
                    {unit}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Price */}
          <div>
            <label
              htmlFor="price"
              className="block text-gray-700 font-medium mb-1"
            >
              Price<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="price"
              placeholder="eg: 120"
              className="full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-green-400 transition-all"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              disabled={loading} // 🔹 Disable while loading
            />
          </div>

          {/* Image */}
          <div className="flex col sm:flex-row items-center gap-5">
            <label
              htmlFor="image"
              className="cursor-pointer flex-center gap-2 bg-green-50 text-green-700 font-semibold border border-green-200 rounded-xl px-6 py-3 hover:bg-green-100 transition-all full sm:w-auto"
            >
              <Upload className="w-5 h-5" /> Upload Image
            </label>
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleImageChange}
              hidden
              disabled={loading} // 🔹 Disable while loading
            />
            {preview && (
              <Image
                src={preview}
                width={100}
                height={100}
                alt="Grocery Image"
                className="rounded-xl shadow-md border border-gray-200 object-cover"
              />
            )}
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.9 }}
            className={`mt-4 w-full bg-linear-to-r from-green-500 to-green-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all flex-center gap-2 ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? (
              <div className="w-full flex justify-center items-center gap-2">
                <div className="h-5 w-5 rounded-full border-4 border-white border-t-transparent animate-spin" />
                Submitting...
              </div>
            ) : (
              "Add Grocery"
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
