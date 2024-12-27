import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthSession } from "@/lib/authOptions";

export async function GET() {
  try {
    const session: any = await getAuthSession();
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, message: 'User not authenticated' },
        { status: 401 },
      );
    }

    const userId: string = session.user.id;

    const notifications = await prisma.notification.findMany({
      where: { userId },
      select: {
        id: true,
        content: true,
        isRead: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const formattedNotifications = notifications.map((notification: any) => ({
      notificationId: notification.id,
      content: notification.content,
      isRead: notification.isRead,
      createdAt: notification.createdAt.toISOString(),
    }));

    return NextResponse.json(
      {
        success: true,
        message: 'Notifications fetched successfully',
        data: formattedNotifications,
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 },
    );
  }
}