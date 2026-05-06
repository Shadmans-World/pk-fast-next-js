"use client";
import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  ArrowLeft,
  Building,
  CreditCard,
  CreditCardIcon,
  Home,
  Loader2,
  LocateFixed,
  MapPin,
  Navigation,
  Phone,
  Search,
  Truck,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/src/redux/store";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import { DraggableMarker } from "@/src/components/DraggableMarker";

export default function Checkout() {
  const router = useRouter();
  const handleBackToCart = () => {
    router.push("/user/cart");
  };

  const { userData } = useSelector((state: RootState) => state.user);
  const { subTotal, deliveryFee, finalTotal ,cartData} = useSelector(
    (state: RootState) => state.cart,
  );
  const [address, setAddress] = useState({
    fullName: "",
    mobile: "",
    city: "",
    state: "",
    postCode: "",
    fullAddress: "",
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "online">("cod");
  const handleSearchQuery = async () => {
    if (!searchQuery) return;
    setSearchLoading(true);
    try {
      const res = await axios.get("/api/search-geocode", {
        params: { q: searchQuery },
      });

      if (res.data.length > 0) {
        const place = res.data[0];

        const lat = parseFloat(place.lat);
        const lon = parseFloat(place.lon);

        setPosition([lat, lon]);

        setAddress((prev) => ({
          ...prev,
          fullAddress: place.display_name,
          city: place.address?.city || "",
          state: place.address?.state || "",
          postCode: place.address?.postcode || "",
        }));
        setSearchLoading(false);
      }
    } catch (error) {
      console.log("Search error:", error);
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setPosition([latitude, longitude]);
        },
        (err) => {
          console.log("location error", err);
        },
        { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 },
      );
    }
  }, []);

  useEffect(() => {
    if (userData) {
      setAddress((prev) => ({
        ...prev,
        fullName: userData?.name || "",
        mobile: userData?.mobile || "",
      }));
    }
  }, [userData]);

  // 🔥 GPS FUNCTION
  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setPosition([latitude, longitude]);
      },
      (err) => {
        console.log("GPS error:", err);
      },
      { enableHighAccuracy: true },
    );
  };

  const handleCod = async()=>{
    if(!position){
      return null
    }
    try {
      const result = await axios.post("/api/user/order",{
        userId: userData?._id,
        items:cartData.map(item=>({
          grocery:item._id,
          name:item.name,
          price:item.price,
          unit:item.unit,
          quantity:item.quantity,
          image:item.image
        })),
        totalAmount:finalTotal,
        address:{
          fullName: address.fullName,
          mobile:address.mobile,
          city:address.city,
          state:address.state,
          fullAddress:address.fullAddress,
          pinCode:address.postCode,
          latitude:position[0],
          longitude:position[1]
        },
        paymentMethod
      })
      router.push("/user/order-success")
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div className="w-[92%] md:w-[80%] mx-auto py-10 relative">
      <motion.button
        whileTap={{ scale: 0.97 }}
        className="absolute left-0 top-2 flex items-center gap-2 text-green-700 hover:text-green-800 font-semibold"
        onClick={handleBackToCart}
      >
        <ArrowLeft size={16} />
        <span className="">Back To Cart</span>
      </motion.button>
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className=" text-3xl md:text-4xl font-bold text-green-700 text-center mb-10"
      >
        Checkout
      </motion.h1>
      <div className="grid md:grid-cols-2 gap-8">
        {/* Left Div */}
        <motion.div
          className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2 ">
            <MapPin className="text-green-700" /> Delivery Address
          </h2>
          <div className="space-y-4">
            {/* Name */}
            <div className="relative">
              <User
                className="absolute left-3 top-3 text-green-600"
                size={18}
              />
              <input
                type="text"
                value={address.fullName}
                onChange={(e) =>
                  setAddress((prev) => ({ ...prev, fullName: e.target.value }))
                }
                className="pl-10 full border rounded-lg p-3 text-sm bg-gray-50"
              />
            </div>
            {/* Phone Number */}
            <div className="relative">
              <Phone
                className="absolute left-3 top-3 text-green-600"
                size={18}
              />
              <input
                type="text"
                value={address.mobile}
                onChange={(e) =>
                  setAddress((prev) => ({ ...prev, mobile: e.target.value }))
                }
                className="pl-10 full border rounded-lg p-3 text-sm bg-gray-50"
              />
            </div>
            {/* Full Address */}
            <div className="relative">
              <Home
                className="absolute left-3 top-3 text-green-600"
                size={18}
              />
              <input
                type="text"
                value={address.fullAddress}
                onChange={(e) =>
                  setAddress((prev) => ({
                    ...prev,
                    fullAddress: e.target.value,
                  }))
                }
                className="pl-10 full border rounded-lg p-3 text-sm bg-gray-50"
                placeholder="Full Address"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              {/* City */}
              <div className="relative">
                <Building
                  className="absolute left-3 top-3 text-green-600"
                  size={18}
                />
                <input
                  type="text"
                  value={address.city}
                  onChange={(e) =>
                    setAddress((prev) => ({ ...prev, city: e.target.value }))
                  }
                  className="pl-10 full border rounded-lg p-3 text-sm bg-gray-50"
                  placeholder="City"
                />
              </div>
              {/* State */}
              <div className="relative">
                <Navigation
                  className="absolute left-3 top-3 text-green-600"
                  size={18}
                />
                <input
                  type="text"
                  value={address.state}
                  onChange={(e) =>
                    setAddress((prev) => ({
                      ...prev,
                      state: e.target.value,
                    }))
                  }
                  className="pl-10 full border rounded-lg p-3 text-sm bg-gray-50"
                  placeholder="State"
                />
              </div>
              {/* Pin Code */}
              <div className="relative">
                <Search
                  className="absolute left-3 top-3 text-green-600"
                  size={18}
                />
                <input
                  type="text"
                  value={address.postCode}
                  onChange={(e) =>
                    setAddress((prev) => ({ ...prev, pinCode: e.target.value }))
                  }
                  className="pl-10 full border rounded-lg p-3 text-sm bg-gray-50"
                  placeholder="Post code"
                />
              </div>
            </div>
            {/* Search */}
            <div className="flex gap-2 mt-3">
              <input
                type="text"
                placeholder="search city or area"
                className="flex-1 border rounded-lg p-3 text-sm focus:ring-2 focus:ring-green-500 outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                className="bg-green-600 text-white px-5 rounded-lg hover:bg-green-700 transition-all font-medium"
                onClick={handleSearchQuery}
              >
                {searchLoading ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  "Search"
                )}
              </button>
            </div>

            {/* Map */}
            <div className="relative mt-6 h-82.5 rounded-xl border border-gray-200 shadow-inner">
              {position && (
                <MapContainer
                  center={position}
                  zoom={13}
                  scrollWheelZoom={true}
                  className="w-full h-full [&_.leaflet-control-container]:hidden!"
                >
                  <TileLayer
                    attribution="&copy; OpenStreetMap contributors"
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />

                  <DraggableMarker
                    position={position}
                    setPosition={setPosition}
                    setAddress={setAddress}
                  />
                </MapContainer>
              )}

              {/* 🔥 GPS BUTTON (MapContainer এর বাইরে) */}
              {position && (
                <motion.button
                  whileTap={{ scale: 0.93 }}
                  onClick={handleGetCurrentLocation}
                  style={{
                    position: "absolute",
                    bottom: "16px",
                    right: "16px",
                    zIndex: 9999,
                  }}
                  className="bg-green-600 text-white shadow-lg rounded-full p-3 hover:bg-green-700 transition-all flex-center"
                >
                  <LocateFixed size={20} />
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Right Div */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 h-fit"
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <CreditCard className="text-green-600" /> Payment Method
          </h2>
          <div className="space-y-4 mb-6">
            {/* Online button */}
            <button
              className={`flex items-center gap-3 w-full border rounded-lg p-3 transition-all ${
                paymentMethod === "online"
                  ? "border-green-600 bg-green-50    shadow-sm"
                  : "hover:bg-gray-50"
              }`}
              onClick={() => setPaymentMethod("online")}
            >
              <CreditCardIcon className="text-green-600" />
              <span className="font-medium text-gray-700">
                Pay Online (stripe)
              </span>
            </button>

            {/* Cash On Delivery */}
            <button
              className={`flex items-center gap-3 w-full border rounded-lg p-3 transition-all ${
                paymentMethod === "cod"
                  ? "border-green-600 bg-green-50    shadow-sm"
                  : "hover:bg-gray-50"
              }`}
              onClick={() => setPaymentMethod("cod")}
            >
              <Truck className="text-green-600" />
              <span className="font-medium text-gray-700">
                Cash on Delivery
              </span>
            </button>
          </div>

          <div className="border-t pt-4 text-gray-700 space-y-2 text-sm sm:text-base">
            <div className="flex justify-between">
              <span className="font-semibold">Subtotal</span>
              <span className="font-semibold text-green-600">
                <span className=" font-extrabold">৳</span>
                {subTotal}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Delivery Fee</span>
              <span className="font-semibold text-green-600">
                <span className=" font-extrabold">৳</span>
                {deliveryFee}
              </span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t pt-3">
              <span >Total</span>
              <span className="font-semibold text-green-600">
                <span className="font-extrabold">৳</span>
                {finalTotal}
              </span>
            </div>
          </div>

          <motion.button
          whileTap={{scale:0.93}}
          className="w-full mt-6 bg-green-600 text-white py-3 rounded-full hover:bg-green-700 transition-all font-semibold"
          onClick={()=>{
            if(paymentMethod=="cod"){
              handleCod()
            }
            else{
              null
            }
          }}
          >
            {paymentMethod == "cod" ? "Place Order" : "Pay & Place Order"}
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}
