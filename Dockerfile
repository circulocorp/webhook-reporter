FROM node:18-alpine

RUN npm install -g ts-node typescript

WORKDIR /usr/src/app

COPY package*.json pnpm-lock.yaml ./

COPY . .

RUN npm install

ENV NODE_ENV=production

ENV AUTHORIZATION_KEY=0506
ENV JWT_SECRET_KEY=circulocorpdesarrollo2023
ENV JWT_EXPIRES_IN=1d
ENV MAILTRAP_USER=a526db013b125e
ENV MAILTRAP_PASS=9e32312b12f9bf
ENV DATABASE=webhooks_db
ENV DATABASE_USER=main_user_db
ENV DATABASE_PASSWORD=main_password_db
ENV DATABASE_HOST=127.0.0.1
ENV DATABASE_PORT=5432
ENV MAIL_HOST=sandbox.smtp.mailtrap.io
ENV MAIL_PORT=2525
ENV MAIL_USER=88fbefa0ebf374
ENV MAIL_PASS=f299372ca3fe28

EXPOSE 3000

CMD ["npm","start"]