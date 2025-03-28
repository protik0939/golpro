'use client'

import React from 'react'
import Image from 'next/image';
import golproLogo from '../../../public/golproLogoSvg.svg';
import './logoanimation.css';
import Link from 'next/link';
import Example from './button';
import NavbarCenter from './NavbarCenter';
import { signOut, useSession } from 'next-auth/react';
import NavbarBottom from './NavbarBottom';



export default function Navbar() {
    const { data, status } = useSession();

    return (
        <>

            <div className='fixed w-full z-50'>
                <div className={`navbar z-50 transition-all duration-300`}>
                    <div className="navbar-start">
                        <Link href={"/"} className="text-slate-400">
                            <Image className='animated-svg' height={47} width={100} src={golproLogo} alt="logo" />
                        </Link>
                    </div>
                    <div className="navbar-center">
                        <div className='hidden lg:flex'>
                            <NavbarCenter />
                        </div>
                    </div>


                    <div className="navbar-end">
                        {
                            status === 'loading' ? (
                                <div className='p-2 aspect-square rounded-full bg-primary/20 backdrop-blur-md'><span className="loading loading-infinity loading-md" /></div>
                            ) : data ? (
                                <div className="dropdown dropdown-end">
                                    <div className='flex items-center justify-center space-x-2'>

                                        <button className="btn-circle avatar items-center justify-center cursor-pointer" aria-label="User menu">
                                            <div className="w-10 rounded-full">
                                                {data.user?.image ? (
                                                    <Image
                                                        src={data.user.image}
                                                        alt="User Image"
                                                        width={40}
                                                        height={40}
                                                        className="rounded-full"
                                                        unoptimized={true}
                                                    />
                                                ) : (
                                                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                                                        {/* Placeholder if no image */}
                                                        <span className="text-black">{data.user?.name?.charAt(0) || 'G'}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </button>
                                    </div>
                                    <ul className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
                                        <li className='bg-primary/0 hover:bg-primary/20 shadow-none hover:shadow-sm hover:shadow-secondary transition-all duration-200 ease-in-out rounded-lg'>
                                            <Link href={`/profile/${data.user?.username}`} className="justify-between">
                                                Profile
                                            </Link>
                                        </li>
                                        <li className='bg-primary/0 hover:bg-primary/20 shadow-none hover:shadow-sm hover:shadow-secondary transition-all duration-200 ease-in-out rounded-lg'><Link href={''}>Settings</Link></li>
                                        <li className='bg-primary/0 hover:bg-primary/20 shadow-none hover:shadow-sm hover:shadow-secondary transition-all duration-200 ease-in-out rounded-lg'>
                                            <button onClick={() => signOut()}>Sign Out</button>
                                        </li>
                                    </ul>
                                </div>
                            )
                                :
                                <Link href={'/login'}><Example /></Link>
                        }
                    </div>
                </div>
            </div >
            <div className='lg:hidden fixed bottom-0 flex justify-center p-1 items-center w-full z-50'>
                <NavbarBottom />
            </div>
        </>
    );
};


