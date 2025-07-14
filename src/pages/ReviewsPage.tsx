import React, { useState } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Star, Search, Filter, ThumbsUp, MapPin, Calendar, CheckCircle } from 'lucide-react';
import { Review } from '../types';

export const ReviewsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'recent' | 'top-rated'>('all');

  // Mock reviews data
  const reviews: Review[] = [
    {
      id: '1',
      userId: 'user1',
      userName: 'John Doe',
      userAvatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1',
      saccoId: 'sacco1',
      saccoName: 'City Hoppa',
      rating: 5,
      comment: 'Excellent service! The matatu was clean, the driver was professional, and we arrived on time. Highly recommend for the CBD to Westlands route.',
      route: 'CBD to Westlands',
      date: '2024-01-15',
      helpful: 12,
      verified: true
    },
    {
      id: '2',
      userId: 'user2',
      userName: 'Sarah Wilson',
      userAvatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1',
      saccoId: 'sacco2',
      saccoName: 'Double M',
      rating: 4,
      comment: 'Good service overall. The wait time was a bit longer than expected, but the ride was comfortable and safe.',
      route: 'CBD to Rongai',
      date: '2024-01-14',
      helpful: 8,
      verified: true
    },
    {
      id: '3',
      userId: 'user3',
      userName: 'Michael Chen',
      userAvatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1',
      saccoId: 'sacco3',
      saccoName: 'Kenya Bus',
      rating: 3,
      comment: 'Average experience. The matatu was okay but could be cleaner. Driver was friendly though.',
      route: 'CBD to Buruburu',
      date: '2024-01-13',
      helpful: 5,
      verified: false
    },
    {
      id: '4',
      userId: 'user4',
      userName: 'Grace Mwangi',
      userAvatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1',
      saccoId: 'sacco1',
      saccoName: 'City Hoppa',
      rating: 5,
      comment: 'Amazing service! Very punctual and the matatu was spotless. The conductor was very helpful with directions.',
      route: 'CBD to Westlands',
      date: '2024-01-12',
      helpful: 15,
      verified: true
    },
    {
      id: '5',
      userId: 'user5',
      userName: 'David Ochieng',
      userAvatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=1',
      saccoId: 'sacco2',
      saccoName: 'Double M',
      rating: 2,
      comment: 'Not a great experience. The matatu was overcrowded and the driver was reckless. Would not recommend.',
      route: 'CBD to Rongai',
      date: '2024-01-11',
      helpful: 3,
      verified: true
    }
  ];

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = review.saccoName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.route.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.comment.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedFilter === 'recent') {
      return matchesSearch && new Date(review.date) >= new Date('2024-01-14');
    }
    if (selectedFilter === 'top-rated') {
      return matchesSearch && review.rating >= 4;
    }
    return matchesSearch;
  });

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

  return (
    <div className="min-h-screen bg-[#161111] py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">SACCO Reviews</h1>
          <p className="text-[#afa5a5]">Read reviews from fellow passengers and share your experience</p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#afa5a5] w-4 h-4" />
            <Input
              placeholder="Search reviews by SACCO, route, or keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-[#332d2d] border-[#4c4242] text-white placeholder-[#afa5a5]"
            />
          </div>
          
          <div className="flex gap-2">
            <Button
              variant={selectedFilter === 'all' ? 'default' : 'outline'}
              onClick={() => setSelectedFilter('all')}
              className={selectedFilter === 'all' ? 'bg-[#ddbfbf] text-[#161111]' : 'border-[#4c4242] text-[#afa5a5] hover:bg-[#231e1e]'}
            >
              All
            </Button>
            <Button
              variant={selectedFilter === 'recent' ? 'default' : 'outline'}
              onClick={() => setSelectedFilter('recent')}
              className={selectedFilter === 'recent' ? 'bg-[#ddbfbf] text-[#161111]' : 'border-[#4c4242] text-[#afa5a5] hover:bg-[#231e1e]'}
            >
              Recent
            </Button>
            <Button
              variant={selectedFilter === 'top-rated' ? 'default' : 'outline'}
              onClick={() => setSelectedFilter('top-rated')}
              className={selectedFilter === 'top-rated' ? 'bg-[#ddbfbf] text-[#161111]' : 'border-[#4c4242] text-[#afa5a5] hover:bg-[#231e1e]'}
            >
              Top Rated
            </Button>
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-6">
          {filteredReviews.map((review) => (
            <Card key={review.id} className="p-6 bg-[#231e1e] border-[#4c4242]">
              {/* Review Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <img
                    src={review.userAvatar}
                    alt={review.userName}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-white">{review.userName}</h3>
                      {review.verified && (
                        <CheckCircle className="w-4 h-4 text-green-400" />
                      )}
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-[#afa5a5]">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(review.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="flex items-center space-x-1 mb-1">
                    {renderStars(review.rating)}
                  </div>
                  <Badge variant="secondary" className="bg-[#332d2d] text-[#afa5a5]">
                    {review.saccoName}
                  </Badge>
                </div>
              </div>

              {/* Route Info */}
              <div className="flex items-center space-x-2 mb-3">
                <MapPin className="w-4 h-4 text-[#afa5a5]" />
                <span className="text-[#afa5a5] text-sm">{review.route}</span>
              </div>

              {/* Review Content */}
              <p className="text-white mb-4 leading-relaxed">{review.comment}</p>

              {/* Review Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-[#4c4242]">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-[#afa5a5] hover:text-white hover:bg-[#332d2d]"
                >
                  <ThumbsUp className="w-4 h-4 mr-1" />
                  Helpful ({review.helpful})
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-[#afa5a5] hover:text-white hover:bg-[#332d2d]"
                >
                  Reply
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredReviews.length === 0 && (
          <Card className="p-8 bg-[#231e1e] border-[#4c4242] text-center">
            <div className="text-[#afa5a5] mb-4">
              <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold text-white mb-2">No reviews found</h3>
              <p>Try adjusting your search terms or filters</p>
            </div>
          </Card>
        )}

        {/* Write Review CTA */}
        <Card className="mt-8 p-6 bg-gradient-to-r from-[#2a2424] to-[#332d2d] border-[#4c4242]">
          <div className="text-center">
            <h3 className="text-xl font-bold text-white mb-2">Share Your Experience</h3>
            <p className="text-[#afa5a5] mb-4">
              Help other passengers by writing a review about your recent trip
            </p>
            <Button className="bg-[#ddbfbf] text-[#161111] hover:bg-[#c9adad]">
              Write a Review
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};