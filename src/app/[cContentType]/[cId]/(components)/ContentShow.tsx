'use client'
import { IContent, IAuthor, IGenre } from '@/app/models/types';
import shimmer from '@/components/Shimmer';
import toBase64 from '@/components/ToBasesf';
import axios from 'axios';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import SeasonsCarousal from './SeasonsCarousal';
import EpisodeCarousal from './EpisodeCarousal';

interface CIdProps {
    readonly cId: string;
}

export default function ContentShow({ cId }: CIdProps) {
    const [content, setContent] = useState<IContent | null>(null);
    const [loading, setLoading] = useState(true);
    const [authors, setAuthors] = useState<IAuthor[]>([]);
    const [genres, setGenres] = useState<IGenre[]>([]);
    const [aLoading, setALoading] = useState(true);
    const [gLoading, setGLoading] = useState(true);
    const [totalSeasons, setTotalSeasons] = useState(0);
    const [totalEpisodes, setTotalEpisodes] = useState(0);
    const [seasons, setSeasons] = useState<number>(0);

    const [bgImages, setBgImages] = useState({
        banner: "",
        landscape: "",
        portrait: "",
        logo: "",
        description: "",
        title: "",
    });

    useEffect(() => {
        if (!cId) return;

        const fetchContent = async () => {
            try {
                const { data } = await axios.get(`/api/contentcrud/${cId}`);
                if (!data?.cSeasons) {
                    console.error("Invalid content data:", data);
                    setContent(null);
                    return;
                }
                setContent(data);
                calculateSeasonsAndEpisodes(data);
                setBgImages({
                    banner: data.cBanner ?? "",
                    landscape: data.cLandscape ?? "",
                    portrait: data.cPortrait ?? "",
                    logo: data.cLogo ?? "",
                    description: data.cDescription ?? "",
                    title: data.cTitle ?? "",
                });
                setSeasons(data.cSeasons.length > 0 ? data.cSeasons.length - 1 : 0);
            } catch (error) {
                console.error("Error fetching content:", error);
            } finally {
                setLoading(false);
            }
        };


        fetchContent();
    }, [cId]);

    useEffect(() => {
        if (!content) return;

        const fetchAuthorsAndGenres = async () => {
            try {
                setALoading(true);
                setGLoading(true);

                const authorResponses = await Promise.all(
                    content.cAuthors.map(authorId => axios.get(`/api/authorscrud/${authorId}`))
                );
                setAuthors(authorResponses.filter(res => res !== null).map(res => res.data));

                const genreResponses = await Promise.all(
                    content.cGenre.map(genreId => axios.get(`/api/genrecrud/${genreId}`))
                );
                setGenres(genreResponses.filter(res => res !== null).map(res => res.data));
            } catch (error) {
                console.error("Error fetching authors or genres:", error);
            } finally {
                setALoading(false);
                setGLoading(false);
            }
        };

        fetchAuthorsAndGenres();
    }, [content]);

    const calculateSeasonsAndEpisodes = (data: IContent) => {
        if (!data.cSeasons) return;
        setTotalSeasons(data.cSeasons.length);
        setTotalEpisodes(data.cSeasons.reduce((sum, season) => sum + (season.cEpisodes?.length ?? 0), 0));
    };

    const handleSeasonChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const seasonIndex = Number(e.target.value) - 1;
        if (content?.cSeasons && seasonIndex >= 0 && seasonIndex < content.cSeasons.length) {
            setSeasons(seasonIndex);
            setBgImages({
                banner: content.cSeasons[seasonIndex]?.cBanner ?? "",
                landscape: content.cSeasons[seasonIndex]?.cLandscape ?? "",
                portrait: content.cSeasons[seasonIndex]?.cPortrait ?? "",
                logo: content.cSeasons[seasonIndex]?.cLogo ?? "",
                title: content.cSeasons[seasonIndex]?.cTitle ?? "",
                description: content.cSeasons[seasonIndex]?.cDescription ?? "",
            });
        }
    };

    if (loading) return <h1>Loading......</h1>;
    if (!content) return <h1>No content found</h1>;

    return (
        <div>
            <div className='w-full relative -z-20 '>
                <Image unoptimized src={bgImages.portrait} alt="Responsive Image" width={1094} height={1625} className="block md:hidden object-cover" placeholder={`data:image/svg+xml;base64,${toBase64(shimmer(1094, 1625))}`} />
                <Image unoptimized src={bgImages.landscape} alt="Responsive Image" width={2375} height={1137} className="hidden md:block lg:hidden object-cover" placeholder={`data:image/svg+xml;base64,${toBase64(shimmer(2375, 1137))}`} />
                <Image unoptimized src={bgImages.banner} alt="Responsive Image" width={2375} height={825} className="hidden lg:block object-cover" placeholder={`data:image/svg+xml;base64,${toBase64(shimmer(2375, 825))}`} />
                <div className='absolute contents-bg w-full h-full bottom-0' />
                <div className='absolute bottom-0 w-full p-5'>
                    <Image unoptimized src={bgImages.logo} alt="Logo Image" width='200' height='200' className={`!w-1/3 lg:!w-1/8 object-cover`} loading='eager' />
                    <div className='flex flex-col lg:flex-row justify-between'>
                        <div>
                            <h1 className='font-bold text-lg'>{bgImages.title}</h1>
                            <h1>{bgImages.description}</h1>
                            <h1>Allowed for age: {content.cViwersAge}</h1>
                            <h1>{totalSeasons} Seasons | {totalEpisodes} Episodes</h1>
                        </div>
                        <div className='flex flex-col'>
                            {/* Display Authors */}
                            <strong>Authors:</strong>
                            {aLoading ? (
                                <p>Loading authors...</p>
                            ) : (
                                <p> {authors.map(a => a.fullName).join(', ')}</p>
                            )}
                        </div>

                        <div className='flex flex-col'>
                            {/* Display Genres */}
                            <strong>Genres:</strong>
                            {gLoading ? (
                                <p>Loading genres...</p>
                            ) : (
                                <p> {genres.map(g => g.genreName).join(', ')}</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className='pl-5'>
                <select defaultValue="Select Season" className="select select-ghost border-[1px] border-secondary" onChange={handleSeasonChange}>
                    <option disabled>Select Season</option>
                    {content.cSeasons.map((season) => (
                        <option key={season.cId} value={season.cNo}>{season.cNo} | {season.cTitle}</option>
                    ))}
                </select>
            </div>

            {content.cSeasons[seasons]?.cEpisodes && (
                <EpisodeCarousal title={`Season ${seasons + 1} Episodes`} slidesInfo={content.cSeasons[seasons].cEpisodes} contentType={content.cContentType} />
            )}

            <SeasonsCarousal title="Seasons" slidesInfo={content.cSeasons} contentType={content.cContentType} />
        </div>
    );
}
