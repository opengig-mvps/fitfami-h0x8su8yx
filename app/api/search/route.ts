import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body: any = await request.json();
    const searchTerm: string = String(body.searchTerm || '');

    const [recipes, users] = await Promise.all([
      prisma.recipe.findMany({
        where: {
          OR: [
            { title: { contains: searchTerm, mode: 'insensitive' } },
            { ingredients: { contains: searchTerm, mode: 'insensitive' } },
          ],
        },
        select: {
          title: true,
          steps: true,
        },
      }),
      prisma.user.findMany({
        where: {
          OR: [
            { username: { contains: searchTerm, mode: 'insensitive' } },
            { name: { contains: searchTerm, mode: 'insensitive' } },
          ],
        },
        select: {
          username: true,
          bio: true,
        },
      }),
    ]);

    const results = [
      ...recipes.map((recipe: any) => ({
        type: 'recipe',
        title: recipe.title,
        description: recipe.steps,
      })),
      ...users.map((user: any) => ({
        type: 'user',
        title: user.username,
        description: user.bio || '',
      })),
    ];

    return NextResponse.json({
      success: true,
      message: 'Search results fetched successfully',
      data: results,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: 'Error fetching search results',
      },
      { status: 500 },
    );
  }
}