import jwt from "jsonwebtoken";:w
import vault from "node-vault"
import vaultClient from "../vault.ts"

async function getUserToken (userData: {id: string, email: string}): Promise<string>{

  try{
    await vaultClient.write(`identity/entity/name/${userData.id}`,
    metadata :{
        email: userData.email, 
        session_id: Date.now().toString()
      });
    const tokenRequest = await vaultClient.write("identity/token/create",{
      entity_alias: userData, 
      ttl: "5m" 
    });
    const vaultUserToken = tokenRequest.auth.client_token;
    const vaultUserClient = vault({
      endpoint: "http://localhost:8200",
      token: vaultUserToken,
    })
    const result = vaultUserClient.read("identity/iodc/roles/user-role")
    console.log("passed on user token getter", result.data.token)
    return result.data.token
    )
  }catch(err){
    console.error("Error: Server failed to load user token on vault,  error:", err)
    return
  }
} 
