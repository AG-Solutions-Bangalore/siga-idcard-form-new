
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Crop, Upload, RotateCcw, Check, Maximize2, Minimize2 } from 'lucide-react';



const ImageCropper = ({ isOpen, onClose, onCropComplete, title }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [cropData, setCropData] = useState({
    x: 0,
    y: 0,
    width: 200,
    height: 200,
    isDragging: false,
    isResizing: false,
    dragStart: { x: 0, y: 0 },
    aspectRatio: 1,
  });
  
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const containerRef = useRef(null);

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle both mouse and touch events
  const handleStart = (e, isResizing = false) => {
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    setCropData(prev => ({
      ...prev,
      isDragging: !isResizing,
      isResizing,
      dragStart: { 
        x: clientX - (isResizing ? prev.x + prev.width : prev.x), 
        y: clientY - (isResizing ? prev.y + prev.height : prev.y) 
      }
    }));
  };

//   const handleStart = (e, isResizing = false) => {
//     const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
//     const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
//     setCropData(prev => ({
//       ...prev,
//       isDragging: true,
//       isResizing:false,
//       dragStart: { 
//         x: clientX - (isResizing ? prev.x + prev.width : prev.x), 
//         y: clientY - (isResizing ? prev.y + prev.height : prev.y) 
//       }
//     }));
//   };

  const handleMove = useCallback((e) => {
    if (!imageRef.current) return;
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const rect = imageRef.current.getBoundingClientRect();
    
    if (cropData.isDragging) {
      const newX = Math.max(0, Math.min(clientX - cropData.dragStart.x, rect.width - cropData.width));
      const newY = Math.max(0, Math.min(clientY - cropData.dragStart.y, rect.height - cropData.height));
      
      setCropData(prev => ({
        ...prev,
        x: newX,
        y: newY
      }));
    } else if (cropData.isResizing) {
      const newWidth = Math.max(50, Math.min(clientX - cropData.dragStart.x - cropData.x, rect.width - cropData.x));
      const newHeight = Math.max(50, Math.min(clientY - cropData.dragStart.y - cropData.y, rect.height - cropData.y));
      
      setCropData(prev => ({
        ...prev,
        width: newWidth,
        height: newHeight,
        aspectRatio: newWidth / newHeight
      }));
    }
  }, [cropData.isDragging, cropData.isResizing, cropData.dragStart, cropData.x, cropData.y]);

  const handleEnd = useCallback(() => {
    setCropData(prev => ({ ...prev, isDragging: false, isResizing: false }));
  }, []);

  useEffect(() => {
    if (cropData.isDragging || cropData.isResizing) {
      document.addEventListener('mousemove', handleMove);
      document.addEventListener('touchmove', handleMove);
      document.addEventListener('mouseup', handleEnd);
      document.addEventListener('touchend', handleEnd);
      return () => {
        document.removeEventListener('mousemove', handleMove);
        document.removeEventListener('touchmove', handleMove);
        document.removeEventListener('mouseup', handleEnd);
        document.removeEventListener('touchend', handleEnd);
      };
    }
  }, [cropData.isDragging, cropData.isResizing, handleMove, handleEnd]);

  const handleCrop = () => {
    if (!selectedImage || !canvasRef.current || !imageRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = imageRef.current;

    if (!ctx) return;

    // Set canvas size to crop size
    canvas.width = cropData.width;
    canvas.height = cropData.height;

    // Calculate scale factors
    const scaleX = img.naturalWidth / img.width;
    const scaleY = img.naturalHeight / img.height;

    // Draw cropped image
    ctx.drawImage(
      img,
      cropData.x * scaleX,
      cropData.y * scaleY,
      cropData.width * scaleX,
      cropData.height * scaleY,
      0,
      0,
      cropData.width,
      cropData.height
    );

    // Convert to base64
    const croppedImage = canvas.toDataURL('image/jpeg', 0.9);
    onCropComplete(croppedImage);
    handleClose();
  };

  const handleClose = () => {
    setSelectedImage(null);
    setCropData({ 
      x: 0, 
      y: 0, 
      width: 200, 
      height: 200, 
      isDragging: false, 
      isResizing: false,
      dragStart: { x: 0, y: 0 },
      aspectRatio: 1
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[100vh] bg-amber-50  overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Crop className="w-5 h-5" />
            {title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {!selectedImage ? (
            <div className="border-2 border-dashed border-amber-300 rounded-lg p-8 text-center">
              <Upload className="w-12 h-12 mx-auto text-amber-400 mb-4" />
              <p className="text-amber-600 mb-4">Upload an image to crop</p>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <label htmlFor="image-upload">
                <Button asChild className="cursor-pointer shadow-sm shadow-amber-800">
                  <span>Choose Image</span>
                </Button>
              </label>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative inline-block" ref={containerRef}>
                <img
                  ref={imageRef}
                  src={selectedImage}
                  alt="Crop preview"
                  className="max-w-full max-h-96 object-contain"
                  draggable={false}
                  onLoad={() => {
                    if (imageRef.current) {
                      const minDimension = Math.min(imageRef.current.width, imageRef.current.height) * 0.5;
                      setCropData(prev => ({
                        ...prev,
                        width: minDimension,
                        height: minDimension,
                        aspectRatio: 1
                      }));
                    }
                  }}
                />
                <div
                  className="absolute border-2 border-blue-500 bg-blue-100 bg-opacity-20 cursor-move"
                  style={{
                    left: cropData.x,
                    top: cropData.y,
                    width: cropData.width,
                    height: cropData.height,
                  }}
                  onMouseDown={(e) => handleStart(e)}
                  onTouchStart={(e) => handleStart(e)}
                >
                  <div className="absolute inset-0 border border-dashed border-blue-400"></div>
                  {/* Resize handle */}
                  <div 
                    className="absolute bottom-0 right-0 w-4 h-4 bg-blue-500 cursor-nwse-resize"
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      handleStart(e, true);
                    }}
                    onTouchStart={(e) => {
                      e.stopPropagation();
                      handleStart(e, true);
                    }}
                  >
                    <Maximize2 className="w-3 h-3 text-white" />
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2 justify-center">
                <Button variant="default" className="border border-amber-800" onClick={() => setSelectedImage(null)}>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
                <Button className="shadow-sm shadow-amber-800"  onClick={handleCrop}>
                  <Check className="w-4 h-4 mr-2" />
                  Crop Image
                </Button>
              </div>
            </div>
          )}
        </div>
        
        <canvas ref={canvasRef} className="hidden" />
      </DialogContent>
    </Dialog>
  );
};

export default ImageCropper;

