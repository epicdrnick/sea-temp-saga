ARG BUILD_FROM
FROM $BUILD_FROM

# Install required packages
RUN apk add --no-cache nodejs npm

# Copy your application files
WORKDIR /app
COPY . .

# Install dependencies and build the application
RUN npm install
RUN npm run build

# Copy data for add-on
COPY run.sh /
RUN chmod a+x /run.sh

CMD [ "/run.sh" ]