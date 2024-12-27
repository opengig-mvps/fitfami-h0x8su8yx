'use client';
import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { LoaderCircleIcon } from 'lucide-react';
import api from '@/lib/api';

const recipeSchema = z.object({
  title: z.string().min(1, "Title is required"),
  ingredients: z.string().min(1, "Ingredients are required"),
  steps: z.string().min(1, "Steps are required"),
  image: z
    .instanceof(File)
    .refine((file) => file?.size <= 5 * 1024 * 1024, "Image size should be less than 5MB")
    .refine(
      (file) => ["image/jpeg", "image/png", "image/gif"].includes(file?.type),
      "Only JPEG, PNG, and GIF formats are accepted"
    ),
});

type RecipeFormData = z.infer<typeof recipeSchema>;

const CreateRecipe: React.FC = () => {
  const { data: session } = useSession();
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RecipeFormData>({
    resolver: zodResolver(recipeSchema),
  });

  const onSubmit = async (data: RecipeFormData) => {
    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('ingredients', data.ingredients);
      formData.append('steps', data.steps);
      formData.append('image', data.image);

      const response = await api.post(`/api/recipes`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data.success) {
        toast.success("Recipe created successfully!");
      }
    } catch (error: any) {
      toast.error(error.response?.data.message ?? "Something went wrong");
    }
  };

  const handleImageChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="flex-1 p-8">
      <h2 className="text-2xl font-bold mb-6">Create New Recipe</h2>
      <Card>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle>Recipe Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input {...register("title")} placeholder="Enter recipe title" />
              {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="ingredients">Ingredients</Label>
              <Textarea {...register("ingredients")} placeholder="List the ingredients" />
              {errors.ingredients && <p className="text-red-500 text-sm">{errors.ingredients.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="steps">Preparation Steps</Label>
              <Textarea {...register("steps")} placeholder="Describe the preparation steps" />
              {errors.steps && <p className="text-red-500 text-sm">{errors.steps.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Upload Image</Label>
              <Input type="file" accept="image/*" {...register("image")} onChange={handleImageChange} />
              {errors.image && <p className="text-red-500 text-sm">{errors.image.message}</p>}
              {imagePreview && <img src={imagePreview} alt="Image Preview" className="mt-4 w-32 h-32 object-cover" />}
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <LoaderCircleIcon className="w-4 h-4 mr-2 animate-spin" />
                  Creating Recipe...
                </>
              ) : (
                "Create Recipe"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default CreateRecipe;