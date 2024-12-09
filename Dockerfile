FROM node:16.15.0-alpine

WORKDIR /srv
COPY package.json /srv/
COPY package-lock.json /srv/
COPY tsconfig.json /srv/
COPY tsconfig.build.json /srv/

RUN npm ci

COPY motor /srv/motor
COPY prisma /srv/prisma

RUN npx prisma generate

RUN npm run build

EXPOSE 8080

CMD [ "npm", "start" ]
