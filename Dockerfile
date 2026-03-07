FROM node:20-slim 
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV CI="true"
RUN corepack enable
WORKDIR /server
COPY package.json pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --no-frozen-lockfile
RUN apt-get update && apt-get install -y curl jq
RUN curl -s -L -o jwt.tar.gz https://github.com/mike-engel/jwt-cli/releases/latest/download/jwt-linux.tar.gz && \
  tar xf jwt.tar.gz -C /usr/local/bin jwt && \
  rm -rf jwt.tar.gz 
COPY . .
EXPOSE 3000
CMD ["pnpm", "run" ,"dev"]

