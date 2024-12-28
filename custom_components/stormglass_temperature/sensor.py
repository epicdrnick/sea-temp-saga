"""Support for Stormglass sea temperature sensor."""
from __future__ import annotations

from datetime import datetime, timedelta
import logging
from typing import Any

import requests
from homeassistant.components.sensor import SensorEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import (
    CONF_API_KEY,
    CONF_LATITUDE,
    CONF_LONGITUDE,
    UnitOfTemperature,
)
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback
from homeassistant.util import Throttle

from .const import DOMAIN, SCAN_INTERVAL, CALLS_PER_DAY

_LOGGER = logging.getLogger(__name__)

async def async_setup_entry(
    hass: HomeAssistant,
    config_entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    """Set up the Stormglass sensor."""
    api_key = config_entry.data[CONF_API_KEY]
    latitude = config_entry.data[CONF_LATITUDE]
    longitude = config_entry.data[CONF_LONGITUDE]

    async_add_entities(
        [StormglassSensor(api_key, latitude, longitude)],
        True,
    )

class StormglassSensor(SensorEntity):
    """Implementation of a Stormglass sensor."""

    _attr_native_unit_of_measurement = UnitOfTemperature.CELSIUS
    _attr_has_entity_name = True
    _attr_name = "Sea Temperature"

    def __init__(self, api_key: str, latitude: float, longitude: float) -> None:
        """Initialize the sensor."""
        self._api_key = api_key
        self._latitude = latitude
        self._longitude = longitude
        self._attr_unique_id = f"stormglass_temperature_{latitude}_{longitude}"
        self._calls_today = 0
        self._last_reset = datetime.now()

    @Throttle(timedelta(seconds=SCAN_INTERVAL))
    def update(self) -> None:
        """Get the latest data from Stormglass."""
        # Reset API call counter if 24 hours have passed
        if datetime.now() - self._last_reset > timedelta(hours=24):
            self._calls_today = 0
            self._last_reset = datetime.now()

        # Check API call limit
        if self._calls_today >= CALLS_PER_DAY:
            _LOGGER.warning("API call limit reached (10 calls per 24 hours)")
            return

        try:
            response = requests.get(
                f"https://api.stormglass.io/v2/weather/point",
                params={
                    "lat": self._latitude,
                    "lng": self._longitude,
                    "params": "waterTemperature",
                },
                headers={"Authorization": self._api_key},
            )
            response.raise_for_status()
            data = response.json()
            self._attr_native_value = data["hours"][0]["waterTemperature"]["sg"]
            self._calls_today += 1
            self._attr_extra_state_attributes = {
                "last_updated": datetime.now().isoformat(),
                "api_calls_remaining": CALLS_PER_DAY - self._calls_today,
                "latitude": self._latitude,
                "longitude": self._longitude,
            }
        except Exception as err:
            _LOGGER.error("Error fetching data: %s", err)
            self._attr_native_value = None