import { useState } from 'react';
import { DashboardCard } from '@/components/ui/app-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
const npos = [
  {
    id: 1,
    name: 'Save the Oceans',
    category: 'Environment',
    location: 'Global',
  },
  { id: 2, name: 'Educate for Future', category: 'Education', location: 'USA' },
  {
    id: 3,
    name: 'Green Earth Initiative',
    category: 'Environment',
    location: 'Europe',
  },
  { id: 4, name: 'Tech for All', category: 'Technology', location: 'Asia' },
];
export default function NPOs() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const filteredNPOs = npos.filter(
    (npo) =>
      npo.name.toLowerCase().includes(search.toLowerCase()) &&
      (category === '' || npo.category === category)
  );
  return (
    <div>
      <h1 className='text-3xl font-bold mb-6 text-gray-100'>NPO Management</h1>
      <div className='mb-6 flex flex-wrap gap-4'>
        <Input
          placeholder='Search NPOs'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className='max-w-sm bg-gray-800 border-gray-700 text-gray-300'
        />
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className='w-[180px] bg-gray-800 border-gray-700 text-gray-300'>
            <SelectValue placeholder='Category' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='All'>All Categories</SelectItem>
            <SelectItem value='Environment'>Environment</SelectItem>
            <SelectItem value='Education'>Education</SelectItem>
            <SelectItem value='Technology'>Technology</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {filteredNPOs.map((npo) => (
          <DashboardCard key={npo.id} title={npo.name}>
            <p className='text-gray-300 mb-2'>Category: {npo.category}</p>
            <p className='text-gray-300 mb-4'>Location: {npo.location}</p>
            <Button className='w-full bg-pink-700 text-white hover:bg-pink-800'>
              View Details
            </Button>
          </DashboardCard>
        ))}
      </div>
    </div>
  );
}
