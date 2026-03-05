import jwt from "jsonwebtoken";
import vault from "node-vault";
import crypto from "crypto";
import vaultClient from "../vault.ts";

export default async function userTokenGenerator(userData: {
  id: string;
  email: string;
}): Promise<string> {
  try {
    const authMethods = await vaultClient().read("sys/auth");
    console.log(authMethods);
    const tokenAccessor = authMethods.data["token/"].accessor;
    console.log("token accessor");
    await vaultClient().write(`identity/entity/name/${userData.id}`, {
      metadata: {
        email: userData.email,
        session_id: crypto.randomBytes(20).toString("hex"),
      },
    });

    const entityId = await vaultClient().read(
      `identity/entity/name/${userData.id}`,
    );
    const canonicalId = entityId.data.id;
    await vaultClient().write(`identity/entity-alias`, {
      name: userData.id,
      canonical_id: canonicalId,
      mount_accessor: tokenAccessor,
    });
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
