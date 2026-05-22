"use client";

import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { CiPause1, CiPlay1 } from "react-icons/ci";
import { IoShareSocialOutline } from "react-icons/io5";
import {
  RiArrowRightLine,
  RiDiscLine,
  RiSearchLine,
  RiSparklingLine,
} from "react-icons/ri";

import { useMusic } from "@/app/context/MusicContext";
import { useShare } from "@/app/context/ShareContext";
import { IAudio, IEpisode, ISeason } from "@/DummyApi/typeScript";

type AudiobookRouteParams = {
  cId?: string;
  seasonId?: string;
  episodeId?: string;
};

type FlatEpisode = {
  music: IAudio;
  musicIndex: number;
  season: ISeason;
  seasonIndex: number;
  episode: IEpisode;
  episodeIndex: number;
};

function buildEpisodePath(item: FlatEpisode) {
  return `/audiobooks/${item.music.cId}/${item.season.cId}/${item.episode.cId}`;
}

function sameEpisode(left: FlatEpisode | null, right: FlatEpisode | null) {
  return (
    left?.music.cId === right?.music.cId &&
    left?.season.cId === right?.season.cId &&
    left?.episode.cId === right?.episode.cId
  );
}

export default function Audiobooks() {
  const router = useRouter();
  const params = useParams<AudiobookRouteParams>();
  const [songs, setSongs] = useState<IAudio[]>([]);
  const [loadingMusic, setLoadingMusic] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [loadError, setLoadError] = useState<string | null>(null);
  const {
    playMusic,
    playControl,
    isPlaying,
    selectedContentIndex,
    selectedSeasonIndex,
    selectedMusicIndex,
  } = useMusic();
  const { handleShareClick, shareStatus } = useShare();
  const autoSelectedRef = useRef(false);

  useEffect(() => {
    const fetchEpisode = async () => {
      try {
        const response = await axios.get<IAudio[]>("/api/contentcrud/audioget");
        setSongs(response.data);
      } catch (error) {
        console.error("Error fetching audiobook content:", error);
        setLoadError("Unable to load audiobooks right now.");
      } finally {
        setLoadingMusic(false);
      }
    };

    fetchEpisode();
  }, []);

  const flattenedEpisodes = useMemo<FlatEpisode[]>(() => {
    return songs.flatMap((music, musicIndex) =>
      music.cSeasons.flatMap((season, seasonIndex) =>
        season.cEpisodes.map((episode, episodeIndex) => ({
          music,
          musicIndex,
          season,
          seasonIndex,
          episode,
          episodeIndex,
        })),
      ),
    );
  }, [songs]);

  const routeTarget = useMemo<FlatEpisode | null>(() => {
    if (!params?.cId || !params?.seasonId || !params?.episodeId) {
      return null;
    }

    return (
      flattenedEpisodes.find(
        (item) =>
          item.music.cId === params.cId &&
          item.season.cId === params.seasonId &&
          item.episode.cId === params.episodeId,
      ) ?? null
    );
  }, [flattenedEpisodes, params?.cId, params?.seasonId, params?.episodeId]);

  useEffect(() => {
    if (!routeTarget || autoSelectedRef.current) {
      return;
    }

    playMusic(
      routeTarget.musicIndex,
      routeTarget.seasonIndex,
      routeTarget.episodeIndex,
    );
    autoSelectedRef.current = true;
  }, [playMusic, routeTarget]);

  const activeEpisode = useMemo<FlatEpisode | null>(() => {
    if (
      selectedContentIndex !== null &&
      selectedSeasonIndex !== null &&
      selectedMusicIndex !== null
    ) {
      const selectedMusic = songs[selectedContentIndex];
      const selectedSeason = selectedMusic?.cSeasons[selectedSeasonIndex];
      const selectedEpisode = selectedSeason?.cEpisodes[selectedMusicIndex];

      if (selectedMusic && selectedSeason && selectedEpisode) {
        return {
          music: selectedMusic,
          musicIndex: selectedContentIndex,
          season: selectedSeason,
          seasonIndex: selectedSeasonIndex,
          episode: selectedEpisode,
          episodeIndex: selectedMusicIndex,
        };
      }
    }

    return routeTarget ?? flattenedEpisodes[0] ?? null;
  }, [
    flattenedEpisodes,
    routeTarget,
    selectedContentIndex,
    selectedMusicIndex,
    selectedSeasonIndex,
    songs,
  ]);

  const visibleEpisodes = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    if (!term) {
      return flattenedEpisodes;
    }

    return flattenedEpisodes.filter(({ music, season, episode }) => {
      const haystack = [
        music.cTitle,
        music.cDescription,
        season.cTitle,
        episode.cTitle,
        episode.cDescription,
        ...music.cAuthors,
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(term);
    });
  }, [flattenedEpisodes, searchTerm]);

  const queueEpisodes = useMemo(() => {
    if (!activeEpisode) {
      return visibleEpisodes.slice(0, 8);
    }

    const sameSeason = flattenedEpisodes.filter(
      (item) =>
        item.music.cId === activeEpisode.music.cId &&
        item.season.cId === activeEpisode.season.cId,
    );

    return sameSeason.length > 1 ? sameSeason : visibleEpisodes.slice(0, 8);
  }, [activeEpisode, flattenedEpisodes, visibleEpisodes]);

  const summary = useMemo(() => {
    const seasons = songs.reduce(
      (count, music) => count + music.cSeasons.length,
      0,
    );

    return {
      series: songs.length,
      seasons,
      episodes: flattenedEpisodes.length,
    };
  }, [flattenedEpisodes.length, songs]);

  const hasDeepLink = Boolean(
    params?.cId && params?.seasonId && params?.episodeId,
  );

  const handlePlay = (item: FlatEpisode) => {
    if (sameEpisode(activeEpisode, item) && isPlaying) {
      playControl();
      return;
    }

    playMusic(item.musicIndex, item.seasonIndex, item.episodeIndex);
  };

  const handleShare = async (item: FlatEpisode) => {
    const url = `${globalThis.location.origin}${buildEpisodePath(item)}`;
    handleShareClick(item.episode.cTitle, url);
  };

  if (loadingMusic) {
    return (
      <div className="relative overflow-hidden pt-20 pb-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(67,107,225,0.2),_transparent_35%),radial-gradient(circle_at_top_right,_rgba(217,165,56,0.16),_transparent_28%),linear-gradient(180deg,_#07111f_0%,_#050816_55%,_#02040a_100%)]" />
        <div className="relative mx-auto flex min-h-[70vh] w-full flex-col gap-6 px-4 sm:px-6 lg:px-8 animate-pulse">
          <div className="h-40 rounded-[2rem] bg-white/8" />
          <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
            <div className="h-[28rem] rounded-[2rem] bg-white/8" />
            <div className="h-[28rem] rounded-[2rem] bg-white/8" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="h-72 rounded-[1.75rem] bg-white/8" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const heroEpisode = activeEpisode ?? flattenedEpisodes[0] ?? null;

  return (
    <div className="relative overflow-hidden pt-20 pb-16 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(67,107,225,0.28),_transparent_28%),radial-gradient(circle_at_80%_10%,_rgba(217,165,56,0.22),_transparent_18%),radial-gradient(circle_at_bottom_right,_rgba(17,25,40,0.9),_transparent_30%),linear-gradient(180deg,_#07111f_0%,_#050816_50%,_#02040a_100%)]" />
      <div className="absolute left-8 top-24 h-56 w-56 rounded-full bg-[#436be1]/20 blur-3xl" />
      <div className="absolute right-0 top-32 h-72 w-72 rounded-full bg-[#d5a538]/15 blur-3xl" />

      <div className="relative mx-auto flex w-full flex-col gap-8 px-4 sm:px-6 lg:px-8">
        <section className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/30 backdrop-blur-xl md:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.32em] text-white/70">
                <RiSparklingLine className="text-[#d5a538]" />
                Audiobook Studio
              </div>
              <div className="flex flex-wrap items-center gap-3 text-sm text-white/75">
                <span className="rounded-full border border-white/10 bg-black/20 px-4 py-2">
                  {summary.series} series
                </span>
                <span className="rounded-full border border-white/10 bg-black/20 px-4 py-2">
                  {summary.seasons} seasons
                </span>
                <span className="rounded-full border border-white/10 bg-black/20 px-4 py-2">
                  {summary.episodes} episodes
                </span>
                {shareStatus ? (
                  <span className="rounded-full border border-[#436be1]/40 bg-[#436be1]/15 px-4 py-2 text-[#c6d4ff]">
                    {shareStatus}
                  </span>
                ) : null}
              </div>
            </div>

            <div className="w-full max-w-md rounded-[1.75rem] border border-white/10 bg-black/25 p-4 shadow-2xl shadow-black/30">
              <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/8 px-4 py-3 text-white/70">
                <RiSearchLine className="text-lg" />
                <input
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search titles, seasons, authors"
                  className="w-full bg-transparent text-sm outline-none placeholder:text-white/35"
                />
              </label>
            </div>
          </div>
        </section>

        {loadError ? (
          <div className="rounded-2xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
            {loadError}
          </div>
        ) : null}

        {hasDeepLink && !routeTarget ? (
          <div className="rounded-2xl border border-amber-400/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
            This shared audiobook link does not match any loaded episode. Try a
            different link or go back to the full library.
          </div>
        ) : null}

        <section className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/6 shadow-2xl shadow-black/30 backdrop-blur-xl">
            {heroEpisode ? (
              <div className="relative min-h-[32rem] h-full">
                <div className="absolute inset-0">
                  <Image
                    src={
                      heroEpisode.episode.cSquare || heroEpisode.music.cSquare
                    }
                    alt={heroEpisode.episode.cTitle}
                    fill
                    className="object-cover opacity-20 blur-2xl scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#050816] via-[#050816]/90 to-[#050816]/40" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050816] via-transparent to-transparent" />
                </div>

                <div className="relative grid gap-6 p-6 md:p-8 xl:grid-cols-[18rem_1fr] xl:items-end">
                  <div className="relative mx-auto w-full max-w-[18rem] overflow-hidden rounded-[1.8rem] border border-white/10 bg-black/30 shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
                    <Image
                      src={
                        heroEpisode.episode.cSquare || heroEpisode.music.cSquare
                      }
                      alt={heroEpisode.episode.cTitle}
                      width={800}
                      height={800}
                      className="aspect-square w-full object-cover"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/70 to-transparent p-4">
                      <div className="text-xs uppercase tracking-[0.28em] text-white/50">
                        Now playing
                      </div>
                      <div className="mt-1 text-lg font-semibold">
                        {heroEpisode.episode.cTitle}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-5 pb-1">
                    <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.22em] text-white/55">
                      <span className="rounded-full border border-white/10 bg-white/8 px-3 py-1">
                        {heroEpisode.music.cTitle}
                      </span>
                      <span className="rounded-full border border-white/10 bg-white/8 px-3 py-1">
                        Season {heroEpisode.season.cNo}
                      </span>
                      <span className="rounded-full border border-white/10 bg-white/8 px-3 py-1">
                        Episode {heroEpisode.episode.cNo}
                      </span>
                    </div>

                    <h2 className="max-w-2xl text-3xl font-black leading-tight sm:text-4xl">
                      {heroEpisode.episode.cTitle}
                    </h2>
                    <p className="max-w-3xl text-sm leading-7 text-white/70 sm:text-base">
                      {heroEpisode.episode.cDescription ||
                        heroEpisode.music.cDescription}
                    </p>

                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        onClick={() => handlePlay(heroEpisode)}
                        className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#436be1] to-[#6d87ef] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#436be1]/30 transition hover:-translate-y-0.5"
                      >
                        {sameEpisode(activeEpisode, heroEpisode) &&
                        isPlaying ? (
                          <CiPause1 className="text-lg" />
                        ) : (
                          <CiPlay1 className="text-lg" />
                        )}
                        {sameEpisode(activeEpisode, heroEpisode) && isPlaying
                          ? "Pause"
                          : "Play"}
                      </button>

                      <button
                        onClick={() => handleShare(heroEpisode)}
                        className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/8 px-5 py-3 text-sm font-semibold text-white/90 transition hover:bg-white/12"
                      >
                        <IoShareSocialOutline className="text-lg" />
                        Share link
                      </button>

                      <button
                        onClick={() => router.push("/audiobooks")}
                        className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-5 py-3 text-sm font-semibold text-white/80 transition hover:bg-black/35"
                      >
                        Back to library
                        <RiArrowRightLine className="text-lg" />
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2 text-xs text-white/70">
                      {heroEpisode.music.cAuthors.map((author) => (
                        <span
                          key={author}
                          className="rounded-full border border-white/10 bg-white/8 px-3 py-2"
                        >
                          {author}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex min-h-[24rem] items-center justify-center p-8 text-white/60">
                No audiobook content found yet.
              </div>
            )}
          </div>

          <aside className="overflow-auto max-h-[32rem] lg:max-h-[50rem] sm:max-h-auto rounded-[2rem] border border-white/10 bg-white/6 p-5 shadow-2xl shadow-black/30 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs uppercase tracking-[0.28em] text-white/45">
                  Queue
                </div>
                <h3 className="mt-2 text-xl font-bold">Up next</h3>
              </div>
              <RiDiscLine className="text-2xl text-[#d5a538]" />
            </div>

            <div className="mt-4 space-y-3">
              {queueEpisodes.map((item) => {
                const isActive = sameEpisode(activeEpisode, item);

                return (
                  <div
                    key={`${item.music.cId}-${item.season.cId}-${item.episode.cId}-queue`}
                    className={`group flex items-center gap-3 rounded-2xl border p-3 transition ${isActive ? "border-[#436be1]/60 bg-[#436be1]/15" : "border-white/10 bg-white/6 hover:bg-white/10"}`}
                  >
                    <button
                      onClick={() => handlePlay(item)}
                      className="relative h-16 w-16 overflow-hidden rounded-xl border border-white/10"
                    >
                      <Image
                        src={item.episode.cSquare || item.music.cSquare}
                        alt={item.episode.cTitle}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/35 opacity-0 transition group-hover:opacity-100">
                        {isActive && isPlaying ? (
                          <CiPause1 className="text-xl" />
                        ) : (
                          <CiPlay1 className="text-xl" />
                        )}
                      </div>
                    </button>

                    <div className="min-w-0 flex-1">
                      <div className="text-xs uppercase tracking-[0.22em] text-white/40">
                        {item.music.cTitle}
                      </div>
                      <div className="truncate font-semibold text-white">
                        {item.episode.cTitle}
                      </div>
                      <div className="truncate text-sm text-white/60">
                        {item.episode.cDescription}
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <button
                        onClick={() => handleShare(item)}
                        className="rounded-full border border-white/10 bg-white/8 p-2 text-white/80 transition hover:bg-white/12"
                        title="Share episode link"
                      >
                        <IoShareSocialOutline />
                      </button>
                      <Link
                        href={buildEpisodePath(item)}
                        className="text-xs font-semibold text-[#cfd8ff] transition hover:text-white"
                      >
                        Open
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </aside>
        </section>

        <section className="space-y-4">
          <div className="flex items-end justify-between gap-4">
            <div>
              <div className="text-xs uppercase tracking-[0.28em] text-white/45">
                Library
              </div>
              <h3 className="mt-2 text-2xl font-bold">All episodes</h3>
            </div>
            <div className="text-sm text-white/60">
              {visibleEpisodes.length} result
              {visibleEpisodes.length === 1 ? "" : "s"}
            </div>
          </div>

          {visibleEpisodes.length === 0 ? (
            <div className="rounded-[1.75rem] border border-white/10 bg-white/6 p-10 text-center text-white/60">
              No audiobooks match your search.
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {visibleEpisodes.map((item) => {
                const isActive = sameEpisode(activeEpisode, item);

                return (
                  <article
                    key={`${item.music.cId}-${item.season.cId}-${item.episode.cId}`}
                    className={`group overflow-hidden rounded-[1.75rem] border shadow-xl shadow-black/30 transition duration-300 ${isActive ? "border-[#436be1]/70 bg-[#436be1]/15" : "border-white/10 bg-white/6 hover:-translate-y-1 hover:bg-white/10"}`}
                  >
                    <div className="relative aspect-square overflow-hidden">
                      <Image
                        src={item.episode.cSquare || item.music.cSquare}
                        alt={item.episode.cTitle}
                        fill
                        className="object-cover transition duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

                      <div className="absolute left-4 top-4 flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.2em] text-white/80">
                        <span className="rounded-full bg-black/55 px-3 py-1">
                          Season {item.season.cNo}
                        </span>
                        <span className="rounded-full bg-black/55 px-3 py-1">
                          #{item.episode.cNo}
                        </span>
                      </div>

                      <button
                        onClick={() => handlePlay(item)}
                        className="absolute inset-x-4 bottom-4 flex items-center justify-between rounded-2xl border border-white/10 bg-black/45 px-4 py-3 text-left backdrop-blur-md transition group-hover:bg-black/60"
                      >
                        <div>
                          <div className="text-xs uppercase tracking-[0.24em] text-white/50">
                            {item.music.cTitle}
                          </div>
                          <div className="mt-1 line-clamp-1 text-base font-semibold">
                            {item.episode.cTitle}
                          </div>
                        </div>
                        <div className="rounded-full bg-white/10 p-3 text-lg text-white">
                          {isActive && isPlaying ? <CiPause1 /> : <CiPlay1 />}
                        </div>
                      </button>
                    </div>

                    <div className="space-y-3 p-4">
                      <p className="line-clamp-2 min-h-[3rem] text-sm leading-6 text-white/65">
                        {item.episode.cDescription}
                      </p>

                      <div className="flex flex-wrap gap-2 text-xs text-white/60">
                        {item.music.cAuthors.slice(0, 3).map((author) => (
                          <span
                            key={`${item.episode.cId}-${author}`}
                            className="rounded-full border border-white/10 bg-white/8 px-3 py-1"
                          >
                            {author}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between gap-3">
                        <button
                          onClick={() => handleShare(item)}
                          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/8 px-3 py-2 text-xs font-semibold text-white/80 transition hover:bg-white/12"
                        >
                          <IoShareSocialOutline />
                          Share
                        </button>
                        <Link
                          href={buildEpisodePath(item)}
                          className="text-xs font-semibold text-[#cfd8ff] transition hover:text-white"
                        >
                          Open single view
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
