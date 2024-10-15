'use client'
import { useMusic } from '@/components/MusicContext';
import MusicPlayer from '@/components/MusicPlayer';
import musicData from '@/model/musicApi';
import Image from 'next/image';
import React, { useState } from 'react'
import Draggable from 'react-draggable';
import { RiDragMove2Line } from 'react-icons/ri';


export default function MusicPlayerButton() {

    const [dragging, setDragging] = useState(false);
    const { selectedMusicIndex, isPlaying, isVisible, stopMusic } = useMusic();

    const handleStart = () => {
        setDragging(false);
    };



    const handleDrag = () => {
        setDragging(true);
    };

    const handleClick = () => {
        if (!dragging) {
            const dialog = document.getElementById('MusicShowing') as HTMLDialogElement;
            dialog?.showModal();
        }
    };


    return (
        <>
            {
                selectedMusicIndex === null ?
                    <></>
                    :
                    <>
                        <Draggable
                            bounds="body"
                            defaultPosition={{ x: 130, y: 2 }}
                            onStart={handleStart}
                            onDrag={handleDrag}
                        >
                            <div className="justify-center fixed z-[2000]">

                                <button
                                    className="absolute bottom-0 left-0 bg-base-100 text-primary border border-primary text-sm rounded-full p-1"
                                    style={{ cursor: 'grab', zIndex: 10 }}
                                >
                                    <RiDragMove2Line />
                                </button>
                                <button
                                    onClick={handleClick}
                                    onTouchStart={handleClick}
                                    className='flex flex-col justify-center items-center'
                                >
                                    <Image
                                        src={musicData[selectedMusicIndex].songImage}
                                        alt={musicData[selectedMusicIndex].title}
                                        height={100}
                                        width={100}
                                        className={`rounded-full w-14 object-cover ${isPlaying ? 'animate-[spin_10s_linear_infinite]' : 'animate-none'} `}
                                    />
                                </button>
                            </div>
                        </Draggable>
                        <dialog id="MusicShowing" className="modal">
                            <div className="modal-box relative p-0">
                                {/* Blurred and darkened background */}
                                <div
                                    className="absolute inset-0 z-0"
                                    style={{
                                        backgroundImage: `url('${musicData[selectedMusicIndex].songImage}')`,
                                        backgroundPosition: 'center',
                                        backgroundRepeat: 'no-repeat',
                                        backgroundSize: 'cover',
                                        filter: 'blur(8px)',
                                        opacity: 0.7,
                                    }}
                                ></div>

                                <div className="absolute inset-0 bg-black opacity-50 z-10"></div>

                                <div className="relative z-20">
                                    <form method="dialog">
                                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                                            ✕
                                        </button>
                                    </form>
                                    <MusicPlayer music={musicData[selectedMusicIndex]} totalMusic={musicData.length} />
                                </div>
                            </div>
                        </dialog>
                    </>
            }
        </>
    );
}
