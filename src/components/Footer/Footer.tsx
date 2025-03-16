import React from 'react'
import Image from "next/image";
import favICon from '../../app/assets/icons/icon.svg'
import lIcon from '../../app/assets/logos/golproLogoSvg.svg'
import Link from "next/link";
import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export default function Footer() {

    const currentYear = new Date().getFullYear();

    return (
        <div>
            <footer className="footer text-secondary sm:footer-horizontal bg-base-100 text-base-content p-10">
                <nav className="@max-md:justify-center">
                    <h6 className="footer-title">Services</h6>
                    <Link href={''} className="link link-hover">Branding</Link>
                    <Link href={''} className="link link-hover">Design</Link>
                    <Link href={''} className="link link-hover">Marketing</Link>
                    <Link href={''} className="link link-hover">Advertisement</Link>
                </nav>

                <nav className="@max-md:justify-center">
                    <h6 className="footer-title">Company</h6>
                    <Link href={''} className="link link-hover">About us</Link>
                    <Link href={''} className="link link-hover">Contact</Link>
                    <Link href={''} className="link link-hover">Jobs</Link>
                    <Link href={''} className="link link-hover">Press kit</Link>
                </nav>

                <nav className="@max-md:justify-center">
                    <h6 className="footer-title">Legal</h6>
                    <Link href={''} className="link link-hover">Terms of use</Link>
                    <Link href={''} className="link link-hover">Privacy policy</Link>
                    <Link href={''} className="link link-hover">Cookie policy</Link>
                </nav>
                <form>
                    <h6 className="footer-title">Newsletter</h6>
                    <fieldset className="w-full flex flex-col">
                        <label>Enter your email address</label>
                        <div className="join @max-md:flex @max-md:flex-col">
                            <input
                                type="text"
                                placeholder="username@site.com"
                                className="input input-bordered join-item" />
                            <button className="btn btn-primary join-item">Subscribe</button>
                        </div>
                    </fieldset>
                </form>
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
                    <div className="grid grid-flow-col gap-4">
                        <Link href={''}>
                            <FaFacebook className="text-4xl" />
                        </Link>
                        <Link href={''}>
                            <FaYoutube className="text-4xl" />
                        </Link>
                        <Link href={''}>
                            <FaInstagram className="text-4xl" />
                        </Link>
                        <Link href={''}>
                            <FaXTwitter className="text-4xl" />
                        </Link>
                    </div>
                </nav>
            </footer>
        </div>
    )
}
