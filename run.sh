#!/usr/bin/with-contenv bashio

# Get config values
API_KEY=$(bashio::config 'api_key')
LATITUDE=$(bashio::config 'latitude')
LONGITUDE=$(bashio::config 'longitude')

# Export as environment variables
export STORMGLASS_API_KEY="${API_KEY}"
export STORMGLASS_LAT="${LATITUDE}"
export STORMGLASS_LON="${LONGITUDE}"

# Create the sensor entity in Home Assistant
bashio::log.info "Creating sea temperature sensor entity..."
curl -X POST -H "Authorization: Bearer ${SUPERVISOR_TOKEN}" \
     -H "Content-Type: application/json" \
     http://supervisor/core/api/states/sensor.sea_temperature \
     -d "{\"state\": \"unavailable\", \"attributes\": {\"unit_of_measurement\": \"°C\", \"friendly_name\": \"Sea Temperature\"}}"

# Start the application
cd /app
npm start