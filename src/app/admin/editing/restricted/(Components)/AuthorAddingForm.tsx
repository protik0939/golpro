'use client'

import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { FiSearch, FiEdit2, FiTrash2, FiPlus, FiUsers, FiMail, FiCalendar } from 'react-icons/fi';

type AuthorItem = {
  authorId: string;
  email?: string;
  fullName: string;
  description: string;
  imageUrl: string;
  dateOfBirth?: string;
};

type AuthorFormState = {
  authorId: string;
  email: string;
  fullName: string;
  description: string;
  imageUrl: string;
  dateOfBirth: string;
};

type Props = Readonly<{ email: string }>;

const emptyState: AuthorFormState = {
  authorId: '',
  email: '',
  fullName: '',
  description: '',
  imageUrl: '',
  dateOfBirth: '',
};

export default function AuthorAddingForm({ email }: Props) {
  const [authors, setAuthors] = useState<AuthorItem[]>([]);
  const [formState, setFormState] = useState<AuthorFormState>(emptyState);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [mode, setMode] = useState<'create' | 'edit'>('create');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [deletingAuthor, setDeletingAuthor] = useState<AuthorItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const loadAuthors = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get('/api/authorscrud/authorGet');
      setAuthors(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load authors:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDateForInput = (value?: string) => {
    if (!value) return '';
    const parsedDate = new Date(value);
    return Number.isNaN(parsedDate.getTime()) ? '' : parsedDate.toISOString().slice(0, 10);
  };

  useEffect(() => {
    void loadAuthors();
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

  const handleEdit = (author: AuthorItem) => {
    setMode('edit');
    setFormState({
      authorId: author.authorId,
      email: author.email ?? '',
      fullName: author.fullName,
      description: author.description,
      imageUrl: author.imageUrl,
      dateOfBirth: formatDateForInput(author.dateOfBirth),
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

  const confirmDeleteAuthor = async () => {
    if (!deletingAuthor) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/authorscrud/${deletingAuthor.authorId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        throw new Error('Failed to delete author');
      }

      await loadAuthors();
      if (formState.authorId === deletingAuthor.authorId) {
        resetForm();
      }
      setDeletingAuthor(null);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Error deleting author');
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

      if (!formState.authorId || !formState.email || !formState.fullName || !formState.description || !imageUrl || !formState.dateOfBirth) {
        throw new Error('All fields are required');
      }

      const normalizedDescription = formState.description.replace(/\r?\n/g, String.raw`\n`);

      const payload = {
        adminEmail: email,
        authorId: formState.authorId,
        email: formState.email,
        fullName: formState.fullName,
        description: normalizedDescription,
        imageUrl,
        dateOfBirth: formState.dateOfBirth,
      };

      const response = await fetch(
        mode === 'edit' ? `/api/authorscrud/${formState.authorId}` : '/api/authorscrud/authorPost',
        {
          method: mode === 'edit' ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result?.message || result?.error || 'Failed to save author');
      }

      setMessage(result?.message || 'Author saved successfully');
      await loadAuthors();
      resetForm();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredAuthors = useMemo(() => {
    return authors.filter((a) => {
      const q = searchQuery.toLowerCase().trim();
      return (
        q === '' ||
        (a.fullName || '').toLowerCase().includes(q) ||
        (a.authorId || '').toLowerCase().includes(q) ||
        (a.email || '').toLowerCase().includes(q) ||
        (a.description || '').toLowerCase().includes(q)
      );
    });
  }, [authors, searchQuery]);

  return (
    <section className='rounded-3xl border border-base-300 bg-base-100 p-5 shadow-xl sm:p-6 space-y-6'>
      {/* Header */}
      <div className='flex flex-col gap-2 border-b border-base-300 pb-4 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <div className='inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-secondary'>
            <FiUsers /> Creator Directory
          </div>
          <h2 className='text-2xl font-bold'>Author Manager</h2>
          <p className='text-sm text-base-content/70'>Create, update, and manage author profiles, contact details, and dates of birth.</p>
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
            {mode === 'edit' ? `Edit Author (${formState.authorId})` : 'Register New Author'}
          </h3>

          <div className='grid gap-4 md:grid-cols-2'>
            <label className='form-control w-full'>
              <span className='label-text font-medium'>Author ID</span>
              <input
                className='input input-bordered w-full font-mono'
                placeholder='e.g. author-01'
                value={formState.authorId}
                onChange={(e) => setFormState({ ...formState, authorId: e.target.value })}
                disabled={mode === 'edit'}
              />
            </label>
            <label className='form-control w-full'>
              <span className='label-text font-medium'>Full Name</span>
              <input
                className='input input-bordered w-full'
                placeholder='Author Full Name'
                value={formState.fullName}
                onChange={(e) => setFormState({ ...formState, fullName: e.target.value })}
              />
            </label>
          </div>

          <div className='grid gap-4 md:grid-cols-2'>
            <label className='form-control w-full'>
              <span className='label-text font-medium'>Email Address</span>
              <input
                type='email'
                className='input input-bordered w-full'
                placeholder='author@example.com'
                value={formState.email}
                onChange={(e) => setFormState({ ...formState, email: e.target.value })}
              />
            </label>
            <label className='form-control w-full'>
              <span className='label-text font-medium'>Date of Birth</span>
              <input
                type='date'
                className='input input-bordered w-full'
                value={formState.dateOfBirth}
                onChange={(e) => setFormState({ ...formState, dateOfBirth: e.target.value })}
              />
            </label>
          </div>

          <label className='form-control w-full'>
            <span className='label-text font-medium'>Biography & Description</span>
            <textarea
              className='textarea textarea-bordered min-h-28 w-full'
              placeholder='Author biography...'
              value={formState.description}
              onChange={(e) => setFormState({ ...formState, description: e.target.value })}
            />
          </label>

          <div className='grid gap-4 md:grid-cols-[1.2fr_0.8fr]'>
            <label className='form-control w-full'>
              <span className='label-text font-medium'>Profile Image</span>
              <input
                type='file'
                className='file-input file-input-bordered w-full'
                accept='image/*'
                onChange={(e) => setSelectedImage(e.target.files?.[0] || null)}
              />
            </label>
            <div className='rounded-2xl border border-base-300 bg-base-100 p-3'>
              <div className='text-xs font-medium text-base-content/60'>Avatar Preview</div>
              {selectedImage || formState.imageUrl ? (
                <div className='relative mt-2 h-28 w-full overflow-hidden rounded-xl bg-base-300'>
                  <Image
                    src={selectedImage ? URL.createObjectURL(selectedImage) : formState.imageUrl}
                    alt='Author avatar'
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
            <button className='btn btn-secondary btn-sm min-w-32' type='submit' disabled={isSubmitting}>
              {isSubmitting ? <span className='loading loading-spinner loading-xs'></span> : mode === 'edit' ? 'Update Author' : 'Publish Author'}
            </button>
          </div>
        </form>

        {/* Existing Authors List */}
        <aside className='space-y-4 rounded-2xl border border-base-300 bg-base-200/30 p-4'>
          <div className='flex items-center justify-between gap-2 border-b border-base-300/50 pb-2'>
            <h3 className='text-lg font-bold'>Existing Authors ({authors.length})</h3>
            <div className='relative w-44 sm:w-56'>
              <FiSearch className='absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-base-content/40' />
              <input
                type='text'
                className='input input-bordered input-xs w-full pl-7'
                placeholder='Search authors...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className='space-y-3 max-h-[500px] overflow-y-auto pr-1'>
            {isLoading ? (
              <div className='flex min-h-32 items-center justify-center text-sm text-base-content/60'>
                <span className='loading loading-spinner loading-sm text-secondary'></span>
              </div>
            ) : filteredAuthors.length > 0 ? (
              filteredAuthors.map((author) => (
                <article key={author.authorId} className='flex gap-3 rounded-xl border border-base-300 bg-base-100 p-3 shadow-sm hover:shadow-md transition-shadow'>
                  <div className='relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-base-300'>
                    <Image src={author.imageUrl || 'https://placehold.co/100'} alt={author.fullName} fill unoptimized className='object-cover' />
                  </div>
                  <div className='min-w-0 flex-1 space-y-1'>
                    <div className='flex items-start justify-between gap-2'>
                      <div>
                        <h4 className='text-sm font-bold text-base-content line-clamp-1'>{author.fullName}</h4>
                        <div className='flex flex-wrap items-center gap-1 text-[11px] text-base-content/60 font-mono'>
                          <span>{author.authorId}</span>
                          {author.email && <span className='flex items-center gap-0.5 text-secondary'><FiMail /> {author.email}</span>}
                        </div>
                      </div>
                      <div className='flex gap-1 shrink-0'>
                        <button type='button' className='btn btn-ghost btn-xs text-info' onClick={() => handleEdit(author)} title='Edit'>
                          <FiEdit2 />
                        </button>
                        <button type='button' className='btn btn-ghost btn-xs text-error' onClick={() => setDeletingAuthor(author)} title='Delete'>
                          <FiTrash2 />
                        </button>
                      </div>
                    </div>
                    {author.dateOfBirth && (
                      <div className='flex items-center gap-1 text-[11px] text-base-content/50'>
                        <FiCalendar /> DOB: {new Date(author.dateOfBirth).toLocaleDateString()}
                      </div>
                    )}
                    <p className='line-clamp-2 text-xs text-base-content/70'>{author.description}</p>
                  </div>
                </article>
              ))
            ) : (
              <div className='flex min-h-32 items-center justify-center rounded-xl border border-dashed border-base-300 text-xs text-base-content/50'>
                No authors found matching your search.
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* Delete Confirmation Modal */}
      {deletingAuthor && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm'>
          <div className='card w-full max-w-sm bg-base-100 p-5 shadow-2xl space-y-4'>
            <div className='flex items-center gap-2 text-error'>
              <FiTrash2 className='h-6 w-6' />
              <h3 className='font-bold text-lg'>Delete Author</h3>
            </div>
            <p className='text-sm text-base-content/80'>
              Delete author <strong>{deletingAuthor.fullName}</strong> ({deletingAuthor.authorId})?
            </p>
            <div className='flex justify-end gap-2 pt-2'>
              <button className='btn btn-ghost btn-xs' onClick={() => setDeletingAuthor(null)} disabled={isDeleting}>
                Cancel
              </button>
              <button className='btn btn-error btn-xs text-white' onClick={confirmDeleteAuthor} disabled={isDeleting}>
                {isDeleting ? <span className='loading loading-spinner loading-xs'></span> : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}