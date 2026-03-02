import vaultClient from "../src/vault.ts";

const dataSigner = async (payload: object): Promise<string> => {
  const base64Data = Buffer.from(JSON.stringify(payload)).toString("base64");

  try {
    const result = await vaultClient().write("transit/sign/jwt-key-pair", {
      input: base64Data,
    });
    const signature = result.data.signature;
    console.log("Passed on data signer");
    return signature;
  } catch (error) {
    console.error("Vault signing failed:", error);
    throw error;
  }
};
export default dataSigner;
