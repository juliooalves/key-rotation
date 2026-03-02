import vault from "node-vault";
import * as dotenv from "dotenv";
dotenv.config();

const options: vault.VaultOptions = {
  apiVersion: "v1",
  endpoint: "http://localhost:8200",
  token: process.env.VAULT_TOKEN,
};

const vaultClient = () => {
  try {
    const vaultData = vault(options);
    return vaultData;
  } catch (err) {
    console.error("Error: Failed to fetch vault client");
    return;
  }
};
export default vaultClient;
