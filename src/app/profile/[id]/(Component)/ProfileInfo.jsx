'use client'

import { useSession } from 'next-auth/react';
import Image from 'next/image'
import React from 'react'

export default function ProfileInfo() {


    const { data: session } = useSession();

    return (
        <div>
            {session?.user?.name}
            {session?.user?.email}
            <Image
                src={session?.user?.image}
                alt={session?.user?.name}
                width={400}
                height={400}
            />
        </div>
    )
}
