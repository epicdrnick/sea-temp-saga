import React from "react";
import ConfigForm from "@/components/ConfigForm";
import SeaTemperature from "@/components/SeaTemperature";
import { useQuery } from "@tanstack/react-query";

const fetchSeaTemperature = async (config: {
  apiKey: string;
  latitude: string;
  longitude: string;
}) => {
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

  const data = await response.json();
  return data.hours[0].waterTemperature.sg;
};

const Index = () => {
  const [config, setConfig] = React.useState<{
    apiKey: string;
    latitude: string;
    longitude: string;
  } | null>(null);

  const { data: temperature, isLoading, error } = useQuery({
    queryKey: ["seaTemperature", config],
    queryFn: () => (config ? fetchSeaTemperature(config) : null),
    enabled: !!config,
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