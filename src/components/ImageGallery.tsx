"use client";

import React, { useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/Button";

interface ImageGalleryProps {
  images: string[];
  productName: string;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({
  images,
  productName,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const thumbnailsRef = useRef<HTMLDivElement>(null);

  // Filter out empty/invalid images
  const validImages = images.filter((img) => img && img.trim() !== "");

  // If no valid images, show placeholder
  if (validImages.length === 0) {
    return (
      <div className="aspect-square bg-muted rounded-lg flex items-center justify-center text-muted-foreground">
        No Image
      </div>
    );
  }

  const handlePrevious = () => {
    setSelectedIndex((prev) =>
      prev === 0 ? validImages.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setSelectedIndex((prev) =>
      prev === validImages.length - 1 ? 0 : prev + 1
    );
  };

  const handleThumbnailClick = (index: number) => {
    setSelectedIndex(index);
    // Scroll thumbnail into view
    if (thumbnailsRef.current) {
      const thumbnails = thumbnailsRef.current.children;
      if (thumbnails[index]) {
        (thumbnails[index] as HTMLElement).scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square bg-muted rounded-lg overflow-hidden group">
        <img
          src={validImages[selectedIndex]}
          alt={`${productName} - Image ${selectedIndex + 1}`}
          className="w-full h-full object-contain"
        />

        {/* Navigation Arrows */}
        {validImages.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="sm"
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background opacity-0 group-hover:opacity-100 transition-opacity rounded-full w-10 h-10 p-0"
              onClick={handlePrevious}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background opacity-0 group-hover:opacity-100 transition-opacity rounded-full w-10 h-10 p-0"
              onClick={handleNext}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </>
        )}

        {/* Image Counter */}
        {validImages.length > 1 && (
          <div className="absolute bottom-3 right-3 bg-background/80 px-2 py-1 rounded text-xs text-foreground">
            {selectedIndex + 1} / {validImages.length}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {validImages.length > 1 && (
        <div
          ref={thumbnailsRef}
          className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent"
        >
          {validImages.map((image, index) => (
            <button
              key={index}
              onClick={() => handleThumbnailClick(index)}
              className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-all ${
                selectedIndex === index
                  ? "border-primary ring-2 ring-primary/30"
                  : "border-transparent hover:border-muted-foreground/50"
              }`}
            >
              <img
                src={image}
                alt={`${productName} - Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
