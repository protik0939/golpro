'use client'

import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { IContent, ISeason, IEpisode } from '@/app/models/types';

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
  const [selectedImages, setSelectedImages] = useState<{ cLandscape?: File | null; cPortrait?: File | null; cBanner?: File | null; cLogo?: File | null; cCard?: File | null; cSquare?: File | null; }>({});
  const [statusMessage, setStatusMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    axios.get('/api/contentcrud/contentgetfull').then((response) => setContents(response.data));
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
    setFormState(emptyState(email));
    setFormState((previous) => ({
      ...previous,
      contentId,
      cTitle: content?.cTitle ?? '',
      cDescription: content?.cDescription ?? '',
      cLink: content?.cLink ?? '',
      cYtId: content?.cTrailerYtId ?? '',
    }));
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
      cFullEpisode: episode.cFullEpisode,
      cNextEpisodeSpoilers: episode.cNextEpisodeSpoilers,
    });
    setSelectedImages({});
    setStatusMessage('');
  };

  const refreshContent = async (targetContentId: string) => {
    const refreshed = await axios.get('/api/contentcrud/contentgetfull');
    const refreshedContents = refreshed.data as IContent[];
    setContents(refreshedContents);
    const refreshedContent = refreshedContents.find((item: IContent) => item.cId === targetContentId) || null;
    setSelectedContent(refreshedContent);
    if (refreshedContent) {
      const refreshedSeason = refreshedContent.cSeasons.find((item: ISeason) => item.cId === formState.seasonId) || null;
      setSelectedSeason(refreshedSeason);
    }
  };

  const handleDeleteEpisode = async (episodeId: string) => {
    if (!selectedContent || !selectedSeason) return;

    const confirmed = globalThis.confirm(`Delete episode ${episodeId}?`);
    if (!confirmed) return;

    const response = await fetch(`/api/episodescrud/${selectedContent.cId}/${selectedSeason.cId}/${episodeId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    const result = await response.json();
    if (!response.ok) {
      setStatusMessage(result?.message || result?.error || 'Failed to delete episode');
      return;
    }

    await refreshContent(selectedContent.cId);
    resetForm();
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: keyof EpisodeFormState) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const imageUrl = await uploadToImageBB(file);
    setFormState((previous) => ({ ...previous, [field]: imageUrl }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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
        cFullEpisode: formState.cFullEpisode.replace(/\r?\n/g, String.raw`\n`),
        cNextEpisodeSpoilers: formState.cNextEpisodeSpoilers.replace(/\r?\n/g, String.raw`\n`),
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
      await refreshContent(formState.contentId);
      resetForm();
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  let submitLabel = 'Publish episode';
  if (mode === 'edit') {
    submitLabel = 'Update episode';
  }
  if (isSubmitting) {
    submitLabel = 'Saving...';
  }

  return (
    <section className='rounded-3xl border border-base-300 bg-base-100/90 p-5 shadow-xl shadow-black/5 backdrop-blur sm:p-6'>
      <div className='mb-6 flex flex-col gap-2 border-b border-base-300 pb-4'>
        <p className='text-sm font-semibold uppercase tracking-[0.2em] text-primary'>Episode manager</p>
        <div className='flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between'>
          <div>
            <h2 className='text-2xl font-bold'>Episodes</h2>
            <p className='text-sm text-base-content/70'>Select a content record and season, then create, update, or delete embedded episodes.</p>
          </div>
          {mode === 'edit' ? (
            <button type='button' className='btn btn-ghost btn-sm' onClick={resetForm}>
              Cancel edit
            </button>
          ) : null}
        </div>
      </div>

      <div className='grid gap-6 xl:grid-cols-[1fr_0.95fr]'>
        <form className='space-y-4' onSubmit={handleSubmit}>
          <div className='grid gap-4 md:grid-cols-2'>
            <label className='form-control w-full'>
              <span className='label-text font-medium'>Content</span>
              <select className='select select-bordered w-full' value={formState.contentId} onChange={(e) => handleSelectContent(e.target.value)}>
                <option value='' disabled>Select content</option>
                {contents.map((content) => (
                  <option key={content.cId} value={content.cId}>{content.cTitle}</option>
                ))}
              </select>
            </label>

            <label className='form-control w-full'>
              <span className='label-text font-medium'>Season</span>
              <select className='select select-bordered w-full' value={formState.seasonId} onChange={(e) => handleSelectSeason(e.target.value)} disabled={!selectedContent}>
                <option value='' disabled>Select season</option>
                {seasons.map((season) => (
                  <option key={season.cId} value={season.cId}>{season.cTitle} (Season {season.cNo})</option>
                ))}
              </select>
            </label>
          </div>

          <div className='grid gap-4 md:grid-cols-2'>
            <label className='form-control w-full'>
              <span className='label-text font-medium'>Episode ID</span>
              <input className='input input-bordered w-full' value={formState.cId} onChange={(e) => setFormState({ ...formState, cId: e.target.value })} disabled={mode === 'edit'} />
            </label>
            <label className='form-control w-full'>
              <span className='label-text font-medium'>Episode number</span>
              <input className='input input-bordered w-full' value={formState.cNo} onChange={(e) => setFormState({ ...formState, cNo: e.target.value })} />
            </label>
          </div>

          <div className='grid gap-4 md:grid-cols-2'>
            <label className='form-control w-full'>
              <span className='label-text font-medium'>Title</span>
              <input className='input input-bordered w-full' value={formState.cTitle} onChange={(e) => setFormState({ ...formState, cTitle: e.target.value })} />
            </label>
            <label className='form-control w-full'>
              <span className='label-text font-medium'>Link</span>
              <input className='input input-bordered w-full' value={formState.cLink} onChange={(e) => setFormState({ ...formState, cLink: e.target.value })} />
            </label>
          </div>

          <label className='form-control w-full'>
            <span className='label-text font-medium'>Description</span>
            <textarea className='textarea textarea-bordered min-h-32 w-full' value={formState.cDescription} onChange={(e) => setFormState({ ...formState, cDescription: e.target.value })} />
          </label>

          <div className='grid gap-4 md:grid-cols-2'>
            <label className='form-control w-full'>
              <span className='label-text font-medium'>YouTube ID</span>
              <input className='input input-bordered w-full' value={formState.cYtId} onChange={(e) => setFormState({ ...formState, cYtId: e.target.value })} />
            </label>
            <label className='form-control w-full'>
              <span className='label-text font-medium'>Audio source</span>
              <input className='input input-bordered w-full' value={formState.cAudioSrc} onChange={(e) => setFormState({ ...formState, cAudioSrc: e.target.value })} />
            </label>
          </div>

          <label className='form-control w-full'>
            <span className='label-text font-medium'>Full episode</span>
            <textarea className='textarea textarea-bordered min-h-32 w-full' value={formState.cFullEpisode} onChange={(e) => setFormState({ ...formState, cFullEpisode: e.target.value })} />
          </label>

          <label className='form-control w-full'>
            <span className='label-text font-medium'>Next episode spoilers</span>
            <textarea className='textarea textarea-bordered min-h-28 w-full' value={formState.cNextEpisodeSpoilers} onChange={(e) => setFormState({ ...formState, cNextEpisodeSpoilers: e.target.value })} />
          </label>

          <div className='grid gap-4 sm:grid-cols-2'>
            {[
              { key: 'cLandscape', label: 'Landscape' },
              { key: 'cPortrait', label: 'Portrait' },
              { key: 'cBanner', label: 'Banner' },
              { key: 'cLogo', label: 'Logo' },
              { key: 'cCard', label: 'Card' },
              { key: 'cSquare', label: 'Square' },
            ].map((field) => {
              const imageValue = formState[field.key as keyof EpisodeFormState];

              return (
                <label key={field.key} className='rounded-2xl border border-base-300 bg-base-200/40 p-4'>
                  <div className='flex items-center justify-between gap-2'>
                    <span className='font-medium'>{field.label}</span>
                    <span className='text-xs text-base-content/50'>{imageValue ? 'Ready' : 'Empty'}</span>
                  </div>
                  {imageValue ? (
                    <Image src={imageValue} alt={field.label} width={640} height={224} unoptimized className='mt-3 h-28 w-full rounded-xl object-cover' />
                  ) : (
                    <div className='mt-3 flex h-28 items-center justify-center rounded-xl border border-dashed border-base-300 text-sm text-base-content/50'>No preview</div>
                  )}
                  <input type='file' className='file-input file-input-bordered file-input-sm mt-3 w-full' onChange={(e) => handleFileUpload(e, field.key as keyof EpisodeFormState)} />
                </label>
              );
            })}
          </div>

          {statusMessage ? <div className='alert alert-info text-sm'>{statusMessage}</div> : null}

          <div className='flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end'>
            {mode === 'edit' ? (
              <button type='button' className='btn btn-ghost' onClick={resetForm}>
                Cancel
              </button>
            ) : null}
            <button className='btn btn-primary min-w-40' type='submit' disabled={isSubmitting}>
              {submitLabel}
            </button>
          </div>
        </form>

        <aside className='space-y-4 rounded-3xl border border-base-300 bg-base-200/40 p-4'>
          <div className='flex items-center justify-between'>
            <h3 className='text-lg font-semibold'>Existing episodes</h3>
            <span className='text-xs text-base-content/60'>{episodes.length} items</span>
          </div>

          <div className='space-y-3'>
            {episodes.length > 0 ? (
              episodes.map((episode) => (
                <article key={episode.cId} className='rounded-2xl border border-base-300 bg-base-100 p-3'>
                  <div className='flex gap-3'>
                    <Image
                      src={episode.cLandscape || episode.cBanner || episode.cCard || episode.cPortrait || episode.cLogo || episode.cSquare || 'https://placehold.co/240x160?text=Episode'}
                      alt={episode.cTitle}
                      width={80}
                      height={80}
                      unoptimized
                      className='h-20 w-20 rounded-xl object-cover'
                    />
                    <div className='min-w-0 flex-1'>
                      <div className='flex items-start justify-between gap-2'>
                        <div>
                          <p className='text-sm font-semibold'>{episode.cTitle}</p>
                          <p className='text-xs text-base-content/60'>Episode {episode.cNo} · {episode.cId}</p>
                        </div>
                        <div className='flex gap-2'>
                          <button type='button' className='btn btn-outline btn-xs' onClick={() => handleEditEpisode(episode)}>
                            Edit
                          </button>
                          <button type='button' className='btn btn-error btn-xs' onClick={() => handleDeleteEpisode(episode.cId)}>
                            Delete
                          </button>
                        </div>
                      </div>
                      <p className='mt-2 line-clamp-3 text-sm text-base-content/70'>{episode.cDescription}</p>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className='rounded-2xl border border-dashed border-base-300 p-4 text-sm text-base-content/60'>Select a content record and season to see episodes.</div>
            )}
          </div>
        </aside>
      </div>
    </section>
  );
}