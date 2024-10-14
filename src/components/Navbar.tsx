import React from 'react'
import Image from 'next/image';
import golproLogo from '../../public/golproLogoSvg.svg';
import './logoanimation.css';
import Link from 'next/link';
import Example from './button';
import NavbarCenter from './NavbarComponents/NavbarCenter';
import { auth, signOut } from '../../auth';
// import { signOut } from '../../auth'; 



export default async function Navbar() {

    const session = await auth()

    return (
        <div className='fixed w-full z-50'>
            <div className={`navbar z-50 transition-all duration-300`}>
                <div className="navbar-start">
                    <Link href={"/"} className="text-slate-400">
                        <Image className='animated-svg' height={47} width={100} src={golproLogo} alt="logo" />
                    </Link>
                </div>
                <div className="navbar-center hidden lg:flex">
                    <NavbarCenter />
                </div>

                <div className="navbar-end">
                    {
                        session ?
                            <div className="dropdown dropdown-end">
                                <div className='flex items-center justify-center space-x-2'>
                                    <button className="btn-circle avatar items-center justify-center" aria-label="User menu">
                                        <div className="w-10 rounded-full">
                                            {session.user?.image ? (
                                                <Image
                                                    src={session.user.image}
                                                    alt="User Image"
                                                    width={40}
                                                    height={40}
                                                    className="rounded-full"
                                                />
                                            ) : (
                                                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                                    {/* Placeholder if no image */}
                                                    <span className="text-gray-400">U</span>
                                                </div>
                                            )}
                                        </div>
                                    </button>
                                </div>
                                <ul className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
                                    <li>
                                        <Link href={`/profile/${session.user?.email}`} className="justify-between">
                                            Profile <span className="badge">New</span>
                                        </Link>
                                    </li>
                                    <li><Link href={''}>Settings</Link></li>
                                    <li><Link href={''}><form
                                        action={async () => {
                                            "use server"
                                            await signOut()
                                        }}
                                    >
                                        <button className="" type="submit">Sign Out</button>
                                    </form></Link></li>


                                </ul>
                            </div>
                            :
                            <Link href={'/login'}><Example /></Link>
                    }
                </div>
            </div>
        </div >
    );
};


