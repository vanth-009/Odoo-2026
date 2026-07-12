import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

// GET all notifications
export async function GET(_request: NextRequest) {
  try {
    const list = await prisma.notification.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50
    });

    return NextResponse.json({ data: list });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    );
  }
}

// PATCH - Mark notifications as read
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { notificationId, all } = body;

    if (all) {
      await prisma.notification.updateMany({
        where: { isRead: false },
        data: { isRead: true }
      });
      return NextResponse.json({ message: 'All notifications marked as read' });
    }

    if (!notificationId) {
      return NextResponse.json({ error: 'notificationId is required' }, { status: 400 });
    }

    const updated = await prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true }
    });

    return NextResponse.json({ data: updated, message: 'Notification marked as read' });
  } catch (error) {
    console.error('Error updating notification:', error);
    return NextResponse.json({ error: 'Failed to update notification' }, { status: 500 });
  }
}

// DELETE - Clear notification(s)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const notificationId = searchParams.get('id');

    if (notificationId) {
      await prisma.notification.delete({
        where: { id: notificationId }
      });
      return NextResponse.json({ message: 'Notification deleted successfully' });
    }

    // Default to clearing all read notifications
    await prisma.notification.deleteMany({
      where: { isRead: true }
    });
    
    return NextResponse.json({ message: 'Read notifications cleared' });
  } catch (error) {
    console.error('Error deleting notification:', error);
    return NextResponse.json({ error: 'Failed to delete notification' }, { status: 500 });
  }
}
