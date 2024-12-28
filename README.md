# Home Assistant Stormglass Sea Temperature Integration

This integration allows you to monitor sea temperature data from Stormglass.io in Home Assistant.

## Installation

### HACS Installation
1. Open HACS in your Home Assistant instance
2. Click on "Integrations"
3. Click the three dots in the top right corner
4. Select "Custom repositories"
5. Add this repository URL and select "Integration" as the category
6. Click "Add"
7. Find "Stormglass Sea Temperature" in the integration list and click "Download"
8. Restart Home Assistant

### Manual Installation
1. Copy the `custom_components/stormglass_temperature` directory to your Home Assistant's `custom_components` directory
2. Restart Home Assistant

## Configuration

1. Go to Settings -> Devices & Services
2. Click "Add Integration"
3. Search for "Stormglass Sea Temperature"
4. Enter your Stormglass API key and location coordinates

## Features

- Displays sea temperature data from Stormglass.io
- Updates every hour
- Limited to 10 API calls per 24 hours
- Shows remaining API calls in sensor attributes

## Support

For issues and feature requests, please open an issue on GitHub.

## License

MIT License