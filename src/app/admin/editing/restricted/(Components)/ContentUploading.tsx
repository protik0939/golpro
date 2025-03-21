'use client'
import React, { useState } from 'react'
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import ContentAddingForm from './ContentAddingForm';
import SeasonAddingForm from './SeasonAddingForm';
import EpisodeAddingForm from './EpisodeAddingForm';
import GenreAddingForm from './GenreAddingForm';
import AuthorAddingForm from './AuthorAddingForm';

export default function ContentUploading() {
    const [forms, setForms] = useState<string>("");

    const { data: session, status } = useSession();
    const router = useRouter();

    if (status === "loading") {
        return <div>Loading...</div>;
    }
    else if (session && session?.user?.email === 'protik0939@gmail.com') {
        return (
            <div className='pt-20'>
                <div className='w-full flex items-center justify-center space-x-2'>
                    <button onClick={() => setForms("content")} className='btn btn-primary'>Add Content</button>
                    <button onClick={() => setForms("Seasons")} className='btn btn-primary'>Add Seasons</button>
                    <button onClick={() => setForms("Episodes")} className='btn btn-primary'>Add Episodes</button>
                    <button onClick={() => setForms("Genre")} className='btn btn-primary'>Add Genre</button>
                    <button onClick={() => setForms("Authors")} className='btn btn-primary'>Add Authors</button>
                </div>
                {forms === 'content' && <ContentAddingForm email={session?.user?.email} />}
                {forms === 'Seasons' && <SeasonAddingForm email={session?.user?.email} />}
                {forms === 'Episodes' && <EpisodeAddingForm email={session?.user?.email} />}
                {forms === 'Genre' && <GenreAddingForm email={session?.user?.email} />}
                {forms === 'Authors' && <AuthorAddingForm email={session?.user?.email} />}
            </div>
        )
    }
    else {
        router.push("/");
    }
}
