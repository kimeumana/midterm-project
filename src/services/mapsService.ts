export interface Route {
  id: string;
  name: string;
  distance: number; // in kilometers
  duration: number; // in minutes
  traffic: 'light' | 'moderate' | 'heavy';
  safetyScore: number; // 1-10 scale
  coordinates: Array<{ lat: number; lng: number }>;
}

export interface SACCO {
  id: string;
  name: string;
  rating: number;
  reliability: number;
  safetyScore: number;
  averageWaitTime: number; // in minutes
  routes: string[];
  priceMultiplier: number; // base multiplier for pricing
}

export class MapsService {
  private static instance: MapsService;
  private apiKey = 'maps:api';

  static getInstance(): MapsService {
    if (!MapsService.instance) {
      MapsService.instance = new MapsService();
    }
    return MapsService.instance;
  }

  async getRoutes(
    origin: { lat: number; lng: number },
    destination: { lat: number; lng: number }
  ): Promise<Route[]> {
    try {
      // Replace with actual maps API call
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.lat},${origin.lng}&destination=${destination.lat},${destination.lng}&alternatives=true&key=${this.apiKey}`
      );

      if (!response.ok) {
        throw new Error('Routes data unavailable');
      }

      const data = await response.json();
      
      return data.routes.map((route: any, index: number) => ({
        id: `route_${index}`,
        name: route.summary || `Route ${index + 1}`,
        distance: route.legs[0].distance.value / 1000, // Convert to km
        duration: route.legs[0].duration.value / 60, // Convert to minutes
        traffic: this.determineTrafficLevel(route.legs[0].duration_in_traffic?.value || route.legs[0].duration.value),
        safetyScore: this.calculateSafetyScore(route),
        coordinates: this.decodePolyline(route.overview_polyline.points)
      }));
    } catch (error) {
      console.error('Error fetching routes:', error);
      // Return mock routes if API fails
      return this.getMockRoutes();
    }
  }

  async getSACCOsForRoute(routeId: string): Promise<SACCO[]> {
    // Mock SACCO data - in real implementation, this would come from a database
    const mockSACCOs: SACCO[] = [
      {
        id: 'sacco_1',
        name: 'City Hoppa',
        rating: 4.2,
        reliability: 8.5,
        safetyScore: 8.0,
        averageWaitTime: 8,
        routes: ['CBD to Westlands', 'CBD to Buruburu'],
        priceMultiplier: 1.0
      },
      {
        id: 'sacco_2',
        name: 'Double M',
        rating: 4.0,
        reliability: 7.8,
        safetyScore: 7.5,
        averageWaitTime: 12,
        routes: ['CBD to Rongai', 'CBD to Westlands'],
        priceMultiplier: 0.9
      },
      {
        id: 'sacco_3',
        name: 'Kenya Bus',
        rating: 3.8,
        reliability: 7.2,
        safetyScore: 7.0,
        averageWaitTime: 15,
        routes: ['CBD to Buruburu', 'CBD to Rongai'],
        priceMultiplier: 0.8
      }
    ];

    return mockSACCOs.filter(sacco => 
      sacco.routes.some(route => route.toLowerCase().includes(routeId.toLowerCase()))
    );
  }

  private determineTrafficLevel(durationSeconds: number): 'light' | 'moderate' | 'heavy' {
    const minutes = durationSeconds / 60;
    if (minutes < 30) return 'light';
    if (minutes < 60) return 'moderate';
    return 'heavy';
  }

  private calculateSafetyScore(route: any): number {
    // Mock safety calculation - in real implementation, this would use crime data, road conditions, etc.
    return Math.random() * 3 + 7; // Random score between 7-10
  }

  private decodePolyline(encoded: string): Array<{ lat: number; lng: number }> {
    // Simplified polyline decoding - in real implementation, use proper polyline library
    return [
      { lat: -1.2921, lng: 36.8219 }, // Mock coordinates
      { lat: -1.2641, lng: 36.8078 }
    ];
  }

  private getMockRoutes(): Route[] {
    return [
      {
        id: 'route_1',
        name: 'Main Route via Uhuru Highway',
        distance: 15.2,
        duration: 35,
        traffic: 'moderate',
        safetyScore: 8.5,
        coordinates: [
          { lat: -1.2921, lng: 36.8219 },
          { lat: -1.2641, lng: 36.8078 }
        ]
      },
      {
        id: 'route_2',
        name: 'Alternative Route via Waiyaki Way',
        distance: 18.7,
        duration: 42,
        traffic: 'heavy',
        safetyScore: 7.8,
        coordinates: [
          { lat: -1.2921, lng: 36.8219 },
          { lat: -1.2641, lng: 36.8078 }
        ]
      }
    ];
  }
}