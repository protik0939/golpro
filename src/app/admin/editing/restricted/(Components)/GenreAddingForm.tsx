'use client'

import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Image from 'next/image';

type GenreItem = {
  genreId: string;
  genreName: string;
  genreDescription: string;
  imageUrl: string;
};

type GenreFormState = {
  genreId: string;
  genreName: string;
  genreDescription: string;
  imageUrl: string;
};

type Props = Readonly<{ email: string }>;

const emptyState: GenreFormState = {
  genreId: '',
  genreName: '',
  genreDescription: '',
  imageUrl: '',
};

export default function GenreAddingForm({ email }: Props) {
  const [genres, setGenres] = useState<GenreItem[]>([]);
  const [formState, setFormState] = useState<GenreFormState>(emptyState);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [mode, setMode] = useState<'create' | 'edit'>('create');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const loadGenres = async () => {
    const { data } = await axios.get('/api/genrecrud/genreget');
    setGenres(data);
  };

  useEffect(() => {
    void loadGenres();
  }, []);

  const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);

    const { data } = await axios.post(
      `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMAGEBB_API_KEY}`,
      formData
    );

    if (!data.success) {
      throw new Error('Image upload failed');
    }

    return data.data.url as string;
  };

  const handleEdit = (genre: GenreItem) => {
    setMode('edit');
    setFormState({
      genreId: genre.genreId,
      genreName: genre.genreName,
      genreDescription: genre.genreDescription,
      imageUrl: genre.imageUrl,
    });
    setSelectedImage(null);
    setMessage('');
  };

  const resetForm = () => {
    setMode('create');
    setFormState(emptyState);
    setSelectedImage(null);
    setMessage('');
  };

  const handleDelete = async (genreId: string) => {
    const confirmed = globalThis.confirm(`Delete genre ${genreId}?`);
    if (!confirmed) {
      return;
    }

    await fetch(`/api/genrecrud/${genreId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    await loadGenres();
    if (formState.genreId === genreId) {
      resetForm();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      const imageUrl = selectedImage ? await uploadImage(selectedImage) : formState.imageUrl;

      if (!formState.genreId || !formState.genreName || !formState.genreDescription || !imageUrl) {
        throw new Error('All fields are required');
      }

      const payload = {
        email,
        genreId: formState.genreId,
        genreName: formState.genreName,
        genreDescription: formState.genreDescription.replace(/\r?\n/g, String.raw`\n`),
        imageUrl,
      };

      const response = await fetch(
        mode === 'edit' ? `/api/genrecrud/${formState.genreId}` : '/api/genrecrud/genrepost',
        {
          method: mode === 'edit' ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result?.message || result?.error || 'Failed to save genre');
      }

      setMessage(result?.message || 'Genre saved successfully');
      await loadGenres();
      resetForm();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitLabel = mode === 'edit' ? 'Update genre' : 'Publish genre';

  return (
    <section className='rounded-3xl border border-base-300 bg-base-100/90 p-5 shadow-xl shadow-black/5 backdrop-blur sm:p-6'>
      <div className='mb-6 flex flex-col gap-2 border-b border-base-300 pb-4'>
        <p className='text-sm font-semibold uppercase tracking-[0.2em] text-primary'>Genre manager</p>
        <div className='flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between'>
          <div>
            <h2 className='text-2xl font-bold'>Genres</h2>
            <p className='text-sm text-base-content/70'>Create, edit, and remove genre records with a responsive list and inline image preview.</p>
          </div>
          {mode === 'edit' ? (
            <button type='button' className='btn btn-ghost btn-sm' onClick={resetForm}>
              Cancel edit
            </button>
          ) : null}
        </div>
      </div>

      <div className='grid gap-6 xl:grid-cols-[1fr_0.9fr]'>
        <form className='space-y-4' onSubmit={handleSubmit}>
          <div className='grid gap-4 md:grid-cols-2'>
            <label className='form-control w-full'>
              <span className='label-text font-medium'>Genre ID</span>
              <input className='input input-bordered w-full' value={formState.genreId} onChange={(e) => setFormState({ ...formState, genreId: e.target.value })} disabled={mode === 'edit'} />
            </label>
            <label className='form-control w-full'>
              <span className='label-text font-medium'>Genre name</span>
              <input className='input input-bordered w-full' value={formState.genreName} onChange={(e) => setFormState({ ...formState, genreName: e.target.value })} />
            </label>
          </div>

          <label className='form-control w-full'>
            <span className='label-text font-medium'>Description</span>
            <textarea className='textarea textarea-bordered min-h-32 w-full' value={formState.genreDescription} onChange={(e) => setFormState({ ...formState, genreDescription: e.target.value })} />
          </label>

          <div className='grid gap-4 md:grid-cols-[1.2fr_0.8fr]'>
            <label className='form-control w-full'>
              <span className='label-text font-medium'>Genre image</span>
              <input type='file' className='file-input file-input-bordered w-full' onChange={(e) => setSelectedImage(e.target.files?.[0] || null)} />
            </label>
            <div className='rounded-2xl border border-base-300 bg-base-200/40 p-4'>
              <div className='text-sm font-medium'>Preview</div>
              {selectedImage || formState.imageUrl ? (
                <Image
                  src={selectedImage ? URL.createObjectURL(selectedImage) : formState.imageUrl}
                  alt='Genre preview'
                  width={640}
                  height={320}
                  unoptimized
                  className='mt-3 h-40 w-full rounded-xl object-cover'
                />
              ) : (
                <div className='mt-3 flex h-40 items-center justify-center rounded-xl border border-dashed border-base-300 text-sm text-base-content/50'>No image selected</div>
              )}
            </div>
          </div>

          {message ? <div className='alert alert-info text-sm'>{message}</div> : null}

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

        <aside className='space-y-3 rounded-3xl border border-base-300 bg-base-200/40 p-4'>
          <div className='flex items-center justify-between'>
            <h3 className='text-lg font-semibold'>Existing genres</h3>
            <span className='text-xs text-base-content/60'>{genres.length} items</span>
          </div>

          <div className='space-y-3'>
            {genres.map((genre) => (
              <article key={genre.genreId} className='rounded-2xl border border-base-300 bg-base-100 p-3'>
                <div className='flex gap-3'>
                  <Image src={genre.imageUrl} alt={genre.genreName} width={80} height={80} unoptimized className='h-20 w-20 rounded-xl object-cover' />
                  <div className='min-w-0 flex-1'>
                    <div className='flex items-start justify-between gap-2'>
                      <div>
                        <p className='text-sm font-semibold'>{genre.genreName}</p>
                        <p className='text-xs text-base-content/60'>{genre.genreId}</p>
                      </div>
                      <div className='flex gap-2'>
                        <button type='button' className='btn btn-outline btn-xs' onClick={() => handleEdit(genre)}>
                          Edit
                        </button>
                        <button type='button' className='btn btn-error btn-xs' onClick={() => handleDelete(genre.genreId)}>
                          Delete
                        </button>
                      </div>
                    </div>
                    <p className='mt-2 line-clamp-3 text-sm text-base-content/70'>{genre.genreDescription}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </aside>
      </div>
    </section>
  );
}