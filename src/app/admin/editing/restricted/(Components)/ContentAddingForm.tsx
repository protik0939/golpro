import React, { useState, useEffect } from 'react';
import axios from 'axios';

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

export default function ContentAddingForm({ email }: Readonly<{ email: string }>) {

  const imageBb: string = process.env.NEXT_PUBLIC_IMAGEBB_API_KEY ?? '';

  const [contentData, setContentData] = useState({
    emeil: email,
    cContentType: "",
    cId: "",
    cTitle: "",
    cDescription: "",
    cLandscape: "",
    cPortrait: "",
    cBanner: "",
    cLogo: "",
    cCard: "",
    cLink: "",
    cSquare: "",
    cTrailerYtId: "",
    width: 200,
    height: 200,
    cGenre: [] as string[],
    cAuthors: [] as string[],
    cViwersAge: "",
    cUserVisit: 0,
    cSeasons: [] as object[],
  });

  const [genres, setGenres] = useState<Genre[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);

  useEffect(() => {
    // Fetch genres and authors from API
    axios.get('/api/genrecrud/genreget').then(response => setGenres(response.data));
    axios.get('/api/authorscrud/authorGet').then(response => setAuthors(response.data));
  }, []);

  const uploadToImageBB = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('key', imageBb);
    const response = await axios.post('https://api.imgbb.com/1/upload', formData);
    return response.data.data.url;
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
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
    console.log(contentData);
    const response = await fetch('/api/contentcrud/contentpost', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(contentData),
    });

    const result = await response.json();
    
    alert("Content Added Successfully");
    console.log(result);
  };



  return (
    <div className='flex flex-col justify-center items-center mx-auto w-full space-y-2'>
      <h1>Content Form</h1>
      <form className='flex flex-col justify-center items-center mx-auto w-full space-y-2' onSubmit={handleSubmit}>
        <input type='text' placeholder='Id' className='input' value={contentData.cId} onChange={(e) => setContentData({ ...contentData, cId: e.target.value })} />
        <input type='text' placeholder='Title' className='input' value={contentData.cTitle} onChange={(e) => setContentData({ ...contentData, cTitle: e.target.value })} />
        <textarea className='textarea' placeholder='Description' value={contentData.cDescription} onChange={(e) => setContentData({ ...contentData, cDescription: e.target.value })} />
        <h1>Landscape</h1>
        <input type='file' className='file-input' onChange={(e) => handleFileUpload(e, 'cLandscape')} />
        <h1>Portrait</h1>
        <input type='file' className='file-input' onChange={(e) => handleFileUpload(e, 'cPortrait')} />
        <h1>Banner</h1>
        <input type='file' className='file-input' onChange={(e) => handleFileUpload(e, 'cBanner')} />
        <h1>Logo</h1>
        <input type='file' className='file-input' onChange={(e) => handleFileUpload(e, 'cLogo')} />
        <h1>Card</h1>
        <input type='file' className='file-input' onChange={(e) => handleFileUpload(e, 'cCard')} />
        <h1>Square</h1>
        <input type='file' className='file-input' onChange={(e) => handleFileUpload(e, 'cSquare')} />
        <input type='text' placeholder='Link' className='input' value={contentData.cLink} onChange={(e) => setContentData({ ...contentData, cLink: e.target.value })} />
        <input type='text' placeholder='Trailer YouTube ID' className='input' value={contentData.cTrailerYtId} onChange={(e) => setContentData({ ...contentData, cTrailerYtId: e.target.value })} />
        <input type='text' placeholder='Viewer Age' className='input' value={contentData.cViwersAge} onChange={(e) => setContentData({ ...contentData, cViwersAge: e.target.value })} />

        <select defaultValue="Content Type" onChange={(e) => setContentData({ ...contentData, cContentType: e.target.value })} className="select">
          <option disabled={true}>Content Type</option>
          <option>storyseries</option>
          <option>story</option>
          <option>audiostoryseries</option>
          <option>audiostory</option>
        </select>

        <fieldset className="fieldset p-4 bg-base-100 border border-base-300 rounded-box w-80">
          <legend className="fieldset-legend">Genres</legend>
          {genres.map((genre) => (
            <label className="fieldset-label" key={genre.genreId}>
              <input type='checkbox' className="checkbox" checked={contentData.cGenre.includes(genre.genreId)} onChange={() => handleCheckboxChange(genre.genreId, 'cGenre')} />
              {genre.genreName}
            </label>
          ))}
        </fieldset>

        <fieldset className="fieldset p-4 bg-base-100 border border-base-300 rounded-box w-80">
          <legend className="fieldset-legend">Authors</legend>
          {authors.map((author) => (
            <label className="fieldset-label" key={author.authorId}>
              <input type='checkbox' className="checkbox" checked={contentData.cAuthors.includes(author.authorId)} onChange={() => handleCheckboxChange(author.authorId, 'cAuthors')} />
              {author.fullName}
            </label>
          ))}
        </fieldset>

        <input className='btn' type='submit' value='Submit' />
      </form>
    </div>
  );
}
