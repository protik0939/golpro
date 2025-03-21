import axios from 'axios';
import React, { useState } from 'react'

export default function GenreAddingForm({ email }: Readonly<{ email: string }>) {

  const [genreId, setGenreId] = useState('');
  const [genreName, setGenreName] = useState('');
  const [genreDescription, setGenreDescription] = useState('');
  const [genreImage, setGenreImage] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!genreId || !genreName || !genreDescription || !genreImage) {
      alert("All fields are required!");
      return;
    }

    try {
      // Upload Image to ImageBB
      const formData = new FormData();
      formData.append("image", genreImage);

      const { data: imgbbData } = await axios.post(
        `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMAGEBB_API_KEY}`,
        formData
      );

      if (!imgbbData.success) {
        throw new Error("Image upload failed");
      }

      const imageUrl = imgbbData.data.url;

      // Save author details to MongoDB
      const { data: response } = await axios.post('/api/genrecrud/genrepost', {
        email,
        genreId,
        genreName,
        genreDescription: genreDescription.replace(/\r?\n/g, "\\n"), // Convert new lines to \n
        imageUrl,
      });

      alert(response.message);
      setGenreId('');
      setGenreName('');
      setGenreDescription('');
      setGenreImage(null);
    } catch (error: any) {
      console.error(error);
      alert(error.response?.data?.message || "Something went wrong!");
    }
  };

  return (
    <div className='flex flex-col justify-center items-center mx-auto w-full space-y-2'>
      <h1>Genres</h1>
      <form className='flex flex-col justify-center items-center mx-auto w-full space-y-2' onSubmit={handleSubmit}>
        <input type="text" placeholder="Genre Id" className="input" value={genreId} onChange={(e) => setGenreId(e.target.value)} />
        <input type="text" placeholder="Genre Name" className="input" value={genreName} onChange={(e) => setGenreName(e.target.value)} />
        <textarea
          className="textarea"
          placeholder="Genre Description"
          value={genreDescription}
          onChange={(e) => setGenreDescription(e.target.value)}
        ></textarea>
        <input type="file" className="file-input" onChange={(e) => setGenreImage(e.target.files?.[0] || null)} />
        <input className='btn' type="submit" value={'Submit'} />
      </form>
    </div>
  )
}
