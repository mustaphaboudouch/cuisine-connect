import { cookies } from "next/headers";
import { jwtVerify, SignJWT } from "jose";

/**
 * Sign a JWT using HMAC-SHA256 algorithm.
 */

type SignJWTArgs = {
  payload: {
    sub: string;
  };
  options: {
    exp: string;
  };
};

function signJWT({ payload, options }: SignJWTArgs) {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET_KEY);
    return new SignJWT(payload)
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime(options.exp)
      .setIssuedAt()
      .setSubject(payload.sub)
      .sign(secret);
  } catch (error) {
    throw error;
  }
}

/**
 * Verify a JWT and return the payload
 */

async function verifyJWT<T>(token: string): Promise<T> {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET_KEY);
    const decoded = await jwtVerify(token, secret);
    return decoded.payload as T;
  } catch (error) {
    throw new Error("Your token has been expired.");
  }
}

/**
 * Delete JWT from cookies
 */

function deleteJWT() {
  cookies().set({
    name: process.env.JWT_TOKEN_NAME!,
    value: "",
    maxAge: -1,
  });
}

export { signJWT, verifyJWT, deleteJWT };
