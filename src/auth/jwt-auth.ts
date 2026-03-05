import * as jose from "jose";

const JWKS_URL = "http://vault:8200/v1/identity/oidc/.well-known/keys";

export default async function userTokenAuth(jwt: string): Promise<string> {
  try {
    const JWKS = jose.createRemoteJWKSet(new URL(JWKS_URL));
    const claims = jose.decodeJwt(jwt);
    const { payload, protectedHeader } = await jose.jwtVerify(jwt, JWKS, {
      issuer: claims.iss,
      audience: claims.aud,
    });
    console.log("Token validated successfully", payload);
    return payload;
  } catch (err) {
    console.log(typeof err);
    console.log(err);
    console.error("Error when tried to Validate user Token:", err.message);
    return err;
  }
}
