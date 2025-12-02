FROM node:20-alpine

RUN npm install -g pnpm serve

WORKDIR /app

COPY package.json pnpm-lock.yaml tsconfig.app.json tsconfig.json tsconfig.node.json vite.config.ts ./

RUN pnpm install 

COPY . .

RUN pnpm exec vite build

EXPOSE 5173

ENV VITE_IP_BACKEND="http://localhost:8000"

CMD ["pnpm", "run", "dev"]