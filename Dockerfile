FROM node:lts-alpine
RUN npm install -g pnpm serve
WORKDIR /app
COPY package.json pnpm-lock.yaml tsconfig.app.json tsconfig.json tsconfig.node.json vite.config.ts ./
RUN pnpm install 
COPY . .
EXPOSE 80
ENV VITE_IP_BACKEND="http://localhost:8000"
ENTRYPOINT [ "pnpm", "run", "dev", "--host", "0.0.0.0", "--port", "80" ]
