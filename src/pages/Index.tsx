import React from "react";
import ConfigForm from "@/components/ConfigForm";
import SeaTemperature from "@/components/SeaTemperature";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";

const CALLS_PER_DAY = 10;
const STORAGE_KEY = "stormglass_api_calls";

interface ApiCallRecord {
  timestamp: number;
  count: number;
}

const fetchSeaTemperature = async (config: {
  apiKey: string;
  latitude: string;
  longitude: string;
}) => {
  // Check API call limits
  const now = Date.now();
  const storedData = localStorage.getItem(STORAGE_KEY);
  let apiCallRecord: ApiCallRecord = storedData
    ? JSON.parse(storedData)
    : { timestamp: now, count: 0 };

  // Reset counter if 24 hours have passed
  if (now - apiCallRecord.timestamp > 24 * 60 * 60 * 1000) {
    apiCallRecord = { timestamp: now, count: 0 };
  }

  // Check if limit reached
  if (apiCallRecord.count >= CALLS_PER_DAY) {
    throw new Error(`API call limit reached (${CALLS_PER_DAY} calls per 24 hours)`);
  }

  // Make API call
  const response = await fetch(
    `https://api.stormglass.io/v2/weather/point?lat=${config.latitude}&lng=${config.longitude}&params=waterTemperature`,
    {
      headers: {
        Authorization: config.apiKey,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch sea temperature");
  }

  // Update API call counter
  apiCallRecord.count += 1;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(apiCallRecord));

  const data = await response.json();
  const temperature = data.hours[0].waterTemperature.sg;

  // Update Home Assistant sensor
  await fetch("/api/hassio_ingress/sea_temperature", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      state: temperature,
      attributes: {
        unit_of_measurement: "°C",
        friendly_name: "Sea Temperature",
        latitude: config.latitude,
        longitude: config.longitude,
        last_updated: new Date().toISOString(),
        api_calls_remaining: CALLS_PER_DAY - apiCallRecord.count,
      },
    }),
  });

  return temperature;
};

const Index = () => {
  const [config, setConfig] = React.useState<{
    apiKey: string;
    latitude: string;
    longitude: string;
  } | null>(null);
  const { toast } = useToast();

  const { data: temperature, isLoading, error } = useQuery({
    queryKey: ["seaTemperature", config],
    queryFn: () => (config ? fetchSeaTemperature(config) : null),
    enabled: !!config,
    refetchInterval: 3600000, // Refresh every hour
    retry: false,
    meta: {
      onError: (error: Error) => {
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      },
    },
  });

  const handleConfigSave = (newConfig: {
    apiKey: string;
    latitude: string;
    longitude: string;
  }) => {
    setConfig(newConfig);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-center text-ocean mb-8">
          Stormglass Sea Temperature
        </h1>
        
        <ConfigForm onSave={handleConfigSave} />
        
        {config && (
          <SeaTemperature
            temperature={temperature}
            loading={isLoading}
            error={error?.message}
          />
        )}
      </div>
    </div>
  );
};

export default Index;