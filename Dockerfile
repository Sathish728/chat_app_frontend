FROM node:20-alpine


WORKDIR /app


COPY package*.json ./


RUN npm install --legacy-peer-deps --force && \
    npm cache clean --force


COPY . .

# Accept build-time secrets
ARG VITE_API_URL
ARG VITE_STREAM_API_KEY

ENV VITE_API_URL=$VITE_API_URL
ENV VITE_STREAM_API_KEY=$VITE_STREAM_API_KEY
ENV NODE_OPTIONS="--max-old-space-size=1536"


RUN npm run build


RUN npm install -g serve


EXPOSE 3000


CMD ["serve", "-s", "dist", "-l", "3000"]