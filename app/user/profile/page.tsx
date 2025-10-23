import { auth } from '@/auth';
import React from 'react'
import { SessionProvider } from 'next-auth/react';
import UpdateProfileForm from './UpdateProfileForm';

const Profile = async() => {

  const session = await auth();
  return (
    <SessionProvider session={session}>
      <div className="max-w-xl mx-auto space-y-4">
        <h2 className="text-2xl font-bold">Update Profile</h2>
        <UpdateProfileForm />
      </div>
    </SessionProvider>
  )
}

export default Profile