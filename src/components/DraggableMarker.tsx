import { Marker, useMap } from "react-leaflet";
import L from "leaflet";
import { LatLngExpression } from "leaflet";
import axios from "axios";
import { useEffect } from "react";

const markerIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/128/684/684908.png",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
});

interface Props {
  position: [number, number];
  setPosition: React.Dispatch<React.SetStateAction<[number, number] | null>>;
  setAddress: any; // you can type it properly if you have Address interface
}

export const DraggableMarker = ({ position, setPosition, setAddress }: Props) => {
  const map = useMap();

  // Center map on current position
  useEffect(() => {
    map.setView(position as LatLngExpression, 15, { animate: true });
  }, [position, map]);

  // Fetch address from server API
  useEffect(() => {
  if (!position) return;

  const fetchAddress = async () => {
    try {
      const res = await axios.get(
        `/api/reverse-geocode?lat=${position[0]}&lon=${position[1]}`
      );

      const addr = res.data.address;

      setAddress((prev: any) => ({
        ...prev,
        city: addr?.city || addr?.town || addr?.village || "",
        state: addr?.state || "",
        postCode: addr?.postcode || "",
        fullAddress: res.data?.display_name || "",
      }));
    } catch (err) {
      console.error("Error fetching address:", err);
    }
  };

  fetchAddress();
}, [position]);

  return (
    <Marker
      position={position as LatLngExpression}
      icon={markerIcon}
      draggable
      eventHandlers={{
        dragend: (e) => {
          const marker = e.target as L.Marker;
          const { lat, lng } = marker.getLatLng();
          setPosition([lat, lng]);
        },
      }}
    />
  );
};
