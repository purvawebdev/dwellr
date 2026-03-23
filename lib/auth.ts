import { NextRequest } from "next/server";
import { checkToken, TokenPayload } from "./jwt";

export function getUserFromRequest(req: NextRequest): TokenPayload | null {
  let token: string | null = null;

  // First try Authorization header (for backwards compatibility and XHR requests)
  const authHeader = req.headers.get("authorization");
  if (authHeader) {
    const parts = authHeader.split(" ");
    if (parts[0] === "Bearer" && parts[1]) {
      token = parts[1];
    }
  }

  // Fall back to cookie (httpOnly cookies are more secure)
  if (!token) {
    token = req.cookies.get("authToken")?.value || null;
  }

  if (!token) {
    return null;
  }

  return checkToken(token);
}