FROM node:10.14.1

WORKDIR /app

ADD package.json ./
ADD package-lock.json ./
ADD tsconfig.json ./
ADD src/ ./src
ADD packages/ ./packages
RUN mkdir tests && touch tests/index.ts

RUN npm install
RUN npm run build
RUN rm -r src && rm -r tests && rm tsconfig.json && rm -r dist/tests

ENV NODE_ENV=production

ENTRYPOINT ["npm", "start"]
