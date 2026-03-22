import { NextRequest } from "next/server";
import { checkToken } from "./jwt";

export function getUserFromRequest(req: NextRequest) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader) return null;

  const token = authHeader.split(" ")[1];
  if (!token) return null;

  return checkToken(token);
}