import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthSession } from '@/lib/authOptions';

type CommentRequestBody = {
  content: string;
};

export async function POST(
  request: Request,
  { params }: { params: { recipeId: string } },
) {
  try {
    const session = await getAuthSession();
    if (!session) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 },
      );
    }

    const recipeId = params.recipeId;
    const userId = session.user.id;

    const body: CommentRequestBody = await request.json();
    const content = String(body.content);

    if (!content) {
      return NextResponse.json(
        { success: false, message: 'Content is required' },
        { status: 400 },
      );
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        userId,
        recipeId,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Comment added successfully',
        data: {
          commentId: comment.id,
          content: comment.content,
          createdAt: comment.createdAt,
        },
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error('Error adding comment:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error', data: error },
      { status: 500 },
    );
  }
}