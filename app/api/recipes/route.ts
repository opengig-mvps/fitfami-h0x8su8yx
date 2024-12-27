import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthSession } from "@/lib/authOptions";
import { uploadImageToCloudinary } from '@/lib/imageService'; // Ensure this path is correct and the module exists

type RecipeRequestBody = {
  title: string;
  ingredients: string;
  steps: string;
  imageUrl: string;
};

export async function POST(request: Request) {
  try {
    const session: any = await getAuthSession();
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 },
      );
    }

    const body: RecipeRequestBody = await request.json();
    const { title, ingredients, steps, imageUrl } = body;

    if (!title || !ingredients || !steps || !imageUrl) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 },
      );
    }

    const uploadedImageUrl = await uploadImageToCloudinary(imageUrl);

    const recipe = await prisma.recipe.create({
      data: {
        title,
        ingredients,
        steps,
        imageUrl: uploadedImageUrl,
        authorId: session?.user?.id,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Recipe created successfully',
        data: {
          recipeId: recipe?.id,
          title: recipe?.title,
          ingredients: recipe?.ingredients,
          steps: recipe?.steps,
          imageUrl: recipe?.imageUrl,
        },
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error('Error creating recipe:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 },
    );
  }
}