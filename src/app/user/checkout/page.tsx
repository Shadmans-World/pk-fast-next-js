"use client";
import React, { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  ArrowLeft,
  Building,
  Home,
  MapPin,
  Navigation,
  Phone,
  Search,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/src/redux/store";

import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
import L, { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import { DraggableMarker } from "@/src/components/DraggableMarker";
import { OpenStreetMapProvider } from "leaflet-geosearch";

const markerIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/128/684/684908.png",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

export default function Checkout() {
  const router = useRouter();
  const handleBackToCart = () => {
    router.push("/user/cart");
  };

  const { userData } = useSelector((state: RootState) => state.user);
  const [address, setAddress] = useState({
    fullName: "",
    mobile: "",
    city: "",
    state: "",
    postCode: "",
    fullAddress: "",
  });

  const [searchQuery, setSearchQuery]= useState("")

  const [position, setPosition] = useState<[number, number] | null>(null);

  const handleSearchQuery = async () => {
  if (!searchQuery) return;

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

//   const DraggableMarker: React.FC = () => {
//     const map = useMap();
//     useEffect(() => {
//       map.setView(position as LatLngExpression, 15, { animate: true });
//     }, [position, map]);


//     useEffect(()=>{
//         const fetchAddress = async()=>{
//             if(!position) return 
//             try {
//                 const result =await axios.get(`/api/reverse-geocode?lat=${position[0]}&lon=${position[1]}`)

//                 console.log(result.data)
//                 const addr = result.data.address;
//                 setAddress(prev=>({
//                     ...prev,
//                     city:addr.city,
//                     state:addr.state,
//                     postCode:addr.postcode,
//                     fullAddress:result.data.display_name

//                 }))

//             } catch (error) {
//                 console.log("error in map fetching: ",error)
//             }
//         }
//         fetchAddress()
//     },[position])
//     return (
//       <Marker
//         icon={markerIcon}
//         position={position as LatLngExpression}
//         draggable={true}
//         eventHandlers={{
//           dragend: (e: L.LeafletEvent) => {
//             const marker = e.target as L.Marker;
//             const { lat, lng } = marker.getLatLng();

//             setPosition([lat, lng]);
//           },
//         }}
//       />
//     );
//   };

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
                  setAddress((prev) => ({ ...prev, fullName: e.target.value}))
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
                    setAddress((prev) => ({ ...prev, city: e.target.value}))
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
                      state: e.target.value
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
                value={searchQuery} onChange={(e)=>setSearchQuery(e.target.value)}
              />
              <button className="bg-green-600 text-white px-5 rounded-lg hover:bg-green-700 transition-all font-medium" onClick={handleSearchQuery}>
                Search
              </button>
            </div>

            {/* Map */}
            <div className="relative mt-6 h-82.5 rounded-xl overflow-hidden border border-gray-200 shadow-inner ">
              {position && (
                <MapContainer
                  center={position as LatLngExpression}
                  zoom={13}
                  scrollWheelZoom={true}
                  className="full h-full"
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                    <DraggableMarker
      position={position}
      setPosition={setPosition}
      setAddress={setAddress}
    />
                </MapContainer>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
