'use client'

import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { IContent, ISeason } from '@/app/models/types';
import { FiLayers, FiSearch, FiEdit2, FiTrash2, FiPlus, FiFilm } from 'react-icons/fi';

type SeasonFormState = {
  email: string;
  contentId: string;
  cId: string;
  cNo: string;
  cTitle: string;
  cDescription: string;
  cLandscape: string;
  cPortrait: string;
  cBanner: string;
  cLogo: string;
  cCard: string;
  cSquare: string;
  cLink: string;
  cTrailerYtId: string;
  width: number;
  height: number;
  cEpisodes: object[];
};

const emptyState = (email: string): SeasonFormState => ({
  email,
  contentId: '',
  cId: '',
  cNo: '',
  cTitle: '',
  cDescription: '',
  cLandscape: '',
  cPortrait: '',
  cBanner: '',
  cLogo: '',
  cCard: '',
  cSquare: '',
  cLink: '',
  cTrailerYtId: '',
  width: 200,
  height: 200,
  cEpisodes: [],
});

type Props = Readonly<{ email: string }>;

export default function SeasonAddingForm({ email }: Props) {
  const imageBb: string = process.env.NEXT_PUBLIC_IMAGEBB_API_KEY ?? '';

  const [contents, setContents] = useState<IContent[]>([]);
  const [selectedContent, setSelectedContent] = useState<IContent | null>(null);
  const [formState, setFormState] = useState<SeasonFormState>(() => emptyState(email));
  const [mode, setMode] = useState<'create' | 'edit'>('create');
  const [selectedImages, setSelectedImages] = useState<{
    cLandscape?: File | null;
    cPortrait?: File | null;
    cBanner?: File | null;
    cLogo?: File | null;
    cCard?: File | null;
    cSquare?: File | null;
  }>({});
  const [statusMessage, setStatusMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingSeason, setDeletingSeason] = useState<ISeason | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [contentSearchQuery, setContentSearchQuery] = useState('');

  const loadContents = async () => {
    try {
      const response = await axios.get('/api/contentcrud/contentgetfull');
      setContents(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error('Failed to fetch contents:', err);
    }
  };

  useEffect(() => {
    void loadContents();
  }, []);

  const uploadToImageBB = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('key', imageBb);
    const response = await axios.post('https://api.imgbb.com/1/upload', formData);
    return response.data.data.url;
  };

  const seasons = useMemo(() => selectedContent?.cSeasons ?? [], [selectedContent]);

  const resetForm = () => {
    setMode('create');
    setFormState(emptyState(email));
    setSelectedImages({});
    setStatusMessage('');
  };

  const handleSelectContent = (contentId: string) => {
    const content = contents.find((item) => item.cId === contentId) || null;
    setSelectedContent(content);
    setMode('create');
    setFormState({
      ...emptyState(email),
      contentId,
      cTitle: content?.cTitle ?? '',
      cDescription: content?.cDescription ?? '',
      cLink: content?.cLink ?? '',
      cTrailerYtId: content?.cTrailerYtId ?? '',
    });
    setSelectedImages({});
    setStatusMessage('');
  };

  const handleEditSeason = (season: ISeason) => {
    if (!selectedContent) return;

    setMode('edit');
    setFormState({
      email,
      contentId: selectedContent.cId,
      cId: season.cId,
      cNo: season.cNo,
      cTitle: season.cTitle,
      cDescription: season.cDescription,
      cLandscape: season.cLandscape,
      cPortrait: season.cPortrait,
      cBanner: season.cBanner,
      cLogo: season.cLogo,
      cCard: season.cCard,
      cSquare: season.cSquare,
      cLink: season.cLink,
      cTrailerYtId: season.cTrailerYtId ?? '',
      width: season.width ?? 200,
      height: season.height ?? 200,
      cEpisodes: season.cEpisodes ?? [],
    });
    setSelectedImages({});
    setStatusMessage('');
  };

  const confirmDeleteSeason = async () => {
    if (!selectedContent || !deletingSeason) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/seasonscrud/${selectedContent.cId}/${deletingSeason.cId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result?.message || result?.error || 'Failed to delete season');
      }

      await loadContents();
      const refreshed = await axios.get('/api/contentcrud/contentgetfull');
      const updatedList = refreshed.data as IContent[];
      setContents(updatedList);
      setSelectedContent(updatedList.find((item: IContent) => item.cId === selectedContent.cId) || null);
      resetForm();
      setDeletingSeason(null);
    } catch (err) {
      setStatusMessage(err instanceof Error ? err.message : 'Delete failed');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formState.contentId) {
      setStatusMessage('Please select a parent Content first.');
      return;
    }

    setIsSubmitting(true);
    setStatusMessage('');

    try {
      const uploads = await Promise.all([
        selectedImages.cLandscape ? uploadToImageBB(selectedImages.cLandscape) : Promise.resolve(formState.cLandscape),
        selectedImages.cPortrait ? uploadToImageBB(selectedImages.cPortrait) : Promise.resolve(formState.cPortrait),
        selectedImages.cBanner ? uploadToImageBB(selectedImages.cBanner) : Promise.resolve(formState.cBanner),
        selectedImages.cLogo ? uploadToImageBB(selectedImages.cLogo) : Promise.resolve(formState.cLogo),
        selectedImages.cCard ? uploadToImageBB(selectedImages.cCard) : Promise.resolve(formState.cCard),
        selectedImages.cSquare ? uploadToImageBB(selectedImages.cSquare) : Promise.resolve(formState.cSquare),
      ]);

      const payload = {
        email,
        contentId: formState.contentId,
        cId: formState.cId,
        cNo: formState.cNo,
        cTitle: formState.cTitle,
        cDescription: formState.cDescription,
        cLandscape: uploads[0],
        cPortrait: uploads[1],
        cBanner: uploads[2],
        cLogo: uploads[3],
        cCard: uploads[4],
        cSquare: uploads[5],
        cLink: formState.cLink,
        cTrailerYtId: formState.cTrailerYtId,
        width: formState.width,
        height: formState.height,
        cEpisodes: formState.cEpisodes,
      };

      const response = await fetch(
        mode === 'edit'
          ? `/api/seasonscrud/${formState.contentId}/${formState.cId}`
          : '/api/seasonscrud/seasonspost',
        {
          method: mode === 'edit' ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result?.message || result?.error || 'Failed to save season');
      }

      setStatusMessage(result?.message || 'Season saved successfully');
      const refreshed = await axios.get('/api/contentcrud/contentgetfull');
      const updatedList = refreshed.data as IContent[];
      setContents(updatedList);
      setSelectedContent(updatedList.find((item: IContent) => item.cId === formState.contentId) || null);
      if (mode === 'create') {
        resetForm();
        setFormState((prev) => ({ ...prev, contentId: selectedContent?.cId ?? '' }));
      }
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredContentOptions = useMemo(() => {
    return contents.filter((c) => {
      const q = contentSearchQuery.toLowerCase().trim();
      return q === '' || (c.cTitle || '').toLowerCase().includes(q) || (c.cId || '').toLowerCase().includes(q);
    });
  }, [contents, contentSearchQuery]);

  return (
    <section className='rounded-3xl border border-base-300 bg-base-100 p-5 shadow-xl sm:p-6 space-y-6'>
      {/* Header */}
      <div className='flex flex-col gap-2 border-b border-base-300 pb-4 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <div className='inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-accent'>
            <FiLayers /> Season Hierarchy
          </div>
          <h2 className='text-2xl font-bold'>Season Manager</h2>
          <p className='text-sm text-base-content/70'>Organize and publish content seasons linked to parent titles.</p>
        </div>
        {mode === 'edit' && (
          <button type='button' className='btn btn-ghost btn-sm gap-1' onClick={resetForm}>
            <FiPlus /> Switch to Create Mode
          </button>
        )}
      </div>

      {/* Parent Content Selector Card */}
      <div className='rounded-2xl border border-accent/20 bg-accent/5 p-4 space-y-3'>
        <div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
          <label className='font-bold text-sm flex items-center gap-2 text-accent'>
            <FiFilm /> Step 1: Select Parent Content
          </label>
          <div className='relative w-full sm:w-64'>
            <FiSearch className='absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-base-content/40' />
            <input
              type='text'
              className='input input-bordered input-xs w-full pl-7'
              placeholder='Filter parent contents...'
              value={contentSearchQuery}
              onChange={(e) => setContentSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <select
          className='select select-bordered select-sm w-full font-medium'
          value={selectedContent?.cId || ''}
          onChange={(e) => handleSelectContent(e.target.value)}
        >
          <option value=''>Choose parent content record...</option>
          {filteredContentOptions.map((item) => (
            <option key={item.cId} value={item.cId}>
              {item.cTitle} ({item.cId}) — {item.cSeasons?.length || 0} Seasons
            </option>
          ))}
        </select>
      </div>

      {selectedContent && (
        <div className='grid gap-6 xl:grid-cols-[1fr_0.9fr]'>
          {/* Season Form */}
          <form className='space-y-4 rounded-2xl border border-base-300 bg-base-200/30 p-4' onSubmit={handleSubmit}>
            <h3 className='font-bold text-lg border-b border-base-300/50 pb-2'>
              {mode === 'edit' ? `Edit Season (${formState.cId})` : `Add New Season for ${selectedContent.cTitle}`}
            </h3>

            <div className='grid gap-4 md:grid-cols-2'>
              <label className='form-control w-full'>
                <span className='label-text font-medium'>Season ID</span>
                <input
                  className='input input-bordered w-full font-mono'
                  placeholder='e.g. s01'
                  value={formState.cId}
                  onChange={(e) => setFormState({ ...formState, cId: e.target.value })}
                  disabled={mode === 'edit'}
                />
              </label>
              <label className='form-control w-full'>
                <span className='label-text font-medium'>Season Number (cNo)</span>
                <input
                  className='input input-bordered w-full'
                  placeholder='e.g. 1'
                  value={formState.cNo}
                  onChange={(e) => setFormState({ ...formState, cNo: e.target.value })}
                />
              </label>
            </div>

            <div className='grid gap-4 md:grid-cols-2'>
              <label className='form-control w-full'>
                <span className='label-text font-medium'>Season Title</span>
                <input
                  className='input input-bordered w-full'
                  placeholder='Season Title'
                  value={formState.cTitle}
                  onChange={(e) => setFormState({ ...formState, cTitle: e.target.value })}
                />
              </label>
              <label className='form-control w-full'>
                <span className='label-text font-medium'>Trailer YouTube ID</span>
                <input
                  className='input input-bordered w-full'
                  placeholder='YouTube Video ID'
                  value={formState.cTrailerYtId}
                  onChange={(e) => setFormState({ ...formState, cTrailerYtId: e.target.value })}
                />
              </label>
            </div>

            <label className='form-control w-full'>
              <span className='label-text font-medium'>Season Description</span>
              <textarea
                className='textarea textarea-bordered min-h-24 w-full'
                placeholder='Season synopsis...'
                value={formState.cDescription}
                onChange={(e) => setFormState({ ...formState, cDescription: e.target.value })}
              />
            </label>

            {/* Image upload preview row */}
            <div className='grid gap-3 sm:grid-cols-3'>
              {(['cLandscape', 'cPortrait', 'cBanner'] as const).map((imgKey) => (
                <div key={imgKey} className='space-y-1 rounded-xl border border-base-300 bg-base-100 p-2 text-xs'>
                  <span className='font-semibold capitalize text-base-content/70'>{imgKey.replace('c', '')}</span>
                  {formState[imgKey] ? (
                    <div className='relative h-20 w-full rounded-lg overflow-hidden bg-base-300'>
                      <Image src={formState[imgKey]} alt={imgKey} fill unoptimized className='object-cover' />
                    </div>
                  ) : (
                    <div className='flex h-20 items-center justify-center rounded-lg border border-dashed border-base-300 text-[10px] text-base-content/40'>
                      No image
                    </div>
                  )}
                  <input
                    type='file'
                    className='file-input file-input-bordered file-input-xs w-full'
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setSelectedImages((prev) => ({ ...prev, [imgKey]: file }));
                      }
                    }}
                  />
                </div>
              ))}
            </div>

            {statusMessage && (
              <div className={`alert ${statusMessage.includes('successfully') ? 'alert-success text-white' : 'alert-error text-white'} text-sm`}>
                {statusMessage}
              </div>
            )}

            <div className='flex items-center justify-end gap-3 pt-2'>
              {mode === 'edit' && (
                <button type='button' className='btn btn-ghost btn-sm' onClick={resetForm}>
                  Cancel Edit
                </button>
              )}
              <button className='btn btn-accent btn-sm min-w-32' type='submit' disabled={isSubmitting}>
                {isSubmitting ? <span className='loading loading-spinner loading-xs'></span> : mode === 'edit' ? 'Update Season' : 'Publish Season'}
              </button>
            </div>
          </form>

          {/* Existing Seasons Grid */}
          <aside className='space-y-4 rounded-2xl border border-base-300 bg-base-200/30 p-4'>
            <div className='flex items-center justify-between border-b border-base-300/50 pb-2'>
              <h3 className='text-lg font-bold'>Seasons for &quot;{selectedContent.cTitle}&quot; ({seasons.length})</h3>
            </div>

            <div className='space-y-3 max-h-[500px] overflow-y-auto pr-1'>
              {seasons.length > 0 ? (
                seasons.map((season) => (
                  <article key={season.cId} className='flex gap-3 rounded-xl border border-base-300 bg-base-100 p-3 shadow-sm hover:shadow-md transition-shadow'>
                    <div className='relative h-20 w-28 shrink-0 overflow-hidden rounded-lg bg-base-300'>
                      <Image
                        src={season.cLandscape || season.cBanner || season.cPortrait || 'https://placehold.co/200x120'}
                        alt={season.cTitle || season.cId}
                        fill
                        unoptimized
                        className='object-cover'
                      />
                    </div>
                    <div className='min-w-0 flex-1 space-y-1'>
                      <div className='flex items-start justify-between gap-2'>
                        <div>
                          <span className='badge badge-accent badge-xs font-mono'>Season {season.cNo || season.cId}</span>
                          <h4 className='text-sm font-bold text-base-content line-clamp-1 mt-0.5'>{season.cTitle}</h4>
                        </div>
                        <div className='flex gap-1 shrink-0'>
                          <button type='button' className='btn btn-ghost btn-xs text-info' onClick={() => handleEditSeason(season)} title='Edit'>
                            <FiEdit2 />
                          </button>
                          <button type='button' className='btn btn-ghost btn-xs text-error' onClick={() => setDeletingSeason(season)} title='Delete'>
                            <FiTrash2 />
                          </button>
                        </div>
                      </div>
                      <p className='line-clamp-2 text-xs text-base-content/70'>{season.cDescription}</p>
                      <div className='text-[10px] text-base-content/50 font-medium'>
                        Episodes: {season.cEpisodes?.length || 0}
                      </div>
                    </div>
                  </article>
                ))
              ) : (
                <div className='flex min-h-32 items-center justify-center rounded-xl border border-dashed border-base-300 text-xs text-base-content/50'>
                  No seasons published for this content yet.
                </div>
              )}
            </div>
          </aside>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingSeason && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm'>
          <div className='card w-full max-w-sm bg-base-100 p-5 shadow-2xl space-y-4'>
            <div className='flex items-center gap-2 text-error'>
              <FiTrash2 className='h-6 w-6' />
              <h3 className='font-bold text-lg'>Delete Season</h3>
            </div>
            <p className='text-sm text-base-content/80'>
              Delete <strong>{deletingSeason.cTitle || deletingSeason.cId}</strong>? All episodes under this season will be removed.
            </p>
            <div className='flex justify-end gap-2 pt-2'>
              <button className='btn btn-ghost btn-xs' onClick={() => setDeletingSeason(null)} disabled={isDeleting}>
                Cancel
              </button>
              <button className='btn btn-error btn-xs text-white' onClick={confirmDeleteSeason} disabled={isDeleting}>
                {isDeleting ? <span className='loading loading-spinner loading-xs'></span> : 'Delete Season'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}