'use client'

import axios from 'axios';
import React, { useEffect, useState, useMemo } from 'react';
import Image from 'next/image';
import { FiSearch, FiEdit2, FiTrash2, FiPlus, FiTag } from 'react-icons/fi';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [deletingGenre, setDeletingGenre] = useState<GenreItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const loadGenres = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get('/api/genrecrud/genreget');
      setGenres(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load genres:', error);
    } finally {
      setIsLoading(false);
    }
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

  const confirmDeleteGenre = async () => {
    if (!deletingGenre) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/genrecrud/${deletingGenre.genreId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        throw new Error('Failed to delete genre');
      }

      await loadGenres();
      if (formState.genreId === deletingGenre.genreId) {
        resetForm();
      }
      setDeletingGenre(null);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Error deleting genre');
    } finally {
      setIsDeleting(false);
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

  const filteredGenres = useMemo(() => {
    return genres.filter((g) => {
      const q = searchQuery.toLowerCase().trim();
      return (
        q === '' ||
        (g.genreName || '').toLowerCase().includes(q) ||
        (g.genreId || '').toLowerCase().includes(q) ||
        (g.genreDescription || '').toLowerCase().includes(q)
      );
    });
  }, [genres, searchQuery]);

  return (
    <section className='rounded-3xl border border-base-300 bg-base-100 p-5 shadow-xl sm:p-6 space-y-6'>
      {/* Header */}
      <div className='flex flex-col gap-2 border-b border-base-300 pb-4 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <div className='inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary'>
            <FiTag /> Taxonomy Management
          </div>
          <h2 className='text-2xl font-bold'>Genre Manager</h2>
          <p className='text-sm text-base-content/70'>Create, edit, and remove content genres with real-time preview.</p>
        </div>
        {mode === 'edit' && (
          <button type='button' className='btn btn-ghost btn-sm gap-1' onClick={resetForm}>
            <FiPlus /> Switch to Create Mode
          </button>
        )}
      </div>

      <div className='grid gap-6 xl:grid-cols-[1fr_0.9fr]'>
        {/* Form */}
        <form className='space-y-4 rounded-2xl border border-base-300 bg-base-200/30 p-4' onSubmit={handleSubmit}>
          <h3 className='font-bold text-lg border-b border-base-300/50 pb-2'>
            {mode === 'edit' ? `Edit Genre (${formState.genreId})` : 'Add New Genre'}
          </h3>

          <div className='grid gap-4 md:grid-cols-2'>
            <label className='form-control w-full'>
              <span className='label-text font-medium'>Genre ID</span>
              <input
                className='input input-bordered w-full font-mono'
                placeholder='e.g. sci-fi'
                value={formState.genreId}
                onChange={(e) => setFormState({ ...formState, genreId: e.target.value })}
                disabled={mode === 'edit'}
              />
            </label>
            <label className='form-control w-full'>
              <span className='label-text font-medium'>Genre Name</span>
              <input
                className='input input-bordered w-full'
                placeholder='e.g. Science Fiction'
                value={formState.genreName}
                onChange={(e) => setFormState({ ...formState, genreName: e.target.value })}
              />
            </label>
          </div>

          <label className='form-control w-full'>
            <span className='label-text font-medium'>Description</span>
            <textarea
              className='textarea textarea-bordered min-h-28 w-full'
              placeholder='Genre summary...'
              value={formState.genreDescription}
              onChange={(e) => setFormState({ ...formState, genreDescription: e.target.value })}
            />
          </label>

          <div className='grid gap-4 md:grid-cols-[1.2fr_0.8fr]'>
            <label className='form-control w-full'>
              <span className='label-text font-medium'>Genre Image</span>
              <input
                type='file'
                className='file-input file-input-bordered w-full'
                accept='image/*'
                onChange={(e) => setSelectedImage(e.target.files?.[0] || null)}
              />
            </label>
            <div className='rounded-2xl border border-base-300 bg-base-100 p-3'>
              <div className='text-xs font-medium text-base-content/60'>Image Preview</div>
              {selectedImage || formState.imageUrl ? (
                <div className='relative mt-2 h-28 w-full overflow-hidden rounded-xl bg-base-300'>
                  <Image
                    src={selectedImage ? URL.createObjectURL(selectedImage) : formState.imageUrl}
                    alt='Genre preview'
                    fill
                    unoptimized
                    className='object-cover'
                  />
                </div>
              ) : (
                <div className='mt-2 flex h-28 items-center justify-center rounded-xl border border-dashed border-base-300 text-xs text-base-content/40'>
                  No image chosen
                </div>
              )}
            </div>
          </div>

          {message && (
            <div className={`alert ${message.includes('successfully') ? 'alert-success text-white' : 'alert-error text-white'} text-sm`}>
              {message}
            </div>
          )}

          <div className='flex items-center justify-end gap-3 pt-2'>
            {mode === 'edit' && (
              <button type='button' className='btn btn-ghost btn-sm' onClick={resetForm}>
                Cancel Edit
              </button>
            )}
            <button className='btn btn-primary btn-sm min-w-32' type='submit' disabled={isSubmitting}>
              {isSubmitting ? <span className='loading loading-spinner loading-xs'></span> : mode === 'edit' ? 'Update Genre' : 'Publish Genre'}
            </button>
          </div>
        </form>

        {/* Existing Genres List */}
        <aside className='space-y-4 rounded-2xl border border-base-300 bg-base-200/30 p-4'>
          <div className='flex items-center justify-between gap-2 border-b border-base-300/50 pb-2'>
            <h3 className='text-lg font-bold'>Existing Genres ({genres.length})</h3>
            <div className='relative w-44 sm:w-56'>
              <FiSearch className='absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-base-content/40' />
              <input
                type='text'
                className='input input-bordered input-xs w-full pl-7'
                placeholder='Search genres...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className='space-y-3 max-h-[500px] overflow-y-auto pr-1'>
            {isLoading ? (
              <div className='flex min-h-32 items-center justify-center text-sm text-base-content/60'>
                <span className='loading loading-spinner loading-sm text-primary'></span>
              </div>
            ) : filteredGenres.length > 0 ? (
              filteredGenres.map((genre) => (
                <article key={genre.genreId} className='flex gap-3 rounded-xl border border-base-300 bg-base-100 p-3 shadow-sm hover:shadow-md transition-shadow'>
                  <div className='relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-base-300'>
                    <Image src={genre.imageUrl || 'https://placehold.co/100'} alt={genre.genreName} fill unoptimized className='object-cover' />
                  </div>
                  <div className='min-w-0 flex-1 space-y-1'>
                    <div className='flex items-start justify-between gap-2'>
                      <div>
                        <h4 className='text-sm font-bold text-base-content line-clamp-1'>{genre.genreName}</h4>
                        <span className='badge badge-ghost badge-xs font-mono'>{genre.genreId}</span>
                      </div>
                      <div className='flex gap-1 shrink-0'>
                        <button type='button' className='btn btn-ghost btn-xs text-info' onClick={() => handleEdit(genre)} title='Edit'>
                          <FiEdit2 />
                        </button>
                        <button type='button' className='btn btn-ghost btn-xs text-error' onClick={() => setDeletingGenre(genre)} title='Delete'>
                          <FiTrash2 />
                        </button>
                      </div>
                    </div>
                    <p className='line-clamp-2 text-xs text-base-content/70'>{genre.genreDescription}</p>
                  </div>
                </article>
              ))
            ) : (
              <div className='flex min-h-32 items-center justify-center rounded-xl border border-dashed border-base-300 text-xs text-base-content/50'>
                No genres found matching your search.
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* Delete Confirmation Modal */}
      {deletingGenre && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm'>
          <div className='card w-full max-w-sm bg-base-100 p-5 shadow-2xl space-y-4'>
            <div className='flex items-center gap-2 text-error'>
              <FiTrash2 className='h-6 w-6' />
              <h3 className='font-bold text-lg'>Delete Genre</h3>
            </div>
            <p className='text-sm text-base-content/80'>
              Delete <strong>{deletingGenre.genreName}</strong> ({deletingGenre.genreId})?
            </p>
            <div className='flex justify-end gap-2 pt-2'>
              <button className='btn btn-ghost btn-xs' onClick={() => setDeletingGenre(null)} disabled={isDeleting}>
                Cancel
              </button>
              <button className='btn btn-error btn-xs text-white' onClick={confirmDeleteGenre} disabled={isDeleting}>
                {isDeleting ? <span className='loading loading-spinner loading-xs'></span> : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}