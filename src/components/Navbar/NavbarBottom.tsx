"use client"
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { IoHome, IoClose } from 'react-icons/io5';
import { GiDramaMasks } from 'react-icons/gi';
import { SiAudiobookshelf } from 'react-icons/si';
import { BsStars, BsSunFill, BsMoonStarsFill, BsInfoCircleFill, BsShieldCheck } from 'react-icons/bs';
import { TbMenu4 } from 'react-icons/tb';
import { FaUsers, FaFileContract } from 'react-icons/fa';

export default function NavbarBottom() {
    const pathname = usePathname();
    const [activeModal, setActiveModal] = useState<'more' | 'theme' | null>(null);

    const [theme, setTheme] = useState<string | null>(null);

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') ?? 'Dark';
        setTheme(savedTheme);
        document.querySelector('html')?.setAttribute('data-theme', savedTheme);
    }, []);

    const handleThemeChange = (newTheme: string) => {
        setTheme(newTheme);
        document.querySelector('html')?.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        setActiveModal(null);
    };

    const isActive = (route: string) => pathname === route ? 'bg-primary/20 backdrop-blur-md' : 'bg-primary/0 hover:bg-primary/20 hover:backdrop-blur-md';

    const moreOptions = [
        {
            title: 'Authors',
            subtitle: 'Discover writers',
            href: '/authors',
            icon: <FaUsers className="text-2xl text-primary" />,
            bgColor: 'bg-primary/10 hover:bg-primary/20',
        },
        {
            title: 'Terms of Use',
            subtitle: 'Read guidelines',
            href: '/termsofuse',
            icon: <FaFileContract className="text-2xl text-secondary" />,
            bgColor: 'bg-secondary/10 hover:bg-secondary/20',
        },
        {
            title: 'Privacy Policy',
            subtitle: 'Your data safety',
            href: '/privacypolicy',
            icon: <BsShieldCheck className="text-2xl text-accent" />,
            bgColor: 'bg-accent/10 hover:bg-accent/20',
        },
        {
            title: 'About Us',
            subtitle: 'Our story',
            href: '/aboutus',
            icon: <BsInfoCircleFill className="text-2xl text-info" />,
            bgColor: 'bg-info/10 hover:bg-info/20',
        },
    ];

    return (
        <>
            <div className={`flex w-full rounded-xl transition-all duration-500 ease-in-out p-2 bg-base-100/10 backdrop-blur-lg`}>
                <ul className="flex justify-between w-full px-1 space-x-2 items-center">

                    {/* More Trigger */}
                    <li>
                        <button
                            onClick={() => setActiveModal('more')}
                            className="bg-primary/0 hover:bg-primary/20 hover:backdrop-blur-md flex cursor-pointer flex-col justify-center items-center hover:scale-105 rounded-lg p-2 transition duration-200 ease-in-out"
                        >
                            <TbMenu4 className='text-3xl' />
                            <h1 className='text-xs'>More</h1>
                        </button>
                    </li>

                    {/* Theme Trigger */}
                    <li>
                        <button
                            onClick={() => setActiveModal('theme')}
                            className="bg-primary/0 hover:bg-primary/20 hover:backdrop-blur-md flex cursor-pointer flex-col justify-center items-center hover:scale-105 rounded-lg p-2 transition duration-200 ease-in-out"
                        >
                            <BsStars className='text-3xl' />
                            <h1 className='text-xs'>Theme</h1>
                        </button>
                    </li>

                    <li>
                        <Link href={'/'}>
                            <div className={`flex flex-col justify-center items-center ${isActive('/')} hover:scale-105 rounded-lg p-2 transition duration-200 ease-in-out`}>
                                <IoHome className='text-3xl' />
                                <h1 className='text-xs'>Home</h1>
                            </div>
                        </Link>
                    </li>
                    <li>
                        <Link href={'/audiobooks'}>
                            <div className={`flex flex-col justify-center items-center ${isActive('/audiobooks')} hover:scale-105 rounded-lg p-2 transition duration-200 ease-in-out`}>
                                <SiAudiobookshelf className='text-3xl' />
                                <h1 className='text-xs'>Audiobook</h1>
                            </div>
                        </Link>
                    </li>
                    <li>
                        <Link href={'/genres'}>
                            <div className={`flex flex-col justify-center items-center ${isActive('/genres')} hover:scale-105 rounded-lg p-2 transition duration-200 ease-in-out`}>
                                <GiDramaMasks className='text-3xl' />
                                <h1 className='text-xs'>Genre</h1>
                            </div>
                        </Link>
                    </li>
                </ul>
            </div>

            {/* Modal Overlay for Responsive Screen */}
            {activeModal && (
                <div
                    className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity duration-300 p-2 sm:p-4"
                    onClick={() => setActiveModal(null)}
                >
                    <div
                        className="w-full max-w-md bg-base-100 border border-base-300 rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl transition-all transform space-y-5"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="flex items-center justify-between border-b border-base-200 pb-3">
                            <div>
                                <h3 className="text-xl font-bold">
                                    {activeModal === 'more' ? 'More Options' : 'Select Theme'}
                                </h3>
                                <p className="text-xs text-base-content/60">
                                    {activeModal === 'more' ? 'Explore quick pages & guidelines' : 'Choose your preferred visual appearance'}
                                </p>
                            </div>
                            <button
                                onClick={() => setActiveModal(null)}
                                className="btn btn-sm btn-circle btn-ghost"
                                aria-label="Close"
                            >
                                <IoClose className="text-2xl" />
                            </button>
                        </div>

                        {/* Modal Content Grid */}
                        {activeModal === 'more' ? (
                            <div className="grid grid-cols-2 gap-3">
                                {moreOptions.map((item) => (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        onClick={() => setActiveModal(null)}
                                        className={`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border border-base-200/60 ${item.bgColor} transition-all duration-200 hover:scale-105 text-center shadow-xs`}
                                    >
                                        <div className="p-3 rounded-2xl bg-base-100 shadow-sm">
                                            {item.icon}
                                        </div>
                                        <div>
                                            <span className="font-bold text-sm block">{item.title}</span>
                                            <span className="text-[10px] text-base-content/60 block">{item.subtitle}</span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={() => handleThemeChange('Light')}
                                    className={`flex flex-col items-center justify-center gap-3 p-5 rounded-2xl border transition-all duration-200 hover:scale-105 text-center ${
                                        theme === 'Light'
                                            ? 'border-primary bg-primary/20 shadow-md ring-2 ring-primary/40'
                                            : 'border-base-200 bg-base-200/40 hover:bg-base-200/80'
                                    }`}
                                >
                                    <div className="p-3 rounded-2xl bg-amber-400/20 text-amber-500 shadow-sm">
                                        <BsSunFill className="text-3xl" />
                                    </div>
                                    <div>
                                        <span className="font-bold text-sm block">Light Mode</span>
                                        <span className="text-[10px] text-base-content/60 block">Bright & clean interface</span>
                                    </div>
                                </button>

                                <button
                                    onClick={() => handleThemeChange('Dark')}
                                    className={`flex flex-col items-center justify-center gap-3 p-5 rounded-2xl border transition-all duration-200 hover:scale-105 text-center ${
                                        theme === 'Dark'
                                            ? 'border-primary bg-primary/20 shadow-md ring-2 ring-primary/40'
                                            : 'border-base-200 bg-base-200/40 hover:bg-base-200/80'
                                    }`}
                                >
                                    <div className="p-3 rounded-2xl bg-indigo-500/20 text-indigo-400 shadow-sm">
                                        <BsMoonStarsFill className="text-3xl" />
                                    </div>
                                    <div>
                                        <span className="font-bold text-sm block">Dark Mode</span>
                                        <span className="text-[10px] text-base-content/60 block">Sleek & high contrast</span>
                                    </div>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}