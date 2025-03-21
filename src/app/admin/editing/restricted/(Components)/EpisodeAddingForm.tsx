import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { IContent, ISeason } from '@/app/models/types';



export default function EpisodeAddingForm({ email }: Readonly<{ email: string }>) {
  const imageBb: string = process.env.NEXT_PUBLIC_IMAGEBB_API_KEY ?? '';

  const [content, setContent] = useState<IContent[]>([]);
  const [selectedContent, setSelectedContent] = useState<IContent | null>(null);
  const [selectedSeason, setSelectedSeason] = useState<ISeason | null>(null);

  const [useMainContentImages, setUseMainContentImages] = useState(false);
  const [useSeasonImages, setUseSeasonImages] = useState(false);

  const [contentData, setContentData] = useState({
    email: email,
    contentId: '',
    seasonId: '',
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
    cYtId: '',
    cAudioSrc: '',
    cFullEpisode: '',
    cNextEpisodeSpoilers: '',
  });

  useEffect(() => {
    axios.get('/api/contentcrud/contentgetfull').then(response => setContent(response.data));
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

  const handleSelectContent = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = content.find(c => c.cId === e.target.value) || null;
    setSelectedContent(selected);
    setSelectedSeason(null);

    setContentData(prev => ({
      ...prev,
      contentId: selected?.cId ?? '',
      cTitle: selected?.cTitle ?? '',
      cDescription: selected?.cDescription ?? '',
      cLink: selected?.cLink ?? '',
      cTrailerYtId: selected?.cTrailerYtId ?? '',
      seasonId: '',
    }));
  };

  const handleSelectSeason = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = selectedContent?.cSeasons.find(s => s.cId === e.target.value) ?? null;
    setSelectedSeason(selected);

    setContentData(prev => ({
      ...prev,
      seasonId: selected?.cId ?? '',
    }));
  };

  const handleUseImages = (source: 'content' | 'season') => {
    if (source === 'content') {
      setUseMainContentImages(true);
      setUseSeasonImages(false);
      if (selectedContent) {
        setContentData(prev => ({
          ...prev,
          cLandscape: selectedContent.cLandscape,
          cPortrait: selectedContent.cPortrait,
          cBanner: selectedContent.cBanner,
          cLogo: selectedContent.cLogo,
          cCard: selectedContent.cCard,
          cSquare: selectedContent.cSquare,
        }));
      }
    } else {
      setUseMainContentImages(false);
      setUseSeasonImages(true);
      if (selectedSeason) {
        setContentData(prev => ({
          ...prev,
          cLandscape: selectedSeason.cLandscape,
          cPortrait: selectedSeason.cPortrait,
          cBanner: selectedSeason.cBanner,
          cLogo: selectedSeason.cLogo,
          cCard: selectedSeason.cCard,
          cSquare: selectedSeason.cSquare,
        }));
      }
    }
  };

  const handleUncheckImages = () => {
    setUseMainContentImages(false);
    setUseSeasonImages(false);
    setContentData(prev => ({
      ...prev,
      cLandscape: '',
      cPortrait: '',
      cBanner: '',
      cLogo: '',
      cCard: '',
      cSquare: '',
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(contentData);
    const modifiedData = {
      ...contentData,
      cFullEpisode: contentData.cFullEpisode?.replace(/\r?\n/g, "\\n"),
      cNextEpisodeSpoilers: contentData.cNextEpisodeSpoilers?.replace(/\r?\n/g, "\\n"),
    };

    const response = await fetch('/api/episodescrud/episodespost', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(modifiedData),
    });

    const result = await response.json();
    console.log(result);
  };


  return (
    <div className='flex flex-col justify-center items-center mx-auto w-full space-y-2'>
      <h1>Content Form</h1>
      <form onSubmit={handleSubmit} className='flex flex-col justify-center items-center mx-auto w-full space-y-2'>

        {/* Select Content */}
        <select className="select" defaultValue="Select Content" onChange={handleSelectContent}>
          <option disabled>Select Content</option>
          {content.map(c => (
            <option key={c.cId} value={c.cId}>{c.cTitle}</option>
          ))}
        </select>

        {/* Select Season (if content is selected) */}
        {selectedContent && (
          <select className="select" defaultValue="Select Season" onChange={handleSelectSeason}>
            <option disabled>Select Season</option>
            {selectedContent.cSeasons.map(s => (
              <option key={s.cId} value={s.cId}>{s.cTitle} (Season {s.cNo})</option>
            ))}
          </select>
        )}

        {/* Checkboxes */}
        <div className="flex space-x-4">
          <label>
            <input
              type="checkbox"
              checked={useMainContentImages}
              onChange={() => handleUseImages('content')}
              disabled={useSeasonImages}
            /> Use Main Content Images
          </label>

          <label>
            <input
              type="checkbox"
              checked={useSeasonImages}
              onChange={() => handleUseImages('season')}
              disabled={useMainContentImages}
            /> Use Season Images
          </label>

          <button type="button" onClick={handleUncheckImages}>Reset Images</button>
        </div>
        <input type='file' className='file-input' onChange={(e) => handleFileUpload(e, 'cLandscape')} disabled={useMainContentImages || useSeasonImages} />
        <input type='file' className='file-input' onChange={(e) => handleFileUpload(e, 'cPortrait')} disabled={useMainContentImages || useSeasonImages} />

        <input type='text' placeholder='Id' className='input' value={contentData.cId} onChange={(e) => setContentData({ ...contentData, cId: e.target.value })} />
        <input type='text' placeholder='No' className='input' value={contentData.cNo} onChange={(e) => setContentData({ ...contentData, cNo: e.target.value })} />
        <input type='text' placeholder='Title' className='input' value={contentData.cTitle} onChange={(e) => setContentData({ ...contentData, cTitle: e.target.value })} />
        <textarea className='textarea' placeholder='Description' value={contentData.cDescription} onChange={(e) => setContentData({ ...contentData, cDescription: e.target.value })} />

        <input type='text' placeholder='Link' className='input' value={contentData.cLink} onChange={(e) => setContentData({ ...contentData, cLink: e.target.value })} />
        <input type='text' placeholder='Youtube Id' className='input' value={contentData.cYtId} onChange={(e) => setContentData({ ...contentData, cYtId: e.target.value })} />
        <input type='text' placeholder='Audio Source' className='input' value={contentData.cAudioSrc} onChange={(e) => setContentData({ ...contentData, cAudioSrc: e.target.value })} />
        <textarea
          className="textarea"
          placeholder="Full Episode"
          value={contentData.cFullEpisode}
          onChange={(e) => setContentData({ ...contentData, cFullEpisode: e.target.value })}
        />

        <textarea
          className="textarea"
          placeholder="Next Episode Spoiler"
          value={contentData.cNextEpisodeSpoilers}
          onChange={(e) => setContentData({ ...contentData, cNextEpisodeSpoilers: e.target.value })}
        />


        <input type='submit' className='btn' value='Submit' />
      </form>
    </div>
  );
}
