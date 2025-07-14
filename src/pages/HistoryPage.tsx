import React, { useState } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Calendar, MapPin, Star, Download, Filter } from 'lucide-react';
import { Trip } from '../types';

export const HistoryPage: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'completed' | 'cancelled'>('all');

  // Mock trip history data
  const trips: Trip[] = [
    {
      id: '1',
      userId: 'user1',
      origin: 'CBD',
      destination: 'Westlands',
      saccoName: 'City Hoppa',
      fare: 85,
      date: '2024-01-15T08:30:00Z',
      status: 'completed',
      rating: 5,
      review: 'Great service, very punctual!'
    },
    {
      id: '2',
      userId: 'user1',
      origin: 'Westlands',
      destination: 'CBD',
      saccoName: 'City Hoppa',
      fare: 80,
      date: '2024-01-15T17:45:00Z',
      status: 'completed',
      rating: 4
    },
    {
      id: '3',
      userId: 'user1',
      origin: 'CBD',
      destination: 'Rongai',
      saccoName: 'Double M',
      fare: 120,
      date: '2024-01-14T07:15:00Z',
      status: 'completed',
      rating: 3,
      review: 'Average experience, could be better'
    },
    {
      id: '4',
      userId: 'user1',
      origin: 'CBD',
      destination: 'Buruburu',
      saccoName: 'Kenya Bus',
      fare: 95,
      date: '2024-01-13T12:00:00Z',
      status: 'cancelled'
    },
    {
      id: '5',
      userId: 'user1',
      origin: 'Rongai',
      destination: 'CBD',
      saccoName: 'Double M',
      fare: 115,
      date: '2024-01-12T16:30:00Z',
      status: 'completed',
      rating: 4
    }
  ];

  const filteredTrips = trips.filter(trip => {
    if (selectedFilter === 'all') return true;
    return trip.status === selectedFilter;
  });

  const totalSpent = trips
    .filter(trip => trip.status === 'completed')
    .reduce((sum, trip) => sum + trip.fare, 0);

  const completedTrips = trips.filter(trip => trip.status === 'completed').length;

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-400'
        }`}
      />
    ));
  };

  const getStatusBadge = (status: Trip['status']) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-900 text-green-300">Completed</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-900 text-red-300">Cancelled</Badge>;
      case 'ongoing':
        return <Badge className="bg-blue-900 text-blue-300">Ongoing</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#161111] py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Trip History</h1>
          <p className="text-[#afa5a5]">View your past trips and travel patterns</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 bg-[#231e1e] border-[#4c4242]">
            <div className="text-center">
              <div className="text-3xl font-bold text-[#ddbfbf] mb-2">{completedTrips}</div>
              <div className="text-[#afa5a5]">Completed Trips</div>
            </div>
          </Card>
          
          <Card className="p-6 bg-[#231e1e] border-[#4c4242]">
            <div className="text-center">
              <div className="text-3xl font-bold text-[#ddbfbf] mb-2">KES {totalSpent}</div>
              <div className="text-[#afa5a5]">Total Spent</div>
            </div>
          </Card>
          
          <Card className="p-6 bg-[#231e1e] border-[#4c4242]">
            <div className="text-center">
              <div className="text-3xl font-bold text-[#ddbfbf] mb-2">
                {completedTrips > 0 ? (totalSpent / completedTrips).toFixed(0) : 0}
              </div>
              <div className="text-[#afa5a5]">Avg. Fare (KES)</div>
            </div>
          </Card>
        </div>

        {/* Filters and Export */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex gap-2">
            <Button
              variant={selectedFilter === 'all' ? 'default' : 'outline'}
              onClick={() => setSelectedFilter('all')}
              className={selectedFilter === 'all' ? 'bg-[#ddbfbf] text-[#161111]' : 'border-[#4c4242] text-[#afa5a5] hover:bg-[#231e1e]'}
            >
              All Trips
            </Button>
            <Button
              variant={selectedFilter === 'completed' ? 'default' : 'outline'}
              onClick={() => setSelectedFilter('completed')}
              className={selectedFilter === 'completed' ? 'bg-[#ddbfbf] text-[#161111]' : 'border-[#4c4242] text-[#afa5a5] hover:bg-[#231e1e]'}
            >
              Completed
            </Button>
            <Button
              variant={selectedFilter === 'cancelled' ? 'default' : 'outline'}
              onClick={() => setSelectedFilter('cancelled')}
              className={selectedFilter === 'cancelled' ? 'bg-[#ddbfbf] text-[#161111]' : 'border-[#4c4242] text-[#afa5a5] hover:bg-[#231e1e]'}
            >
              Cancelled
            </Button>
          </div>
          
          <Button
            variant="outline"
            className="border-[#4c4242] text-[#afa5a5] hover:bg-[#231e1e]"
          >
            <Download className="w-4 h-4 mr-2" />
            Export History
          </Button>
        </div>

        {/* Trip List */}
        <div className="space-y-4">
          {filteredTrips.map((trip) => (
            <Card key={trip.id} className="p-6 bg-[#231e1e] border-[#4c4242]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                <div className="flex-1">
                  {/* Route Info */}
                  <div className="flex items-center space-x-2 mb-2">
                    <MapPin className="w-4 h-4 text-[#afa5a5]" />
                    <span className="text-white font-medium">
                      {trip.origin} → {trip.destination}
                    </span>
                    {getStatusBadge(trip.status)}
                  </div>
                  
                  {/* Trip Details */}
                  <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-6 text-sm text-[#afa5a5]">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(trip.date).toLocaleDateString()}</span>
                      <span>{new Date(trip.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    
                    <div>
                      <span className="font-medium">{trip.saccoName}</span>
                    </div>
                    
                    <div className="font-semibold text-[#ddbfbf]">
                      KES {trip.fare}
                    </div>
                  </div>
                  
                  {/* Rating and Review */}
                  {trip.rating && (
                    <div className="mt-3 pt-3 border-t border-[#4c4242]">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-sm text-[#afa5a5]">Your rating:</span>
                        <div className="flex items-center space-x-1">
                          {renderStars(trip.rating)}
                        </div>
                      </div>
                      {trip.review && (
                        <p className="text-sm text-[#afa5a5] italic">"{trip.review}"</p>
                      )}
                    </div>
                  )}
                </div>
                
                {/* Actions */}
                <div className="flex flex-col space-y-2 mt-4 sm:mt-0 sm:ml-4">
                  {trip.status === 'completed' && !trip.rating && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-[#4c4242] text-[#afa5a5] hover:bg-[#231e1e]"
                    >
                      Rate Trip
                    </Button>
                  )}
                  
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-[#4c4242] text-[#afa5a5] hover:bg-[#231e1e]"
                  >
                    Book Again
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredTrips.length === 0 && (
          <Card className="p-8 bg-[#231e1e] border-[#4c4242] text-center">
            <div className="text-[#afa5a5] mb-4">
              <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold text-white mb-2">No trips found</h3>
              <p>You haven't taken any trips yet or no trips match the selected filter</p>
            </div>
            <Button className="mt-4 bg-[#ddbfbf] text-[#161111] hover:bg-[#c9adad]">
              Plan Your First Trip
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
};