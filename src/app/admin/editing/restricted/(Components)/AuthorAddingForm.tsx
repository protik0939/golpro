'use client'

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';

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

  const loadAuthors = async () => {
    const { data } = await axios.get('/api/authorscrud/authorGet');
    setAuthors(data);
  };

  const formatDateForInput = (value?: string) => {
    if (!value) {
      return '';
    }

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

  const handleDelete = async (authorId: string) => {
    const confirmed = globalThis.confirm(`Delete author ${authorId}?`);
    if (!confirmed) {
      return;
    }

    await fetch(`/api/authorscrud/${authorId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    await loadAuthors();
    if (formState.authorId === authorId) {
      resetForm();
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

  const submitLabel = mode === 'edit' ? 'Update author' : 'Publish author';

  return (
    <section className='rounded-3xl border border-base-300 bg-base-100/90 p-5 shadow-xl shadow-black/5 backdrop-blur sm:p-6'>
      <div className='mb-6 flex flex-col gap-2 border-b border-base-300 pb-4'>
        <p className='text-sm font-semibold uppercase tracking-[0.2em] text-primary'>Author manager</p>
        <div className='flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between'>
          <div>
            <h2 className='text-2xl font-bold'>Authors</h2>
            <p className='text-sm text-base-content/70'>Create, edit, and remove author records with a responsive list and inline image preview.</p>
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
              <span className='label-text font-medium'>Author ID</span>
              <input className='input input-bordered w-full' value={formState.authorId} onChange={(e) => setFormState({ ...formState, authorId: e.target.value })} disabled={mode === 'edit'} />
            </label>
            <label className='form-control w-full'>
              <span className='label-text font-medium'>Full name</span>
              <input className='input input-bordered w-full' value={formState.fullName} onChange={(e) => setFormState({ ...formState, fullName: e.target.value })} />
            </label>
          </div>

          <div className='grid gap-4 md:grid-cols-2'>
            <label className='form-control w-full'>
              <span className='label-text font-medium'>Email</span>
              <input type='email' className='input input-bordered w-full' value={formState.email} onChange={(e) => setFormState({ ...formState, email: e.target.value })} />
            </label>
            <label className='form-control w-full'>
              <span className='label-text font-medium'>Date of birth</span>
              <input type='date' className='input input-bordered w-full' value={formState.dateOfBirth} onChange={(e) => setFormState({ ...formState, dateOfBirth: e.target.value })} />
            </label>
          </div>

          <label className='form-control w-full'>
            <span className='label-text font-medium'>Description</span>
            <textarea className='textarea textarea-bordered min-h-32 w-full' value={formState.description} onChange={(e) => setFormState({ ...formState, description: e.target.value })} />
          </label>

          <div className='grid gap-4 md:grid-cols-[1.2fr_0.8fr]'>
            <label className='form-control w-full'>
              <span className='label-text font-medium'>Author image</span>
              <input type='file' className='file-input file-input-bordered w-full' onChange={(e) => setSelectedImage(e.target.files?.[0] || null)} />
            </label>
            <div className='rounded-2xl border border-base-300 bg-base-200/40 p-4'>
              <div className='text-sm font-medium'>Preview</div>
              {selectedImage || formState.imageUrl ? (
                <Image
                  src={selectedImage ? URL.createObjectURL(selectedImage) : formState.imageUrl}
                  alt='Author preview'
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
            <h3 className='text-lg font-semibold'>Existing authors</h3>
            <span className='text-xs text-base-content/60'>{authors.length} items</span>
          </div>

          <div className='space-y-3'>
            {authors.map((author) => (
              <article key={author.authorId} className='rounded-2xl border border-base-300 bg-base-100 p-3'>
                <div className='flex gap-3'>
                  <Image src={author.imageUrl} alt={author.fullName} width={80} height={80} unoptimized className='h-20 w-20 rounded-xl object-cover' />
                  <div className='min-w-0 flex-1'>
                    <div className='flex items-start justify-between gap-2'>
                      <div>
                        <p className='text-sm font-semibold'>{author.fullName}</p>
                        <p className='text-xs text-base-content/60'>{author.authorId}</p>
                        <p className='text-xs text-base-content/60'>{author.email}</p>
                        <p className='text-xs text-base-content/60'>{author.dateOfBirth ? new Date(author.dateOfBirth).toLocaleDateString() : ''}</p>
                      </div>
                      <div className='flex gap-2'>
                        <button type='button' className='btn btn-outline btn-xs' onClick={() => handleEdit(author)}>
                          Edit
                        </button>
                        <button type='button' className='btn btn-error btn-xs' onClick={() => handleDelete(author.authorId)}>
                          Delete
                        </button>
                      </div>
                    </div>
                    <p className='mt-2 line-clamp-3 text-sm text-base-content/70'>{author.description}</p>
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