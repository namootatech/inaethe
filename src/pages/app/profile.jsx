import { useState } from 'react';
import { DashboardCard } from '@/components/ui/app-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
export default function Profile() {
  const [name, setName] = useState('John Doe');
  const [email, setEmail] = useState('john@example.com');
  const [bio, setBio] = useState(
    'I am passionate about making a difference...'
  );
  const [notifications, setNotifications] = useState(true);
  const [publicProfile, setPublicProfile] = useState(true);
  const handleSubmit = (e) => {
    e.preventDefault();
    // Implement profile update logic here
    console.log('Profile updated:', {
      name,
      email,
      bio,
      notifications,
      publicProfile,
    });
  };
  return (
    <div>
      <h1 className='text-3xl font-bold mb-6 text-gray-100'>Profile</h1>
      <DashboardCard title='User Details'>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <Label htmlFor='name' className='text-gray-300'>
              Name
            </Label>
            <Input
              id='name'
              value={name}
              onChange={(e) => setName(e.target.value)}
              className='bg-gray-800 border-gray-700 text-gray-300'
            />
          </div>
          <div>
            <Label htmlFor='email' className='text-gray-300'>
              Email
            </Label>
            <Input
              id='email'
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='bg-gray-800 border-gray-700 text-gray-300'
            />
          </div>
          <div>
            <Label htmlFor='bio' className='text-gray-300'>
              Bio
            </Label>
            <Textarea
              id='bio'
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className='bg-gray-800 border-gray-700 text-gray-300'
            />
          </div>
          <div className='flex items-center space-x-2'>
            <Switch
              id='notifications'
              checked={notifications}
              onCheckedChange={setNotifications}
            />
            <Label htmlFor='notifications' className='text-gray-300'>
              Enable Notifications
            </Label>
          </div>
          <div className='flex items-center space-x-2'>
            <Switch
              id='publicProfile'
              checked={publicProfile}
              onCheckedChange={setPublicProfile}
            />
            <Label htmlFor='publicProfile' className='text-gray-300'>
              Make Profile Public
            </Label>
          </div>
          <Button
            type='submit'
            className='w-full bg-pink-700 text-white hover:bg-pink-800'
          >
            Update Profile
          </Button>
        </form>
      </DashboardCard>
    </div>
  );
}
