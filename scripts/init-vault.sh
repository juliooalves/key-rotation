#!/bin/bash

export VAULT_ADDR='http://vault:8200'

echo "Checking connectivity to $VAULT_ADDR..."
until vault status -tls-skip-verify >/dev/null 2>&1; do
  if [ $? -eq 0 ] || [ $? -eq 2 ]; then
    break
  fi
  echo "Vault is still unavailable at $VAULT_ADDR... sleeping"
  sleep 2
done

vault auth enable userpass
vault auth enable approle

vault policy write backend-policy /vault/policies/backend.hcl

vault write identity/oidc/key/jwt-key allowed_client_ids="*" \
  rotation_period="1h" \
  verification_ttl="2h"

vault write auth/approle/role/backend-role \
  token_policies="backend-policy" \
  token_ttl=1h \
  token_max_ttl=4h

vault write auth/token/roles/jwt-issuer \
  allowed_entity_aliases="*" \
  orphan=true \
  renewable=true \
  token_period="10m"

vault write identity/oidc/role/user-role \
  key="jwt-key" \
  ttl="1h" \
  template='{"id": {{identity.entity.name}}, "email": {{identity.entity.metadata.email}}, "session_id": {{identity.entity.metadata.session_id}}}'

ROLE_ID=$(vault read -field=role_id auth/approle/role/backend-role/role-id)
echo "Role Id saved"
SECRET_ID=$(vault write -f -field=secret_id auth/approle/role/backend-role/secret-id)
echo "Secret id saved"

echo "VAULT_ROLE_ID=$ROLE_ID" >./shared_config/.env.vault
echo "VAULT_SECRET_ID=$SECRET_ID" >>./shared_config/.env.vault

cat /shared_config/.env.vault
