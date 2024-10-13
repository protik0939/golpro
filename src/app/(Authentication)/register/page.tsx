import Link from "next/link";
import './glow.css';
import loginPic from '../../icon.svg'
import Image from "next/image";

const Register = () => {
    return (
        <div className="flex sm:flex-col w-full overflow-hidden">
            <div className="flex justify-center items-center w-1/2 sm:w-full relative pt-20 pb-20">
                <div className="card bg-base-100/50 backdrop-blur-lg w-full max-w-sm shrink-0 shadow-2xl">
                    <form className="card-body">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Name</span>
                            </label>
                            <input type="text" placeholder="Name" className="input input-bordered" required />
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Email</span>
                            </label>
                            <input type="email" placeholder="Email" className="input input-bordered" required />
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Date Of Birth</span>
                            </label>
                            <input type="date" placeholder="Email" className="input input-bordered" required />
                        </div>
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text">Password</span>
                            </label>
                            <input type="password" placeholder="Password" className="input input-bordered" required />
                            <label className="label">
                                <Link href="#" className="label-text-alt link link-hover">Forgot password?</Link>
                            </label>
                        </div>
                        <div className="form-control mt-6">
                            <button className="btn btn-primary">Register</button>
                        </div>
                        <div className="w-full flex justify-center items-center mt-10">
                            <h1 className="text-xs">Already have an account? <Link className="text-[#436be1] font-bold big:hover:scale-110" href={'/login'}>Login</Link></h1>
                        </div>
                    </form>
                </div>
                <div className="absolute w-1/4 h-1/2 -z-40 blur-[130px] bg-gradient-to-r from-[#436be1] to-[#436be1] animate-glow-spread" />
            </div>
            <div className="flex justify-center items-center w-1/2 sm:w-full h-full sm:h-1/2 relative">
                <Image
                    src={loginPic}
                    alt='loginpic'
                    height={2000}
                    width={2000}
                    className="-z-50 object-cover w-full h-full filter contrast-200 blur-xl opacity-30 sm:hidden"
                />
                <div className="absolute w-1/4 h-1/2 -z-40 blur-[130px] bg-gradient-to-r from-[#436be1] to-[#436be1] animate-glow-spread" />
            </div>
        </div>
    );
};

export default Register;