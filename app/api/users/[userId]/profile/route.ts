import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

type ProfileRequestBody = {
  bio: string;
  profilePictureUrl: string;
};

export async function POST(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const userId: string = params.userId;
    const body: ProfileRequestBody = await request.json();

    const { bio, profilePictureUrl } = body;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        bio: bio ? String(bio) : undefined,
        profilePictureUrl: profilePictureUrl ? String(profilePictureUrl) : undefined,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'User profile updated successfully',
        data: {
          bio,
          profilePictureUrl,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error updating user profile:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error', data: error },
      { status: 500 }
    );
  }
}