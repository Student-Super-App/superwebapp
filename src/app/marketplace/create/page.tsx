'use client';

import { AuthGuard } from '@/components/AuthGuard';
import { Header } from '@/components/common/Header';
import { Sidebar } from '@/components/common/Sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { useCreateProduct } from '@/features/marketplace/hooks';
import { PRODUCT_CATEGORIES, PRODUCT_CONDITIONS } from '@/types/marketplace';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Plus, X, ArrowLeft, Package } from 'lucide-react';
import { toast } from 'sonner';

export const dynamic = 'force-dynamic';

export default function CreateProductPage() {
  const router = useRouter();
  const createProduct = useCreateProduct();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    condition: '',
    images: [''],
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData((prev) => ({ ...prev, images: newImages }));
  };

  const addImageField = () => {
    if (formData.images.length < 5) {
      setFormData((prev) => ({ ...prev, images: [...prev.images, ''] }));
    } else {
      toast.error('Maximum 5 images allowed');
    }
  };

  const removeImageField = (index: number) => {
    if (formData.images.length > 1) {
      const newImages = formData.images.filter((_, i) => i !== index);
      setFormData((prev) => ({ ...prev, images: newImages }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.title.trim()) {
      toast.error('Title is required');
      return;
    }
    if (!formData.description.trim()) {
      toast.error('Description is required');
      return;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      toast.error('Valid price is required');
      return;
    }
    if (!formData.category) {
      toast.error('Category is required');
      return;
    }
    if (!formData.condition) {
      toast.error('Condition is required');
      return;
    }

    // Filter out empty image URLs
    const validImages = formData.images.filter((img) => img.trim() !== '');

    createProduct.mutate({
      title: formData.title.trim(),
      description: formData.description.trim(),
      price: parseFloat(formData.price),
      category: formData.category,
      condition: formData.condition,
      images: validImages,
    });
  };

  return (
    <AuthGuard>
      <div className="flex flex-col h-screen overflow-hidden">
        <Header />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
            <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8">
              {/* Header */}
              <div className="mb-6">
                <Button
                  variant="ghost"
                  onClick={() => router.back()}
                  className="mb-4 dark:hover:bg-gray-800"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                    <Package className="w-6 h-6 text-white" />
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                    List Your Item
                  </h1>
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  Fill in the details below to list your item on the marketplace
                </p>
              </div>

              <Card className="p-6 dark:bg-gray-800 dark:border-gray-700">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Title */}
                  <div className="space-y-2">
                    <Label htmlFor="title" className="dark:text-gray-200">
                      Title <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="e.g., iPhone 13 Pro Max 256GB"
                      className="dark:bg-gray-700 dark:border-gray-600"
                      maxLength={100}
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formData.title.length}/100 characters
                    </p>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Label htmlFor="description" className="dark:text-gray-200">
                      Description <span className="text-red-500">*</span>
                    </Label>
                    <textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Describe your item in detail..."
                      rows={6}
                      className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                      maxLength={1000}
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {formData.description.length}/1000 characters
                    </p>
                  </div>

                  {/* Price */}
                  <div className="space-y-2">
                    <Label htmlFor="price" className="dark:text-gray-200">
                      Price (USD) <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.price}
                      onChange={(e) => handleInputChange('price', e.target.value)}
                      placeholder="0.00"
                      className="dark:bg-gray-700 dark:border-gray-600"
                    />
                  </div>

                  {/* Category & Condition */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category" className="dark:text-gray-200">
                        Category <span className="text-red-500">*</span>
                      </Label>
                      <select
                        id="category"
                        value={formData.category}
                        onChange={(e) => handleInputChange('category', e.target.value)}
                        className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                      >
                        <option value="">Select category</option>
                        {PRODUCT_CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="condition" className="dark:text-gray-200">
                        Condition <span className="text-red-500">*</span>
                      </Label>
                      <select
                        id="condition"
                        value={formData.condition}
                        onChange={(e) => handleInputChange('condition', e.target.value)}
                        className="w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                      >
                        <option value="">Select condition</option>
                        {PRODUCT_CONDITIONS.map((cond) => (
                          <option key={cond} value={cond}>
                            {cond}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Images */}
                  <div className="space-y-2">
                    <Label className="dark:text-gray-200">
                      Images (URLs)
                    </Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                      Add up to 5 image URLs (from AWS, Cloudinary, etc.)
                    </p>
                    <div className="space-y-3">
                      {formData.images.map((img, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            value={img}
                            onChange={(e) => handleImageChange(index, e.target.value)}
                            placeholder={`Image URL ${index + 1}`}
                            className="dark:bg-gray-700 dark:border-gray-600"
                          />
                          {formData.images.length > 1 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() => removeImageField(index)}
                              className="dark:bg-gray-700 dark:border-gray-600"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                      {formData.images.length < 5 && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={addImageField}
                          className="w-full dark:bg-gray-700 dark:border-gray-600"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Another Image
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex gap-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => router.back()}
                      className="flex-1 dark:bg-gray-700 dark:border-gray-600"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={createProduct.isPending}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      {createProduct.isPending ? 'Listing...' : 'List Item'}
                    </Button>
                  </div>
                </form>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
