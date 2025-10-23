'use client'

import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "../ui/button";

type Props = {
    page: number | string;
    totalPages: number | string;
}

const Pagination = ({page, totalPages}: Props) => {

    const router = useRouter();
    const searchParams = useSearchParams();
  return (
    <div className="flex gap-2">
        <Button disabled={page == 1} onClick={() => router.push(`?page=${Number(page) - 1}`)} className="w-24 cursor-pointer" variant='outline'>
            Previous
        </Button>
        <Button disabled={page == Number(totalPages)} onClick={() => router.push(`?page=${Number(page) + 1}`)} className="w-24 cursor-pointer" variant='outline'>
            Next
        </Button>
    </div>
  )
}

export default Pagination