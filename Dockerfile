# build stage
FROM node:lts-alpine AS build
RUN npm install -g pnpm
WORKDIR /app
COPY package.json pnpm-lock.yaml tsconfig.app.json tsconfig.json tsconfig.node.json vite.config.ts ./
RUN pnpm install
COPY . .
RUN pnpm exec vite build

# production stage
FROM nginx:stable-alpine AS production
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
ENV VITE_IP_BACKEND="http://localhost:8000"
CMD ["nginx", "-g", "daemon off;"]
