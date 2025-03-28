"use client"
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { IoHome } from 'react-icons/io5';
import { GiDramaMasks } from 'react-icons/gi';
import { SiAudiobookshelf } from 'react-icons/si';
import { FaAngleUp } from 'react-icons/fa';
import { BsStars } from 'react-icons/bs';
import { TbMenu4 } from 'react-icons/tb';

export default function NavbarBottom() {
    const pathname = usePathname();
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (!(event.target as HTMLElement).closest(".dropdown")) {
                setOpenDropdown(null);
            }
        };

        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    const toggleDropdown = (dropdown: string) => {
        setOpenDropdown(openDropdown === dropdown ? null : dropdown);
    };

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
    };

    const themeList = ["Light", "Dark"];
    const isActive = (route: string) => pathname === route ? 'bg-primary/20 backdrop-blur-md' : 'bg-primary/0 hover:bg-primary/20 hover:backdrop-blur-md';

    return (
        <div className={`flex w-full rounded-xl transition-all duration-500 ease-in-out p-2 bg-base-100/10 backdrop-blur-lg`}>
            <ul className="flex justify-between w-full px-1 space-x-2 items-center">

                {/* More Dropdown */}
                <li className="dropdown dropdown-top relative">
                    <button onClick={() => toggleDropdown('more')} className="bg-primary/0 hover:bg-primary/20 hover:backdrop-blur-md flex cursor-pointer flex-col justify-center items-center hover:scale-105 rounded-lg p-2 transition duration-200 ease-in-out">
                        <TbMenu4 className='text-3xl' />
                        <div className='flex items-center space-x-1.5'>
                            <h1 className='text-xs'>More</h1>
                            <FaAngleUp className={`text-xs transition-transform duration-300 ${openDropdown === 'more' ? 'rotate-180' : ''}`} />
                        </div>
                    </button>
                    {openDropdown === 'more' && (
                        <ul className="absolute left-0 mt-2 dropdown-content menu bg-base-100 rounded-box z-10 w-52 p-2 shadow-sm">
                            <li className="hover:bg-primary/20 rounded-lg transition-all"><Link href={'/authors'}>Authors</Link></li>
                            <li className="hover:bg-primary/20 rounded-lg transition-all"><Link href={'/termsofuse'}>Terms of use</Link></li>
                            <li className="hover:bg-primary/20 rounded-lg transition-all"><Link href={'/privacypolicy'}>Privacy Policy</Link></li>
                            <li className="hover:bg-primary/20 rounded-lg transition-all"><Link href={'/aboutus'}>About us</Link></li>
                        </ul>
                    )}
                </li>

                {/* Theme Dropdown */}
                <li className="dropdown dropdown-top relative">
                    <button onClick={() => toggleDropdown('theme')} className="bg-primary/0 hover:bg-primary/20 hover:backdrop-blur-md flex cursor-pointer flex-col justify-center items-center hover:scale-105 rounded-lg p-2 transition duration-200 ease-in-out">
                        <BsStars className='text-3xl' />
                        <div className='flex items-center space-x-1.5'>
                            <h1 className='text-xs'>Theme</h1>
                            <FaAngleUp className={`text-xs transition-transform duration-300 ${openDropdown === 'theme' ? 'rotate-180' : ''}`} />
                        </div>
                    </button>
                    {openDropdown === 'theme' && (
                        <ul className="absolute left-0 mt-2 dropdown-content menu bg-base-100 rounded-box z-10 w-52 p-2 shadow-sm">
                            {themeList.map((themeName) => (
                                <li key={themeName}>
                                    <button className={`p-2 rounded-lg cursor-pointer transition duration-200 bg-primary/0 hover:bg-primary/20 shadow-0 hover:shadow-md hover:shadow-secondary ${theme === themeName ? 'bg-primary' : ''}`}
                                        onClick={() => handleThemeChange(themeName)}>
                                        {themeName} Mode
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </li>
                <li><Link href={'/'}><div className={`flex flex-col justify-center items-center ${isActive('/')} hover:scale-105 rounded-lg p-2 transition duration-200 ease-in-out`}><IoHome className='text-3xl' /><h1 className='text-xs'>Home</h1></div></Link></li>
                <li><Link href={'/audiobooks'}><div className={`flex flex-col justify-center items-center ${isActive('/audiobooks')} hover:scale-105 rounded-lg p-2 transition duration-200 ease-in-out`}><SiAudiobookshelf className='text-3xl' /><h1 className='text-xs'>Audiobook</h1></div></Link></li>
                <li><Link href={'/genres'}><div className={`flex flex-col justify-center items-center ${isActive('/genre')} hover:scale-105 rounded-lg p-2 transition duration-200 ease-in-out`}><GiDramaMasks className='text-3xl' /><h1 className='text-xs'>Genre</h1></div></Link></li>
            </ul>
        </div>
    );
}