
'use client';
// Modal for creating new skills with image selection
import React, { useState } from 'react';
import Image from 'next/image';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { SKILL_CATEGORY_IMAGES, SkillCategory } from '@/lib/types';
import { Attribute } from '@/lib/types';

interface CreateSkillModalProps {
  open: boolean;
  onClose: () => void;
  onCreateSkill: (name: string, imageUrl: string, attributeIds: string[]) => void;
  attributes: Attribute[];
}

export function CreateSkillModal({ open, onClose, onCreateSkill, attributes }: CreateSkillModalProps) {
  const [skillName, setSkillName] = useState('');
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [selectedAttributes, setSelectedAttributes] = useState<string[]>([]);
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [useCustomImage, setUseCustomImage] = useState(false);

  const handleSubmit = () => {
    if (!skillName.trim()) return;
    
    const imageUrl = useCustomImage && customImageUrl.trim() 
      ? customImageUrl.trim() 
      : selectedImage || Object.values(SKILL_CATEGORY_IMAGES)[0];

    onCreateSkill(skillName.trim(), imageUrl, selectedAttributes);
    
    // Reset form
    setSkillName('');
    setSelectedImage('');
    setSelectedAttributes([]);
    setCustomImageUrl('');
    setUseCustomImage(false);
  };

  const handleAttributeToggle = (attributeId: string) => {
    setSelectedAttributes(prev =>
      prev.includes(attributeId)
        ? prev.filter(id => id !== attributeId)
        : [...prev, attributeId]
    );
  };

  const canCreate = skillName.trim() && (selectedImage || (useCustomImage && customImageUrl.trim()));

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Skill</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Skill Name */}
          <div>
            <Label htmlFor="skill-name">Skill Name</Label>
            <Input
              id="skill-name"
              placeholder="e.g., Guitar Playing, Running, Coding"
              value={skillName}
              onChange={(e) => setSkillName(e.target.value)}
            />
          </div>

          {/* Image Selection */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <Label>Choose Image</Label>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="custom-image"
                  checked={useCustomImage}
                  onCheckedChange={(checked) => setUseCustomImage(checked === true)}
                />
                <Label htmlFor="custom-image" className="text-sm">Use custom URL</Label>
              </div>
            </div>

            {useCustomImage ? (
              <div>
                <Input
                  placeholder="Enter image URL..."
                  value={customImageUrl}
                  onChange={(e) => setCustomImageUrl(e.target.value)}
                />
                {customImageUrl && (
                  <div className="mt-3 relative h-24 w-24 mx-auto rounded-lg overflow-hidden">
                    <Image
                      src={customImageUrl}
                      alt="Custom preview"
                      fill
                      className="object-cover"
                      onError={() => setCustomImageUrl('')}
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                {Object.entries(SKILL_CATEGORY_IMAGES).map(([category, imageUrl]) => (
                  <button
                    key={category}
                    onClick={() => setSelectedImage(imageUrl)}
                    className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === imageUrl
                        ? 'border-blue-500 ring-2 ring-blue-200'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <Image
                      src={imageUrl}
                      alt={category}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Attribute Linking */}
          <div>
            <Label className="mb-3 block">Link to Attributes (Optional)</Label>
            <div className="grid grid-cols-2 gap-2">
              {attributes?.map((attribute) => (
                <div key={attribute.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`attr-${attribute.id}`}
                    checked={selectedAttributes.includes(attribute.id)}
                    onCheckedChange={() => handleAttributeToggle(attribute.id)}
                  />
                  <Label htmlFor={`attr-${attribute.id}`} className="text-sm">
                    {attribute.name} (Lv. {attribute.level})
                  </Label>
                </div>
              )) || []}
            </div>
            {selectedAttributes.length === 0 && (
              <p className="text-sm text-gray-500 mt-1">
                Skills linked to attributes will award XP to those attributes during sessions.
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={!canCreate}>
              Create Skill
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
