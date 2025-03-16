"use client"
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { IoHome } from 'react-icons/io5';
import { GiDramaMasks } from 'react-icons/gi';
import { SiAudiobookshelf } from 'react-icons/si';
import { FaAngleDown } from 'react-icons/fa';
import { BsStars } from 'react-icons/bs';
import { TbMenu4 } from 'react-icons/tb';

export default function NavbarCenter() {
    const [isScrolled, setIsScrolled] = useState(false);
    const pathname = usePathname();
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

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
        const savedTheme = localStorage.getItem('theme') || 'Dark';
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
        <div className={`flex mr-4 rounded-xl transition-all duration-500 ease-in-out p-2 ${isScrolled ? 'bg-base-100/10 backdrop-blur-lg' : 'bg-transparent backdrop-blur-none'}`}>
            <ul className="flex justify-between px-1 space-x-2 items-center">
                <li><Link href={'/'}><div className={`flex space-x-1.5 justify-center items-center ${isActive('/')} hover:scale-105 rounded-lg p-2 transition duration-200 ease-in-out`}><IoHome className='text-lg' /><h1>Home</h1></div></Link></li>
                <li><Link href={'/genre'}><div className={`flex space-x-1.5 justify-center items-center ${isActive('/genre')} hover:scale-105 rounded-lg p-2 transition duration-200 ease-in-out`}><GiDramaMasks className='text-lg' /><h1>Genre</h1></div></Link></li>
                <li><Link href={'/audiobooks'}><div className={`flex space-x-1.5 justify-center items-center ${isActive('/audiobooks')} hover:scale-105 rounded-lg p-2 transition duration-200 ease-in-out`}><SiAudiobookshelf className='text-lg' /><h1>Audiobook</h1></div></Link></li>
                
                {/* More Dropdown */}
                <li className="dropdown relative">
                    <button onClick={() => toggleDropdown('more')} className="bg-primary/0 hover:bg-primary/20 hover:backdrop-blur-md flex cursor-pointer space-x-1.5 justify-center items-center hover:scale-105 rounded-lg p-2 transition duration-200 ease-in-out">
                        <TbMenu4 className='text-lg'/>
                        <h1>More</h1>
                        <FaAngleDown className={`text-lg transition-transform duration-300 ${openDropdown === 'more' ? 'rotate-180' : ''}`} />
                    </button>
                    {openDropdown === 'more' && (
                        <ul className="absolute left-0 mt-2 dropdown-content menu bg-base-100 rounded-box z-10 w-52 p-2 shadow-sm">
                            <li className="hover:bg-primary/20 rounded-lg transition-all"><Link href={'/terms'}>Terms of use</Link></li>
                            <li className="hover:bg-primary/20 rounded-lg transition-all"><Link href={'/privacy'}>Privacy Policy</Link></li>
                            <li className="hover:bg-primary/20 rounded-lg transition-all"><Link href={'/about'}>About us</Link></li>
                        </ul>
                    )}
                </li>

                {/* Theme Dropdown */}
                <li className="dropdown relative">
                    <button onClick={() => toggleDropdown('theme')} className="bg-primary/0 hover:bg-primary/20 hover:backdrop-blur-md flex cursor-pointer space-x-1.5 justify-center items-center hover:scale-105 rounded-lg p-2 transition duration-200 ease-in-out">
                        <BsStars className='text-lg'/>
                        <h1>Theme</h1>
                        <FaAngleDown className={`text-lg transition-transform duration-300 ${openDropdown === 'theme' ? 'rotate-180' : ''}`} />
                    </button>
                    {openDropdown === 'theme' && (
                        <ul className="absolute left-0 mt-2 dropdown-content menu bg-base-100 rounded-box z-10 w-52 p-2 shadow-sm">
                            {themeList.map((themeName) => (
                                <li
                                    key={themeName}
                                    className={`p-2 rounded-lg cursor-pointer transition duration-200 bg-primary/0 hover:bg-primary/20 shadow-0 hover:shadow-md hover:shadow-secondary ${theme === themeName ? 'bg-primary' : ''}`}
                                    onClick={() => handleThemeChange(themeName)}
                                >
                                    {themeName} Mode
                                </li>
                            ))}
                        </ul>
                    )}
                </li>
            </ul>
        </div>
    );
}