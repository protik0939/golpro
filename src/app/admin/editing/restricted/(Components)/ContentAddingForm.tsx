'use client'

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';

interface Genre {
  genreId: string;
  genreName: string;
  genreDescription: string;
  imageUrl: string;
}

interface Author {
  authorId: string;
  fullName: string;
  description: string;
  imageUrl: string;
}

export interface ContentFormValues {
  emeil: string;
  cContentType: string;
  cId: string;
  cTitle: string;
  cDescription: string;
  cLandscape: string;
  cPortrait: string;
  cBanner: string;
  cLogo: string;
  cCard: string;
  cLink: string;
  cSquare: string;
  cTrailerYtId: string;
  width: number;
  height: number;
  cGenre: string[];
  cAuthors: string[];
  cViwersAge: string;
  cUserVisit: number;
  cSeasons: object[];
  cHomePage: string[];
}

export interface ContentFormContent {
  cId: string;
  cContentType?: string;
  cTitle?: string;
  cDescription?: string;
  cLandscape?: string;
  cPortrait?: string;
  cBanner?: string;
  cLogo?: string;
  cCard?: string;
  cLink?: string;
  cSquare?: string;
  cTrailerYtId?: string;
  width?: number;
  height?: number;
  cGenre?: Array<string | { genreId?: string }>;
  cAuthors?: Array<string | { authorId?: string }>;
  cViwersAge?: string;
  cUserVisit?: number;
  cSeasons?: object[];
  cHomePage?: string[];
}

type ContentAddingFormProps = Readonly<{
  email: string;
  mode?: 'create' | 'edit';
  content?: ContentFormContent | null;
  onSaved?: () => void;
  onCancel?: () => void;
}>;

const normalizeSelection = (
  items?: Array<string | { genreId?: string } | { authorId?: string }>,
  key?: 'genreId' | 'authorId'
) => {
  if (!items) {
    return [];
  }

  return items
    .map((item) => {
      if (typeof item === 'string') {
        return item;
      }

      if (key && item && typeof item === 'object' && key in item) {
        return (item as Record<string, string | undefined>)[key] ?? '';
      }

      return '';
    })
    .filter(Boolean);
};

const createEmptyContentData = (email: string, content?: ContentFormContent | null): ContentFormValues => ({
  emeil: email,
  cContentType: content?.cContentType ?? '',
  cId: content?.cId ?? '',
  cTitle: content?.cTitle ?? '',
  cDescription: content?.cDescription ?? '',
  cLandscape: content?.cLandscape ?? '',
  cPortrait: content?.cPortrait ?? '',
  cBanner: content?.cBanner ?? '',
  cLogo: content?.cLogo ?? '',
  cCard: content?.cCard ?? '',
  cLink: content?.cLink ?? '',
  cSquare: content?.cSquare ?? '',
  cTrailerYtId: content?.cTrailerYtId ?? '',
  width: content?.width ?? 200,
  height: content?.height ?? 200,
  cGenre: normalizeSelection(content?.cGenre, 'genreId'),
  cAuthors: normalizeSelection(content?.cAuthors, 'authorId'),
  cViwersAge: content?.cViwersAge ?? '',
  cUserVisit: content?.cUserVisit ?? 0,
  cSeasons: content?.cSeasons ?? [],
  cHomePage: content?.cHomePage ?? [],
});

export default function ContentAddingForm({ email, mode = 'create', content, onSaved, onCancel }: ContentAddingFormProps) {
  const imageBb: string = process.env.NEXT_PUBLIC_IMAGEBB_API_KEY ?? '';

  const [contentData, setContentData] = useState<ContentFormValues>(() => createEmptyContentData(email, content));
  const [genres, setGenres] = useState<Genre[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    axios.get('/api/genrecrud/genreget').then(response => setGenres(response.data));
    axios.get('/api/authorscrud/authorGet').then(response => setAuthors(response.data));
  }, []);

  useEffect(() => {
    setContentData(createEmptyContentData(email, content));
    setStatusMessage('');
  }, [email, content, mode]);

  const uploadToImageBB = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('key', imageBb);
    const response = await axios.post('https://api.imgbb.com/1/upload', formData);
    return response.data.data.url;
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: keyof Pick<ContentFormValues, 'cLandscape' | 'cPortrait' | 'cBanner' | 'cLogo' | 'cCard' | 'cSquare'>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = await uploadToImageBB(file);
      setContentData(prev => ({ ...prev, [field]: imageUrl }));
    }
  };

  const handleCheckboxChange = (id: string, field: 'cGenre' | 'cAuthors') => {
    setContentData(prev => {
      const updatedList = prev[field].includes(id)
        ? prev[field].filter((item: string) => item !== id)
        : [...prev[field], id];
      return { ...prev, [field]: updatedList };
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMessage('');

    const targetUrl = mode === 'edit' && content?.cId ? `/api/contentcrud/${content.cId}` : '/api/contentcrud/contentpost';
    const response = await fetch(targetUrl, {
      method: mode === 'edit' ? 'PUT' : 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(contentData),
    });

    const result = await response.json();

    if (!response.ok) {
      setStatusMessage(result?.error || result?.message || 'Something went wrong');
      setIsSubmitting(false);
      return;
    }

    setStatusMessage(mode === 'edit' ? 'Content updated successfully.' : 'Content created successfully.');
    if (mode === 'create') {
      setContentData(createEmptyContentData(email));
    }

    onSaved?.();
    setIsSubmitting(false);
  };

  const imagePreviewFields: Array<{ label: string; key: keyof Pick<ContentFormValues, 'cLandscape' | 'cPortrait' | 'cBanner' | 'cLogo' | 'cCard' | 'cSquare'> }> = [
    { label: 'Landscape', key: 'cLandscape' },
    { label: 'Portrait', key: 'cPortrait' },
    { label: 'Banner', key: 'cBanner' },
    { label: 'Logo', key: 'cLogo' },
    { label: 'Card', key: 'cCard' },
    { label: 'Square', key: 'cSquare' },
  ];

  const formTitle = mode === 'edit' ? 'Edit content' : 'Create content';
  let submitLabel = 'Publish content';

  if (isSubmitting) {
    submitLabel = 'Saving...';
  } else if (mode === 'edit') {
    submitLabel = 'Update content';
  }

  return (
    <section className='rounded-3xl border border-base-300 bg-base-100/90 p-5 shadow-xl shadow-black/5 backdrop-blur sm:p-6'>
      <div className='mb-6 flex flex-col gap-2 border-b border-base-300 pb-4'>
        <p className='text-sm font-semibold uppercase tracking-[0.2em] text-primary'>Content manager</p>
        <div className='flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between'>
          <div>
            <h2 className='text-2xl font-bold'>{formTitle}</h2>
            <p className='text-sm text-base-content/70'>Create a new title or update an existing record without leaving the admin screen.</p>
          </div>
          {mode === 'edit' && onCancel ? (
            <button type='button' className='btn btn-ghost btn-sm' onClick={onCancel}>
              Cancel edit
            </button>
          ) : null}
        </div>
      </div>

      <form className='space-y-6' onSubmit={handleSubmit}>
        <div className='grid gap-4 md:grid-cols-2'>
          <label className='form-control w-full'>
            <span className='label-text font-medium'>Content ID</span>
            <input type='text' placeholder='Id' className='input input-bordered w-full' value={contentData.cId} onChange={(e) => setContentData({ ...contentData, cId: e.target.value })} disabled={mode === 'edit'} />
          </label>
          <label className='form-control w-full'>
            <span className='label-text font-medium'>Content type</span>
            <select value={contentData.cContentType} onChange={(e) => setContentData({ ...contentData, cContentType: e.target.value })} className='select select-bordered w-full'>
              <option value='' disabled>Choose a content type</option>
              <option value='storyseries'>storyseries</option>
              <option value='story'>story</option>
              <option value='audiostoryseries'>audiostoryseries</option>
              <option value='audiostory'>audiostory</option>
            </select>
          </label>
        </div>

        <div className='grid gap-4 md:grid-cols-2'>
          <label className='form-control w-full'>
            <span className='label-text font-medium'>Title</span>
            <input type='text' placeholder='Title' className='input input-bordered w-full' value={contentData.cTitle} onChange={(e) => setContentData({ ...contentData, cTitle: e.target.value })} />
          </label>
          <label className='form-control w-full'>
            <span className='label-text font-medium'>Viewer age</span>
            <input type='text' placeholder='Viewer Age' className='input input-bordered w-full' value={contentData.cViwersAge} onChange={(e) => setContentData({ ...contentData, cViwersAge: e.target.value })} />
          </label>
        </div>

        <label className='form-control w-full'>
          <span className='label-text font-medium'>Description</span>
          <textarea className='textarea textarea-bordered min-h-32 w-full' placeholder='Description' value={contentData.cDescription} onChange={(e) => setContentData({ ...contentData, cDescription: e.target.value })} />
        </label>

        <div className='grid gap-4 md:grid-cols-2'>
          <label className='form-control w-full'>
            <span className='label-text font-medium'>Link</span>
            <input type='text' placeholder='Link' className='input input-bordered w-full' value={contentData.cLink} onChange={(e) => setContentData({ ...contentData, cLink: e.target.value })} />
          </label>
          <label className='form-control w-full'>
            <span className='label-text font-medium'>Trailer YouTube ID</span>
            <input type='text' placeholder='Trailer YouTube ID' className='input input-bordered w-full' value={contentData.cTrailerYtId} onChange={(e) => setContentData({ ...contentData, cTrailerYtId: e.target.value })} />
          </label>
        </div>

        <div className='grid gap-4 lg:grid-cols-2'>
          <div className='space-y-3'>
            <div className='flex items-center justify-between'>
              <h3 className='text-lg font-semibold'>Images</h3>
              <span className='text-xs text-base-content/60'>Upload or replace individual artwork fields.</span>
            </div>
            <div className='grid gap-4 sm:grid-cols-2'>
              {imagePreviewFields.map((field) => {
                const imageValue = contentData[field.key];

                return (
                  <label key={field.key} className='space-y-2 rounded-2xl border border-base-300 bg-base-200/40 p-4'>
                    <div className='flex items-center justify-between gap-2'>
                      <span className='font-medium'>{field.label}</span>
                      {imageValue ? <span className='badge badge-neutral badge-sm'>Ready</span> : <span className='badge badge-outline badge-sm'>Empty</span>}
                    </div>
                    {imageValue ? (
                      <Image src={imageValue} alt={`${field.label} preview`} width={640} height={224} unoptimized className='h-28 w-full rounded-xl object-cover' />
                    ) : (
                      <div className='flex h-28 items-center justify-center rounded-xl border border-dashed border-base-300 text-sm text-base-content/50'>
                        No preview yet
                      </div>
                    )}
                    <input type='file' className='file-input file-input-bordered file-input-sm w-full' onChange={(e) => handleFileUpload(e, field.key)} />
                  </label>
                );
              })}
            </div>
          </div>

          <div className='space-y-4'>
            <div className='grid gap-4 md:grid-cols-2'>
              <fieldset className='rounded-2xl border border-base-300 bg-base-200/40 p-4'>
                <legend className='px-2 text-sm font-semibold'>Genres</legend>
                <div className='max-h-56 space-y-2 overflow-y-auto pr-1'>
                  {genres.map((genre) => (
                    <label className='flex items-center gap-3 rounded-xl px-2 py-1.5 hover:bg-base-200' key={genre.genreId}>
                      <input type='checkbox' className='checkbox checkbox-sm' checked={contentData.cGenre.includes(genre.genreId)} onChange={() => handleCheckboxChange(genre.genreId, 'cGenre')} />
                      <span className='text-sm'>{genre.genreName}</span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <fieldset className='rounded-2xl border border-base-300 bg-base-200/40 p-4'>
                <legend className='px-2 text-sm font-semibold'>Authors</legend>
                <div className='max-h-56 space-y-2 overflow-y-auto pr-1'>
                  {authors.map((author) => (
                    <label className='flex items-center gap-3 rounded-xl px-2 py-1.5 hover:bg-base-200' key={author.authorId}>
                      <input type='checkbox' className='checkbox checkbox-sm' checked={contentData.cAuthors.includes(author.authorId)} onChange={() => handleCheckboxChange(author.authorId, 'cAuthors')} />
                      <span className='text-sm'>{author.fullName}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
            </div>

            <div className='grid gap-4 md:grid-cols-2'>
              <label className='form-control w-full'>
                <span className='label-text font-medium'>Width</span>
                <input type='number' min='0' className='input input-bordered w-full' value={contentData.width} onChange={(e) => setContentData({ ...contentData, width: Number(e.target.value) })} />
              </label>
              <label className='form-control w-full'>
                <span className='label-text font-medium'>Height</span>
                <input type='number' min='0' className='input input-bordered w-full' value={contentData.height} onChange={(e) => setContentData({ ...contentData, height: Number(e.target.value) })} />
              </label>
            </div>
          </div>
        </div>

        {statusMessage ? <div className='alert alert-info text-sm'>{statusMessage}</div> : null}

        <div className='flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end'>
          {mode === 'edit' && onCancel ? (
            <button type='button' className='btn btn-ghost' onClick={onCancel}>
              Cancel
            </button>
          ) : null}
          <button className='btn btn-primary min-w-40' type='submit' disabled={isSubmitting}>
            {submitLabel}
          </button>
        </div>
      </form>
    </section>
  );
}