export interface WeatherData {
  temperature: number;
  humidity: number;
  precipitation: number;
  windSpeed: number;
  condition: 'sunny' | 'cloudy' | 'rainy' | 'stormy';
  visibility: number;
}

export class WeatherService {
  private static instance: WeatherService;
  private apiKey = import.meta.env.VITE_WEATHER_API_KEY || 'weather:api';

  static getInstance(): WeatherService {
    if (!WeatherService.instance) {
      WeatherService.instance = new WeatherService();
    }
    return WeatherService.instance;
  }

  async getCurrentWeather(latitude: number, longitude: number): Promise<WeatherData> {
    try {
      // Check if we have a valid API key
      if (this.apiKey === 'weather:api' || !this.apiKey) {
        console.warn('Using mock weather data - no valid Weather API key provided');
        return this.getMockWeatherData();
      }

      try {
        // Replace with actual weather API call
        const response = await fetch(
          `https://api.weatherapi.com/v1/current.json?key=${this.apiKey}&q=${latitude},${longitude}&aqi=no`
        );
        
        if (!response.ok) {
          throw new Error('Weather data unavailable');
        }

        const data = await response.json();
        
        return {
          temperature: data.current.temp_c,
          humidity: data.current.humidity,
          precipitation: data.current.precip_mm,
          windSpeed: data.current.wind_kph,
          condition: this.mapWeatherCondition(data.current.condition.text),
          visibility: data.current.vis_km
        };
      } catch (apiError) {
        console.warn('Weather API call failed, using mock data:', apiError);
        return this.getMockWeatherData();
      }
    } catch (error) {
      console.warn('Error in getCurrentWeather, using mock data:', error);
      // Return default weather data if API fails
      return this.getMockWeatherData();
    }
  }

  private getMockWeatherData(): WeatherData {
    return {
      temperature: 25,
      humidity: 60,
      precipitation: 0,
      windSpeed: 10,
      condition: 'sunny',
      visibility: 10
    };
  }

  private mapWeatherCondition(condition: string): WeatherData['condition'] {
    const lowerCondition = condition.toLowerCase();
    if (lowerCondition.includes('rain') || lowerCondition.includes('drizzle')) {
      return 'rainy';
    }
    if (lowerCondition.includes('storm') || lowerCondition.includes('thunder')) {
      return 'stormy';
    }
    if (lowerCondition.includes('cloud') || lowerCondition.includes('overcast')) {
      return 'cloudy';
    }
    return 'sunny';
  }
}