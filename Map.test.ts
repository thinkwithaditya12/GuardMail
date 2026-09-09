import { describe, expect, it } from "vitest";
import { isValidRouteCoordinate, routeCoordinates, routeLineColor } from "./Map";

const hops = [
  { order: 1, ip: "8.8.8.8", kind: "public", city: "Mountain View", country: "US", lat: 37.386, lng: -122.083, provider: "test" },
  { order: 2, ip: "1.1.1.1", kind: "public", city: "Brisbane", country: "AU", lat: -27.47, lng: 153.02, provider: "test" },
  { order: 3, ip: "10.0.0.1", kind: "private", city: "Private", country: "--", lat: 0, lng: 0, provider: "test" },
  { order: 4, ip: "203.0.113.8", kind: "synthetic", city: "Synthetic", country: "--", lat: 12, lng: 25, provider: "test" },
];

describe("Leaflet route map helpers", () => {
  it("keeps only validated public coordinates for the route line", () => {
    expect(routeCoordinates(hops)).toEqual([[37.386, -122.083], [-27.47, 153.02]]);
  });

  it("rejects private, synthetic, and out-of-range coordinates", () => {
    expect(isValidRouteCoordinate(hops[2])).toBe(false);
    expect(isValidRouteCoordinate(hops[3])).toBe(false);
    expect(isValidRouteCoordinate({ kind: "public", lat: 91, lng: 0 })).toBe(false);
  });

  it("uses a red route line for observed public-IP hops", () => {
    expect(routeLineColor()).toBe("#ef4444");
  });
});
