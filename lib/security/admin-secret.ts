import "server-only";

export const ADMIN_SECRET_HEADER = "x-sablex-admin-secret";

export function isValidAdminSecret(headers: Headers): boolean {
  const expectedSecret = process.env.sablex_ADMIN_SECRET;
  const receivedSecret = headers.get(ADMIN_SECRET_HEADER);

  if (!expectedSecret || !receivedSecret) {
    return false;
  }

  return receivedSecret === expectedSecret;
}
