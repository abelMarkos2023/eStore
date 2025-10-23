import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { signOutUser } from "@/lib/actions/user.action";
import { DropdownMenuLabel } from "@radix-ui/react-dropdown-menu";
import { UserIcon } from "lucide-react";
import Link from "next/link";

const UserButton = async () => {
  const session = await auth();

  if (!session) {
    return (
      <Button asChild size="sm">
        <Link href="/auth/signin" className="flex items-center">
          <UserIcon className="mr-1" />
          Sign In
        </Link>
      </Button>
    );
  }
  const firstInitial = session.user?.name?.charAt(0).toUpperCase();
  return (
    <div className="flex gap-2">
        <DropdownMenu >
            <DropdownMenuTrigger asChild>
                <div className="flex items-center">
                    <Button variant='ghost' className="w-8 h-8 rounded-full bg-primary flex items-center text-secondary justify-center">
                        {firstInitial}
                    </Button>
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' forceMount className='w-56 p-2'>
                    <DropdownMenuLabel className="flex flex-col space-y-1">
                        <span className="text-sm font-medium">
                            {session.user?.name}
                        </span>
                        <span className="text-sm text-muted-foreground">
                            {session.user?.email}
                        </span>
                    </DropdownMenuLabel>
                    <DropdownMenuItem>
                      <Link href='/user/profile' className="w-full">
                        User Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link href='/user/orders' className="w-full">
                        Order History
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="p-0 w-full mt-2">
                        <form action={signOutUser}>
                            <Button className="w-full cursor-pointer text-center py-4" variant = 'ghost' type="submit">Sign out</Button>
                        </form>
                    </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    </div>
  );
};

export default UserButton;
