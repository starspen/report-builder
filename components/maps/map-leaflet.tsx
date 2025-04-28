import { useState } from "react";
import Leaflet from "leaflet";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

const PROJECT_NAME = process.env.NEXT_PUBLIC_PROJECT_NAME;

// Set default icon paths
// Leaflet.Icon.Default.imagePath = "../node_modules/leaflet";
const customIcon = new Leaflet.Icon({
  iconUrl: "/images/maps/marker-icon.png",
  iconRetinaUrl: "/images/maps/marker-icon.png",
  shadowUrl: "/images/maps/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface MapState {
  lat: number;
  lng: number;
  zoom: number;
}

const MapsLeaflet = ({
  height = 350,
  locationMap,
}: {
  height?: number;
  locationMap: string;
}) => {
  const [lat, lng] = locationMap
    ? locationMap.split(",").map(Number)
    : [51.505, -0.09];
  const [state, setState] = useState<MapState>({
    lat,
    lng,
    zoom: 13,
  });

  if (!locationMap) return <div>There is no location for this asset</div>;

  const position: [number, number] = [state.lat, state.lng];
  return (
    <MapContainer
      center={position}
      zoom={state.zoom}
      style={{ height: height }}
    >
      <TileLayer
        attribution={`${PROJECT_NAME} Dev`}
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position} icon={customIcon}></Marker>
    </MapContainer>
  );
};

export default MapsLeaflet;
