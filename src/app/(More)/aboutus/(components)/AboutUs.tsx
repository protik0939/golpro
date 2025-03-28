import React from 'react'
import golproLogo from '../../../../../public/golproLogoSvg.svg';
import { FaFacebook, FaYoutube, FaInstagram } from 'react-icons/fa';
import Image from 'next/image';
import Link from 'next/link';

export default function AboutUs() {
    return (
        <div className="flex flex-col items-center p-8 w-full md:w-[600px]">
            {/* Logo and Title */}
            <div className="flex flex-col items-center mb-8">
                <Image
                    src={golproLogo}
                    alt="Golpro Logo"
                    height="200"
                    width="400"
                    className="w-44 h-32 mb-4"
                />
                <h1 className="text-4xl font-bold">আমাদের সম্পর্কে</h1>
            </div>

            {/* About Text */}
            <p className="text-lg text-center leading-relaxed mb-8">
                &quot;গল্প প্রতিদিন&quot; নাম নিয়ে এবং &quot;বিনোদন সীমাহিন&quot; স্লোগান নিয়ে ২০১৯ সালের ২৩শে
                ফেব্রুয়ারি শুরু হয় আমার ফেসবুক পেইজের যাত্রা । আমরা শাহীনে ছিলাম, আমি
                ক্রিকেটার হবো, ভুত ফেসবুকসহ আরও কিছু কন্টেন্ট এর মাধ্যমে পথচলা শুরু হয়
                এই প্ল্যাটফর্মের । পরবর্তীতে নাম পরিবর্তন হয়ে নাম হয়ে যায় গল্প্রো ।
                <br /><br />
                ফেসবুক পেইজ থেকে যাত্রা শুরু হলেও বর্তমানে গল্প্রো তার ওয়েবসাইটেও সকল
                কিছু পরিচালনা করছে । আমাদের সাথে থাকার জন্য অসংখ্য ধন্যবাদ ।
                <br /><br />
                এ ছাড়া এই ওয়েবসাইটটি সম্পূর্ণ নির্মাণ করেছেন সাদাত আলম প্রতীক, যিনি
                গল্প্রো এর ফেসবুক পেইজেরও নির্মাতা ।
            </p>

            {/* Social Media Links */}
            <div className="flex space-x-6">
                <Link href="https://www.facebook.com/golprobd" target="_blank" rel="noopener noreferrer">
                    <FaFacebook size={40} className="text-blue-600 hover:scale-110 transition-all duration-200 ease-in-out" />
                </Link>
                <Link href="https://www.youtube.com/@golpro6887" target="_blank" rel="noopener noreferrer">
                    <FaYoutube size={40} className="text-red-600 hover:scale-110 transition-all duration-200 ease-in-out" />
                </Link>
                <Link href="https://www.instagram.com/golprobd" target="_blank" rel="noopener noreferrer">
                    <FaInstagram size={40} className="text-pink-600 hover:scale-110 transition-all duration-200 ease-in-out" />
                </Link>
            </div>
        </div>
    )
}
