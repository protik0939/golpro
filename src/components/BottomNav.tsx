import Link from 'next/link'
import React from 'react'
import { FaHome } from 'react-icons/fa'
import { GiDramaMasks } from 'react-icons/gi'
import { IoPlay } from 'react-icons/io5';
import { RiSettings4Fill } from "react-icons/ri";
import { SiAudiobookshelf } from "react-icons/si";

export default function BottomNav() {
    return (
        <ul className="menu menu-horizontal bg-base-200/80 backdrop-blur-lg hidden sm:flex justify-between items-center px-4 fixed bottom-0 w-full z-50">
            <li>
                <Link href={''} className="tooltip" data-tip="Greels">
                    <IoPlay className='text-2xl' />
                </Link>
            </li>
            <li>
                <Link href={'/audiobooks'} className="tooltip" data-tip="Audiobooks">
                    <SiAudiobookshelf className='text-2xl' />
                </Link>
            </li>
            <li>
                <Link href={'/'} className="tooltip" data-tip="Home">
                    <FaHome className='text-2xl' />
                </Link>
            </li>
            <li>
                <Link href={'/genre'} className="tooltip" data-tip="Genre">
                    <GiDramaMasks className='text-2xl' />
                </Link>
            </li>
            <li>
                <Link href={''} className="tooltip" data-tip="Settings">
                    <RiSettings4Fill className='text-2xl' />
                </Link>
            </li>
        </ul>
    )
}
