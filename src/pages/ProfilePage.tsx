import React, { useState } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { User, Mail, Phone, MapPin, Star, Settings, Edit3, Save, X } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+254 712 345 678',
    location: 'Nairobi, Kenya',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&dpr=1'
  });

  const [editedProfile, setEditedProfile] = useState(profile);

  const handleSave = () => {
    setProfile(editedProfile);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  const stats = {
    totalTrips: 47,
    totalSpent: 3420,
    averageRating: 4.6,
    favoriteRoute: 'CBD to Westlands'
  };

  const recentActivity = [
    { type: 'trip', description: 'Completed trip: CBD to Westlands', date: '2024-01-15' },
    { type: 'review', description: 'Reviewed City Hoppa (5 stars)', date: '2024-01-15' },
    { type: 'trip', description: 'Completed trip: Westlands to CBD', date: '2024-01-15' },
    { type: 'trip', description: 'Completed trip: CBD to Rongai', date: '2024-01-14' }
  ];

  return (
    <div className="min-h-screen bg-[#161111] py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <Card className="p-6 bg-[#231e1e] border-[#4c4242] mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <div className="relative">
              <img
                src={profile.avatar}
                alt={profile.name}
                className="w-24 h-24 rounded-full object-cover"
              />
              <Button
                size="sm"
                className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-[#ddbfbf] text-[#161111] hover:bg-[#c9adad]"
              >
                <Edit3 className="w-3 h-3" />
              </Button>
            </div>
            
            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-3">
                  <Input
                    value={editedProfile.name}
                    onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })}
                    className="bg-[#332d2d] border-[#4c4242] text-white"
                  />
                  <Input
                    value={editedProfile.email}
                    onChange={(e) => setEditedProfile({ ...editedProfile, email: e.target.value })}
                    className="bg-[#332d2d] border-[#4c4242] text-white"
                  />
                  <Input
                    value={editedProfile.phone}
                    onChange={(e) => setEditedProfile({ ...editedProfile, phone: e.target.value })}
                    className="bg-[#332d2d] border-[#4c4242] text-white"
                  />
                  <Input
                    value={editedProfile.location}
                    onChange={(e) => setEditedProfile({ ...editedProfile, location: e.target.value })}
                    className="bg-[#332d2d] border-[#4c4242] text-white"
                  />
                </div>
              ) : (
                <div>
                  <h1 className="text-2xl font-bold text-white mb-2">{profile.name}</h1>
                  <div className="space-y-2 text-[#afa5a5]">
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4" />
                      <span>{profile.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4" />
                      <span>{profile.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4" />
                      <span>{profile.location}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex space-x-2">
              {isEditing ? (
                <>
                  <Button
                    onClick={handleSave}
                    className="bg-[#ddbfbf] text-[#161111] hover:bg-[#c9adad]"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                  <Button
                    onClick={handleCancel}
                    variant="outline"
                    className="border-[#4c4242] text-[#afa5a5] hover:bg-[#231e1e]"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </>
              ) : (
                <Button
                  onClick={() => setIsEditing(true)}
                  variant="outline"
                  className="border-[#4c4242] text-[#afa5a5] hover:bg-[#231e1e]"
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              )}
            </div>
          </div>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="p-4 bg-[#231e1e] border-[#4c4242] text-center">
            <div className="text-2xl font-bold text-[#ddbfbf] mb-1">{stats.totalTrips}</div>
            <div className="text-sm text-[#afa5a5]">Total Trips</div>
          </Card>
          
          <Card className="p-4 bg-[#231e1e] border-[#4c4242] text-center">
            <div className="text-2xl font-bold text-[#ddbfbf] mb-1">KES {stats.totalSpent}</div>
            <div className="text-sm text-[#afa5a5]">Total Spent</div>
          </Card>
          
          <Card className="p-4 bg-[#231e1e] border-[#4c4242] text-center">
            <div className="flex items-center justify-center space-x-1 mb-1">
              <span className="text-2xl font-bold text-[#ddbfbf]">{stats.averageRating}</span>
              <Star className="w-5 h-5 text-yellow-400 fill-current" />
            </div>
            <div className="text-sm text-[#afa5a5]">Avg Rating</div>
          </Card>
          
          <Card className="p-4 bg-[#231e1e] border-[#4c4242] text-center">
            <div className="text-sm font-bold text-[#ddbfbf] mb-1">{stats.favoriteRoute}</div>
            <div className="text-sm text-[#afa5a5]">Favorite Route</div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <Card className="p-6 bg-[#231e1e] border-[#4c4242]">
            <h2 className="text-xl font-bold text-white mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.type === 'trip' ? 'bg-blue-400' : 'bg-yellow-400'
                  }`} />
                  <div className="flex-1">
                    <p className="text-white text-sm">{activity.description}</p>
                    <p className="text-[#afa5a5] text-xs">{new Date(activity.date).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Preferences */}
          <Card className="p-6 bg-[#231e1e] border-[#4c4242]">
            <h2 className="text-xl font-bold text-white mb-4">Preferences</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-white">Push Notifications</span>
                <Badge className="bg-green-900 text-green-300">Enabled</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-white">Email Updates</span>
                <Badge className="bg-green-900 text-green-300">Enabled</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-white">Location Services</span>
                <Badge className="bg-green-900 text-green-300">Enabled</Badge>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-white">Dark Mode</span>
                <Badge className="bg-green-900 text-green-300">Enabled</Badge>
              </div>
              
              <Button
                variant="outline"
                className="w-full mt-4 border-[#4c4242] text-[#afa5a5] hover:bg-[#231e1e]"
              >
                <Settings className="w-4 h-4 mr-2" />
                Manage Preferences
              </Button>
            </div>
          </Card>
        </div>

        {/* Account Actions */}
        <Card className="mt-8 p-6 bg-[#231e1e] border-[#4c4242]">
          <h2 className="text-xl font-bold text-white mb-4">Account</h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              variant="outline"
              className="border-[#4c4242] text-[#afa5a5] hover:bg-[#231e1e]"
            >
              Change Password
            </Button>
            
            <Button
              variant="outline"
              className="border-[#4c4242] text-[#afa5a5] hover:bg-[#231e1e]"
            >
              Download Data
            </Button>
            
            <Button
              variant="outline"
              className="border-red-600 text-red-400 hover:bg-red-900/20"
            >
              Delete Account
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};