
// import Link from 'next/link';
import './glow.css';
import loginPic from '../../icon.svg';
import Image from 'next/image';
// import { FormEvent } from 'react';
import { FcGoogle } from "react-icons/fc";
import { signIn } from '../../../../auth';

const login = () => {
    // Correctly type the event as FormEvent<HTMLFormElement>
    // const handleForm = (e: FormEvent<HTMLFormElement>) => {
    //     e.preventDefault();

    //     // Cast e.target to HTMLFormElement to access form fields
    //     const form = e.target as HTMLFormElement;
    //     const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    //     const password = (form.elements.namedItem('password') as HTMLInputElement).value;

    //     const logInInfo = { email, password };
    //     console.log(logInInfo);
    // };

    return (
        <div className="flex sm:flex-col w-full overflow-hidden">
            <div className="flex justify-center items-center w-1/2 sm:w-full relative pt-20 pb-20">
                <div className="card bg-base-100/50 backdrop-blur-lg w-full max-w-sm shrink-0 shadow-2xl">
                    {/* <form onSubmit={handleForm} className="card-body">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Email</span>
                            </label>
                            <input name="email" type="email" placeholder="Email" className="input input-bordered" required />
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Password</span>
                            </label>
                            <input name="password" type="password" placeholder="Password" className="input input-bordered" required />
                            <label className="label">
                                <Link href="#" className="label-text-alt link link-hover">
                                    Forgot password?
                                </Link>
                            </label>
                        </div>
                        <div className="form-control mt-6">
                            <input className="btn btn-primary" type="submit" value="LogIn" />
                        </div>
                        <div className="w-full flex justify-center items-center mt-10">
                            <h1 className="text-xs">
                                Don&apos;t have an account?{' '}
                                <Link className="text-[#436be1] font-bold big:hover:scale-110" href="/register">
                                    Register
                                </Link>
                            </h1>
                        </div>
                    </form> */}
                    <div className="w-full flex flex-col justify-center items-center mt-10 mb-10">
                        <h1 className="text-xs">Log In with Google</h1>
                        <form
                            action={async () => {
                                "use server"
                                await signIn("google", { redirectTo: "/" })
                            }} >
                            <button type='submit'><FcGoogle className='bg-[#ffffff] shadow-[#436be150] shadow-lg text-5xl rounded-full mt-4' /></button>
                        </form>
                    </div>
                </div>
                <div className="absolute w-1/4 h-1/2 -z-40 blur-[130px] bg-gradient-to-r from-[#436be1] to-[#436be1] animate-glow-spread" />
            </div >
            <div className="flex justify-center items-center w-1/2 sm:w-full h-full sm:h-1/2 relative">
                <Image
                    src={loginPic}
                    alt="loginpic"
                    height={2000}
                    width={2000}
                    className="-z-50 object-cover w-full h-full filter contrast-200 blur-xl opacity-30 sm:hidden"
                />
                <div className="absolute w-1/4 h-1/2 -z-40 blur-[130px] bg-gradient-to-r from-[#436be1] to-[#436be1] animate-glow-spread" />
            </div>
        </div >
    );
};

export default login;
