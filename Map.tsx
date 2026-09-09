import { useEffect, useRef } from "react";
import type { LayerGroup, Map as LeafletMap } from "leaflet";
import "leaflet/dist/leaflet.css";
import { cn } from "@/lib/utils";

export type MapHop = {
  order: number;
  ip: string;
  kind: string;
  city: string;
  country: string;
  lat: number;
  lng: number;
  provider: string;
  contextLabel?: string;
};

export function isValidRouteCoordinate(hop: Pick<MapHop, "kind" | "lat" | "lng">) {
  return hop.kind === "public" && Number.isFinite(hop.lat) && Number.isFinite(hop.lng) && hop.lat >= -90 && hop.lat <= 90 && hop.lng >= -180 && hop.lng <= 180;
}

export function routeCoordinates(hops: MapHop[]) {
  return hops.filter(isValidRouteCoordinate).map(hop => [hop.lat, hop.lng] as [number, number]);
}

export function routeLineColor() {
  return "#ef4444";
}

interface MapViewProps {
  className?: string;
  initialCenter?: { lat: number; lng: number };
  initialZoom?: number;
  hops?: MapHop[];
  onMapReady?: (map: LeafletMap) => void;
  onMapError?: (error: unknown) => void;
}

export function MapView({ className, initialCenter = { lat: 20, lng: 0 }, initialZoom = 2, hops = [], onMapReady, onMapError }: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const routeLayerRef = useRef<LayerGroup | null>(null);
  const onMapReadyRef = useRef(onMapReady);
  const onMapErrorRef = useRef(onMapError);
  onMapReadyRef.current = onMapReady;
  onMapErrorRef.current = onMapError;
  const routeKey = JSON.stringify(hops.map(hop => [hop.order, hop.ip, hop.kind, hop.lat, hop.lng]));

  useEffect(() => {
    let disposed = false;
    let map: LeafletMap | null = null;
    import("leaflet").then(({ default: L }) => {
      if (disposed || !mapContainer.current) return;
      try {
        map = L.map(mapContainer.current, { worldCopyJump: true, zoomControl: true, attributionControl: true }).setView([initialCenter.lat, initialCenter.lng], initialZoom);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 7, minZoom: 1, attribution: "© OpenStreetMap contributors" }).addTo(map);
        const routeLayer = L.layerGroup().addTo(map);
        mapRef.current = map;
        routeLayerRef.current = routeLayer;
        onMapReadyRef.current?.(map);
        const validHops = hops.filter(isValidRouteCoordinate);
        const points = routeCoordinates(hops);
        validHops.forEach(hop => {
          L.circleMarker([hop.lat, hop.lng], { radius: 6, color: "#f8fafc", weight: 2, fillColor: routeLineColor(), fillOpacity: .95 }).bindTooltip(`HOP ${hop.order} · ${hop.ip}<br/>${hop.city}, ${hop.country}<br/><span class="leaflet-context-note">Routing context · not sender attribution</span>`, { direction: "top", opacity: .95 }).addTo(routeLayer);
        });
        if (points.length > 1) {
          L.polyline(points, { color: routeLineColor(), weight: 3, opacity: .95, dashArray: "8 8", lineCap: "round" }).bindTooltip("Observed public-IP route · context, not sender attribution", { sticky: true }).addTo(routeLayer);
          map.fitBounds(L.latLngBounds(points), { padding: [28, 28], maxZoom: 4 });
        } else if (points.length === 1) {
          map.setView(points[0], Math.max(initialZoom, 3));
        }
        window.setTimeout(() => map?.invalidateSize(), 0);
      } catch (error) {
        onMapErrorRef.current?.(error);
      }
    }).catch(error => onMapErrorRef.current?.(error));
    return () => { disposed = true; routeLayerRef.current?.clearLayers(); map?.remove(); mapRef.current = null; routeLayerRef.current = null; };
  }, [routeKey, initialCenter.lat, initialCenter.lng, initialZoom]);

  return <div ref={mapContainer} className={cn("mailsentinel-leaflet h-[320px] w-full", className)} role="img" aria-label="Interactive world map showing observed public IP routing context" />;
}
