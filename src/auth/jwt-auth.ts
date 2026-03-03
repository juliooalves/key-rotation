import jwt from "jsonwebtoken";
import vault from "node-vault";
import vaultClient from "../vault.ts";

export default async function getUserToken(userData: {
  id: string;
  email: string;
}): Promise<string> {
  try {
    await vaultClient().write(`identity/entity/name/${userData.id}`, {
      metadata: {
        email: userData.email,
        session_id: "1234",
      },
    });
    console.log("passed on the write identity endpoint");
    const tokenRequest = await vaultClient().write(
      "auth/token/create/jwt-issuer",
      {
        entity_alias: userData.id,
        ttl: "5m",
      },
    );
    console.log("token request successfully created", tokenRequest);
    const vaultUserToken = await tokenRequest.auth.client_token;
    const vaultUserClient = vault({
      endpoint: "http://localhost:8200",
      token: vaultUserToken,
    });

    console.log("user vault client created.");
    const result = await vaultUserClient.read("identity/oidc/token/user-role");
    console.log("result", result);
    console.log("passed on user token getter", result.data.token);
    return result.data.token;
  } catch (err) {
    console.error(
      "Error: Server failed to load user token on vault,  error:",
      err,
    );
    return;
  }
}
