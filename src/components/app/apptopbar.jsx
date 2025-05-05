import React from 'react';
import { Bell, Search, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/context/AuthContext';

export default function TopBar() {
  const { user, logoutUser } = useAuth();
  console.log('** [TOPBAR] User:', user);
  return (
    <div className='flex items-center justify-between p-4 bg-gray-900 border-b border-gray-700'>
      <div className='flex items-center'>
        {/* <Input
          type='text'
          placeholder='Search...'
          className='w-64 bg-gray-800 border-gray-700 text-gray-300 focus:border-pink-700'
        />
        <Button
          variant='ghost'
          size='icon'
          className='ml-2 text-gray-400 hover:text-pink-700'
        >
          <Search className='h-5 w-5' />
        </Button> */}
        <p className='text-gray-600 font-bold'> Donations Platform</p>
      </div>
      <div className='flex items-center space-x-4'>
        <Button
          variant='ghost'
          size='icon'
          className='text-gray-400 hover:text-pink-700'
        >
          <Bell className='h-5 w-5' />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant='ghost'
              size='icon'
              className='text-gray-400 hover:text-pink-700'
            >
              <User className='h-5 w-5' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className='w-56 bg-gray-800 border-gray-700'>
            <DropdownMenuLabel className='text-gray-300'>
              {user?.user?.firstName} {user?.user?.lastName}
            </DropdownMenuLabel>
            <DropdownMenuSeparator className='bg-gray-700' />
            {/* <DropdownMenuItem className='text-gray-300 hover:bg-gray-700 hover:text-pink-700'>
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem className='text-gray-300 hover:bg-gray-700 hover:text-pink-700'>
              Settings
            </DropdownMenuItem> */}
            <DropdownMenuItem
              className='text-gray-300 hover:bg-gray-700 hover:text-pink-700'
              onClick={logoutUser}
            >
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
