import React, { useState } from 'react';
import axios from 'axios';

export default function AuthorAddingForm({ email }: Readonly<{ email: string }>) {
    const [authorId, setAuthorId] = useState('');
    const [fullName, setFullName] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState<File | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!authorId || !fullName || !description || !image) {
            alert("All fields are required!");
            return;
        }

        try {
            // Upload Image to ImageBB
            const formData = new FormData();
            formData.append("image", image);

            const { data: imgbbData } = await axios.post(
                `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMAGEBB_API_KEY}`,
                formData
            );

            if (!imgbbData.success) {
                throw new Error("Image upload failed");
            }

            const imageUrl = imgbbData.data.url;

            // Save author details to MongoDB
            const { data: response } = await axios.post('/api/authorscrud/authorPost', {
                email,
                authorId,
                fullName,
                description: description.replace(/\r?\n/g, "\\n"), // Convert new lines to \n
                imageUrl,
            });

            alert(response.message);
            setAuthorId('');
            setFullName('');
            setDescription('');
            setImage(null);
        } catch (error: unknown) {
            console.error(error);
            alert("Something went wrong!");
        }
    };

    return (
        <div className='flex flex-col justify-center items-center mx-auto w-full space-y-2'>
            <h1>Authors</h1>
            <form className='flex flex-col justify-center items-center mx-auto w-full space-y-2' onSubmit={handleSubmit}>
                <input type="text" placeholder="Author Id" className="input" value={authorId} onChange={(e) => setAuthorId(e.target.value)} />
                <input type="text" placeholder="Author Full Name" className="input" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                <textarea
                    className="textarea"
                    placeholder="Author Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                ></textarea>
                <input type="file" className="file-input" onChange={(e) => setImage(e.target.files?.[0] || null)} />
                <input className='btn' type="submit" value={'Submit'} />
            </form>
        </div>
    );
}
