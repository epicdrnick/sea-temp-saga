import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Thermometer } from "lucide-react";

interface SeaTemperatureProps {
  temperature?: number;
  loading: boolean;
  error?: string;
}

const SeaTemperature = ({ temperature, loading, error }: SeaTemperatureProps) => {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-ocean flex items-center gap-2">
          <Thermometer className="h-6 w-6" />
          Sea Temperature
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="animate-pulse flex justify-center py-8">
            <div className="h-8 w-24 bg-gray-200 rounded"></div>
          </div>
        ) : error ? (
          <div className="text-red-500 text-center py-4">{error}</div>
        ) : (
          <div className="text-4xl font-bold text-center text-ocean">
            {temperature !== undefined ? `${temperature}°C` : "N/A"}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SeaTemperature;