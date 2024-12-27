import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import MapSelector from "./MapSelector";

interface ConfigFormProps {
  onSave: (config: { apiKey: string; latitude: string; longitude: string }) => void;
}

const ConfigForm = ({ onSave }: ConfigFormProps) => {
  const [apiKey, setApiKey] = React.useState("");
  const [latitude, setLatitude] = React.useState("");
  const [longitude, setLongitude] = React.useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!apiKey || !latitude || !longitude) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    onSave({ apiKey, latitude, longitude });
    toast({
      title: "Success",
      description: "Configuration saved successfully",
    });
  };

  const handleLocationSelect = (lat: string, lng: string) => {
    setLatitude(lat);
    setLongitude(lng);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-ocean">Stormglass Configuration</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="apiKey" className="text-sm font-medium">
              API Key
            </label>
            <Input
              id="apiKey"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your Stormglass API key"
            />
          </div>
          
          <MapSelector onLocationSelect={handleLocationSelect} />
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Selected Latitude</label>
              <Input value={latitude} readOnly />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Selected Longitude</label>
              <Input value={longitude} readOnly />
            </div>
          </div>

          <Button type="submit" className="w-full bg-ocean hover:bg-ocean-light">
            Save Configuration
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ConfigForm;