'use client'

import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { IContent, ISeason } from '@/app/models/types';

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
    setFormState((previous) => ({ ...emptyState(email), contentId, cTitle: content?.cTitle ?? previous.cTitle, cDescription: content?.cDescription ?? previous.cDescription, cLink: content?.cLink ?? previous.cLink, cTrailerYtId: content?.cTrailerYtId ?? previous.cTrailerYtId }));
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

  const handleDeleteSeason = async (seasonId: string) => {
    if (!selectedContent) return;

    const confirmed = globalThis.confirm(`Delete season ${seasonId}?`);
    if (!confirmed) return;

    const response = await fetch(`/api/seasonscrud/${selectedContent.cId}/${seasonId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    const result = await response.json();
    if (!response.ok) {
      setStatusMessage(result?.message || result?.error || 'Failed to delete season');
      return;
    }

    const refreshed = await axios.get('/api/contentcrud/contentgetfull');
    setContents(refreshed.data);
    setSelectedContent(refreshed.data.find((item: IContent) => item.cId === selectedContent.cId) || null);
    resetForm();
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: keyof SeasonFormState) => {
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
      setContents(refreshed.data);
      setSelectedContent(refreshed.data.find((item: IContent) => item.cId === formState.contentId) || null);
      resetForm();
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitLabel = mode === 'edit' ? 'Update season' : 'Publish season';

  return (
    <section className='rounded-3xl border border-base-300 bg-base-100/90 p-5 shadow-xl shadow-black/5 backdrop-blur sm:p-6'>
      <div className='mb-6 flex flex-col gap-2 border-b border-base-300 pb-4'>
        <p className='text-sm font-semibold uppercase tracking-[0.2em] text-primary'>Season manager</p>
        <div className='flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between'>
          <div>
            <h2 className='text-2xl font-bold'>Seasons</h2>
            <p className='text-sm text-base-content/70'>Select a content record, manage its seasons, and edit or remove entries in place.</p>
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
          <label className='form-control w-full'>
            <span className='label-text font-medium'>Content</span>
            <select className='select select-bordered w-full' value={formState.contentId} onChange={(e) => handleSelectContent(e.target.value)}>
              <option value='' disabled>Select content</option>
              {contents.map((content) => (
                <option key={content.cId} value={content.cId}>
                  {content.cTitle}
                </option>
              ))}
            </select>
          </label>

          <div className='grid gap-4 md:grid-cols-2'>
            <label className='form-control w-full'>
              <span className='label-text font-medium'>Season ID</span>
              <input className='input input-bordered w-full' value={formState.cId} onChange={(e) => setFormState({ ...formState, cId: e.target.value })} disabled={mode === 'edit'} />
            </label>
            <label className='form-control w-full'>
              <span className='label-text font-medium'>Season number</span>
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
              <span className='label-text font-medium'>Trailer YouTube ID</span>
              <input className='input input-bordered w-full' value={formState.cTrailerYtId} onChange={(e) => setFormState({ ...formState, cTrailerYtId: e.target.value })} />
            </label>
            <div className='grid grid-cols-2 gap-4'>
              <label className='form-control w-full'>
                <span className='label-text font-medium'>Width</span>
                <input type='number' className='input input-bordered w-full' value={formState.width} onChange={(e) => setFormState({ ...formState, width: Number(e.target.value) })} />
              </label>
              <label className='form-control w-full'>
                <span className='label-text font-medium'>Height</span>
                <input type='number' className='input input-bordered w-full' value={formState.height} onChange={(e) => setFormState({ ...formState, height: Number(e.target.value) })} />
              </label>
            </div>
          </div>

          <div className='grid gap-4 sm:grid-cols-2'>
            {[
              { key: 'cLandscape', label: 'Landscape' },
              { key: 'cPortrait', label: 'Portrait' },
              { key: 'cBanner', label: 'Banner' },
              { key: 'cLogo', label: 'Logo' },
              { key: 'cCard', label: 'Card' },
              { key: 'cSquare', label: 'Square' },
            ].map((field) => (
              <label key={field.key} className='rounded-2xl border border-base-300 bg-base-200/40 p-4'>
                <div className='flex items-center justify-between gap-2'>
                  <span className='font-medium'>{field.label}</span>
                  <span className='text-xs text-base-content/50'>{formState[field.key as keyof SeasonFormState] ? 'Ready' : 'Empty'}</span>
                </div>
                {formState[field.key as keyof SeasonFormState] ? (
                  <Image
                    src={formState[field.key as keyof SeasonFormState] as string}
                    alt={field.label}
                    width={640}
                    height={224}
                    unoptimized
                    className='mt-3 h-28 w-full rounded-xl object-cover'
                  />
                ) : (
                  <div className='mt-3 flex h-28 items-center justify-center rounded-xl border border-dashed border-base-300 text-sm text-base-content/50'>No preview</div>
                )}
                <input type='file' className='file-input file-input-bordered file-input-sm mt-3 w-full' onChange={(e) => handleFileUpload(e, field.key as keyof SeasonFormState)} />
              </label>
            ))}
          </div>

          {statusMessage ? <div className='alert alert-info text-sm'>{statusMessage}</div> : null}

          <div className='flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end'>
            {mode === 'edit' ? (
              <button type='button' className='btn btn-ghost' onClick={resetForm}>
                Cancel
              </button>
            ) : null}
            <button className='btn btn-primary min-w-40' type='submit' disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : submitLabel}
            </button>
          </div>
        </form>

        <aside className='space-y-4 rounded-3xl border border-base-300 bg-base-200/40 p-4'>
          <div className='flex items-center justify-between'>
            <h3 className='text-lg font-semibold'>Existing seasons</h3>
            <span className='text-xs text-base-content/60'>{seasons.length} items</span>
          </div>

          <div className='space-y-3'>
            {seasons.length > 0 ? (
              seasons.map((season) => (
                <article key={season.cId} className='rounded-2xl border border-base-300 bg-base-100 p-3'>
                  <div className='flex gap-3'>
                    <Image
                      src={season.cLandscape || season.cBanner || season.cCard || season.cPortrait || season.cLogo || season.cSquare || 'https://placehold.co/240x160?text=Season'}
                      alt={season.cTitle}
                      width={80}
                      height={80}
                      unoptimized
                      className='h-20 w-20 rounded-xl object-cover'
                    />
                    <div className='min-w-0 flex-1'>
                      <div className='flex items-start justify-between gap-2'>
                        <div>
                          <p className='text-sm font-semibold'>{season.cTitle}</p>
                          <p className='text-xs text-base-content/60'>Season {season.cNo} · {season.cId}</p>
                        </div>
                        <div className='flex gap-2'>
                          <button type='button' className='btn btn-outline btn-xs' onClick={() => handleEditSeason(season)}>
                            Edit
                          </button>
                          <button type='button' className='btn btn-error btn-xs' onClick={() => handleDeleteSeason(season.cId)}>
                            Delete
                          </button>
                        </div>
                      </div>
                      <p className='mt-2 line-clamp-3 text-sm text-base-content/70'>{season.cDescription}</p>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className='rounded-2xl border border-dashed border-base-300 p-4 text-sm text-base-content/60'>Select a content item to see its seasons.</div>
            )}
          </div>
        </aside>
      </div>
    </section>
  );
}