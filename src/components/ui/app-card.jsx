import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
export function DashboardCard({ title, children }) {
  return (
    <Card className='bg-gray-800 border-gray-700'>
      <CardHeader>
        <CardTitle className='text-gray-100'>{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
