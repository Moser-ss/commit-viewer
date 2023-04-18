FROM node:18.15-alpine
EXPOSE 3000
EXPOSE 3030

WORKDIR /app

RUN apk update && \
 apk add --no-cache git=2.24.1-r0


CMD ["node_modules/.bin/nodemon", "--watch","src","--inspect=0.0.0.0:3030","."]