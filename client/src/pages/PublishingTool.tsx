import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Upload, FileText, AlertCircle, CheckCircle, X } from "lucide-react";

export default function PublishingTool() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "clothing",
    personalPriceUSD: "",
    commercialPriceUSD: "",
    personalPriceCNY: "",
    commercialPriceCNY: "",
    polyCount: "",
    fileFormat: "FBX",
    textureTypes: "",
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedThumbnail, setSelectedThumbnail] = useState<File | null>(null);
  const [selectedTextures, setSelectedTextures] = useState<File[]>([]);
  const [selectedScreenshots, setSelectedScreenshots] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (value: string) => {
    setFormData(prev => ({ ...prev, category: value }));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleThumbnailSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setSelectedThumbnail(e.target.files[0]);
    }
  };

  const handleTextureSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedTextures(Array.from(e.target.files));
    }
  };

  const handleScreenshotSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedScreenshots(Array.from(e.target.files));
    }
  };

  const removeTexture = (index: number) => {
    setSelectedTextures(prev => prev.filter((_, i) => i !== index));
  };

  const removeScreenshot = (index: number) => {
    setSelectedScreenshots(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile) {
      toast.error("Please select a file to upload");
      return;
    }

    if (!formData.title || !formData.description) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      // TODO: Implement file upload and submission
      toast.success("Content submitted for review!");
      setFormData({
        title: "",
        description: "",
        category: "clothing",
        personalPriceUSD: "",
        commercialPriceUSD: "",
        personalPriceCNY: "",
        commercialPriceCNY: "",
        polyCount: "",
        fileFormat: "FBX",
        textureTypes: "",
      });
      setSelectedFile(null);
      setSelectedThumbnail(null);
    } catch (error) {
      toast.error("Failed to submit content");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="w-full">
        {/* Header */}
        <div className="px-6 py-8 border-b border-border">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl font-bold mb-2">Publishing Tool</h1>
            <p className="text-muted-foreground">Submit your 3D assets for review and curation</p>
          </div>
        </div>

        {/* Review Process Info */}
        <div className="px-6 py-8 border-b border-border bg-muted/30">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-cyan-400" />
              Review Process
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-cyan-400/20 rounded-full flex items-center justify-center text-cyan-400 font-bold text-sm">1</div>
                <div>
                  <p className="font-semibold text-foreground">Submit Content</p>
                  <p className="text-sm text-muted-foreground">Upload your asset with details and pricing</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-cyan-400/20 rounded-full flex items-center justify-center text-cyan-400 font-bold text-sm">2</div>
                <div>
                  <p className="font-semibold text-foreground">Admin Review</p>
                  <p className="text-sm text-muted-foreground">Our curation team reviews quality and technical correctness</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-cyan-400/20 rounded-full flex items-center justify-center text-cyan-400 font-bold text-sm">3</div>
                <div>
                  <p className="font-semibold text-foreground">Review Outcomes</p>
                  <p className="text-sm text-muted-foreground">Approved, Revision Required, or Rejected with feedback</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-6 py-8 bg-background">
          <div className="max-w-7xl mx-auto">
            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Form Fields */}
              <div className="lg:col-span-2 space-y-6">
                {/* Basic Info */}
                <Card className="bg-card border-border p-6">
                  <h3 className="text-lg font-semibold mb-4">Asset Details</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Title *</label>
                      <Input
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="Asset name"
                        className="bg-background border-border"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Description *</label>
                      <Textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Detailed description of your asset"
                        className="bg-background border-border"
                        rows={4}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Category *</label>
                        <Select value={formData.category} onValueChange={handleCategoryChange}>
                          <SelectTrigger className="bg-background border-border">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-popover border-border">
                            <SelectItem value="clothing">Clothing</SelectItem>
                            <SelectItem value="hair">Hair</SelectItem>
                            <SelectItem value="face">Face</SelectItem>
                            <SelectItem value="accessories">Accessories</SelectItem>
                            <SelectItem value="animations">Animations</SelectItem>
                            <SelectItem value="packs">Packs</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">File Format</label>
                        <Input
                          name="fileFormat"
                          value={formData.fileFormat}
                          onChange={handleInputChange}
                          placeholder="FBX, OBJ, etc."
                          className="bg-background border-border"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Poly Count</label>
                        <Input
                          name="polyCount"
                          type="number"
                          value={formData.polyCount}
                          onChange={handleInputChange}
                          placeholder="e.g., 50000"
                          className="bg-background border-border"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Texture Types</label>
                        <Input
                          name="textureTypes"
                          value={formData.textureTypes}
                          onChange={handleInputChange}
                          placeholder="e.g., Albedo, Normal, Roughness"
                          className="bg-background border-border"
                        />
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Pricing */}
                <Card className="bg-card border-border p-6">
                  <h3 className="text-lg font-semibold mb-4">Pricing</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Personal License (USD) *</label>
                      <Input
                        name="personalPriceUSD"
                        type="number"
                        step="0.01"
                        value={formData.personalPriceUSD}
                        onChange={handleInputChange}
                        placeholder="$"
                        className="bg-background border-border"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Commercial License (USD) *</label>
                      <Input
                        name="commercialPriceUSD"
                        type="number"
                        step="0.01"
                        value={formData.commercialPriceUSD}
                        onChange={handleInputChange}
                        placeholder="$"
                        className="bg-background border-border"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Personal License (CNY) *</label>
                      <Input
                        name="personalPriceCNY"
                        type="number"
                        step="0.01"
                        value={formData.personalPriceCNY}
                        onChange={handleInputChange}
                        placeholder="¥"
                        className="bg-background border-border"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Commercial License (CNY) *</label>
                      <Input
                        name="commercialPriceCNY"
                        type="number"
                        step="0.01"
                        value={formData.commercialPriceCNY}
                        onChange={handleInputChange}
                        placeholder="¥"
                        className="bg-background border-border"
                      />
                    </div>
                  </div>
                </Card>
              </div>

              {/* Right Column - File Uploads & Quality Standards */}
              <div className="lg:col-span-1">
                <div className="sticky top-8 space-y-4">
                  {/* Quality Guidelines */}
                  <Card className="bg-cyan-400/10 border-cyan-400/30 p-4">
                    <div className="flex gap-3">
                      <AlertCircle className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                      <div className="text-sm">
                        <p className="font-semibold text-cyan-400 mb-2">Quality Standards</p>
                        <ul className="text-foreground/80 space-y-1 text-xs">
                          <li>• Visual quality must be consistent with Genji standards</li>
                          <li>• Technical correctness (proper topology, UV mapping)</li>
                          <li>• Optimization for real-time performance</li>
                          <li>• Clear naming and accurate descriptions</li>
                        </ul>
                      </div>
                    </div>
                  </Card>

                  {/* Asset File Upload */}
                  <Card className="bg-card border-border p-3 border-2 border-dashed hover:border-cyan-400/50 transition cursor-pointer">
                    <label className="block cursor-pointer">
                      <div className="text-center py-4">
                        <Upload className="w-8 h-8 mx-auto mb-3 text-cyan-400" />
                        <p className="text-sm font-medium text-card-foreground mb-1">
                          {selectedFile ? selectedFile.name : "Upload Asset File"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {selectedFile ? "Click to change" : "FBX only"}
                        </p>
                      </div>
                      <input
                        type="file"
                        onChange={handleFileSelect}
                        className="hidden"
                        accept=".fbx"
                      />
                    </label>
                    {selectedFile && (
                      <div className="mt-3 pt-3 border-t border-border">
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span className="truncate">{selectedFile.name}</span>
                          <button
                            type="button"
                            onClick={() => setSelectedFile(null)}
                            className="text-red-400 hover:text-red-300 ml-2"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="mt-2 text-xs text-green-400 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          File selected
                        </div>
                      </div>
                    )}
                  </Card>

                  {/* Thumbnail Upload */}
                  <Card className="bg-card border-border p-3 border-2 border-dashed hover:border-cyan-400/50 transition cursor-pointer">
                    <label className="block cursor-pointer">
                      <div className="text-center py-4">
                        <Upload className="w-8 h-8 mx-auto mb-3 text-cyan-400" />
                        <p className="text-sm font-medium text-card-foreground mb-1">
                          {selectedThumbnail ? "Thumbnail" : "Upload Thumbnail"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {selectedThumbnail ? "Click to change" : "JPG, PNG, WebP"}
                        </p>
                      </div>
                      <input
                        type="file"
                        onChange={handleThumbnailSelect}
                        className="hidden"
                        accept=".jpg,.jpeg,.png,.webp"
                      />
                    </label>
                    {selectedThumbnail && (
                      <div className="mt-3 pt-3 border-t border-border">
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span className="truncate">{selectedThumbnail.name}</span>
                          <button
                            type="button"
                            onClick={() => setSelectedThumbnail(null)}
                            className="text-red-400 hover:text-red-300 ml-2"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="mt-2 text-xs text-green-400 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          File selected
                        </div>
                      </div>
                    )}
                  </Card>

                  {/* File Info */}
                  {/* Texture Upload */}
                  <Card className="bg-card border-border p-3 border-2 border-dashed hover:border-cyan-400/50 transition cursor-pointer">
                    <label className="block cursor-pointer">
                      <div className="text-center py-3">
                        <Upload className="w-6 h-6 mx-auto mb-2 text-cyan-400" />
                        <p className="text-xs font-medium text-card-foreground mb-0.5">
                          {selectedTextures.length > 0 ? `${selectedTextures.length} texture(s)` : "Upload Textures"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {selectedTextures.length > 0 ? "Click to add more" : "PNG, TGA, EXR"}
                        </p>
                      </div>
                      <input
                        type="file"
                        onChange={handleTextureSelect}
                        className="hidden"
                        accept=".png,.tga,.exr"
                        multiple
                      />
                    </label>
                    {selectedTextures.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-border space-y-1">
                        {selectedTextures.map((file, idx) => (
                          <div key={idx} className="flex items-center justify-between text-xs text-muted-foreground">
                            <span className="truncate">{file.name}</span>
                            <button
                              type="button"
                              onClick={() => removeTexture(idx)}
                              className="text-red-400 hover:text-red-300 ml-2"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </Card>

                  {/* Screenshot Upload */}
                  <Card className="bg-card border-border p-3 border-2 border-dashed hover:border-cyan-400/50 transition cursor-pointer">
                    <label className="block cursor-pointer">
                      <div className="text-center py-3">
                        <Upload className="w-6 h-6 mx-auto mb-2 text-cyan-400" />
                        <p className="text-xs font-medium text-card-foreground mb-0.5">
                          {selectedScreenshots.length > 0 ? `${selectedScreenshots.length} screenshot(s)` : "Upload Screenshots"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {selectedScreenshots.length > 0 ? "Click to add more" : "JPG, PNG"}
                        </p>
                      </div>
                      <input
                        type="file"
                        onChange={handleScreenshotSelect}
                        className="hidden"
                        accept=".jpg,.jpeg,.png"
                        multiple
                      />
                    </label>
                    {selectedScreenshots.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-border space-y-1">
                        {selectedScreenshots.map((file, idx) => (
                          <div key={idx} className="flex items-center justify-between text-xs text-muted-foreground">
                            <span className="truncate">{file.name}</span>
                            <button
                              type="button"
                              onClick={() => removeScreenshot(idx)}
                              className="text-red-400 hover:text-red-300 ml-2"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </Card>

                  <Card className="bg-card border-border p-4">
                    <p className="text-xs text-muted-foreground mb-2 font-semibold">Recommended Specs</p>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li>• Thumbnail: 1024x1024px</li>
                      <li>• Max file size: 500MB</li>
                      <li>• Format: FBX only</li>
                      <li>• Include all textures</li>
                    </ul>
                  </Card>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold py-6"
                  >
                    {isSubmitting ? "Submitting..." : "Submit for Review"}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
