'use client'

import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import { ComputerIcon, MoonIcon, SunIcon, SunMoon } from 'lucide-react';
import { useTheme } from 'next-themes';
import React from 'react'

const ModeToggler = () => {
     const { theme, setTheme } = useTheme();
     const [mounted, setMounted] = React.useState(false);

     React.useEffect(() => {
         setMounted(true);
     }, []);

     if (!mounted) {
         return null;
     }
  return (
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button variant={'ghost'} size='sm' className='focus-visible:ring-0 focus-visible:ring-offset-0'>
                {
                    theme === 'system' ? <SunMoon /> : theme === 'dark' ? <SunIcon /> : <MoonIcon />
                }
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuSeparator/>
        <DropdownMenuContent align='end' className='flex flex-col space-y-2 '>
           <DropdownMenuCheckboxItem checked={theme === 'light'} onCheckedChange={() => setTheme('light')}>
                <SunIcon />
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem checked={theme === 'dark'} onCheckedChange={() => setTheme('dark')}>
                <MoonIcon />
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem checked={theme === 'system'} onCheckedChange={() => setTheme('system')}>
                <ComputerIcon />
            </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ModeToggler