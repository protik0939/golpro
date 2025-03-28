import React, { useState, useEffect } from 'react';
import axios from 'axios';

export interface IContent {
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
  createdAt?: Date;
  updatedAt?: Date;
}

export default function SeasonAddingForm({ email }: Readonly<{ email: string }>) {
  const imageBb: string = process.env.NEXT_PUBLIC_IMAGEBB_API_KEY ?? '';
  
  const [useExistingImages, setUseExistingImages] = useState(false);
  const [selectedContent, setSelectedContent] = useState<IContent | null>(null);
  
  const [contentData, setContentData] = useState({
    email: email,
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
    cEpisodes: [] as object[],
  });

  const [content, setContent] = useState<IContent[]>([]);

  useEffect(() => {
    axios.get('/api/contentcrud/contentget').then(response => setContent(response.data));
    console.log(content);
  });

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

  const handleSelectContent = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = content.find(c => c.cId === e.target.value) || null;
    setSelectedContent(selected);
    setContentData(prev => ({
      ...prev,
      contentId: e.target.value,
      cTitle: selected?.cTitle ?? '',
      cDescription: selected?.cDescription ?? '',
      cLink: selected?.cLink ?? '',
      cTrailerYtId: selected?.cTrailerYtId ?? '',
    }));

    if (useExistingImages && selected) {
      setContentData(prev => ({
        ...prev,
        cLandscape: selected.cLandscape,
        cPortrait: selected.cPortrait,
        cBanner: selected.cBanner,
        cLogo: selected.cLogo,
        cCard: selected.cCard,
        cSquare: selected.cSquare,
      }));
    }
  };

  const handleUseExistingImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUseExistingImages(e.target.checked);
    if (e.target.checked && selectedContent) {
      setContentData(prev => ({
        ...prev,
        cLandscape: selectedContent.cLandscape,
        cPortrait: selectedContent.cPortrait,
        cBanner: selectedContent.cBanner,
        cLogo: selectedContent.cLogo,
        cCard: selectedContent.cCard,
        cSquare: selectedContent.cSquare,
      }));
    } else {
      setContentData(prev => ({
        ...prev,
        cLandscape: '',
        cPortrait: '',
        cBanner: '',
        cLogo: '',
        cCard: '',
        cSquare: '',
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(contentData);
    const response = await fetch('/api/seasonscrud/seasonspost', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(contentData),
    });

    const result = await response.json();
    
    alert("Season added successfully!");
    console.log(result);
  };

  return (
    <div className='flex flex-col justify-center items-center mx-auto w-full space-y-2'>
      <h1>Content Form</h1>
      <form className='flex flex-col justify-center items-center mx-auto w-full space-y-2' onSubmit={handleSubmit}>
        <select defaultValue="Select Content" className="select" onChange={handleSelectContent}>
          <option disabled={true}>Select Content</option>
          {content.map(c => (
            <option key={c.cId} value={c.cId}>{c.cTitle}</option>
          ))}
        </select>

        <label className="flex items-center space-x-2">
          <input type="checkbox" checked={useExistingImages} onChange={handleUseExistingImages} />
          <span>Use Existing Images</span>
        </label>

        <input type='text' placeholder='Id' className='input' value={contentData.cId} onChange={(e) => setContentData({ ...contentData, cId: e.target.value })} />
        <input type='text' placeholder='No' className='input' value={contentData.cNo} onChange={(e) => setContentData({ ...contentData, cNo: e.target.value })} />
        <input type='text' placeholder='Title' className='input' value={contentData.cTitle} onChange={(e) => setContentData({ ...contentData, cTitle: e.target.value })} />
        <textarea className='textarea' placeholder='Description' value={contentData.cDescription} onChange={(e) => setContentData({ ...contentData, cDescription: e.target.value })} />

        <h1>Landscape</h1>
        <input type='file' className='file-input' onChange={(e) => handleFileUpload(e, 'cLandscape')} disabled={useExistingImages} />

        <h1>Portrait</h1>
        <input type='file' className='file-input' onChange={(e) => handleFileUpload(e, 'cPortrait')} disabled={useExistingImages} />

        <h1>Banner</h1>
        <input type='file' className='file-input' onChange={(e) => handleFileUpload(e, 'cBanner')} disabled={useExistingImages} />

        <h1>Logo</h1>
        <input type='file' className='file-input' onChange={(e) => handleFileUpload(e, 'cLogo')} disabled={useExistingImages} />

        <h1>Card</h1>
        <input type='file' className='file-input' onChange={(e) => handleFileUpload(e, 'cCard')} disabled={useExistingImages} />

        <h1>Square</h1>
        <input type='file' className='file-input' onChange={(e) => handleFileUpload(e, 'cSquare')} disabled={useExistingImages} />

        <input type='text' placeholder='Link' className='input' value={contentData.cLink} onChange={(e) => setContentData({ ...contentData, cLink: e.target.value })} />
        <input type='text' placeholder='Trailer YouTube ID' className='input' value={contentData.cTrailerYtId} onChange={(e) => setContentData({ ...contentData, cTrailerYtId: e.target.value })} />

        <input className='btn' type='submit' value='Submit' />
      </form>
    </div>
  );
}
