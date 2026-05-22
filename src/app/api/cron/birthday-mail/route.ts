import { connectDB } from '@/app/lib/mongodb';
import Authors from '@/app/models/Authors';
import Content from '@/app/models/Content';
import { authOptions } from '../../auth/authOptions/authOptions';
import { getServerSession } from 'next-auth';
import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';
import { buildBirthdayMailHtml, buildBirthdayMailText } from '@/app/lib/birthday-mail';

export const runtime = 'nodejs';

type BirthdayAuthor = {
  authorId: string;
  email: string;
  fullName: string;
  imageUrl?: string;
  dateOfBirth: Date;
  birthdayMailLastSentYear?: number | null;
};

type BirthdayContent = {
  cId: string;
  cTitle: string;
  cDescription?: string;
  cContentType?: string;
  cLandscape?: string;
  cPortrait?: string;
  cBanner?: string;
  cLogo?: string;
  cCard?: string;
  cSquare?: string;
  cLink?: string;
};

const getBirthdayMailContents = async (authorId?: string) => {
  const query = authorId ? { cAuthors: authorId } : {};

  const contents = (await Content.find(query)
    .sort({ createdAt: -1 })
    .select('cId cTitle cDescription cContentType cLandscape cPortrait cBanner cLogo cCard cSquare cLink')
    .limit(6)
    .lean()) as unknown as BirthdayContent[];

  return contents;
};

const getBaseUrl = (req: Request) => {
  const configuredBaseUrl = process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL;
  if (configuredBaseUrl) {
    return configuredBaseUrl.replace(/\/$/, '');
  }

  const url = new URL(req.url);
  return `${url.protocol}//${url.host}`;
};

const getMonthDay = (date: Date, timeZone: string) =>
  new Intl.DateTimeFormat('en-GB', {
    timeZone,
    month: '2-digit',
    day: '2-digit',
  }).format(date);

const isAuthorizedCronCall = (req: Request) => {
  const secret = process.env.CRON_SECRET;
  const url = new URL(req.url);
  const providedSecret = url.searchParams.get('secret') || req.headers.get('x-cron-secret');
  const isVercelCron = req.headers.get('x-vercel-cron') === '1' || req.headers.get('x-vercel-cron') === 'true';

  if (isVercelCron) {
    return true;
  }

  if (!secret) {
    return Boolean(providedSecret);
  }

  return providedSecret === secret;
};

const createTransporter = () =>
  nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER || 'golprobd@gmail.com',
      pass: process.env.EMAIL_PASS,
    },
  });

const sendBirthdayMail = async ({
  transporter,
  recipientEmail,
  recipientName,
  recipientImageUrl,
  contents,
  baseUrl,
  siteLogoUrl,
  backgroundImageUrl,
}: {
  transporter: ReturnType<typeof createTransporter>;
  recipientEmail: string;
  recipientName: string;
  recipientImageUrl?: string;
  contents: BirthdayContent[];
  baseUrl: string;
  siteLogoUrl: string;
  backgroundImageUrl: string;
}) => {
  const html = buildBirthdayMailHtml({
    author: { fullName: recipientName, email: recipientEmail, imageUrl: recipientImageUrl },
    contents,
    baseUrl,
    siteLogoUrl,
    backgroundImageUrl,
  });

  const text = buildBirthdayMailText({
    author: { fullName: recipientName, email: recipientEmail },
    contents,
    baseUrl,
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER || 'golprobd@gmail.com',
    to: recipientEmail,
    subject: `Happy Birthday, ${recipientName}!`,
    text,
    html,
  });
};

export async function GET(req: Request) {
  if (!isAuthorizedCronCall(req)) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  await connectDB();

  const timeZone = process.env.BIRTHDAY_TIMEZONE || 'Asia/Dhaka';
  const baseUrl = getBaseUrl(req);
  const siteLogoUrl = 'https://i.ibb.co.com/7d2BRkhh/golpro-logo.webp';
  const backgroundImageUrl = 'https://i.ibb.co.com/vC01wvt2/golproseo.webp';
  const today = new Date();
  const currentMonthDay = getMonthDay(today, timeZone);
  const currentYear = new Intl.DateTimeFormat('en-GB', { timeZone, year: 'numeric' }).format(today);
  const currentYearNumber = Number(currentYear);

  const authors = (await Authors.find({}).lean()) as unknown as BirthdayAuthor[];
  const matchingAuthors = authors.filter((author) => {
    if (!author.email || !author.dateOfBirth) {
      return false;
    }

    if (author.birthdayMailLastSentYear === currentYearNumber) {
      return false;
    }

    return getMonthDay(new Date(author.dateOfBirth), timeZone) === currentMonthDay;
  });

  const transporter = createTransporter();
  const results = await Promise.all(
    matchingAuthors.map(async (author) => {
      const previewContents = await getBirthdayMailContents(author.authorId);

      await sendBirthdayMail({
        transporter,
        recipientEmail: author.email,
        recipientName: author.fullName,
        recipientImageUrl: author.imageUrl,
        contents: previewContents,
        baseUrl,
        siteLogoUrl,
        backgroundImageUrl,
      });

      await Authors.updateOne(
        { authorId: author.authorId },
        { $set: { birthdayMailLastSentYear: currentYearNumber } }
      );

      return {
        authorId: author.authorId,
        email: author.email,
        contentsSent: previewContents.length,
      };
    })
  );

  return NextResponse.json(
    {
      message: 'Birthday mail job completed',
      timezone: timeZone,
      date: currentMonthDay,
      matchedAuthors: matchingAuthors.length,
      sent: results,
    },
    { status: 200 }
  );
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session?.user?.email !== 'protik0939@gmail.com') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  await connectDB();

  const baseUrl = getBaseUrl(req);
  const siteLogoUrl = 'https://i.ibb.co.com/7d2BRkhh/golpro-logo.webp';
  const backgroundImageUrl = 'https://i.ibb.co.com/vC01wvt2/golproseo.webp';
  const transporter = createTransporter();

  const body = await req.json().catch(() => ({}));
  const recipientEmail = typeof body?.recipientEmail === 'string' ? body.recipientEmail.trim() : '';
  const recipientName = typeof body?.recipientName === 'string' ? body.recipientName.trim() : '';
  const recipientImageUrl = typeof body?.recipientImageUrl === 'string' ? body.recipientImageUrl.trim() : '';
  const authorId = typeof body?.authorId === 'string' ? body.authorId.trim() : '';

  if (!recipientEmail) {
    return NextResponse.json({ message: 'Recipient email is required' }, { status: 400 });
  }

  const contents = await getBirthdayMailContents(authorId || undefined);

  await sendBirthdayMail({
    transporter,
    recipientEmail,
    recipientName: recipientName || recipientEmail.split('@')[0],
    recipientImageUrl: recipientImageUrl || undefined,
    contents,
    baseUrl,
    siteLogoUrl,
    backgroundImageUrl,
  });

  return NextResponse.json(
    {
      message: 'Birthday email sent',
      recipientEmail,
      contentsSent: contents.length,
    },
    { status: 200 }
  );
}