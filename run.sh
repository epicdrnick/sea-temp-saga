#!/usr/bin/with-contenv bashio

# Get config values
API_KEY=$(bashio::config 'api_key')
LATITUDE=$(bashio::config 'latitude')
LONGITUDE=$(bashio::config 'longitude')

# Export as environment variables
export STORMGLASS_API_KEY="${API_KEY}"
export STORMGLASS_LAT="${LATITUDE}"
export STORMGLASS_LON="${LONGITUDE}"

# Start the application
npm start