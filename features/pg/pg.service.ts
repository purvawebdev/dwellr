import { PG } from "./pg.model";

export async function getNearbyPGs(lat: number, lng: number) {
  try {
    return await PG.find({
      status: "approved",
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [lng, lat],
          },
          $maxDistance: 5000,
        },
      },
    })
      .select("name location address rent ratings amenities")
      .limit(20);
  } catch (error) {
    // Production-safe fallback when geo index is missing or still building.
    const message = error instanceof Error ? error.message : "";
    const isGeoIndexIssue =
      message.includes("unable to find index for $geoNear query") ||
      message.includes("2dsphere") ||
      message.includes("$geoNear");

    if (!isGeoIndexIssue) {
      throw error;
    }

    const latDelta = 0.05;
    const lngDelta = 0.05;

    return PG.find({
      status: "approved",
      "location.coordinates.0": { $gte: lng - lngDelta, $lte: lng + lngDelta },
      "location.coordinates.1": { $gte: lat - latDelta, $lte: lat + latDelta },
    })
      .select("name location address rent ratings amenities")
      .limit(20);
  }
}

export async function getPGById(id: string) {
  return PG.findById(id);
}