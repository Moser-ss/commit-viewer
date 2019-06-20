FROM node:10-alpine

EXPOSE 3000
EXPOSE 9090

WORKDIR /app

CMD ["node_modules/.bin/nodemon", "--watch","src","--inspect=0.0.0.0:9090","."]