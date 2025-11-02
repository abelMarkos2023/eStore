'use client'

import { Input } from "@/components/ui/input";
import { usePathname, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react";

const AdminSearch = () => {
    const searchParams = useSearchParams();
    const pathname = usePathname();

    const actionURl = pathname.includes('/admin/order') ? '/admin/orders' : pathname.includes('/admin/users') ? '/admin/users' : '/admin/products';

    const [query,setQuery] = useState(searchParams.get('query') || '');

    useEffect(() => {
        setQuery(searchParams.get('query') || '');
    },[searchParams]);
  return (
    <form action = {actionURl} method = 'GET'>
        <Input name = 'query' value = {query} onChange = {(e) => setQuery(e.target.value)} className = 'w-[100px] lg:w-[300px]' placeholder = 'Search...' />
    </form>
  )
}

export default AdminSearch