
'use client';
// Profile & Attributes tab component
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AttributeCard } from '@/components/attribute-card';
import { Plus, User, Edit3, Trophy } from 'lucide-react';
import { User as UserType, Attribute } from '@/lib/types';

interface ProfileTabProps {
  user: UserType;
  onCreateAttribute: (name: string) => void;
  onDeleteAttribute: (id: string) => void;
  onUpdateProfile: (updates: Partial<Pick<UserType, 'name' | 'avatarUrl'>>) => void;
}

export function ProfileTab({ user, onCreateAttribute, onDeleteAttribute, onUpdateProfile }: ProfileTabProps) {
  const [newAttributeName, setNewAttributeName] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user.name);

  const handleCreateAttribute = () => {
    if (!newAttributeName.trim()) return;
    
    onCreateAttribute(newAttributeName.trim());
    setNewAttributeName('');
  };

  const handleSaveName = () => {
    if (editName.trim() !== user.name) {
      onUpdateProfile({ name: editName.trim() });
    }
    setIsEditing(false);
  };

  const totalSessions = user.sessions?.length || 0;
  const totalHours = user.sessions?.reduce((sum, session) => sum + (session.focusMinutesTotal / 60), 0) || 0;
  const totalXpEarned = user.sessions?.reduce((sum, session) => sum + session.totalXp, 0) || 0;

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <User className="w-8 h-8" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                {isEditing ? (
                  <div className="flex items-center gap-2">
                    <Input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                      onKeyPress={(e) => e.key === 'Enter' && handleSaveName()}
                    />
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="border-white/20 hover:bg-white/10"
                      onClick={handleSaveName}
                    >
                      Save
                    </Button>
                  </div>
                ) : (
                  <>
                    <h1 className="text-2xl font-bold">{user.name}</h1>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-white/80 hover:text-white hover:bg-white/10"
                      onClick={() => setIsEditing(true)}
                    >
                      <Edit3 className="w-4 h-4" />
                    </Button>
                  </>
                )}
              </div>
              <p className="text-white/80">Solo Leveling MVP</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Overview */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{totalSessions}</div>
            <div className="text-sm text-gray-600">Sessions</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{totalHours.toFixed(1)}</div>
            <div className="text-sm text-gray-600">Hours</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{Math.round(totalXpEarned).toLocaleString()}</div>
            <div className="text-sm text-gray-600">Total XP</div>
          </CardContent>
        </Card>
      </div>

      {/* Attributes Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            Attributes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Create new attribute */}
          <div className="flex gap-2">
            <Input
              placeholder="Create new attribute..."
              value={newAttributeName}
              onChange={(e) => setNewAttributeName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleCreateAttribute()}
              className="flex-1"
            />
            <Button onClick={handleCreateAttribute} disabled={!newAttributeName.trim()}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          {/* Attributes grid */}
          <div className="grid gap-4 md:grid-cols-2">
            {user.attributes?.map((attribute) => (
              <AttributeCard
                key={attribute.id}
                attribute={attribute}
                onDelete={onDeleteAttribute}
                canDelete={attribute.id !== 'strength' && attribute.id !== 'intelligence'}
              />
            ))}
          </div>

          {user.attributes?.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Trophy className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>No attributes yet. Create your first attribute above!</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Basic Achievements (stub) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <Trophy className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p>Achievement system coming soon...</p>
            <p className="text-sm">Keep training to unlock achievements!</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
