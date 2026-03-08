HOME_URL=http://localhost:3000/home
LOGIN_URL=http://localhost:3000/api/auth/jwt-generator
ROTATION_URL=http://localhost:3000/api/vault/key-rotation
JWKS_URL=http://localhost:3000/api/vault/jwks
SESSION_FILE=.jwt_token

BLUE=\033[0;34m
GREEN=\033[0;32m
RED=\033[0;31m
YELLOW=\033[0;33m
NC=\033[0m 

check_session:
	@if [ ! -f $(SESSION_FILE) ]; then \
		echo -e "$(RED)Error: No session found. Please run 'make login' first.$(NC)"; \
		exit 1; \
	fi


.PHONY: login home token rotate-keys logout

login:
	@echo -e "$(BLUE)========================================$(NC)"
	@echo -e "$(BLUE)          LOGIN TO SERVER               $(NC)"
	@echo -e "$(BLUE)========================================$(NC)"
	@read -p "Enter your email: " email; \
	read -sp "Enter your id: " id; \
	echo -e "\n$(YELLOW)Authenticating...$(NC)"; \
	RESPONSE=$$(curl -s -X POST $(LOGIN_URL) \
		-H "Content-Type: application/json" \
		-d "{\"email\":\"$$email\", \"id\":\"$$id\"}"); \
	TOKEN=$$(echo $$RESPONSE | docker compose exec -T backend jq -r '.token // empty'); \
	if [ -n "$$TOKEN" ] && [ "$$TOKEN" != "null" ]; then \
		echo $$TOKEN > $(SESSION_FILE); \
		echo -e "$(GREEN)✔ Login successful! Token saved.$(NC)"; \
	else \
		echo -e "$(RED)✘ Login failed!$(NC)"; \
		echo $$RESPONSE | docker compose exec -T backend jq .; \
	fi

home: check_session
	@echo -e "$(YELLOW)Fetching protected resource...$(NC)"
	@TOKEN=$$(cat $(SESSION_FILE)); \
	curl -s -i -X GET $(HOME_URL) \
		-H "Authorization: Bearer $$TOKEN" | \
		sed "s/HTTP\/1.1 200 OK/$(GREEN)HTTP\/1.1 200 OK$(NC)/" | \
		sed "s/HTTP\/1.1 401 Unauthorized/$(RED)HTTP\/1.1 401 Unauthorized$(NC)/"

token: check_session
	@echo -e "$(BLUE)--- JWT Payload Analysis ---$(NC)"
	@TOKEN=$$(cat $(SESSION_FILE)); \
	docker compose exec -T backend jwt decode $$TOKEN

rotate-keys:
	@echo -e "$(YELLOW)Triggering Key Rotation...$(NC)"
	@RESPONSE=$$(curl -s -X POST $(ROTATION_URL)); \
	echo -e "$(GREEN)Rotation signal sent.$(NC)"; \
	echo $$RESPONSE | docker compose exec -T backend jq .

get-keys:
	@echo -e "$(BLUE)--- JWKS Public Keys ---$(NC)"
	@echo -e "$(YELLOW)Making connection with the server...$(NC)"
	@RESPONSE=$$(curl -s -X GET $(JWKS_URL)); \
	echo -e "$(GREEN)Connection sucessfull, retrieving data.$(NC)"; \
	echo $$RESPONSE  | docker compose exec -T backend jq .

logout:
	@rm -f $(SESSION_FILE)
	@echo -e "$(YELLOW)Session cleared.$(NC)"


