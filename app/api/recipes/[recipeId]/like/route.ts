import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthSession } from '@/lib/authOptions';

export async function POST(
  request: Request,
  { params }: { params: { recipeId: string } },
) {
  try {
    const session: any = await getAuthSession();
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 },
      );
    }

    const userId: string = session.user.id;
    const recipeId: string = params.recipeId;

    const existingLike = await prisma.like.findFirst({
      where: {
        userId,
        recipeId,
      },
    });

    if (existingLike) {
      await prisma.like.delete({
        where: {
          id: existingLike.id,
        },
      });
    } else {
      await prisma.like.create({
        data: {
          userId,
          recipeId,
        },
      });
    }

    const likeCount: number = await prisma.like.count({
      where: {
        recipeId,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Like toggled successfully',
        data: {
          recipeId,
          likeCount,
        },
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error('Error toggling like:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 },
    );
  }
}