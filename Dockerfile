FROM node:15

EXPOSE 3000

#Add user so it doesn't run as root
RUN adduser --system app --home /app
USER app
WORKDIR /app

#clone app
COPY --chown=app . .

WORKDIR /app/timeoff-management

#bump formidable up a version to fix user import error.
# RUN sed -i 's/formidable"\: "~1.0.17/formidable"\: "1.1.1/' package.json

#install app
RUN npm install -y

CMD npm start