
'use client';
// Skills tab component with grid view and filtering
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SkillCard } from '@/components/skill-card';
import { CreateSkillModal } from '@/components/modals/create-skill-modal';
import { Plus, Filter, Search, BookOpen } from 'lucide-react';
import { Skill, Attribute } from '@/lib/types';

interface SkillsTabProps {
  skills: Skill[];
  attributes: Attribute[];
  onCreateSkill: (name: string, imageUrl: string, attributeIds: string[]) => void;
  onDeleteSkill: (id: string) => void;
}

export function SkillsTab({ skills, attributes, onCreateSkill, onDeleteSkill }: SkillsTabProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAttributeFilter, setSelectedAttributeFilter] = useState<string>('all');
  const [tierFilter, setTierFilter] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Filter and search skills
  const filteredSkills = useMemo(() => {
    return skills.filter(skill => {
      // Search filter
      if (searchQuery && !skill.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }

      // Attribute filter
      if (selectedAttributeFilter !== 'all') {
        if (!skill.attributeIds.includes(selectedAttributeFilter)) {
          return false;
        }
      }

      // Tier filter
      if (tierFilter !== 'all') {
        if (skill.tier !== tierFilter) {
          return false;
        }
      }

      return true;
    });
  }, [skills, searchQuery, selectedAttributeFilter, tierFilter]);

  const handleCreateSkill = (name: string, imageUrl: string, attributeIds: string[]) => {
    onCreateSkill(name, imageUrl, attributeIds);
    setShowCreateModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Skills Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Skills ({skills.length})
            </div>
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Skill
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-2">
              <Select value={selectedAttributeFilter} onValueChange={setSelectedAttributeFilter}>
                <SelectTrigger className="w-40">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Attributes</SelectItem>
                  {attributes.map(attr => (
                    <SelectItem key={attr.id} value={attr.id}>
                      {attr.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={tierFilter} onValueChange={setTierFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tiers</SelectItem>
                  <SelectItem value="None">Beginner</SelectItem>
                  <SelectItem value="Skill">Skill</SelectItem>
                  <SelectItem value="Expertise">Expertise</SelectItem>
                  <SelectItem value="Mastery">Mastery</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Skills Grid */}
      {filteredSkills.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredSkills.map((skill) => (
            <SkillCard
              key={skill.id}
              skill={skill}
              attributes={attributes}
              onDelete={onDeleteSkill}
            />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12">
            <div className="text-center text-gray-500">
              <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              {skills.length === 0 ? (
                <>
                  <h3 className="text-lg font-medium mb-2">No skills yet</h3>
                  <p className="mb-4">Create your first skill to start tracking your progress!</p>
                  <Button onClick={() => setShowCreateModal(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Skill
                  </Button>
                </>
              ) : (
                <>
                  <h3 className="text-lg font-medium mb-2">No skills match your filters</h3>
                  <p>Try adjusting your search or filter criteria.</p>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Create Skill Modal */}
      <CreateSkillModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreateSkill={handleCreateSkill}
        attributes={attributes}
      />
    </div>
  );
}
