import { MapPinIcon, SearchIcon } from "lucide-react";
import React from "react";
import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { FareEstimate } from "../../components/FareEstimate";
import { SmartPricingAgent } from "../../services/pricingAgent";
import { useLocation } from "../../hooks/useLocation";

export const LandingPage = (): JSX.Element => {
  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState("");
  const [fareEstimate, setFareEstimate] = useState<any>(null);
  const [insights, setInsights] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { location, error: locationError, refetch: refetchLocation } = useLocation();

  // Popular routes data
  const popularRoutes = [
    { name: "CBD to Westlands", hasIcon: true },
    { name: "CBD to Buruburu", hasIcon: false },
    { name: "CBD to Rongai", hasIcon: false },
  ];

  // Popular destinations data
  const popularDestinations = [
    { name: "Westlands", hasIcon: true },
    { name: "Buruburu", hasIcon: false },
    { name: "Rongai", hasIcon: false },
  ];

  const handleFindRoute = async () => {
    if (!fromLocation || !toLocation) {
      alert("Please enter both from and to locations");
      return;
    }

    setLoading(true);
    try {
      const pricingAgent = SmartPricingAgent.getInstance();
      
      // Mock coordinates for demo - in real app, these would come from geocoding
      const origin = {
        lat: -1.2921,
        lng: 36.8219,
        name: fromLocation
      };
      
      const destination = {
        lat: -1.2641,
        lng: 36.8078,
        name: toLocation
      };

      const userLocation = location ? {
        lat: location.latitude,
        lng: location.longitude
      } : undefined;

      const estimate = await pricingAgent.calculateFare(origin, destination, userLocation);
      const pricingInsights = pricingAgent.getPricingInsights(estimate);
      
      setFareEstimate(estimate);
      setInsights(pricingInsights);
    } catch (error) {
      console.error("Error calculating fare:", error);
      alert("Error calculating fare. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleUseCurrentLocation = () => {
    if (location) {
      setFromLocation("Current Location");
    } else {
      refetchLocation();
    }
  };

  const handlePopularRouteClick = (routeName: string) => {
    const [from, to] = routeName.split(" to ");
    setFromLocation(from);
    setToLocation(to);
  };

  const handlePopularDestinationClick = (destinationName: string) => {
    setToLocation(destinationName);
  };

  return (
    <div className="flex flex-col min-h-[800px] items-start relative bg-[#211111]">
      <div className="flex flex-col w-full items-start relative flex-[0_0_auto] bg-white">
        <div className="flex flex-col min-h-[800px] items-start relative self-stretch w-full flex-[0_0_auto] bg-[#161111]">
          <div className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto]">
            <img
              className="flex-[0_0_auto] relative self-stretch w-full"
              alt="Depth frame"
              src="/depth-2--frame-0.svg"
            />

            <div className="flex items-start justify-center px-40 py-5 flex-1 grow relative self-stretch w-full">
              <div className="flex flex-col max-w-[960px] h-[695px] items-start relative flex-1 grow">
                {/* From input */}
                <div className="flex flex-col items-start px-4 py-3 relative self-stretch w-full flex-[0_0_auto]">
                  <div className="flex h-12 items-center relative self-stretch w-full rounded-xl bg-[#332d2d]">
                    <div className="flex items-center pl-4 h-full">
                      <SearchIcon className="h-6 w-6 text-[#afa5a5]" />
                    </div>
                    <Input
                      className="flex-1 h-full border-none bg-transparent pl-2 pr-4 py-2 text-[#afa5a5] font-['Epilogue',Helvetica] text-base focus-visible:ring-0 focus-visible:ring-offset-0"
                      placeholder="From"
                      value={fromLocation}
                      onChange={(e) => setFromLocation(e.target.value)}
                    />
                  </div>
                </div>

                {/* To input */}
                <div className="flex flex-col items-start px-4 py-3 relative self-stretch w-full flex-[0_0_auto]">
                  <div className="flex h-12 items-center relative self-stretch w-full rounded-xl bg-[#332d2d]">
                    <div className="flex items-center pl-4 h-full">
                      <SearchIcon className="h-6 w-6 text-[#afa5a5]" />
                    </div>
                    <Input
                      className="flex-1 h-full border-none bg-transparent pl-2 pr-4 py-2 text-[#afa5a5] font-['Epilogue',Helvetica] text-base focus-visible:ring-0 focus-visible:ring-offset-0"
                      placeholder="To"
                      value={toLocation}
                      onChange={(e) => setToLocation(e.target.value)}
                    />
                  </div>
                </div>

                {/* Use current location button */}
                <div className="px-4 py-3 flex items-start relative self-stretch w-full flex-[0_0_auto]">
                  <Button
                    variant="outline"
                    className="h-10 px-4 py-0 bg-[#332d2d] text-white border-none rounded-[20px] hover:bg-[#403636] hover:text-white"
                    onClick={handleUseCurrentLocation}
                    disabled={!location && !locationError}
                  >
                    <span className="font-['Epilogue',Helvetica] font-bold text-sm">
                      {location ? "Use current location" : "Getting location..."}
                    </span>
                  </Button>
                </div>

                {/* Popular Routes section */}
                <div className="flex-col pt-5 pb-3 px-4 flex items-start relative self-stretch w-full flex-[0_0_auto]">
                  <h2 className="relative self-stretch mt-[-1.00px] font-['Epilogue',Helvetica] font-bold text-white text-[22px] tracking-[0] leading-7">
                    Popular Routes
                  </h2>
                </div>

                {/* Popular Routes cards */}
                <div className="flex-col gap-3 p-4 flex items-start relative self-stretch w-full flex-[0_0_auto]">
                  <div className="flex items-start gap-3 relative flex-1 self-stretch w-full grow">
                    {popularRoutes.map((route, index) => (
                      <Card
                        key={`route-${index}`}
                        className="flex w-[301px] items-center gap-3 p-4 relative self-stretch bg-[#231e1e] rounded-lg border border-solid border-[#4c4242] hover:bg-[#2a2424] cursor-pointer"
                        onClick={() => handlePopularRouteClick(route.name)}
                      >
                        {route.hasIcon && (
                          <div className="inline-flex flex-col items-start relative flex-[0_0_auto]">
                            <MapPinIcon className="w-6 h-6 text-white" />
                          </div>
                        )}
                        <div className="inline-flex flex-col items-start relative flex-[0_0_auto]">
                          <span className="relative self-stretch mt-[-1.00px] font-['Epilogue',Helvetica] font-bold text-white text-base tracking-[0] leading-5 whitespace-nowrap">
                            {route.name}
                          </span>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Popular Destinations section */}
                <div className="flex-col pt-5 pb-3 px-4 flex items-start relative self-stretch w-full flex-[0_0_auto]">
                  <h2 className="relative self-stretch mt-[-1.00px] font-['Epilogue',Helvetica] font-bold text-white text-[22px] tracking-[0] leading-7">
                    Popular Destinations
                  </h2>
                </div>

                {/* Popular Destinations cards */}
                <div className="flex-col gap-3 p-4 flex items-start relative self-stretch w-full flex-[0_0_auto]">
                  <div className="flex items-start gap-3 relative flex-1 self-stretch w-full grow">
                    {popularDestinations.map((destination, index) => (
                      <Card
                        key={`destination-${index}`}
                        className="flex w-[301px] items-center gap-3 p-4 relative self-stretch bg-[#231e1e] rounded-lg border border-solid border-[#4c4242] hover:bg-[#2a2424] cursor-pointer"
                        onClick={() => handlePopularDestinationClick(destination.name)}
                      >
                        {destination.hasIcon && (
                          <div className="inline-flex flex-col items-start relative flex-[0_0_auto]">
                            <MapPinIcon className="w-6 h-6 text-white" />
                          </div>
                        )}
                        <div className="inline-flex flex-col items-start relative flex-[0_0_auto]">
                          <span className="relative self-stretch mt-[-1.00px] font-['Epilogue',Helvetica] font-bold text-white text-base tracking-[0] leading-5 whitespace-nowrap">
                            {destination.name}
                          </span>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Find Route button */}
                <div className="px-4 py-3 flex items-start relative self-stretch w-full flex-[0_0_auto]">
                  <Button className="flex min-w-[84px] max-w-[480px] h-12 items-center justify-center px-5 py-0 relative flex-1 grow bg-[#ddbfbf] rounded-3xl text-[#161111] hover:bg-[#c9adad]">
                    onClick={handleFindRoute}
                    disabled={loading}
                    <span className="font-['Epilogue',Helvetica] font-bold text-base">
                      {loading ? "Finding Route..." : "Find Route"}
                    </span>
                  </Button>
                </div>

                {/* Fare Estimate Display */}
                {fareEstimate && (
                  <div className="px-4 py-3 relative self-stretch w-full">
                    <FareEstimate fareEstimate={fareEstimate} insights={insights} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
