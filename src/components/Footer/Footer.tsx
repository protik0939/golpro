import React from 'react'
import Image from "next/image";
import favICon from '../../app/assets/icons/icon.svg'
import lIcon from '../../app/assets/logos/golproLogoSvg.svg'
import Link from "next/link";
import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";
import EmailComponent from './EmailComponent';
import InstallPwaButton from './InstallPwaButton';

export default function Footer() {

    const currentYear = new Date().getFullYear();

    return (
        <div className='pb-20 lg:pb-1'>
            <footer className="footer text-secondary sm:footer-horizontal bg-base-100 text-base-content p-10">
                <nav className="@max-md:justify-center">
                    <h6 className="footer-title">Go to</h6>
                    <Link href={'/'} className="link link-hover">Home</Link>
                    <Link href={'/genre'} className="link link-hover">Genre</Link>
                    <Link href={'/'} className="link link-hover">Audiobook</Link>
                    <Link href={'/authors'} className="link link-hover">Authors</Link>
                </nav>

                <nav className="@max-md:justify-center">
                    <h6 className="footer-title">Popular</h6>
                    <Link href={'/storyseries/porichoy'} className="link link-hover">Porichoy</Link>
                    <Link href={'/storyseries/baba'} className="link link-hover">Baba</Link>
                    <Link href={'/audiostory/chesrami'} className="link link-hover">Chesrami</Link>
                    <Link href={'/audiostory/irsha'} className="link link-hover">Irsha</Link>
                </nav>

                <nav className="@max-md:justify-center">
                    <h6 className="footer-title">Legal</h6>
                    <Link href={'/termsofuse'} className="link link-hover">Terms of use</Link>
                    <Link href={'/privacypolicy'} className="link link-hover">Privacy policy</Link>
                    <Link href={'/aboutus'} className="link link-hover">About us</Link>
                </nav>
                <EmailComponent />
            </footer>
            <footer className="footer sm:footer-horizontal bg-base-100 p-10 flex justify-center md:justify-between flex-col md:flex-row items-center">
                <aside className="grid-flow-col items-center">
                    <Image
                        src={favICon}
                        alt="Golpro Icon"
                        width={80}
                        height={80}
                    />
                    <div>
                        <Image
                            src={lIcon}
                            alt="Golpro Logo"
                            width={80}
                            height={80}
                        />
                        <h1 className="text-xs text-secondary">Copyright {currentYear} © All rights Reserved by GolPro</h1>
                    </div>
                </aside>
                <nav className='md:pr-5 text-secondary'>
                    <h6 className="footer-title text-center w-full md:w-auto">Social</h6>
                    <div className="grid grid-flow-col items-center gap-4">
                        <Link target="_blank" href={'https://www.facebook.com/golprobd'}>
                            <FaFacebook className="text-4xl" />
                        </Link>
                        <Link target="_blank" href={'https://www.youtube.com/@golpro6887'}>
                            <FaYoutube className="text-4xl" />
                        </Link>
                        <Link target="_blank" href={'https://www.instagram.com/golprobd/'}>
                            <FaInstagram className="text-4xl" />
                        </Link>
                        <InstallPwaButton />
                    </div>
                </nav>
            </footer>
        </div>
    )
}
