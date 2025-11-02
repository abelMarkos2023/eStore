import DeleteDialog from '@/components/shared/DeleteDialog';
import Pagination from '@/components/shared/Pagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { deleteUser, getAllUsers } from '@/lib/actions/user.action'
import { formatId } from '@/lib/utils';
import Link from 'next/link';
import React from 'react'

const AdminUserPage = async ({searchParams}:{searchParams:Promise<{page:string,query:string}>}) => {

        const {page='1',query=''} = await searchParams

    const data = await getAllUsers({limit:5,page:Number(page),query});



  return (
    <div className="space-y-3">
        <div className="flex items-center justify-between">
            <div className="flex gap-3 items-center">
                <h2 className="text-2xl font-bold">All Users</h2>
                {
                    query && (
                        <>
                            <p className="text-muted-foreground">
                            Showing results for{ `  " ${query} "` } 
                            </p>
                            <Link href= '/admin/users'>
                                <Button variant='ghost'>
                                     Reset
                                </Button>
                             </Link>
                        </>
                        )
                }
                
            </div>
            <Button variant='default'>
                <Link href = '/admin/products/create'>Add New</Link>
            </Button>
        </div>
        <div className="overflow-x-auto-w-fill space-y-4">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Id</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        data?.data.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>{formatId(user.id)}</TableCell>
                                <TableCell>{user.name}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>
                                    {
                                        user.role === 'user' ? <Badge variant='secondary'>user</Badge> : <Badge variant= 'default'>admin</Badge>
                                    }
                                </TableCell>
                                <TableCell className='flex gap-2'>
                                   <DeleteDialog id ={user.id} action={deleteUser}/>
                               <Button className='cursor-pointer' variant='default' size={'sm'}>
                                 <Link href={`/admin/users/${user.id}`}>
                                Edit
                                    </Link>
                               </Button>
                                </TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
            {
                 data!.totalPages > 1 && (
                    <Pagination
                        page={page}
                        totalPages={data?.totalPages || 1}
                    />
                )
            }
        </div>
    </div>
  )
}

export default AdminUserPage