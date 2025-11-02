import { getUserById } from '@/lib/actions/user.action'
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import React from 'react'
import UpdateUserForm from './UpdateUserForm';

export const metadata:Metadata = {
    title: 'Update User',
    description: 'Update user  details here ',
}

const UpdateUserPage = async ({params}:{params:Promise<{id:string}>}) => {

    const {id} = await params

    const user = await getUserById(id);

    if(!user) return notFound();
    console.log(user)
  return (
        <div className="space-y-8 max-w-xl mx-auto">
            <h1 className="text-2xl font-bold">Update User</h1>
            <UpdateUserForm user={user} />
        </div>
  )
}

export default UpdateUserPage