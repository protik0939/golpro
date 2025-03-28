import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import Bookmark from '@/app/models/Bookmark';
import { connectDB } from '@/app/lib/mongodb';
import { authOptions } from '../../auth/authOptions/authOptions';

export async function GET() {
  await connectDB();
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const userId = session?.user?.email;
    const bookmark = await Bookmark.findOne({ userId });

    return NextResponse.json({ contentIds: bookmark?.contentIds || [] }, { status: 200 });
  } catch (error) {
    console.error('Error fetching bookmarks:', error);
    return NextResponse.json({ contentIds: [] }, { status: 500 });
  }
}
