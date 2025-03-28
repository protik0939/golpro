// app/not-found.tsx
import Image from "next/image";
import Link from "next/link";
import React from "react";
import errorPageImage from '../app/assets/notfoundsvg.svg';
import { MdOutlineSupportAgent } from "react-icons/md";

export default function NotFound() {
    return (
        <main className="grid min-h-full place-items-center px-6 py-14 sm:py-32 lg:px-8">
            <div className="text-center">
                <Image
                    src={errorPageImage}
                    alt="Error 404 Image"
                />
                <div className="mt-10 flex items-center justify-center gap-x-6">
                    <Link
                        href="/"
                        className=""
                    >
                        <button className="btn btn-primary">Go back home</button>
                    </Link>
                    <Link href="#" className="text-sm font-semibold text-gray-900">
                        <button className="btn btn-secondary">Contact <span aria-hidden="true">< MdOutlineSupportAgent className="text-xl"/></span></button>
                    </Link>
                </div>
            </div>
        </main>
    );
};
