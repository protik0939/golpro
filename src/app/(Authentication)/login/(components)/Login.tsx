'use client'
import './glow.css';
import loginPic from '../../../assets/icons/icon.svg';
import Image from 'next/image';
import { FcGoogle } from "react-icons/fc";
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';

export default function Login() {



  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const [loggingIn, setLoggingIn] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoggingIn(true);
    setError("");
    console.log(email, password);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email or password");
      console.log(error);
      setLoggingIn(false);
    } else {
      router.push("/");
      setLoggingIn(false);
    }
  };



  return (
    <div className="flex sm:flex-col w-full h-auto">
      <div className="flex justify-center items-center w-full h-full relative pt-20 pb-20">
        <div className="card backdrop-blur-lg w-full max-w-sm shrink-0 shadow-2xl rounded-2xl px-2 overflow-auto">
          <div className='w-full flex justify-center items-center'>
            <h1 className='text-3xl py-6 font-bold text-center'>Log in</h1>
          </div>
          <form onSubmit={handleLogin} className="card-body flex justify-center items-center w-full">
            <div className="form-control w-full">
              <legend className="fieldset-legend">Email</legend>
              <label className="input validator w-full input-ghost border-base-300/20 border-[.5px]">
                <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor"><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></g></svg>
                <input name='email' className='w-full' type="email" placeholder="mail@site.com" required onChange={(e) => setEmail(e.target.value)} />
              </label>
              <div className="validator-hint hidden">Enter valid email address</div>
            </div>
            <div className="form-control w-full">
              <div className='flex items-center justify-between'>
                <legend className="fieldset-legend">Password</legend>
                <button className='cursor-pointer' type='button' onClick={() => setShowPass(!showPass)}>{showPass ? <FaRegEye /> : <FaRegEyeSlash />}</button>
              </div>
              <label className="input w-full input-ghost border-base-300/20 border-[.5px]">
                <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor"><path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"></path><circle cx="16.5" cy="7.5" r=".5" fill="currentColor"></circle></g></svg>
                <input className='w-full' type={showPass ? "text" : "password"} onChange={(e) => setPassword(e.target.value)} required placeholder="Password" minLength={8} pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}" title="Must be more than 8 characters, including number, lowercase letter, uppercase letter" />
              </label>
              <label className="label mt-3">
                <Link href="#" className="label-text-alt link link-hover">
                  Forgot password?
                </Link>
              </label>
            </div>
            <div className='w-full flex justify-center items-center'>
              <div className="form-control mt-6">
                {
                  loggingIn ?
                    <button disabled={true}>Please Wait <span className="loading loading-infinity loading-xs" /></button>
                    :
                    <input className="btn btn-primary" type="submit" value="Log In" />
                }
              </div>
            </div>
            <div className="w-full flex justify-center items-center mt-2">
              <h1 className="text-xs">
                Don&apos;t have an account?{' '}
                <Link className="text-[#436be1] font-bold big:hover:scale-110" href="/register">
                  Register
                </Link>
              </h1>
            </div>
          </form>
          <div className="w-full flex flex-col justify-center items-center mb-10">
            <h1 className="text-xs">Log In with Google</h1>
            <button onClick={() => signIn("google")} type='submit'><FcGoogle className='cursor-pointer bg-[#ffffff] shadow-[#436be150] shadow-lg text-5xl rounded-full hover:scale-3d transition-all duration-300 ease-in-out mt-4' /></button>
          </div>
        </div>
      </div >
      <div className="absolute w-1/4 h-1/2 -z-40 blur-[130px] bg-gradient-to-r from-[#436be1] to-[#436be1] animate-glow-spread" />

      <div className="flex justify-center items-center w-full h-[730px] absolute overflow-hidden -z-40">
        <Image
          src={loginPic}
          alt="loginpic"
          height={2000}
          width={2000}
          className="-z-50 object-cover w-full h-full min-h-[730px] filter contrast-200 blur-xl opacity-30"
        />
        <div className="absolute right-0 w-1/4 h-1/2 -z-40 blur-[130px] bg-gradient-to-r from-[#436be1] to-[#436be1] animate-glow-spread" />
      </div>
    </div >
  )
}
