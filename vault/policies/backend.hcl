

path "identity/oidc/token/*" {
   capabilities = ["read", "create", "update"]
 }
path "identity/oidc/key/jwt-key/rotate" {
  capabilities= ["update"]
}
path "sys/auth/*" {
  capabilities= ["read", "create", "update"]
 }
path "sys/auth" {
  capabilities = ["read"]
}
path "auth/token*" {
  capabilities = ["create", "read", "update"]
}
path "identity/entity-alias*" {
  capabilities = ["create", "read", "update", "delete", "list"]
}

path "identity/entity*"{
   capabilities = ["read", "create", "update", "delete", "list"]

}
