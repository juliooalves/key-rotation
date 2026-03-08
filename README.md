# OIDC Identity Provider and Secret Management System
This project implements a secure, automated Identity Provider (IdP) architecture utilizing **HashiCorp Vault**. It focuses on machine-to-machine authentication, **dynamic OIDC token generation**, and the enforcement of **cryptographic integrity**.

### Core Features
1. Infrastructure as Code (IaC)
The environment is bootstrapped via an automated initialization script that configures Vault's engine, sets up AppRole authentication for the backend, and initializes the OIDC provider. This ensures a consistent, reproducible security environment.

2. Service-Level Authentication (AppRole)
The backend service utilizes the AppRole method to authenticate with Vault. This eliminates the need for hardcoded root tokens in the codebase. The service exchanges a RoleID and SecretID for a temporary, limited-privilege client token.

3. Dynamic OIDC Lifecycle
The system acts as a full OIDC issuer. It manages the generation of JWTs, including identity claims and metadata mapping. The backend validates these tokens by dynamically fetching public keys from the Vault JWKS endpoint.

4. Cryptographic Key Rotation
A dedicated endpoint allows for the rotation of the OIDC signing keys. The system demonstrates "zero-downtime" rotation, where the backend seamlessly transitions to the new public key without manual configuration updates.

### Getting Started
1. Initialize the Environment
Launch the containerized ecosystem. This will start the Vault server, the Node.js backend, and trigger the initialization script.

#### command:
docker compose up -d

2. User Interaction (Makefile)
The project includes a Makefile to simulate client-side interactions with the API.

### Authentication
Capture user credentials and store a local session token.

#### command: 
make login

### Protected Resource Access
Verify the integrity of the JWT against the backend's OIDC middleware.

#### command:
make home 

### Token Inspection
Decode the local JWT using the backend's internal tools to view the header, payload, and claims.

#### command: 
make token

### Key Rotation
Trigger a manual rotation of the OIDC signing keys in Vault and verify the new Key ID (KID).

#### command:
make rotate-keys

### Technical Stack
Security Engine: HashiCorp Vault

Runtime: Node.js / TypeScript (ESM)

Transpiler: tsx / ts-node

Environment: Docker / Alpine Linux

CLI Tools: jq, jwt-cli, curl


