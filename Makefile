
HOME_URL=http://localhost:3000/home
LOGIN_URL=http://localhost:3000/api/auth/jwt-generator
ROTATION_URL=http://localhost:3000/api/vault/key-rotation	
SESSION_FILE=.jwt_token

login:
	
	@echo "========================================"
	@echo "          Login into the Server         "
	@echo "========================================"
	@echo -e "\n"
	@read -p "Enter your email: " email; \
	read -sp "Enter your password: " password; \
	echo ""; \
	echo "Logging in..."; \
	RESPONSE=$$(curl -s -X POST $(LOGIN_URL) \
		-H "Content-Type: application/json" \
		-d '{"id":"hdejhdeh", "email":"'$$email'", "password":"'$$password'"}'); \
	TOKEN=$$( echo $$RESPONSE | docker compose exec backend jq -r '.token'); \
	if [ "$$TOKEN" != "null" ]; then \
		echo $$TOKEN > $(SESSION_FILE); \
		echo "Login successful! Token saved to $(SESSION_FILE)"; \
	else \
		echo "Login failed: $$RESPONSE"; \
	fi

home:
	@if [ ! -f $(SESSION_FILE) ]; then \
		echo "Error: No session found. Please run 'make login' first."; \
		exit 1; \
	fi; \
  TOKEN=$$( cat $(SESSION_FILE)); \
	jwt_token=$$(cat $(SESSION_FILE)); \
	   curl -s -i -X GET $(HOME_URL) \
		-H "Authorization: Bearer $$TOKEN"
	@echo ""
token: 
	@if [ ! -f $(SESSION_FILE) ]; then \
		echo "Error: No session found. Please run 'make login' first."; \
		exit 1; \
  fi; \
  TOKEN=$$( cat $(SESSION_FILE)); \
	docker compose exec backend jwt decode $$TOKEN 

rotate-keys:
	@echo "========================================"
	@echo "          Rotating keys on JWKS         "
	@echo "========================================"
	@curl -X POST $(ROTATION_URL)
	@echo ""
	
.PHONY: login, home, token,
   

