'use client'

import React, { useEffect, useState, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import ContentAddingForm, { type ContentFormContent } from './ContentAddingForm';
import SeasonAddingForm from './SeasonAddingForm';
import EpisodeAddingForm from './EpisodeAddingForm';
import GenreAddingForm from './GenreAddingForm';
import AuthorAddingForm from './AuthorAddingForm';
import { buildBirthdayMailHtml } from '@/app/lib/birthday-mail';
import { FiFilm, FiLayers, FiRadio, FiTag, FiUsers, FiMail, FiSearch, FiRefreshCw, FiEdit2, FiTrash2, FiEye, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

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

const tabs: Array<{ key: TabKey; label: string; icon: React.ElementType }> = [
  { key: 'content', label: 'Contents', icon: FiFilm },
  { key: 'seasons', label: 'Seasons', icon: FiLayers },
  { key: 'episodes', label: 'Episodes', icon: FiRadio },
  { key: 'genre', label: 'Genres', icon: FiTag },
  { key: 'authors', label: 'Authors', icon: FiUsers },
];

export default function ContentUploading() {
  const [forms, setForms] = useState<TabKey>('content');
  const [contents, setContents] = useState<ContentFormContent[]>([]);
  const [selectedContent, setSelectedContent] = useState<ContentFormContent | null>(null);
  const [viewingContent, setViewingContent] = useState<ContentFormContent | null>(null);
  const [deletingContent, setDeletingContent] = useState<ContentFormContent | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [contentTypeFilter, setContentTypeFilter] = useState('all');

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
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const pageSize = 8;
  const [pagination, setPagination] = useState({ page: 1, limit: pageSize, totalItems: 0, totalPages: 1 });

  const { data: session, status } = useSession();
  const router = useRouter();

  const isAdmin = session?.user?.email === 'protik0939@gmail.com';

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

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

  const confirmDeleteContent = async () => {
    if (!deletingContent || !session?.user?.email) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/contentcrud/${deletingContent.cId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ emeil: session.user.email }),
      });

      if (!response.ok) {
        const error = (await response.json()) as { error?: string; message?: string };
        throw new Error(error.error || error.message || 'Failed to delete content');
      }

      showToast(`Content "${deletingContent.cTitle || deletingContent.cId}" deleted successfully.`, 'success');
      if (selectedContent?.cId === deletingContent.cId) {
        setSelectedContent(null);
      }
      setDeletingContent(null);
      refreshContents();
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Failed to delete content', 'error');
    } finally {
      setIsDeleting(false);
    }
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
        throw new Error(result?.message || result?.error || 'Failed to send mail');
      }

      const msg = `Mail sent successfully to ${result?.recipientEmail || birthdayMailComposer.recipientEmail}`;
      setBirthdayMailMessage(msg);
      showToast(msg, 'success');
    } catch (error) {
      const err = error instanceof Error ? error.message : 'Failed to send mail';
      setBirthdayMailMessage(err);
      showToast(err, 'error');
    } finally {
      setSendingBirthdayMail(false);
    }
  };

  const filteredContents = useMemo(() => {
    return contents.filter((content) => {
      const matchesSearch =
        searchQuery.trim() === '' ||
        (content.cTitle || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (content.cId || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (content.cDescription || '').toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType =
        contentTypeFilter === 'all' || (content.cContentType || '').toLowerCase() === contentTypeFilter.toLowerCase();

      return matchesSearch && matchesType;
    });
  }, [contents, searchQuery, contentTypeFilter]);

  if (status === 'loading') {
    return (
      <div className='flex min-h-screen items-center justify-center bg-base-300'>
        <div className='flex flex-col items-center gap-3'>
          <span className='loading loading-spinner loading-lg text-primary'></span>
          <p className='text-sm text-base-content/70'>Authenticating Admin Studio...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-base-300 p-4'>
        <div className='card max-w-md bg-base-100 p-6 shadow-xl text-center space-y-4'>
          <FiAlertCircle className='mx-auto h-12 w-12 text-error' />
          <h2 className='text-2xl font-bold'>Access Restricted</h2>
          <p className='text-sm text-base-content/70'>You must be logged in as an administrator to access the Studio panel.</p>
          <button onClick={() => router.push('/')} className='btn btn-primary btn-sm mx-auto'>Return to Home</button>
        </div>
      </div>
    );
  }

  const totalPages = Math.max(pagination.totalPages, 1);

  const birthdayMailPreviewHtml = buildBirthdayMailHtml({
    author: {
      fullName: birthdayMailComposer.recipientName || 'Recipient',
      email: birthdayMailComposer.recipientEmail || 'recipient@example.com',
      imageUrl: birthdayMailComposer.recipientImageUrl || undefined,
    },
    contents: authorWorks,
    baseUrl: '',
    siteLogoUrl: birthdayMailSiteLogoUrl,
    backgroundImageUrl: birthdayMailBackgroundImageUrl,
  });

  return (
    <div className='min-h-screen bg-gradient-to-br from-base-300 via-base-200 to-base-300 px-4 py-8 sm:px-6 lg:px-8'>
      {/* Toast Notification */}
      {toast && (
        <div className='toast toast-top toast-end z-50'>
          <div className={`alert ${toast.type === 'success' ? 'alert-success' : 'alert-error'} shadow-lg text-white flex items-center gap-2`}>
            {toast.type === 'success' ? <FiCheckCircle /> : <FiAlertCircle />}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      <div className='mx-auto max-w-7xl space-y-6 pt-4'>
        {/* Header Dashboard Banner */}
        <header className='relative overflow-hidden rounded-3xl border border-base-300 bg-base-100 p-6 shadow-2xl sm:p-8 backdrop-blur-md'>
          <div className='absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl pointer-events-none'></div>
          <div className='flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between'>
            <div className='max-w-2xl space-y-2'>
              <div className='inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary'>
                <span className='h-2 w-2 rounded-full bg-primary animate-pulse'></span>
                GOLPRO Studio Hub
              </div>
              <h1 className='text-3xl font-black tracking-tight sm:text-4xl bg-gradient-to-r from-base-content to-base-content/70 bg-clip-text text-transparent'>
                Admin Control Center
              </h1>
              <p className='text-sm text-base-content/70 sm:text-base'>
                Manage content, seasons, episodes, genres, authors, and email dispatchers from a unified full-CRUD studio workspace.
              </p>
            </div>

            {/* Quick Metrics Cards */}
            <div className='grid grid-cols-2 gap-3 sm:grid-cols-3 lg:min-w-[24rem]'>
              <div className='rounded-2xl border border-base-300 bg-base-200/50 p-4 backdrop-blur'>
                <div className='flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-base-content/50'>
                  <FiFilm className='text-primary' /> Visible Records
                </div>
                <div className='mt-2 text-2xl font-black text-primary'>{pagination.totalItems}</div>
              </div>
              <div className='rounded-2xl border border-base-300 bg-base-200/50 p-4 backdrop-blur'>
                <div className='flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-base-content/50'>
                  <FiUsers className='text-secondary' /> Registered Authors
                </div>
                <div className='mt-2 text-2xl font-black text-secondary'>{authors.length}</div>
              </div>
              <div className='col-span-2 sm:col-span-1 rounded-2xl border border-base-300 bg-base-200/50 p-4 backdrop-blur'>
                <div className='flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-base-content/50'>
                  <FiLayers className='text-accent' /> Current Page
                </div>
                <div className='mt-2 text-2xl font-black text-accent'>{pagination.page} / {totalPages}</div>
              </div>
            </div>
          </div>
        </header>

        {/* Tab Navigation */}
        <nav className='flex overflow-x-auto gap-2 rounded-2xl border border-base-300 bg-base-100 p-2 shadow-lg backdrop-blur scrollbar-none'>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = forms === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setForms(tab.key)}
                className={`btn btn-sm flex-1 min-w-[120px] gap-2 transition-all ${
                  isActive ? 'btn-primary shadow-md' : 'btn-ghost hover:bg-base-200'
                }`}
                type='button'
              >
                <Icon className='h-4 w-4' />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* CONTENTS TAB */}
        {forms === 'content' && (
          <div className='grid gap-6 xl:grid-cols-[1.1fr_0.9fr]'>
            {/* Content List Section */}
            <section className='space-y-4 rounded-3xl border border-base-300 bg-base-100 p-5 shadow-xl sm:p-6'>
              <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
                <div>
                  <h2 className='text-2xl font-bold flex items-center gap-2'>
                    <FiFilm className='text-primary' /> Published Content
                  </h2>
                  <p className='text-sm text-base-content/70'>Search and manage audiobooks, drama, and digital content.</p>
                </div>
                <button className='btn btn-ghost btn-sm gap-2' onClick={refreshContents} type='button'>
                  <FiRefreshCw className={loadingContents ? 'animate-spin' : ''} /> Refresh
                </button>
              </div>

              {/* Search & Filter Bar */}
              <div className='grid gap-3 sm:grid-cols-[1fr_auto]'>
                <div className='relative'>
                  <FiSearch className='absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40' />
                  <input
                    type='text'
                    className='input input-bordered input-sm w-full pl-9'
                    placeholder='Search title, ID, or description...'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <select
                  className='select select-bordered select-sm'
                  value={contentTypeFilter}
                  onChange={(e) => setContentTypeFilter(e.target.value)}
                >
                  <option value='all'>All Types</option>
                  <option value='audiobook'>Audiobook</option>
                  <option value='podcast'>Podcast</option>
                  <option value='drama'>Drama</option>
                  <option value='series'>Series</option>
                </select>
              </div>

              {loadingError && <div className='alert alert-error text-sm'>{loadingError}</div>}

              {/* Contents Grid/List */}
              <div className='space-y-3 min-h-[300px]'>
                {loadingContents ? (
                  <div className='flex min-h-48 items-center justify-center rounded-2xl border border-dashed border-base-300 text-base-content/60'>
                    <span className='loading loading-dots loading-md text-primary'></span>
                  </div>
                ) : filteredContents.length > 0 ? (
                  filteredContents.map((content) => (
                    <article
                      key={content.cId}
                      className='group relative flex flex-col sm:flex-row gap-4 rounded-2xl border border-base-300 bg-base-200/40 p-4 transition-all hover:bg-base-200/80 hover:shadow-md'
                    >
                      <div className='relative h-36 w-full sm:w-44 shrink-0 overflow-hidden rounded-xl bg-base-300'>
                        <Image
                          src={
                            content.cLandscape ||
                            content.cBanner ||
                            content.cCard ||
                            content.cPortrait ||
                            content.cLogo ||
                            content.cSquare ||
                            'https://placehold.co/400x225?text=No+Image'
                          }
                          alt={content.cTitle || content.cId}
                          fill
                          unoptimized
                          className='object-cover transition-transform duration-300 group-hover:scale-105'
                        />
                      </div>
                      <div className='flex flex-1 flex-col justify-between gap-3'>
                        <div>
                          <div className='flex flex-wrap items-center gap-2'>
                            <span className='badge badge-primary badge-sm font-semibold capitalize'>
                              {content.cContentType || 'content'}
                            </span>
                            <span className='badge badge-outline badge-sm font-mono'>{content.cId}</span>
                          </div>
                          <h3 className='mt-2 text-lg font-bold text-base-content line-clamp-1'>{content.cTitle}</h3>
                          <p className='mt-1 text-xs text-base-content/70 line-clamp-2'>{content.cDescription}</p>
                        </div>

                        <div className='flex flex-wrap items-center justify-between gap-2 border-t border-base-300/50 pt-2'>
                          <div className='flex gap-3 text-xs text-base-content/60 font-medium'>
                            <span>Genres: {Array.isArray(content.cGenre) ? content.cGenre.length : 0}</span>
                            <span>Authors: {Array.isArray(content.cAuthors) ? content.cAuthors.length : 0}</span>
                            <span>Visits: {content.cUserVisit ?? 0}</span>
                          </div>
                          <div className='flex gap-1'>
                            <button
                              type='button'
                              className='btn btn-ghost btn-xs text-info gap-1'
                              title='View Details'
                              onClick={() => setViewingContent(content)}
                            >
                              <FiEye /> Details
                            </button>
                            <button
                              type='button'
                              className='btn btn-outline btn-xs gap-1'
                              onClick={() => setSelectedContent(content)}
                            >
                              <FiEdit2 /> Edit
                            </button>
                            <button
                              type='button'
                              className='btn btn-error btn-xs gap-1 text-white'
                              onClick={() => setDeletingContent(content)}
                            >
                              <FiTrash2 /> Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))
                ) : (
                  <div className='flex min-h-48 items-center justify-center rounded-2xl border border-dashed border-base-300 text-base-content/60'>
                    No content found matching your search.
                  </div>
                )}
              </div>

              {/* Pagination */}
              <div className='flex flex-col gap-3 border-t border-base-300 pt-4 sm:flex-row sm:items-center sm:justify-between'>
                <div className='text-xs text-base-content/70'>
                  Showing {filteredContents.length} of {pagination.totalItems} items (Page {pagination.page} of {totalPages})
                </div>
                <div className='join'>
                  <button
                    className='btn join-item btn-sm'
                    type='button'
                    disabled={page <= 1}
                    onClick={() => setPage((currentPage) => Math.max(1, currentPage - 1))}
                  >
                    Previous
                  </button>
                  <button className='btn join-item btn-sm btn-ghost pointer-events-none font-bold' type='button'>
                    {pagination.page}
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

            {/* Content Add/Edit Form */}
            <div className='space-y-4'>
              <ContentAddingForm
                email={session?.user?.email ?? ''}
                mode={selectedContent ? 'edit' : 'create'}
                content={selectedContent}
                onSaved={() => {
                  showToast(selectedContent ? 'Content updated successfully!' : 'New content created successfully!', 'success');
                  setSelectedContent(null);
                  refreshContents();
                }}
                onCancel={() => setSelectedContent(null)}
              />
            </div>
          </div>
        )}

        {/* OTHER ENTITY TABS */}
        {forms === 'seasons' && <SeasonAddingForm email={session?.user?.email ?? ''} />}
        {forms === 'episodes' && <EpisodeAddingForm email={session?.user?.email ?? ''} />}
        {forms === 'genre' && <GenreAddingForm email={session?.user?.email ?? ''} />}
        {forms === 'authors' && <AuthorAddingForm email={session?.user?.email ?? ''} />}

        {/* MAIL SENDER DISPATCHER CARD */}
        <section className='rounded-3xl border border-base-300 bg-base-100 p-6 shadow-xl space-y-4'>
          <div className='flex flex-col gap-2 border-b border-base-300 pb-4'>
            <div className='inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary'>
              <FiMail /> Automated Birthday Email Dispatcher
            </div>
            <h2 className='text-2xl font-bold'>Author Mail Studio</h2>
            <p className='text-sm text-base-content/70'>Select an author to test and dispatch personalized promotional birthday newsletters.</p>
          </div>

          <div className='grid gap-4 lg:grid-cols-4'>
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
              {loadingAuthors && <span className='mt-1 text-xs text-info'>Loading authors list...</span>}
              {authorLoadError && <span className='mt-1 text-xs text-error'>{authorLoadError}</span>}
            </label>

            <label className='form-control w-full'>
              <span className='label-text font-medium'>Recipient Name</span>
              <input
                className='input input-bordered w-full'
                value={birthdayMailComposer.recipientName}
                onChange={(e) => setBirthdayMailComposer({ ...birthdayMailComposer, recipientName: e.target.value })}
                placeholder='Recipient Name'
              />
            </label>

            <label className='form-control w-full'>
              <span className='label-text font-medium'>Recipient Email</span>
              <input
                type='email'
                className='input input-bordered w-full'
                value={birthdayMailComposer.recipientEmail}
                onChange={(e) => setBirthdayMailComposer({ ...birthdayMailComposer, recipientEmail: e.target.value })}
                placeholder='Recipient Email'
              />
            </label>

            <div className='flex items-end gap-2'>
              <button
                type='button'
                className='btn btn-primary flex-1'
                onClick={handleSendBirthdayMail}
                disabled={sendingBirthdayMail || !birthdayMailComposer.recipientEmail.trim()}
              >
                {sendingBirthdayMail ? <span className='loading loading-spinner loading-xs'></span> : <FiMail />} Send Mail
              </button>
              <button
                type='button'
                className='btn btn-outline'
                onClick={() => setShowMailPreview(true)}
                disabled={!birthdayMailComposer.authorId}
              >
                <FiEye /> Preview
              </button>
            </div>
          </div>

          {loadingAuthorWorks && <div className='text-xs text-info'>Loading author works preview...</div>}
          {authorWorksError && <div className='alert alert-error text-xs'>{authorWorksError}</div>}

          {birthdayMailMessage && <div className='alert alert-info text-sm'>{birthdayMailMessage}</div>}
        </section>

        {/* MODAL: VIEW DETAILS */}
        {viewingContent && (
          <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm'>
            <div className='card w-full max-w-2xl bg-base-100 p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto'>
              <div className='flex items-start justify-between border-b border-base-300 pb-3'>
                <div>
                  <span className='badge badge-primary text-xs capitalize'>{viewingContent.cContentType}</span>
                  <h3 className='text-2xl font-bold mt-1'>{viewingContent.cTitle}</h3>
                  <p className='text-xs font-mono text-base-content/60'>ID: {viewingContent.cId}</p>
                </div>
                <button className='btn btn-ghost btn-sm btn-circle' onClick={() => setViewingContent(null)}>✕</button>
              </div>

              <div className='relative h-56 w-full rounded-2xl bg-base-300 overflow-hidden'>
                <Image
                  src={viewingContent.cLandscape || viewingContent.cBanner || viewingContent.cCard || viewingContent.cPortrait || 'https://placehold.co/600x300'}
                  alt={viewingContent.cTitle || 'Content image'}
                  fill
                  unoptimized
                  className='object-cover'
                />
              </div>

              <div className='space-y-2'>
                <h4 className='font-semibold text-sm'>Description:</h4>
                <p className='text-sm text-base-content/80 whitespace-pre-line'>{viewingContent.cDescription || 'No description provided.'}</p>
              </div>

              <div className='grid grid-cols-2 gap-4 text-xs bg-base-200/50 p-4 rounded-2xl'>
                <div><span className='font-bold'>Visits:</span> {viewingContent.cUserVisit ?? 0}</div>
                <div><span className='font-bold'>Viewer Age:</span> {viewingContent.cViwersAge || 'All'}</div>
                <div><span className='font-bold'>Genres:</span> {Array.isArray(viewingContent.cGenre) ? viewingContent.cGenre.length : 0}</div>
                <div><span className='font-bold'>Authors:</span> {Array.isArray(viewingContent.cAuthors) ? viewingContent.cAuthors.length : 0}</div>
              </div>

              <div className='flex justify-end gap-2 border-t border-base-300 pt-3'>
                <button className='btn btn-ghost btn-sm' onClick={() => setViewingContent(null)}>Close</button>
                <button
                  className='btn btn-primary btn-sm'
                  onClick={() => {
                    setSelectedContent(viewingContent);
                    setViewingContent(null);
                  }}
                >
                  Edit Content
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: DELETE CONFIRMATION */}
        {deletingContent && (
          <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fadeIn'>
            <div className='card w-full max-w-md bg-base-100 p-6 shadow-2xl space-y-4 border border-base-300'>
              <div className='flex items-center gap-3 text-error'>
                <FiTrash2 className='h-8 w-8' />
                <h3 className='text-xl font-bold'>Confirm Content Deletion</h3>
              </div>
              <p className='text-sm text-base-content/80'>
                Are you sure you want to permanently delete <strong className='text-base-content'>{deletingContent.cTitle || deletingContent.cId}</strong>?
                This action cannot be undone.
              </p>
              <div className='flex justify-end gap-3 pt-2'>
                <button className='btn btn-ghost btn-sm' onClick={() => setDeletingContent(null)} disabled={isDeleting}>
                  Cancel
                </button>
                <button className='btn btn-error btn-sm text-white' onClick={confirmDeleteContent} disabled={isDeleting}>
                  {isDeleting ? <span className='loading loading-spinner loading-xs'></span> : 'Delete Content'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: MAIL PREVIEW */}
        {showMailPreview && (
          <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4'>
            <div className='flex h-[90vh] w-full max-w-6xl flex-col overflow-hidden rounded-3xl border border-base-300 bg-base-100 shadow-2xl'>
              <div className='flex items-center justify-between border-b border-base-300 px-6 py-4'>
                <div>
                  <div className='text-xs font-semibold uppercase tracking-wider text-primary'>Email Template Live Preview</div>
                  <div className='text-sm text-base-content/70'>Newsletter layout sent to selected author.</div>
                </div>
                <button type='button' className='btn btn-ghost btn-sm' onClick={() => setShowMailPreview(false)}>
                  Close
                </button>
              </div>
              <div className='flex-1 bg-base-200 p-4'>
                <iframe title='Birthday mail preview' className='h-full w-full rounded-2xl border border-base-300 bg-white' srcDoc={birthdayMailPreviewHtml} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}