import { PG } from "./pg.model";

export async function getNearbyPGs(lat: number, lng: number) {
  return PG.find({
    location: {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: [lng, lat]
        },
        $maxDistance: 5000
      }
    }
  })
  .select("name location address rent ratings amenities")
  .limit(20);
}