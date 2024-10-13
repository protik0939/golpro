import Image from "next/image";
import favICon from '../app/icon.svg'
import lIcon from '../../public/golproLogoSvg.svg'
import Link from "next/link";
import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const Footer = () => {

    const currentYear = new Date().getFullYear();


    return (
        <div>
            <footer className="footer bg-base-200 text-base-content p-10 sm:justify-items-center">
                <nav className="sm:justify-items-center">
                    <h6 className="footer-title">Services</h6>
                    <Link href={''} className="link link-hover">Branding</Link>
                    <Link href={''} className="link link-hover">Design</Link>
                    <Link href={''} className="link link-hover">Marketing</Link>
                    <Link href={''} className="link link-hover">Advertisement</Link>
                </nav>

                <nav className="sm:justify-items-center">
                    <h6 className="footer-title">Company</h6>
                    <Link href={''} className="link link-hover">About us</Link>
                    <Link href={''} className="link link-hover">Contact</Link>
                    <Link href={''} className="link link-hover">Jobs</Link>
                    <Link href={''} className="link link-hover">Press kit</Link>
                </nav>

                <nav className="sm:justify-items-center">
                    <h6 className="footer-title">Legal</h6>
                    <Link href={''} className="link link-hover">Terms of use</Link>
                    <Link href={''} className="link link-hover">Privacy policy</Link>
                    <Link href={''} className="link link-hover">Cookie policy</Link>
                </nav>

                <form>
                    <h6 className="footer-title">Newsletter</h6>
                    <fieldset className="form-control w-full">
                        <label className="label">
                            <span className="label-text">Enter your email address</span>
                        </label>
                        <div className="join">
                            <input
                                type="text"
                                placeholder="username@site.com"
                                className="input input-bordered join-item w-full" />
                            <button className="btn btn-primary join-item">Subscribe</button>
                        </div>
                    </fieldset>
                </form>
            </footer>
            <footer className="footer bg-base-200 text-base-content border-base-300 border-t px-10 py-4 sm:justify-items-center">
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
                        <h1 className="text-xs">Copyright {currentYear} © All rights Reserved by GolPro</h1>
                    </div>
                </aside>
                <nav className="md:place-self-center md:justify-self-end">
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
    );
};

export default Footer;