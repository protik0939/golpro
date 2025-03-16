'use client'
import React from 'react'
import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Dashboard() {
    const { data, status } = useSession();
    const router = useRouter();

    const handleSignOut = () => {
        signOut();
        router.push('/login');
    }

    if (status === "loading") {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>Dashboard</h1>
            {data?.user ? (
                <div>
                    <p><strong>Name:</strong> {data.user.name}</p>
                    <p><strong>Email:</strong> {data.user.email}</p>
                    <p><strong>Bio:</strong> {data.user.bio}</p>
                    <p><strong>Gender:</strong> {data.user.gender}</p>
                    <button className='btn btn-primary' onClick={() => handleSignOut()}>
                        Log out
                    </button>
                </div>
            ) : (
                <div>
                    <p>User data not available </p>
                    <Link href={"/login"}>Login</Link >
                </div>
            )}
        </div>
    )
}
