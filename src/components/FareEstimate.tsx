import React from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Clock, CloudRain, Car, TrendingUp, MapPin } from 'lucide-react';
import { FareEstimate as FareEstimateType } from '../services/pricingAgent';

interface FareEstimateProps {
  fareEstimate: FareEstimateType;
  insights: string[];
}

export const FareEstimate: React.FC<FareEstimateProps> = ({ fareEstimate, insights }) => {
  const formatCurrency = (amount: number) => `KES ${amount}`;

  return (
    <div className="space-y-4">
      {/* Main Fare Display */}
      <Card className="p-6 bg-gradient-to-r from-[#2a2424] to-[#332d2d] border-[#4c4242]">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-white mb-2">
            Estimated Fare
          </h3>
          <div className="text-4xl font-bold text-[#ddbfbf] mb-4">
            {formatCurrency(fareEstimate.estimatedFare)}
          </div>
          <div className="text-sm text-[#afa5a5]">
            Base fare: {formatCurrency(fareEstimate.baseFare)}
          </div>
        </div>
      </Card>

      {/* Recommended SACCO */}
      {fareEstimate.recommendedSACCO && (
        <Card className="p-4 bg-[#231e1e] border-[#4c4242]">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-white mb-1">
                Recommended SACCO
              </h4>
              <p className="text-[#ddbfbf] font-medium">
                {fareEstimate.recommendedSACCO.name}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="secondary" className="bg-[#332d2d] text-[#afa5a5]">
                  ⭐ {fareEstimate.recommendedSACCO.rating}/5
                </Badge>
                <Badge variant="secondary" className="bg-[#332d2d] text-[#afa5a5]">
                  🛡️ Safety: {fareEstimate.recommendedSACCO.safetyScore}/10
                </Badge>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-[#afa5a5]">Avg. wait time</p>
              <p className="text-[#ddbfbf] font-medium">
                {fareEstimate.recommendedSACCO.averageWaitTime} min
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Pricing Insights */}
      {insights.length > 0 && (
        <Card className="p-4 bg-[#231e1e] border-[#4c4242]">
          <h4 className="font-semibold text-white mb-3">Pricing Insights</h4>
          <div className="space-y-2">
            {insights.map((insight, index) => (
              <div key={index} className="flex items-center gap-2 text-sm text-[#afa5a5]">
                <span>{insight}</span>
              </div>
            ))}
            {(fareEstimate.breakdown.timeAdjustment + fareEstimate.breakdown.trafficAdjustment) >= 50 && (
              <div className="flex items-center gap-2 text-sm text-yellow-400">
                <span>⚠️ Maximum time & traffic adjustment (KES 50) applied</span>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Fare Breakdown */}
      <Card className="p-4 bg-[#231e1e] border-[#4c4242]">
        <h4 className="font-semibold text-white mb-3">Fare Breakdown</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-[#afa5a5]">
            <span>Base fare</span>
            <span>{formatCurrency(fareEstimate.breakdown.base)}</span>
          </div>
          
          {fareEstimate.breakdown.timeAdjustment !== 0 && (
            <div className="flex justify-between text-[#afa5a5]">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Time adjustment
              </span>
              <span className={fareEstimate.breakdown.timeAdjustment > 0 ? 'text-red-400' : 'text-green-400'}>
                {fareEstimate.breakdown.timeAdjustment > 0 ? '+' : ''}
                {formatCurrency(fareEstimate.breakdown.timeAdjustment)}
              </span>
            </div>
          )}

          {fareEstimate.breakdown.weatherAdjustment !== 0 && (
            <div className="flex justify-between text-[#afa5a5]">
              <span className="flex items-center gap-1">
                <CloudRain className="w-3 h-3" />
                Weather adjustment
              </span>
              <span className={fareEstimate.breakdown.weatherAdjustment > 0 ? 'text-red-400' : 'text-green-400'}>
                {fareEstimate.breakdown.weatherAdjustment > 0 ? '+' : ''}
                {formatCurrency(fareEstimate.breakdown.weatherAdjustment)}
              </span>
            </div>
          )}

          {fareEstimate.breakdown.trafficAdjustment !== 0 && (
            <div className="flex justify-between text-[#afa5a5]">
              <span className="flex items-center gap-1">
                <Car className="w-3 h-3" />
                Traffic adjustment
              </span>
              <span className={fareEstimate.breakdown.trafficAdjustment > 0 ? 'text-red-400' : 'text-green-400'}>
                {fareEstimate.breakdown.trafficAdjustment > 0 ? '+' : ''}
                {formatCurrency(fareEstimate.breakdown.trafficAdjustment)}
              </span>
            </div>
          )}

          {fareEstimate.breakdown.demandAdjustment !== 0 && (
            <div className="flex justify-between text-[#afa5a5]">
              <span className="flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                Demand adjustment
              </span>
              <span className={fareEstimate.breakdown.demandAdjustment > 0 ? 'text-red-400' : 'text-green-400'}>
                {fareEstimate.breakdown.demandAdjustment > 0 ? '+' : ''}
                {formatCurrency(fareEstimate.breakdown.demandAdjustment)}
              </span>
            </div>
          )}

          <div className="border-t border-[#4c4242] pt-2 mt-2">
            <div className="flex justify-between font-semibold text-white">
              <span>Total</span>
              <span>{formatCurrency(fareEstimate.estimatedFare)}</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Alternative Routes */}
      {fareEstimate.alternativeRoutes.length > 0 && (
        <Card className="p-4 bg-[#231e1e] border-[#4c4242]">
          <h4 className="font-semibold text-white mb-3">Alternative Routes</h4>
          <div className="space-y-3">
            {fareEstimate.alternativeRoutes.map((route, index) => (
              <div key={route.id} className="flex items-center justify-between p-3 bg-[#2a2424] rounded-lg">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#afa5a5]" />
                  <div>
                    <p className="text-white font-medium">{route.name}</p>
                    <p className="text-xs text-[#afa5a5]">
                      {route.distance.toFixed(1)} km • {route.duration} min
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge 
                    variant="secondary" 
                    className={`${
                      route.traffic === 'light' ? 'bg-green-900 text-green-300' :
                      route.traffic === 'moderate' ? 'bg-yellow-900 text-yellow-300' :
                      'bg-red-900 text-red-300'
                    }`}
                  >
                    {route.traffic} traffic
                  </Badge>
                  <p className="text-xs text-[#afa5a5] mt-1">
                    Safety: {route.safetyScore.toFixed(1)}/10
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};