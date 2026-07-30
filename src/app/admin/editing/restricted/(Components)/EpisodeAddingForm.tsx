'use client'

import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { IContent, ISeason, IEpisode } from '@/app/models/types';
import { FiRadio, FiEdit2, FiTrash2, FiPlus, FiFilm, FiLayers, FiMusic, FiPlayCircle } from 'react-icons/fi';

type EpisodeFormState = {
  email: string;
  contentId: string;
  seasonId: string;
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
  cYtId: string;
  cAudioSrc: string;
  cFullEpisode: string;
  cNextEpisodeSpoilers: string;
};

const emptyState = (email: string): EpisodeFormState => ({
  email,
  contentId: '',
  seasonId: '',
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
  cYtId: '',
  cAudioSrc: '',
  cFullEpisode: '',
  cNextEpisodeSpoilers: '',
});

type Props = Readonly<{ email: string }>;

export default function EpisodeAddingForm({ email }: Props) {
  const imageBb: string = process.env.NEXT_PUBLIC_IMAGEBB_API_KEY ?? '';

  const [contents, setContents] = useState<IContent[]>([]);
  const [selectedContent, setSelectedContent] = useState<IContent | null>(null);
  const [selectedSeason, setSelectedSeason] = useState<ISeason | null>(null);
  const [formState, setFormState] = useState<EpisodeFormState>(() => emptyState(email));
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
  const [deletingEpisode, setDeletingEpisode] = useState<IEpisode | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [contentSearchQuery, setContentSearchQuery] = useState('');

  const loadContents = async () => {
    try {
      const response = await axios.get('/api/contentcrud/contentgetfull');
      setContents(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error('Failed to load contents:', err);
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
  const episodes = useMemo(() => selectedSeason?.cEpisodes ?? [], [selectedSeason]);

  const resetForm = () => {
    setMode('create');
    setFormState(emptyState(email));
    setSelectedImages({});
    setStatusMessage('');
  };

  const handleSelectContent = (contentId: string) => {
    const content = contents.find((item) => item.cId === contentId) || null;
    setSelectedContent(content);
    setSelectedSeason(null);
    setMode('create');
    setFormState({
      ...emptyState(email),
      contentId,
      cTitle: content?.cTitle ?? '',
      cDescription: content?.cDescription ?? '',
      cLink: content?.cLink ?? '',
      cYtId: content?.cTrailerYtId ?? '',
    });
    setSelectedImages({});
    setStatusMessage('');
  };

  const handleSelectSeason = (seasonId: string) => {
    const season = seasons.find((item) => item.cId === seasonId) || null;
    setSelectedSeason(season);
    setMode('create');
    setFormState((previous) => ({ ...previous, seasonId }));
    setStatusMessage('');
  };

  const handleEditEpisode = (episode: IEpisode) => {
    if (!selectedContent || !selectedSeason) return;

    setMode('edit');
    setFormState({
      email,
      contentId: selectedContent.cId,
      seasonId: selectedSeason.cId,
      cId: episode.cId,
      cNo: episode.cNo,
      cTitle: episode.cTitle,
      cDescription: episode.cDescription,
      cLandscape: episode.cLandscape,
      cPortrait: episode.cPortrait,
      cBanner: episode.cBanner,
      cLogo: episode.cLogo,
      cCard: episode.cCard,
      cSquare: episode.cSquare,
      cLink: episode.cLink,
      cYtId: episode.cYtId ?? '',
      cAudioSrc: episode.cAudioSrc ?? '',
      cFullEpisode: episode.cFullEpisode ?? '',
      cNextEpisodeSpoilers: episode.cNextEpisodeSpoilers ?? '',
    });
    setSelectedImages({});
    setStatusMessage('');
  };

  const confirmDeleteEpisode = async () => {
    if (!selectedContent || !selectedSeason || !deletingEpisode) return;

    setIsDeleting(true);
    try {
      const response = await fetch(
        `/api/episodescrud/${selectedContent.cId}/${selectedSeason.cId}/${deletingEpisode.cId}`,
        {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        }
      );

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result?.message || result?.error || 'Failed to delete episode');
      }

      const refreshed = await axios.get('/api/contentcrud/contentgetfull');
      const updatedContents = refreshed.data as IContent[];
      setContents(updatedContents);
      const updatedContent = updatedContents.find((item) => item.cId === selectedContent.cId) || null;
      setSelectedContent(updatedContent);
      if (updatedContent) {
        const updatedSeason = updatedContent.cSeasons.find((item) => item.cId === selectedSeason.cId) || null;
        setSelectedSeason(updatedSeason);
      }
      resetForm();
      setDeletingEpisode(null);
    } catch (err) {
      setStatusMessage(err instanceof Error ? err.message : 'Failed to delete episode');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formState.contentId || !formState.seasonId) {
      setStatusMessage('Please select both parent Content and Season first.');
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
        seasonId: formState.seasonId,
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
        cYtId: formState.cYtId,
        cAudioSrc: formState.cAudioSrc,
        cFullEpisode: formState.cFullEpisode,
        cNextEpisodeSpoilers: formState.cNextEpisodeSpoilers,
      };

      const response = await fetch(
        mode === 'edit'
          ? `/api/episodescrud/${formState.contentId}/${formState.seasonId}/${formState.cId}`
          : '/api/episodescrud/episodespost',
        {
          method: mode === 'edit' ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result?.message || result?.error || 'Failed to save episode');
      }

      setStatusMessage(result?.message || 'Episode saved successfully');
      const refreshed = await axios.get('/api/contentcrud/contentgetfull');
      const updatedContents = refreshed.data as IContent[];
      setContents(updatedContents);
      const updatedContent = updatedContents.find((item) => item.cId === formState.contentId) || null;
      setSelectedContent(updatedContent);
      if (updatedContent) {
        const updatedSeason = updatedContent.cSeasons.find((item) => item.cId === formState.seasonId) || null;
        setSelectedSeason(updatedSeason);
      }
      if (mode === 'create') {
        resetForm();
        setFormState((prev) => ({ ...prev, contentId: selectedContent?.cId ?? '', seasonId: selectedSeason?.cId ?? '' }));
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
          <div className='inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary'>
            <FiRadio /> Episode Studio
          </div>
          <h2 className='text-2xl font-bold'>Episode Manager</h2>
          <p className='text-sm text-base-content/70'>Add and manage audio/video episodes under specified content seasons.</p>
        </div>
        {mode === 'edit' && (
          <button type='button' className='btn btn-ghost btn-sm gap-1' onClick={resetForm}>
            <FiPlus /> Switch to Create Mode
          </button>
        )}
      </div>

      {/* Step-by-step Selection Cards */}
      <div className='grid gap-4 sm:grid-cols-2'>
        <div className='rounded-2xl border border-primary/20 bg-primary/5 p-4 space-y-2'>
          <div className='flex items-center justify-between'>
            <label className='font-bold text-xs flex items-center gap-2 text-primary uppercase tracking-wider'>
              <FiFilm /> Step 1: Parent Content
            </label>
            <input
              type='text'
              className='input input-bordered input-xs w-36'
              placeholder='Search content...'
              value={contentSearchQuery}
              onChange={(e) => setContentSearchQuery(e.target.value)}
            />
          </div>
          <select
            className='select select-bordered select-sm w-full font-medium'
            value={selectedContent?.cId || ''}
            onChange={(e) => handleSelectContent(e.target.value)}
          >
            <option value=''>Choose parent content...</option>
            {filteredContentOptions.map((item) => (
              <option key={item.cId} value={item.cId}>
                {item.cTitle} ({item.cId})
              </option>
            ))}
          </select>
        </div>

        <div className='rounded-2xl border border-secondary/20 bg-secondary/5 p-4 space-y-2'>
          <label className='font-bold text-xs flex items-center gap-2 text-secondary uppercase tracking-wider'>
            <FiLayers /> Step 2: Select Season
          </label>
          <select
            className='select select-bordered select-sm w-full font-medium'
            value={selectedSeason?.cId || ''}
            onChange={(e) => handleSelectSeason(e.target.value)}
            disabled={!selectedContent}
          >
            <option value=''>Choose season...</option>
            {seasons.map((item) => (
              <option key={item.cId} value={item.cId}>
                Season {item.cNo} — {item.cTitle} ({item.cEpisodes?.length || 0} Episodes)
              </option>
            ))}
          </select>
        </div>
      </div>

      {selectedContent && selectedSeason && (
        <div className='grid gap-6 xl:grid-cols-[1fr_0.9fr]'>
          {/* Episode Form */}
          <form className='space-y-4 rounded-2xl border border-base-300 bg-base-200/30 p-4' onSubmit={handleSubmit}>
            <h3 className='font-bold text-lg border-b border-base-300/50 pb-2'>
              {mode === 'edit' ? `Edit Episode (${formState.cId})` : `New Episode for Season ${selectedSeason.cNo}`}
            </h3>

            <div className='grid gap-4 md:grid-cols-2'>
              <label className='form-control w-full'>
                <span className='label-text font-medium'>Episode ID</span>
                <input
                  className='input input-bordered w-full font-mono'
                  placeholder='e.g. ep01'
                  value={formState.cId}
                  onChange={(e) => setFormState({ ...formState, cId: e.target.value })}
                  disabled={mode === 'edit'}
                />
              </label>
              <label className='form-control w-full'>
                <span className='label-text font-medium'>Episode Number (cNo)</span>
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
                <span className='label-text font-medium'>Episode Title</span>
                <input
                  className='input input-bordered w-full'
                  placeholder='Episode Title'
                  value={formState.cTitle}
                  onChange={(e) => setFormState({ ...formState, cTitle: e.target.value })}
                />
              </label>
              <label className='form-control w-full'>
                <span className='label-text font-medium'>YouTube Video ID</span>
                <input
                  className='input input-bordered w-full'
                  placeholder='YouTube ID (cYtId)'
                  value={formState.cYtId}
                  onChange={(e) => setFormState({ ...formState, cYtId: e.target.value })}
                />
              </label>
            </div>

            <label className='form-control w-full'>
              <span className='label-text font-medium'>Audio Source URL (cAudioSrc)</span>
              <input
                className='input input-bordered w-full font-mono text-xs'
                placeholder='https://domain.com/audio.mp3'
                value={formState.cAudioSrc}
                onChange={(e) => setFormState({ ...formState, cAudioSrc: e.target.value })}
              />
            </label>

            <label className='form-control w-full'>
              <span className='label-text font-medium'>Episode Description</span>
              <textarea
                className='textarea textarea-bordered min-h-24 w-full'
                placeholder='Episode synopsis...'
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
              <button className='btn btn-primary btn-sm min-w-32' type='submit' disabled={isSubmitting}>
                {isSubmitting ? <span className='loading loading-spinner loading-xs'></span> : mode === 'edit' ? 'Update Episode' : 'Publish Episode'}
              </button>
            </div>
          </form>

          {/* Existing Episodes Grid */}
          <aside className='space-y-4 rounded-2xl border border-base-300 bg-base-200/30 p-4'>
            <div className='flex items-center justify-between border-b border-base-300/50 pb-2'>
              <h3 className='text-lg font-bold'>Episodes in Season {selectedSeason.cNo} ({episodes.length})</h3>
            </div>

            <div className='space-y-3 max-h-[500px] overflow-y-auto pr-1'>
              {episodes.length > 0 ? (
                episodes.map((ep) => (
                  <article key={ep.cId} className='flex gap-3 rounded-xl border border-base-300 bg-base-100 p-3 shadow-sm hover:shadow-md transition-shadow'>
                    <div className='relative h-20 w-28 shrink-0 overflow-hidden rounded-lg bg-base-300'>
                      <Image
                        src={ep.cLandscape || ep.cBanner || ep.cPortrait || 'https://placehold.co/200x120'}
                        alt={ep.cTitle || ep.cId}
                        fill
                        unoptimized
                        className='object-cover'
                      />
                    </div>
                    <div className='min-w-0 flex-1 space-y-1'>
                      <div className='flex items-start justify-between gap-2'>
                        <div>
                          <span className='badge badge-primary badge-xs font-mono'>Ep {ep.cNo || ep.cId}</span>
                          <h4 className='text-sm font-bold text-base-content line-clamp-1 mt-0.5'>{ep.cTitle}</h4>
                        </div>
                        <div className='flex gap-1 shrink-0'>
                          <button type='button' className='btn btn-ghost btn-xs text-info' onClick={() => handleEditEpisode(ep)} title='Edit'>
                            <FiEdit2 />
                          </button>
                          <button type='button' className='btn btn-ghost btn-xs text-error' onClick={() => setDeletingEpisode(ep)} title='Delete'>
                            <FiTrash2 />
                          </button>
                        </div>
                      </div>
                      <p className='line-clamp-2 text-xs text-base-content/70'>{ep.cDescription}</p>
                      <div className='flex flex-wrap gap-2 text-[10px] text-base-content/50 font-medium'>
                        {ep.cAudioSrc && <span className='flex items-center gap-0.5 text-success'><FiMusic /> Audio</span>}
                        {ep.cYtId && <span className='flex items-center gap-0.5 text-error'><FiPlayCircle /> Video</span>}
                      </div>
                    </div>
                  </article>
                ))
              ) : (
                <div className='flex min-h-32 items-center justify-center rounded-xl border border-dashed border-base-300 text-xs text-base-content/50'>
                  No episodes published for this season yet.
                </div>
              )}
            </div>
          </aside>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingEpisode && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm'>
          <div className='card w-full max-w-sm bg-base-100 p-5 shadow-2xl space-y-4'>
            <div className='flex items-center gap-2 text-error'>
              <FiTrash2 className='h-6 w-6' />
              <h3 className='font-bold text-lg'>Delete Episode</h3>
            </div>
            <p className='text-sm text-base-content/80'>
              Delete <strong>{deletingEpisode.cTitle || deletingEpisode.cId}</strong>?
            </p>
            <div className='flex justify-end gap-2 pt-2'>
              <button className='btn btn-ghost btn-xs' onClick={() => setDeletingEpisode(null)} disabled={isDeleting}>
                Cancel
              </button>
              <button className='btn btn-error btn-xs text-white' onClick={confirmDeleteEpisode} disabled={isDeleting}>
                {isDeleting ? <span className='loading loading-spinner loading-xs'></span> : 'Delete Episode'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}