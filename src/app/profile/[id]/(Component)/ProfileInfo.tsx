'use client';

import { useSession } from 'next-auth/react';
import loginPic from '../../../assets/icons/icon.svg';
import '../../../(Authentication)/login/(components)/glow.css';
import Image from 'next/image';
import React, { useState, useRef, useEffect } from 'react';
import Cropper from 'react-cropper';
import '/node_modules/react-cropper/node_modules/cropperjs/dist/cropper.css';
import axios from 'axios';
import { TbPhotoEdit } from 'react-icons/tb';
import { useRouter } from 'next/navigation';

export default function ProfileInfo() {
    const { data: session, status } = useSession();
    const router = useRouter();

    const [isEditing, setIsEditing] = useState(false);
    const [uploadingImageToServer, setUploadingImageToServer] = useState<boolean>(false);
    const [originalUsername, setOriginalUsername] = useState<string>("");

    const [checkingUsername, setCheckingUsername] = useState(false);
    const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);

    const [updatingData, setUpdatingData] = useState<boolean>(false);

    const [userData, setUserData] = useState({
        username: '',
        name: '',
        bio: '',
        dateOfBirth: '',
        gender: '',
        image: '',
        emailVerified: "verified",
    });

    const [imageUrl, setImageUrl] = useState<string>('');
    const [croppedImage, setCroppedImage] = useState<string | null>(null);
    const [showModal, setShowModal] = useState<boolean>(false);
    const cropperRef = useRef<any>(null);

    // Update userData when session is available
    useEffect(() => {
        if (session?.user) {
            setUserData({
                username: session.user.username,
                email: session.user.email,
                name: session.user.name ?? '',
                bio: session.user.bio ?? '',
                dateOfBirth: session.user.dateOfBirth ?? '',
                gender: session.user.gender ?? '',
                image: session.user.image ?? '',
            });
        }
    }, [session]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    };

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
                    (blob) => {
                        if (blob) {
                            const reader = new FileReader();
                            reader.readAsDataURL(blob);
                            reader.onloadend = () => {
                                const base64data = reader.result as string;
                                setCroppedImage(base64data);
                                setUserData({ ...userData, image: base64data });
                                handleImageUpload(base64data);
                            };
                        }
                    },
                    'image/jpeg',
                    0.8
                );
            }
            setShowModal(false);
        }
    };

    const handleImageUpload = async (croppedBase64: string) => {
        setUploadingImageToServer(true);
        if (croppedBase64) {
            const formData = new FormData();
            formData.append('image', croppedBase64.split(',')[1]);  // Extracting the base64 data part

            try {
                const response = await axios.post(`https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMAGEBB_API_KEY}`, formData);
                const imageUrl = response.data.data.display_url;  // Correct URL from response

                setUserData((prev) => ({ ...prev, image: imageUrl }));
            } catch (error) {
                console.error('Error uploading image:', error);
            }
        }
        setUploadingImageToServer(false);
    };


    const handleSave = async () => {
        setUpdatingData(true);
        try {
            await axios.put('/api/update-profile', userData);
            router.refresh();
            setUpdatingData(false);
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating profile:', error);
            setUpdatingData(false);
        }
    };

    const handleCancel = () => {
        setShowModal(false);
        setImageUrl('');
        setCroppedImage(null);
        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
    };


    function formatDateOfBirth(dateString: string): string {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });
    }

    const startEditing = () => {
        setOriginalUsername(userData.username);
        setIsEditing(true);
    }

    useEffect(() => {
        if (userData.username.length > 4 && userData.username !== originalUsername) {
            setCheckingUsername(true);
            const timeout = setTimeout(async () => {
                try {
                    const res = await fetch("/api/check-username", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ username: userData.username }),
                    });

                    const data = await res.json();
                    setUsernameAvailable(data.available);
                } catch (error) {
                    console.error("Error checking username:", error);
                    setUsernameAvailable(false);
                } finally {
                    setCheckingUsername(false);
                }
            }, 500); // 500ms delay to reduce API calls

            return () => clearTimeout(timeout);
        } else {
            setUsernameAvailable(null); // Reset availability check
        }
    }, [userData.username]);

    const usernameStatus = () => {
        if (userData.username != originalUsername && userData.username.length > 3) {
            if (checkingUsername) {
                return <span className='text-xs'>Checking availability <span className="loading loading-infinity loading-xs" /></span>
            } else if (usernameAvailable === true) {
                return <span className="text-green-500 text-xs">✔ Username is available</span>
            } else if (usernameAvailable === false) {
                return <span className="text-red-500 text-xs">✖ Username is already taken</span>
            } else {
                return null;
            }
        }
    }



    if (status === "loading") {
        return <div>Loading...</div>;
    }

    return (
        <div className="flex sm:flex-col w-full h-auto">
            <div className="flex justify-center items-center w-full h-full relative pt-20 pb-20">
                <div className="card backdrop-blur-lg w-full max-w-xl shrink-0 shadow-2xl rounded-2xl overflow-auto p-5">
                    <h2 className="text-xl font-bold my-5 text-center">Profile Information</h2>
                    <div className="flex flex-col items-center">
                        <div className="relative group w-[150px] h-[150px]">
                            {/* Profile Image */}
                            <Image
                                src={userData.image || '/default-profile.png'}
                                alt="Profile Picture"
                                width={150}
                                height={150}
                                className="rounded-full border-4 border-blue-500"
                                unoptimized={true}
                            />

                            {/* Uploading Loader */}
                            {uploadingImageToServer && <span className="loading loading-infinity loading-xl absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />}

                            {/* Hidden File Input (Triggered by Clicking Edit Icon) */}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                                id="fileInput"
                            />

                            {/* Edit Icon Overlay (Click to Open File Input) */}
                            {isEditing && (
                                <label
                                    htmlFor="fileInput"
                                    className="absolute bottom-2 right-2 bg-gray-800/20 backdrop-blur-md text-white p-2 hover:scale-110 transition-all duration-300 ease-in-out rounded-full cursor-pointer"
                                >
                                    <TbPhotoEdit />
                                </label>
                            )}
                        </div>

                    </div>



                    <div className="mt-4 space-y-2">
                        {
                            isEditing ?
                                <label className="flex items-center justify-between border-b-[.5px] border-base-300/25 pt-3">Username {usernameStatus()}</label>
                                :
                                <label className="block border-b-[.5px] border-base-300/25 pt-3">Username</label>
                        }
                        {isEditing ? (
                            <input className="input input-ghost border-[.5px]  border-base-300/20 w-full" type="text" name="username" value={userData.username} onChange={handleChange} />
                        ) : (
                            <p>{userData.username}</p>
                        )}

                        <label className="block border-b-[.5px] border-base-300/25 pt-3">Name</label>
                        {isEditing ? (
                            <input className="input input-ghost border-[.5px]  border-base-300/20 w-full" type="text" name="name" value={userData.name} onChange={handleChange} />
                        ) : (
                            <p>{userData.name}</p>
                        )}

                        {!isEditing && <label className="block border-b-[.5px] border-base-300/25 pt-3">Email</label>}
                        {isEditing ? (
                            ''
                        ) : (
                            <p className="">{session?.user?.email}</p>
                        )}

                        <label className="block border-b-[.5px] border-base-300/25 pt-3">Bio</label>
                        {isEditing ? (
                            <textarea name="bio" value={userData.bio} onChange={handleChange} className="w-full textarea textarea-ghost border-base-300/20 border-[.5px]" />
                        ) : (
                            <p>{userData.bio || 'No bio available'}</p>
                        )}


                        <label className="block border-b-[.5px] border-base-300/25 pt-3">Date Of Birth</label>
                        {isEditing ? (
                            <input type="date" name="dateOfBirth" value={userData.dateOfBirth ? userData.dateOfBirth.split("T")[0] : ""} onChange={handleChange} className="input w-full flex input-ghost border-base-300/20 border-[.5px]" />
                        ) : (
                            <p>{formatDateOfBirth(userData.dateOfBirth) || 'BirthDate not given'}</p>
                        )}

                        <label className="block border-b-[.5px] border-base-300/25 pt-3">Gender</label>
                        {isEditing ? (
                            <select name="gender" value={userData.gender} onChange={handleChange} className="select w-full flex input-ghost border-base-300/20 border-[.5px]">
                                <option value="">Select</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        ) : (
                            <p>{userData.gender || 'Not specified'}</p>
                        )}


                    </div>

                    <div className="mt-6 flex justify-between">
                        {isEditing ? (
                            updatingData ?
                                <h1>Saving <span className="loading loading-infinity loading-xs" /></h1>
                                :
                                <>
                                    <button onClick={handleSave} disabled={uploadingImageToServer || checkingUsername} className="btn btn-primary">Save</button>
                                    <button onClick={() => setIsEditing(false)}  disabled={uploadingImageToServer || checkingUsername} className="btn bg-red-500">Cancel</button>
                                </>
                        ) : (
                            <div className='w-full flex items-center justify-center'>
                                <button onClick={() => startEditing()} className="btn btn-primary">Edit Profile</button>
                            </div>

                        )}
                    </div>
                </div>
            </div>
            <div className="absolute w-1/4 h-1/2 -z-40 blur-[130px] bg-gradient-to-r from-[#436be1] to-[#436be1] animate-glow-spread" />

            <div className="flex justify-center items-center w-full h-[1000px] absolute overflow-hidden -z-40">
                <Image
                    src={loginPic}
                    alt="loginpic"
                    height={2000}
                    width={2000}
                    className="-z-50 object-cover w-full h-full min-h-[1000px] filter contrast-200 blur-xl opacity-30"
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
    );
}
