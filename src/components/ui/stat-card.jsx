import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
export function StatCard({ title, value, icon }) {
  return (
    <Card className='bg-gray-800 border-gray-700'>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle className='text-sm font-medium text-gray-400'>
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className='text-2xl font-bold text-pink-700'>{value}</div>
      </CardContent>
    </Card>
  );
}
