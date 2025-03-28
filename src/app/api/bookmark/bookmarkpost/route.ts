// app/api/bookmark/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import Bookmark from '@/app/models/Bookmark';
import { connectDB } from '@/app/lib/mongodb';
import { authOptions } from '../../auth/authOptions/authOptions';

export async function POST(req: Request) {
  await connectDB();
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { contentId } = await req.json();
    if (!contentId) return NextResponse.json({ error: 'Content ID is required' }, { status: 400 });

    const userId = session?.user?.email;

    const userBookmark = await Bookmark.findOne({ userId });

    if (userBookmark) {
      // If contentId already exists, remove it; otherwise, add it
      const alreadyBookmarked = userBookmark.contentIds.includes(contentId);
      if (alreadyBookmarked) {
        userBookmark.contentIds = userBookmark.contentIds.filter((id: string) => id !== contentId);
      } else {
        userBookmark.contentIds.push(contentId);
      }
      await userBookmark.save();
    } else {
      await Bookmark.create({ userId, contentIds: [contentId] });
    }

    return NextResponse.json({ message: 'Bookmark updated' }, { status: 200 });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}