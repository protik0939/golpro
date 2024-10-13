"use client"
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import ThemeSwitches from '@/components/ThemeSwitches';
import { IoHome } from 'react-icons/io5';
import { GiDramaMasks } from 'react-icons/gi';
import { MdOutlineBookmark } from 'react-icons/md';
import { CgMoreO } from 'react-icons/cg';

export default function NavbarCenter() {
    const [isScrolled, setIsScrolled] = useState(false);

    // Handle scrolling event
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 0) {
                setIsScrolled(true); // If scrolled, set the background visible
            } else {
                setIsScrolled(false); // If at the top, make the background transparent
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const navLinks = (
        <>
            <li><Link href={'/'}><div className='flex flex-col justify-center items-center'><IoHome className='text-2xl' /></div></Link></li>
            <li><Link href={'/genre'}><div className='flex flex-col justify-center items-center'><GiDramaMasks className='text-2xl' /></div></Link></li>
            <li><Link href={'/bookmarks'}><div className='flex flex-col justify-center items-center'><MdOutlineBookmark className='text-2xl' /></div></Link></li>
            <li>
                <details>
                    <summary aria-expanded="false"><div className='flex flex-col justify-center items-center'><CgMoreO className='text-2xl' /></div></summary>
                    <ul className="p-2 w-max">
                        <li><Link href={'/'}>Terms of use</Link></li>
                        <li><Link href={'/'}>Privacy Policy</Link></li>
                        <li><Link href={'/'}>About us</Link></li>
                    </ul>
                </details>
            </li>
        </>
    );

    return (
        <div className={`navbar-center sm:hidden flex mr-4 rounded-xl transition-all duration-500 ease-in-out
            ${isScrolled ? 'bg-base-100/10 backdrop-blur-lg' : 'bg-transparent backdrop-blur-none'}`}>
            <ul className="menu menu-horizontal px-1 space-x-2">
                {navLinks}
                <li>
                    <ThemeSwitches />
                </li>
            </ul>
        </div>
    );
}
