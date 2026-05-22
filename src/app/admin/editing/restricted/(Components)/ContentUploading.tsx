'use client'

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import ContentAddingForm, { type ContentFormContent } from './ContentAddingForm';
import SeasonAddingForm from './SeasonAddingForm';
import EpisodeAddingForm from './EpisodeAddingForm';
import GenreAddingForm from './GenreAddingForm';
import AuthorAddingForm from './AuthorAddingForm';
import { buildBirthdayMailHtml } from '@/app/lib/birthday-mail';

type TabKey = 'content' | 'seasons' | 'episodes' | 'genre' | 'authors';

type ContentListResponse = {
  contents: ContentFormContent[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
};

type AuthorListItem = {
  authorId: string;
  fullName: string;
  email?: string;
  imageUrl?: string;
};

type BirthdayMailComposerState = {
  authorId: string;
  recipientName: string;
  recipientEmail: string;
  recipientImageUrl: string;
};

type BirthdayMailPreviewContent = {
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

const birthdayMailSiteLogoUrl = 'https://i.ibb.co.com/7d2BRkhh/golpro-logo.webp';
const birthdayMailBackgroundImageUrl = 'https://i.ibb.co.com/vC01wvt2/golproseo.webp';

const tabs: Array<{ key: TabKey; label: string }> = [
  { key: 'content', label: 'Content' },
  { key: 'seasons', label: 'Seasons' },
  { key: 'episodes', label: 'Episodes' },
  { key: 'genre', label: 'Genres' },
  { key: 'authors', label: 'Authors' },
];

export default function ContentUploading() {
  const [forms, setForms] = useState<TabKey>('content');
  const [contents, setContents] = useState<ContentFormContent[]>([]);
  const [selectedContent, setSelectedContent] = useState<ContentFormContent | null>(null);
  const [authors, setAuthors] = useState<AuthorListItem[]>([]);
  const [authorWorks, setAuthorWorks] = useState<BirthdayMailPreviewContent[]>([]);
  const [birthdayMailComposer, setBirthdayMailComposer] = useState<BirthdayMailComposerState>({
    authorId: '',
    recipientName: '',
    recipientEmail: '',
    recipientImageUrl: '',
  });
  const [loadingContents, setLoadingContents] = useState(false);
  const [loadingError, setLoadingError] = useState('');
  const [loadingAuthors, setLoadingAuthors] = useState(false);
  const [authorLoadError, setAuthorLoadError] = useState('');
  const [loadingAuthorWorks, setLoadingAuthorWorks] = useState(false);
  const [authorWorksError, setAuthorWorksError] = useState('');
  const [page, setPage] = useState(1);
  const [refreshIndex, setRefreshIndex] = useState(0);
  const [sendingBirthdayMail, setSendingBirthdayMail] = useState(false);
  const [birthdayMailMessage, setBirthdayMailMessage] = useState('');
  const [showMailPreview, setShowMailPreview] = useState(false);
  const pageSize = 8;
  const [pagination, setPagination] = useState({ page: 1, limit: pageSize, totalItems: 0, totalPages: 1 });

  const { data: session, status } = useSession();
  const router = useRouter();

  const isAdmin = session?.user?.email === 'protik0939@gmail.com';

  useEffect(() => {
    if (status === 'authenticated' && !isAdmin) {
      router.replace('/');
    }
  }, [status, isAdmin, router]);

  useEffect(() => {
    if (!isAdmin || forms !== 'content') {
      return;
    }

    const loadContents = async () => {
      setLoadingContents(true);
      setLoadingError('');

      try {
        const response = await fetch(`/api/contentcrud/contentget?page=${page}&limit=${pageSize}`);
        const result = (await response.json()) as ContentListResponse | { error?: string; message?: string };
        let resultMessage: string | undefined;

        if ('error' in result) {
          resultMessage = result.error;
        } else if ('message' in result) {
          resultMessage = result.message;
        }

        if (!response.ok) {
          throw new Error(resultMessage || 'Failed to load contents');
        }

        const payload = result as ContentListResponse;
        setContents(payload.contents ?? []);
        setPagination(payload.pagination ?? { page, limit: pageSize, totalItems: 0, totalPages: 1 });
      } catch (error) {
        setLoadingError(error instanceof Error ? error.message : 'Failed to load contents');
      } finally {
        setLoadingContents(false);
      }
    };

    void loadContents();
  }, [forms, isAdmin, page, refreshIndex]);

  useEffect(() => {
    if (!isAdmin) {
      return;
    }

    const loadAuthors = async () => {
      setLoadingAuthors(true);
      setAuthorLoadError('');

      try {
        const response = await fetch('/api/authorscrud/authorGet');
        const result = (await response.json()) as AuthorListItem[] | { error?: string; message?: string };
        let resultMessage: string | undefined;

        if (!Array.isArray(result)) {
          if ('error' in result) {
            resultMessage = result.error;
          } else if ('message' in result) {
            resultMessage = result.message;
          }
        }

        if (!response.ok) {
          throw new Error(resultMessage || 'Failed to load authors');
        }

        if (Array.isArray(result)) {
          setAuthors(result);
        } else {
          setAuthors([]);
        }
      } catch (error) {
        setAuthorLoadError(error instanceof Error ? error.message : 'Failed to load authors');
      } finally {
        setLoadingAuthors(false);
      }
    };

    void loadAuthors();
  }, [isAdmin]);

  const refreshContents = () => {
    setRefreshIndex((currentValue) => currentValue + 1);
  };

  const handleDeleteContent = async (contentId: string) => {
    if (!session?.user?.email) {
      return;
    }

    const confirmed = globalThis.confirm(`Delete content ${contentId}?`);
    if (!confirmed) {
      return;
    }

    const response = await fetch(`/api/contentcrud/${contentId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ emeil: session.user.email }),
    });

    if (!response.ok) {
      const error = (await response.json()) as { error?: string; message?: string };
      setLoadingError(error.error || error.message || 'Failed to delete content');
      return;
    }

    if (selectedContent?.cId === contentId) {
      setSelectedContent(null);
    }

    refreshContents();
  };

  const handleSelectBirthdayAuthor = (authorId: string) => {
    const selectedAuthor = authors.find((author) => author.authorId === authorId);
    setBirthdayMailComposer({
      authorId,
      recipientName: selectedAuthor?.fullName || '',
      recipientEmail: selectedAuthor?.email || '',
      recipientImageUrl: selectedAuthor?.imageUrl || '',
    });
    setBirthdayMailMessage('');
    setShowMailPreview(false);
    void loadAuthorWorks(authorId);
  };

  const loadAuthorWorks = async (authorId: string) => {
    if (!authorId) {
      setAuthorWorks([]);
      setAuthorWorksError('');
      return;
    }

    setLoadingAuthorWorks(true);
    setAuthorWorksError('');

    try {
      const response = await fetch(`/api/contentcrud/byAuthor/${authorId}`);
      const result = (await response.json()) as BirthdayMailPreviewContent[] | { message?: string; error?: string };

      if (response.status === 404) {
        setAuthorWorks([]);
        return;
      }

      if (!response.ok) {
        let errorMessage: string | undefined;

        if ('error' in result) {
          errorMessage = result.error;
        } else if ('message' in result) {
          errorMessage = result.message;
        }

        throw new Error(errorMessage || 'Failed to load author works');
      }

      setAuthorWorks(Array.isArray(result) ? result : []);
    } catch (error) {
      setAuthorWorksError(error instanceof Error ? error.message : 'Failed to load author works');
      setAuthorWorks([]);
    } finally {
      setLoadingAuthorWorks(false);
    }
  };

  const handleOpenBirthdayPreview = () => {
    setShowMailPreview(true);
  };

  const handleSendBirthdayMail = async () => {
    setSendingBirthdayMail(true);
    setBirthdayMailMessage('');

    try {
      const response = await fetch('/api/cron/birthday-mail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          authorId: birthdayMailComposer.authorId,
          recipientEmail: birthdayMailComposer.recipientEmail,
          recipientName: birthdayMailComposer.recipientName,
          recipientImageUrl: birthdayMailComposer.recipientImageUrl,
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result?.message || result?.error || 'Failed to send debug mail');
      }

      setBirthdayMailMessage(`Mail sent to ${result?.recipientEmail || birthdayMailComposer.recipientEmail}`);
    } catch (error) {
      setBirthdayMailMessage(error instanceof Error ? error.message : 'Failed to send mail');
    } finally {
      setSendingBirthdayMail(false);
    }
  };

  if (status === 'loading') {
    return <div className='flex min-h-screen items-center justify-center'>Loading...</div>;
  }

  if (!isAdmin) {
    return <div className='flex min-h-screen items-center justify-center'>Access restricted.</div>;
  }

  const totalPages = Math.max(pagination.totalPages, 1);
  let contentGrid: React.ReactNode;
  let authorWorksPreview: React.ReactNode;
  const tabButtons = tabs.map((tab) => {
    let currentTabClass = 'btn-ghost';
    if (forms === tab.key) {
      currentTabClass = 'btn-primary';
    }

    return (
      <button key={tab.key} onClick={() => setForms(tab.key)} className={`btn btn-sm flex-1 min-w-28 ${currentTabClass}`} type='button'>
        {tab.label}
      </button>
    );
  });

  let contentFormMode: 'edit' | 'create' = 'create';
  if (selectedContent) {
    contentFormMode = 'edit';
  }

  let birthdayMailButtonLabel = 'Send birthday mail';
  if (sendingBirthdayMail) {
    birthdayMailButtonLabel = 'Sending mail...';
  }

  const isContentTab = forms === 'content';
  const previewBaseUrl = '';
  const birthdayMailPreviewHtml = buildBirthdayMailHtml({
    author: {
      fullName: birthdayMailComposer.recipientName || 'Recipient',
      email: birthdayMailComposer.recipientEmail || 'recipient@example.com',
      imageUrl: birthdayMailComposer.recipientImageUrl || undefined,
    },
    contents: authorWorks,
    baseUrl: previewBaseUrl,
    siteLogoUrl: birthdayMailSiteLogoUrl,
    backgroundImageUrl: birthdayMailBackgroundImageUrl,
  });

  if (loadingContents) {
    contentGrid = <div className='flex min-h-48 items-center justify-center rounded-2xl border border-dashed border-base-300 text-base-content/60'>Loading contents...</div>;
  } else if (contents.length > 0) {
    contentGrid = contents.map((content) => (
      <article key={content.cId} className='grid gap-4 rounded-2xl border border-base-300 bg-base-200/40 p-4 sm:grid-cols-[160px_1fr]'>
        <div className='overflow-hidden rounded-2xl bg-base-300'>
          <Image
            src={content.cLandscape || content.cBanner || content.cCard || content.cPortrait || content.cLogo || content.cSquare || 'https://placehold.co/400x225?text=No+Image'}
            alt={content.cTitle || content.cId}
            width={400}
            height={225}
            unoptimized
            className='h-40 w-full object-cover'
          />
        </div>
        <div className='flex flex-col gap-3'>
          <div className='flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between'>
            <div>
              <div className='flex flex-wrap gap-2'>
                <span className='badge badge-primary badge-sm'>{content.cContentType || 'content'}</span>
                <span className='badge badge-outline badge-sm'>{content.cId}</span>
              </div>
              <h3 className='mt-2 text-xl font-semibold'>{content.cTitle}</h3>
              <p className='line-clamp-3 text-sm text-base-content/70'>{content.cDescription}</p>
            </div>
            <div className='flex gap-2'>
              <button type='button' className='btn btn-outline btn-sm' onClick={() => setSelectedContent(content)}>
                Edit
              </button>
              <button type='button' className='btn btn-error btn-sm' onClick={() => handleDeleteContent(content.cId)}>
                Delete
              </button>
            </div>
          </div>

          <div className='flex flex-wrap gap-2 text-xs text-base-content/60'>
            <span>Genres: {Array.isArray(content.cGenre) ? content.cGenre.length : 0}</span>
            <span>Authors: {Array.isArray(content.cAuthors) ? content.cAuthors.length : 0}</span>
            <span>Visits: {content.cUserVisit ?? 0}</span>
          </div>
        </div>
      </article>
    ));
  } else {
    contentGrid = <div className='flex min-h-48 items-center justify-center rounded-2xl border border-dashed border-base-300 text-base-content/60'>No contents found for this page.</div>;
  }

  if (loadingAuthorWorks) {
    authorWorksPreview = <div className='mt-4 flex min-h-32 items-center justify-center rounded-2xl border border-dashed border-base-300 text-base-content/60'>Loading works...</div>;
  } else if (authorWorksError) {
    authorWorksPreview = <div className='mt-4 alert alert-error text-sm'>{authorWorksError}</div>;
  } else if (authorWorks.length > 0) {
    authorWorksPreview = (
      <div className='mt-4 grid gap-3 md:grid-cols-2'>
        {authorWorks.map((work) => {
          const workImage = work.cLandscape || work.cBanner || work.cCard || work.cPortrait || work.cLogo || work.cSquare || 'https://placehold.co/400x225?text=No+Image';

          return (
            <article key={work.cId} className='overflow-hidden rounded-2xl border border-base-300 bg-base-200/40'>
              <div className='relative aspect-video overflow-hidden'>
                <Image src={workImage} alt={work.cTitle} fill unoptimized className='object-cover' />
                <div className='absolute bottom-3 left-3 rounded-xl bg-black/70 px-3 py-2 text-xs font-semibold text-white backdrop-blur'>
                  {work.cContentType || 'content'}
                </div>
              </div>
              <div className='space-y-1 p-3'>
                   <p className='text-sm font-semibold uppercase tracking-[0.2em] text-primary'>Birthday mail sender</p>
                   <p className='text-sm text-base-content/70'>Pick an author, review the recipient details, preview the final mail, and send it immediately.</p>
              </div>
            </article>
          );
        })}
      </div>
    );
  } else {
    authorWorksPreview = <div className='mt-4 rounded-2xl border border-dashed border-base-300 p-4 text-sm text-base-content/60'>No works were found for this author yet.</div>;
  }

  return (
    <div className='min-h-screen bg-gradient-to-b from-base-200 via-base-100 to-base-200 px-4 py-8 sm:px-6 lg:px-8'>
      <div className='mx-auto max-w-7xl space-y-6 pt-10'>
        <header className='rounded-3xl border border-base-300 bg-base-100 p-6 shadow-xl shadow-black/5 sm:p-8'>
          <div className='flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between'>
            <div className='max-w-3xl space-y-2'>
              <p className='text-sm font-semibold uppercase tracking-[0.25em] text-primary'>Admin studio</p>
              <h1 className='text-3xl font-black tracking-tight sm:text-4xl'>Content uploading and management</h1>
              <p className='text-sm text-base-content/70 sm:text-base'>Create, edit, remove, and review published content from a single responsive workspace with paginated loading.</p>
            </div>
            <div className='grid grid-cols-2 gap-3 sm:grid-cols-4 lg:min-w-[28rem]'>
              <div className='rounded-2xl border border-base-300 bg-base-200/60 p-4'>
                <div className='text-xs uppercase tracking-[0.2em] text-base-content/50'>Visible</div>
                <div className='mt-2 text-2xl font-bold'>{contents.length}</div>
              </div>
              <div className='rounded-2xl border border-base-300 bg-base-200/60 p-4'>
                <div className='text-xs uppercase tracking-[0.2em] text-base-content/50'>Page</div>
                <div className='mt-2 text-2xl font-bold'>{pagination.page}/{totalPages}</div>
              </div>
              <div className='rounded-2xl border border-base-300 bg-base-200/60 p-4'>
                <div className='text-xs uppercase tracking-[0.2em] text-base-content/50'>Total</div>
                <div className='mt-2 text-2xl font-bold'>{pagination.totalItems}</div>
              </div>
              <div className='rounded-2xl border border-base-300 bg-base-200/60 p-4'>
                <div className='text-xs uppercase tracking-[0.2em] text-base-content/50'>Mode</div>
                <div className='mt-2 text-lg font-semibold capitalize'>{forms}</div>
              </div>
            </div>
          </div>
          <div className='mt-4 rounded-2xl border border-base-300 bg-base-200/40 p-4'>
            <div className='flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between'>
              <div className='space-y-1'>
                <p className='text-sm font-semibold uppercase tracking-[0.2em] text-primary'>Manual mail sender</p>
                <p className='text-sm text-base-content/70'>Pick an author, edit the recipient email if needed, then send the birthday mail manually.</p>
              </div>
              <button
                type='button'
                className='btn btn-secondary btn-sm'
                onClick={handleSendBirthdayMail}
                disabled={sendingBirthdayMail || !birthdayMailComposer.recipientEmail.trim()}
              >
                {birthdayMailButtonLabel}
              </button>
              <button type='button' className='btn btn-outline btn-sm' onClick={handleOpenBirthdayPreview} disabled={!birthdayMailComposer.authorId}>
                Preview mail template
              </button>
            </div>

            <div className='mt-4 grid gap-4 lg:grid-cols-[1fr_1fr]'>
              <label className='form-control w-full'>
                <span className='label-text font-medium'>Author</span>
                <select
                  className='select select-bordered w-full'
                  value={birthdayMailComposer.authorId}
                  onChange={(e) => handleSelectBirthdayAuthor(e.target.value)}
                >
                  <option value=''>Select an author</option>
                  {authors.map((author) => (
                    <option key={author.authorId} value={author.authorId}>
                      {author.fullName} ({author.authorId})
                    </option>
                  ))}
                </select>
                {loadingAuthors && <span className='mt-2 text-xs text-base-content/60'>Loading authors...</span>}
                {authorLoadError && <span className='mt-2 text-xs text-error'>{authorLoadError}</span>}
              </label>

              <label className='form-control w-full'>
                <span className='label-text font-medium'>Recipient name</span>
                <input
                  className='input input-bordered w-full'
                  value={birthdayMailComposer.recipientName}
                  onChange={(e) => setBirthdayMailComposer({ ...birthdayMailComposer, recipientName: e.target.value })}
                  placeholder='Enter recipient name'
                />
              </label>

              <label className='form-control w-full'>
                <span className='label-text font-medium'>Recipient email</span>
                <input
                  type='email'
                  className='input input-bordered w-full'
                  value={birthdayMailComposer.recipientEmail}
                  onChange={(e) => setBirthdayMailComposer({ ...birthdayMailComposer, recipientEmail: e.target.value })}
                  placeholder='Enter recipient email'
                />
              </label>

              <label className='form-control w-full'>
                <span className='label-text font-medium'>Recipient image URL</span>
                <input
                  className='input input-bordered w-full'
                  value={birthdayMailComposer.recipientImageUrl}
                  onChange={(e) => setBirthdayMailComposer({ ...birthdayMailComposer, recipientImageUrl: e.target.value })}
                  placeholder='Optional author image URL'
                />
              </label>
            </div>

            <div className='mt-4 rounded-2xl border border-base-300 bg-base-100 p-4'>
              <div className='flex items-center justify-between gap-3'>
                <div>
                  <div className='text-sm font-semibold uppercase tracking-[0.2em] text-primary'>Auto preview</div>
                  <div className='text-sm text-base-content/70'>These works will be attached to the mail for the selected author.</div>
                </div>
                <div className='text-xs text-base-content/60'>{authorWorks.length} works</div>
              </div>

              {authorWorksPreview}
            </div>

            {birthdayMailMessage && <div className='mt-4 alert alert-info text-sm'>{birthdayMailMessage}</div>}
          </div>
        </header>

        <nav className='flex flex-wrap gap-2 rounded-3xl border border-base-300 bg-base-100 p-2 shadow-lg shadow-black/5'>
          {tabButtons}
        </nav>

        {isContentTab && (
          <div className='grid gap-6 xl:grid-cols-[1.1fr_0.9fr]'>
            <section className='space-y-4 rounded-3xl border border-base-300 bg-base-100/90 p-5 shadow-xl shadow-black/5 backdrop-blur sm:p-6'>
              <div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
                <div>
                  <h2 className='text-2xl font-bold'>Published contents</h2>
                  <p className='text-sm text-base-content/70'>Browse the latest records and jump straight into edit mode.</p>
                </div>
                <div className='flex gap-2'>
                  <button className='btn btn-ghost btn-sm' onClick={refreshContents} type='button'>
                    Refresh
                  </button>
                </div>
              </div>

              {loadingError && <div className='alert alert-error text-sm'>{loadingError}</div>}

              <div className='space-y-3'>{contentGrid}</div>

              <div className='flex flex-col gap-3 border-t border-base-300 pt-4 sm:flex-row sm:items-center sm:justify-between'>
                <div className='text-sm text-base-content/70'>
                  Showing {contents.length} of {pagination.totalItems} contents
                </div>
                <div className='join self-start sm:self-auto'>
                  <button
                    className='btn join-item btn-sm'
                    type='button'
                    disabled={page <= 1}
                    onClick={() => setPage((currentPage) => Math.max(1, currentPage - 1))}
                  >
                    Previous
                  </button>
                  <button className='btn join-item btn-sm btn-ghost pointer-events-none' type='button'>
                    {pagination.page} / {totalPages}
                  </button>
                  <button
                    className='btn join-item btn-sm'
                    type='button'
                    disabled={page >= totalPages}
                    onClick={() => setPage((currentPage) => Math.min(totalPages, currentPage + 1))}
                  >
                    Next
                  </button>
                </div>
              </div>
            </section>

            <div className='space-y-4'>
              <ContentAddingForm
                email={session?.user?.email ?? ''}
                  mode={contentFormMode}
                content={selectedContent}
                onSaved={() => {
                  setSelectedContent(null);
                  refreshContents();
                }}
                onCancel={() => setSelectedContent(null)}
              />
            </div>
          </div>
        )}

        {forms === 'seasons' && <SeasonAddingForm email={session?.user?.email ?? ''} />}
        {forms === 'episodes' && <EpisodeAddingForm email={session?.user?.email ?? ''} />}
        {forms === 'genre' && <GenreAddingForm email={session?.user?.email ?? ''} />}
        {forms === 'authors' && <AuthorAddingForm email={session?.user?.email ?? ''} />}

        {showMailPreview && (
          <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4'>
            <div className='flex h-[90vh] w-full max-w-6xl flex-col overflow-hidden rounded-3xl border border-base-300 bg-base-100 shadow-2xl shadow-black/40'>
              <div className='flex items-center justify-between gap-3 border-b border-base-300 px-4 py-3 sm:px-6'>
                <div>
                  <div className='text-sm font-semibold uppercase tracking-[0.2em] text-primary'>Mail preview</div>
                  <div className='text-sm text-base-content/70'>Review the full birthday email before sending.</div>
                </div>
                <button type='button' className='btn btn-ghost btn-sm' onClick={() => setShowMailPreview(false)}>
                  Close
                </button>
              </div>
              <div className='flex-1 bg-base-200 p-3 sm:p-4'>
                <iframe title='Birthday mail preview' className='h-full w-full rounded-2xl border border-base-300 bg-white' srcDoc={birthdayMailPreviewHtml} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}