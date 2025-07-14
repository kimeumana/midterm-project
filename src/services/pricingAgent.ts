import { WeatherService, WeatherData } from './weatherService';
import { MapsService, Route, SACCO } from './mapsService';

export interface PricingFactors {
  baseFare: number;
  timeMultiplier: number;
  weatherMultiplier: number;
  trafficMultiplier: number;
  demandMultiplier: number;
  saccoMultiplier: number;
}

export interface FareEstimate {
  estimatedFare: number;
  baseFare: number;
  factors: PricingFactors;
  breakdown: {
    base: number;
    timeAdjustment: number;
    weatherAdjustment: number;
    trafficAdjustment: number;
    demandAdjustment: number;
    saccoAdjustment: number;
  };
  recommendedSACCO: SACCO | null;
  alternativeRoutes: Route[];
}

export class SmartPricingAgent {
  private static instance: SmartPricingAgent;
  private weatherService: WeatherService;
  private mapsService: MapsService;

  // Peak hours configuration
  private readonly MORNING_PEAK = { start: 6, end: 9.5 }; // 6:00 AM - 9:30 AM
  private readonly EVENING_PEAK = { start: 17, end: 20 }; // 5:00 PM - 8:00 PM

  // Base pricing multipliers
  private readonly PEAK_HOUR_MULTIPLIER = 1.4;
  private readonly RAIN_MULTIPLIER = 1.3;
  private readonly STORM_MULTIPLIER = 1.6;
  private readonly TRAFFIC_MULTIPLIERS = {
    light: 1.0,
    moderate: 1.15,
    heavy: 1.35
  };

  static getInstance(): SmartPricingAgent {
    if (!SmartPricingAgent.instance) {
      SmartPricingAgent.instance = new SmartPricingAgent();
    }
    return SmartPricingAgent.instance;
  }

  constructor() {
    this.weatherService = WeatherService.getInstance();
    this.mapsService = MapsService.getInstance();
  }

  async calculateFare(
    origin: { lat: number; lng: number; name: string },
    destination: { lat: number; lng: number; name: string },
    userLocation?: { lat: number; lng: number }
  ): Promise<FareEstimate> {
    try {
      // Get current location for weather data
      const location = userLocation || origin;
      
      // Fetch weather and route data concurrently
      const [weatherData, routes] = await Promise.all([
        this.weatherService.getCurrentWeather(location.lat, location.lng),
        this.mapsService.getRoutes(origin, destination)
      ]);

      // Calculate base fare based on distance
      const primaryRoute = routes[0];
      const baseFare = this.calculateBaseFare(primaryRoute.distance);

      // Get current time factors
      const currentTime = new Date();
      const timeMultiplier = this.getTimeMultiplier(currentTime);

      // Calculate weather impact
      const weatherMultiplier = this.getWeatherMultiplier(weatherData);

      // Calculate traffic impact
      const trafficMultiplier = this.TRAFFIC_MULTIPLIERS[primaryRoute.traffic];

      // Calculate demand multiplier (based on time and weather combined)
      const demandMultiplier = this.getDemandMultiplier(timeMultiplier, weatherMultiplier);

      // Get best SACCO recommendation
      const saccos = await this.mapsService.getSACCOsForRoute(
        `${origin.name} to ${destination.name}`
      );
      const recommendedSACCO = this.getBestSACCO(saccos, primaryRoute);
      const saccoMultiplier = recommendedSACCO?.priceMultiplier || 1.0;

      // Calculate final fare
      const factors: PricingFactors = {
        baseFare,
        timeMultiplier,
        weatherMultiplier,
        trafficMultiplier,
        demandMultiplier,
        saccoMultiplier
      };

      const estimatedFare = baseFare * timeMultiplier * weatherMultiplier * 
                           trafficMultiplier * demandMultiplier * saccoMultiplier;

      // Create breakdown for transparency
      const breakdown = {
        base: baseFare,
        timeAdjustment: baseFare * (timeMultiplier - 1),
        weatherAdjustment: baseFare * timeMultiplier * (weatherMultiplier - 1),
        trafficAdjustment: baseFare * timeMultiplier * weatherMultiplier * (trafficMultiplier - 1),
        demandAdjustment: baseFare * timeMultiplier * weatherMultiplier * trafficMultiplier * (demandMultiplier - 1),
        saccoAdjustment: baseFare * timeMultiplier * weatherMultiplier * trafficMultiplier * demandMultiplier * (saccoMultiplier - 1)
      };

      return {
        estimatedFare: Math.round(estimatedFare),
        baseFare,
        factors,
        breakdown,
        recommendedSACCO,
        alternativeRoutes: routes.slice(1) // Exclude primary route
      };

    } catch (error) {
      console.error('Error calculating fare:', error);
      // Return fallback fare estimate
      return this.getFallbackFareEstimate(origin, destination);
    }
  }

  private calculateBaseFare(distance: number): number {
    // Base fare calculation: KES 20 minimum + KES 15 per km
    const minimumFare = 20;
    const perKmRate = 15;
    return Math.max(minimumFare, minimumFare + (distance * perKmRate));
  }

  private getTimeMultiplier(currentTime: Date): number {
    const hour = currentTime.getHours() + (currentTime.getMinutes() / 60);
    
    // Check if current time is in peak hours
    if ((hour >= this.MORNING_PEAK.start && hour <= this.MORNING_PEAK.end) ||
        (hour >= this.EVENING_PEAK.start && hour <= this.EVENING_PEAK.end)) {
      return this.PEAK_HOUR_MULTIPLIER;
    }
    
    // Slight increase during lunch hours (12-2 PM)
    if (hour >= 12 && hour <= 14) {
      return 1.1;
    }
    
    // Late night premium (10 PM - 5 AM)
    if (hour >= 22 || hour <= 5) {
      return 1.2;
    }
    
    return 1.0; // Normal hours
  }

  private getWeatherMultiplier(weather: WeatherData): number {
    switch (weather.condition) {
      case 'stormy':
        return this.STORM_MULTIPLIER;
      case 'rainy':
        return this.RAIN_MULTIPLIER;
      case 'cloudy':
        // Slight increase if heavy clouds (potential rain)
        return weather.humidity > 80 ? 1.1 : 1.0;
      default:
        return 1.0;
    }
  }

  private getDemandMultiplier(timeMultiplier: number, weatherMultiplier: number): number {
    // Higher demand when both time and weather factors are high
    if (timeMultiplier > 1.2 && weatherMultiplier > 1.2) {
      return 1.2; // High demand
    }
    if (timeMultiplier > 1.0 && weatherMultiplier > 1.0) {
      return 1.1; // Moderate demand
    }
    return 1.0; // Normal demand
  }

  private getBestSACCO(saccos: SACCO[], route: Route): SACCO | null {
    if (saccos.length === 0) return null;

    // Score SACCOs based on multiple factors
    const scoredSACCOs = saccos.map(sacco => {
      const reliabilityScore = sacco.reliability / 10; // Normalize to 0-1
      const safetyScore = sacco.safetyScore / 10; // Normalize to 0-1
      const ratingScore = sacco.rating / 5; // Normalize to 0-1
      const waitTimeScore = Math.max(0, 1 - (sacco.averageWaitTime / 30)); // Penalize long wait times
      const priceScore = Math.max(0, 2 - sacco.priceMultiplier); // Favor lower prices

      const totalScore = (reliabilityScore * 0.3) + (safetyScore * 0.25) + 
                        (ratingScore * 0.2) + (waitTimeScore * 0.15) + (priceScore * 0.1);

      return { sacco, score: totalScore };
    });

    // Sort by score and return the best one
    scoredSACCOs.sort((a, b) => b.score - a.score);
    return scoredSACCOs[0].sacco;
  }

  private getFallbackFareEstimate(
    origin: { lat: number; lng: number; name: string },
    destination: { lat: number; lng: number; name: string }
  ): FareEstimate {
    const baseFare = 50; // Fallback base fare
    const factors: PricingFactors = {
      baseFare,
      timeMultiplier: 1.0,
      weatherMultiplier: 1.0,
      trafficMultiplier: 1.0,
      demandMultiplier: 1.0,
      saccoMultiplier: 1.0
    };

    return {
      estimatedFare: baseFare,
      baseFare,
      factors,
      breakdown: {
        base: baseFare,
        timeAdjustment: 0,
        weatherAdjustment: 0,
        trafficAdjustment: 0,
        demandAdjustment: 0,
        saccoAdjustment: 0
      },
      recommendedSACCO: null,
      alternativeRoutes: []
    };
  }

  // Method to get real-time pricing insights
  getPricingInsights(fareEstimate: FareEstimate): string[] {
    const insights: string[] = [];
    
    if (fareEstimate.factors.timeMultiplier > 1.2) {
      insights.push("🕐 Peak hour pricing is currently active");
    }
    
    if (fareEstimate.factors.weatherMultiplier > 1.1) {
      insights.push("🌧️ Weather conditions are affecting fare prices");
    }
    
    if (fareEstimate.factors.trafficMultiplier > 1.2) {
      insights.push("🚗 Heavy traffic is increasing travel costs");
    }
    
    if (fareEstimate.recommendedSACCO) {
      insights.push(`🚌 ${fareEstimate.recommendedSACCO.name} is recommended for this route`);
    }
    
    if (fareEstimate.alternativeRoutes.length > 0) {
      insights.push(`🗺️ ${fareEstimate.alternativeRoutes.length} alternative routes available`);
    }

    return insights;
  }
}