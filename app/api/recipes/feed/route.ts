import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const recipes = await prisma.recipe.findMany({
      select: {
        id: true,
        title: true,
        imageUrl: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 10,
    });

    const feedData = recipes?.map((recipe: any) => ({
      recipeId: recipe?.id,
      title: recipe?.title,
      imageUrl: recipe?.imageUrl,
    }));

    return NextResponse.json(
      {
        success: true,
        message: 'Feed fetched successfully',
        data: feedData,
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error('Error fetching feed:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Error while fetching feed',
      },
      { status: 500 },
    );
  }
}