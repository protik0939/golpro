'use client'
import '../../login/(components)/glow.css';
import loginPic from '../../../assets/icons/icon.svg';
import Image from 'next/image';
import { FcGoogle } from "react-icons/fc";
import Link from 'next/link';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { LiaBirthdayCakeSolid } from 'react-icons/lia';
import { BsGenderAmbiguous } from 'react-icons/bs';
import { CiImageOn } from 'react-icons/ci';
import Cropper, { ReactCropperElement } from 'react-cropper';
import '/node_modules/react-cropper/node_modules/cropperjs/dist/cropper.css';
import axios from 'axios';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';
import { CgRename } from 'react-icons/cg';
import { Md123 } from 'react-icons/md';

export default function Register() {

  const router = useRouter();  //lg

  const [formData, setFormData] = useState({
    username: "",
    name: "",
    email: "",
    password: "",
    dateOfBirth: "",
    image: "",
    gender: "",
    bio: "",
    emailVerified: "",
  });

  const [imageUrl, setImageUrl] = useState<string>('');
  const [showModal, setShowModal] = useState<boolean>(false);

  const cropperRef = useRef<ReactCropperElement>(null);

  const [uploadingImageToServer, setUploadingImageToServer] = useState(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");

  const [usernameAvailable, setUsernameAvailable] = useState<null | boolean>(null);
  const [checkingUsername, setCheckingUsername] = useState<boolean>(false);
  const [registeringUser, setRegisteringUser] = useState<boolean>(false);
  const { data } = useSession();

  // for eemail verification
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otpSendError, setOtpSendError] = useState("");
  const [emailValidationError, setEmailValidationError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(30); // Countdown timer for resend button
  const [canResend, setCanResend] = useState(false);
  const [otpStatus, setOtpStatus] = useState<string>("");
  const [otpSending, setOtpSending] = useState<boolean>(false);
  const [otpVerifying, setOtpVerifying] = useState<boolean>(false);


  useEffect(() => {
    if (formData.username.length > 4) {
      setCheckingUsername(true);
      const timeout = setTimeout(async () => {
        try {

          const res = await fetch("/api/check-username", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username: formData.username }),
          });
          const data = await res.json();
          setUsernameAvailable(data.available);
        } catch (error) {
          console.error("Error checking username:", error);
          setUsernameAvailable(false);
        } finally {
          setCheckingUsername(false);
        }
      }, 500); // Delays API call by 500ms

      return () => clearTimeout(timeout);
    } else {
      setUsernameAvailable(null); // Reset when username is too short
    }
  }, [formData.username]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageUrl(URL.createObjectURL(file));
      setShowModal(true);
    }
  };


  const handleSaveCrop = () => {
    if (cropperRef.current) {
      const cropper = cropperRef.current.cropper;
      const croppedCanvas = cropper.getCroppedCanvas({
        width: 500,  // Set the width to 500px
        height: 500, // Set the height to 500px
      });

      if (croppedCanvas) {
        croppedCanvas.toBlob(
          (blob: Blob | null) => {
            if (blob) {
              const reader = new FileReader();
              reader.readAsDataURL(blob);
              reader.onloadend = () => {
                const base64data = reader.result as string;
                setFormData({ ...formData, image: base64data });
                handleImageUpload(base64data);
              };
            }
          },
          "image/jpeg",
          0.8
        );
      }
      setShowModal(false);
    }
  };

  const handleCancel = () => {
    setShowModal(false);
    setImageUrl('');
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  const handleImageUpload = async (croppedBase64: string) => {
    setUploadingImageToServer(true);
    if (croppedBase64) {
      const formData = new FormData();
      formData.append('image', croppedBase64.split(',')[1]);  // Extracting the base64 data part

      try {
        const response = await axios.post(`https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMAGEBB_API_KEY}`, formData);
        const imageUrl = response.data.data.display_url;  // Correct URL from response

        setFormData((prev) => ({ ...prev, image: imageUrl }));
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
    setUploadingImageToServer(false);
  };

  useEffect(() => {
    console.log(confirmPassword, formData.password);

    if (confirmPassword !== formData.password && confirmPassword !== "") {
      setPasswordError("Passwords do not match");
    } else {
      setPasswordError("");
    }
  }, [confirmPassword, formData.password]); // Runs when either value changes

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, password: e.target.value });
  };


  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisteringUser(true);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (res.ok) {
      router.push("/login");
      setRegisteringUser(false);
    } else {
      console.log(data.error);
      setRegisteringUser(false);
    }
  };

  // functions for otp

  // Start a countdown timer when OTP is sent
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isOtpSent && resendTimer > 0) {
      timer = setInterval(() => setResendTimer((prev) => prev - 1), 1000);
    } else if (resendTimer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(timer);
  }, [isOtpSent, resendTimer]);

  // Email validation before send
  const isValidEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  // Function to send OTP
  const sendOtp = async () => {
    setLoading(true);
    setOtpSending(true);
    setEmailValidationError("");
    setEmail(formData.email);
    console.log(formData.email);

    if (!isValidEmail(formData.email)) {
      setEmailValidationError("Please enter a valid email.");
      setLoading(false);
      setOtpSending(false);
      return;
    }

    setCanResend(false);
    setResendTimer(30); // Reset the timer


    const response = await fetch("/api/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email }),
    });

    const data = await response.json();
    setLoading(false);
    setOtpSending(false);

    if (response.ok) {
      setIsOtpSent(true);
    } else {
      setCanResend(true);
      setOtpSendError(data.error || "Failed to send OTP");
      console.log(otpSendError);
      setIsOtpSent(true);
    }
  };

  // Function to verify OTP
  const verifyOtp = async () => {
    setLoading(true);
    setOtpVerifying(true);
    setEmailValidationError("");

    const response = await fetch("/api/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
    });

    const data = await response.json();
    setLoading(false);
    setOtpVerifying(false);

    if (response.ok) {
      console.log("weee! Thikaso tumi!");
      setFormData(({ ...formData, emailVerified: "verified" }));
      setIsOtpSent(false);
      setOtpVerifying(false);
    } else {
      setOtpStatus(data.error || "Invalid OTP");
      setOtpVerifying(false);
    }
  };



  let otpComponent;

  if (isOtpSent) {
    otpComponent = canResend ? (
      <button type="button" onClick={() => sendOtp()} className="link link-primary text-xs">
        Resend OTP
      </button>
    ) : (
      <h1 className="text-xs text-gray-500">{`Resend in ${resendTimer}s`}</h1>
    );
  } else if (otpSending) {
    otpComponent = <h1>Sending OTP <span className="loading loading-infinity loading-xs" /></h1>
  } else if (formData.emailVerified === "verified") {
    otpComponent = <h1 className='text-green-500 text-xs'>Email Verified ✔</h1>;
  } else {
    otpComponent = (
      <button type="button" onClick={() => sendOtp()} className="link link-primary text-xs">
        Send OTP
      </button>
    );
  }

  const renderOtpVerification = () => {
    if (otp.length !== 6) {
      return <h1 className='text-xs text-gray-500'>Enter 6 digits code</h1>;
    }

    if (otpVerifying) {
      return <h1>Verifying <span className="loading loading-infinity loading-xs" /></h1>;
    }

    return (
      <button
        type='button'
        onClick={() => verifyOtp()}
        className='link link-primary text-xs'
        disabled={loading} // Only disable when loading
      >
        Verify OTP
      </button>
    );
  };


  useEffect(() => {
    if (data?.user) {
      router.push("/");
    }
  }, [data, router]);


  return (
    <div className="flex sm:flex-col w-full h-auto">
      <div className="flex justify-center items-center w-full h-full relative pt-20 pb-20">
        <div className="card backdrop-blur-lg w-full max-w-sm shrink-0 shadow-2xl rounded-2xl px-2 overflow-auto">
          <div className='w-full flex justify-center items-center'>
            <h1 className='text-3xl py-6 font-bold text-center'>Register</h1>
          </div>
          <form onSubmit={handleRegister} className="card-body flex justify-center items-center w-full">

            <div className="form-control w-full">
              <div className='flex items-center justify-between'>
                <legend className="fieldset-legend">Username<span className='text-red-500'>*</span></legend>
                <div>
                  {checkingUsername == true && <p>Checking Availability <span className="loading loading-infinity loading-xs" /></p>}
                  {usernameAvailable === true && checkingUsername == false && formData.username.length > 4 && <p className="text-green-500">✔ Available</p>}
                  {usernameAvailable === false && checkingUsername == false && formData.username.length > 4 && <p className="text-red-500">✖ Already taken</p>}
                </div>
              </div>

              <label className="input validator w-full input-ghost border-base-300/20 border-[.5px]">
                <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></g></svg>
                <input onBlur={(e) => setFormData({ ...formData, username: e.target.value })} className='w-full' type="text" required placeholder="Username" pattern="[A-Za-z][A-Za-z0-9\-]*" minLength={5} maxLength={30} title="Only letters, numbers or dash" />
              </label>
              <p className="validator-hint hidden">
                Must be 5 to 30 characters containing only letters, numbers or dash
              </p>
            </div>


            <div className="form-control w-full">
              <div className='flex items-center justify-between'>
                <legend className="fieldset-legend">Name<span className='text-red-500'>*</span></legend>
              </div>

              <label className="input w-full input-ghost border-base-300/20 border-[.5px]">
                <CgRename />
                <input onChange={(e) => setFormData({ ...formData, name: e.target.value })} value={formData.name} className='w-full' type="text" required placeholder="Name" />
              </label>
            </div>

            <div className="form-control w-full">
              <div className='flex items-center justify-between'>
                <legend className="fieldset-legend justify-start items-center">Email<span className='text-red-500'>*</span></legend>
                {otpComponent}
              </div>
              <label className="input validator w-full input-ghost border-base-300/20 border-[.5px]">
                <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor"><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></g></svg>
                <input className='w-full' type="email" placeholder="mail@site.com" required onBlur={(e) => setFormData({ ...formData, email: e.target.value })} />
              </label>
              <div className="validator-hint hidden">Enter valid email address</div>
              <div className='text-red-500 text-xs'>{emailValidationError}</div>
            </div>

            {
              isOtpSent &&
              <div className="form-control w-full">
                <div className='flex items-center justify-between'>
                  <legend className="fieldset-legend justify-start items-center">Verify OTP<span className='text-red-500'>*</span></legend>
                  {renderOtpVerification()}
                </div>
                <label className="input w-full input-ghost border-base-300/20 border-[.5px]">
                  <Md123 />
                  <input
                    className='w-full'
                    type="text"
                    placeholder="Enter your OTP"
                    required
                    value={otp}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (/^\d*$/.test(value)) {
                        setOtp(value);
                      }
                    }}
                    maxLength={6}
                  />
                </label>
                <div className='text-red-500 text-xs'>{otpStatus}</div>
              </div>}



            <div className="form-control w-full">
              <legend className="fieldset-legend justify-start items-center">Date Of Birth</legend>
              <label className="input w-full flex input-ghost border-base-300/20 border-[.5px]">
                <LiaBirthdayCakeSolid />
                <input className='w-full' type="date" onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })} />
              </label>
            </div>


            <div className="form-control w-full">
              <legend className="fieldset-legend justify-start items-center">Profile Photo
                {
                  uploadingImageToServer ?
                    <span className="loading loading-infinity loading-xs" />
                    :
                    ""
                }
              </legend>
              <label className="file-input file-input-ghost w-full  border-base-300/20 border-[.5px]">
                {
                  formData.image ?
                    <div className='pr-3'>
                      <Image src={formData.image} alt="Profile Picture" width={50} unoptimized={true} height={50} className="rounded-lg border-1 border-blue-500" />
                    </div>
                    :
                    <div className='px-3'>
                      <CiImageOn />
                    </div>
                }
                <input className='w-full' type="file" accept="image/*" onChange={handleImageChange} />
              </label>
            </div>



            <div className="form-control w-full">
              <legend className="fieldset-legend justify-start items-center">Gender</legend>
              <label className="select w-full flex input-ghost border-base-300/20 border-[.5px]">
                <BsGenderAmbiguous />
                <select defaultValue="Gender" onChange={(e) => setFormData({ ...formData, gender: e.target.value })}>
                  <option disabled>Gender</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Others</option>
                </select>
              </label>
            </div>


            <div className="form-control w-full">
              <div className='flex items-center justify-between'>
                <legend className="fieldset-legend">Bio</legend>
              </div>
              <textarea onChange={(e) => setFormData({ ...formData, bio: e.target.value })} value={formData.bio} className='w-full textarea textarea-ghost border-base-300/20 border-[.5px]' placeholder="Write About You" />
            </div>


            <div className="form-control w-full">
              <div className='flex items-center justify-between'>
                <legend className="fieldset-legend">Password<span className='text-red-500'>*</span></legend>
                <button type="button" className='cursor-pointer' onClick={() => setShowPassword(!showPassword)}>{
                  showPassword ?
                    <FaRegEye />
                    :
                    <FaRegEyeSlash />
                }</button>
              </div>
              <label className="input validator w-full input-ghost border-base-300/20 border-[.5px]">
                <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor"><path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"></path><circle cx="16.5" cy="7.5" r=".5" fill="currentColor"></circle></g></svg>
                <input className='w-full' type={showPassword ? 'text' : 'password'} onChange={handlePasswordChange} required placeholder="Password" minLength={8} pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}" title="Must be more than 8 characters, including number, lowercase letter, uppercase letter" />
              </label>
              <p className="validator-hint hidden">
                Must be more than 8 characters, including:
                <br />- At least one number
                <br />- At least one lowercase letter
                <br />- At least one uppercase letter
              </p>
            </div>

            <div className="form-control w-full">
              <div className='flex items-center justify-between'>
                <legend className="fieldset-legend">Confirm Password<span className='text-red-500'>*</span></legend>
                <button type="button" className='cursor-pointer' onClick={() => setShowPassword(!showPassword)}>{
                  showPassword ?
                    <FaRegEye />
                    :
                    <FaRegEyeSlash />
                }</button>
              </div>
              <label className="input validator w-full input-ghost border-base-300/20 border-[.5px]">
                <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor"><path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"></path><circle cx="16.5" cy="7.5" r=".5" fill="currentColor"></circle></g></svg>
                <input className='w-full' type={showPassword ? 'text' : 'password'} onChange={handleConfirmPasswordChange} required placeholder="Confirm Password" minLength={8} pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}" title="Must be more than 8 characters, including number, lowercase letter, uppercase letter" />
              </label>
              <p className={`text-red-500 text-xs pt-2`}>
                {passwordError}
              </p>
            </div>

            <div className='w-full flex justify-center items-center'>
              <div className="form-control mt-6">
                <button className="btn btn-primary" disabled={passwordError.length > 0 || !usernameAvailable || checkingUsername || registeringUser || formData.emailVerified != "verified"} type="submit">{registeringUser ? <span className="loading loading-infinity loading-md" /> : "Register"}</button>
              </div>
            </div>
            <div className="w-full flex justify-center items-center mt-2">
              <h1 className="text-xs">
                Already have an account?{' '}
                <Link className="text-[#436be1] font-bold big:hover:scale-110" href="/login">
                  Log in
                </Link>
              </h1>
            </div>
          </form>
          <div className="w-full flex flex-col justify-center items-center mb-10">
            <h1 className="text-xs">Register with Google</h1>
            <button onClick={() => signIn("google")} type='submit'><FcGoogle className='cursor-pointer bg-[#ffffff] shadow-[#436be150] shadow-lg text-5xl rounded-full hover:scale-3d transition-all duration-300 ease-in-out mt-4' /></button>
          </div>
        </div>
      </div >
      <div className="absolute w-1/4 h-1/2 -z-40 blur-[130px] bg-gradient-to-r from-[#436be1] to-[#436be1] animate-glow-spread" />

      <div className="flex justify-center items-center w-full h-[1500px] absolute overflow-hidden -z-40">
        <Image
          src={loginPic}
          alt="loginpic"
          height={2000}
          width={2000}
          className="-z-50 object-cover w-full h-full min-h-[1500px] filter contrast-200 blur-xl opacity-30"
        />
        <div className="absolute right-0 w-1/4 h-1/2 -z-40 blur-[130px] bg-gradient-to-r from-[#436be1] to-[#436be1] animate-glow-spread" />
      </div>
      {
        showModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-transparent backdrop-blur-md shadow-xl p-4 rounded-lg w-full max-w-lg  border-[.5px] border-white/10 ">
              <h3 className="text-center text-xl font-bold mb-4">Crop Image</h3>
              <Cropper src={imageUrl} style={{ height: 400, width: '100%' }} aspectRatio={1} guides={false} ref={cropperRef} />
              <div className="mt-4 flex justify-between">
                <button onClick={handleSaveCrop} className="btn btn-primary">Save Crop</button>
                <button onClick={handleCancel} className="btn btn-warning">Cancel</button>
              </div>
            </div>
          </div>
        )
      }
    </div >
  )
}
