// PhotoUpload.tsx
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, User } from 'lucide-react';
import ImageCropper from './ImageCropper';



const PhotoUpload = ({ label, value, onChange, placeholder , hasError = false }) => {
  const [isCropperOpen, setIsCropperOpen] = useState(false);

  const handleCropComplete = (croppedImage) => {
    onChange(croppedImage);
  };

  return (
    <div className="space-y-3">
      {/* <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label}
      </label> */}
      
      <div className="flex flex-col sm:flex-row gap-4 items-start">
        {/* <div className={`w-32 h-32 border-2 rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center ${
          hasError ? 'border-red-500' : 'border-gray-200'
        }`}>
          {value ? (
            <img
              src={value}
              alt={label}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-center">
              <User className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-xs text-gray-500">No photo</p>
            </div>
          )}
        </div> */}
        
        <div className="flex-1  hidden sm:block">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsCropperOpen(true)}
            className="w-full sm:w-auto border-amber-400"
          >
            <Camera className="w-4 h-4 mr-2" />
            {value ? 'Change Photo' : 'Upload Photo'}
          </Button>
          {placeholder && (
            <p className="text-xs text-gray-500 mt-1">{placeholder}</p>
          )}
          {hasError && (
            <p className="mt-1 text-sm text-red-600">Please upload a photo</p>
          )}
        </div>
      </div>

      <ImageCropper
        isOpen={isCropperOpen}
        onClose={() => setIsCropperOpen(false)}
        onCropComplete={handleCropComplete}
        title={`Upload ${label}`}
      />
    </div>
  );
};

export default PhotoUpload;