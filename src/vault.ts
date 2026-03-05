import fs from "fs";
import vault from "node-vault";
import * as dotenv from "dotenv";

const vaultEnvPath = "/server/config/.env.vault";
if (fs.existsSync(vaultEnvPath)) {
  const envConfig = dotenv.parse(fs.readFileSync(vaultEnvPath));
  for (const k in envConfig) {
    process.env[k] = envConfig[k];
  }
}
const options: vault.VaultOptions = {
  apiVersion: "v1",
  endpoint: "http://vault:8200",
};
export const vaultClient = () => {
  try {
    const vaultData = vault(options);
    return vaultData;
  } catch (err) {
    console.error("Error: Failed to fetch vault client");
    return;
  }
};
console.log(process.env.VAULT_ROLE_ID, process.env.VAULT_SECRET_ID);
export async function initVaultClient() {
  const result = await vaultClient().approleLogin({
    role_id: process.env.VAULT_ROLE_ID,
    secret_id: process.env.VAULT_SECRET_ID,
  });
  options.token = result.auth.client_token;
  return options;
}
