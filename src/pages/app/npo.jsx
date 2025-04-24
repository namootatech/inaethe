import { useState } from 'react';
import Layout from '@/components/app/mainlayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
export default function NPODashboard() {
  const [activeTab, setActiveTab] = useState('subscribers');
  return (
    <Layout userType='npo'>
      <h1 className='text-3xl font-bold mb-6'>NPO Dashboard</h1>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value='subscribers'>Subscribers</TabsTrigger>
          <TabsTrigger value='payments'>Payments</TabsTrigger>
          <TabsTrigger value='website'>Website Management</TabsTrigger>
        </TabsList>
        <TabsContent value='subscribers'>
          <Card>
            <CardHeader>
              <CardTitle>Subscribers</CardTitle>
              <CardDescription>Manage your subscribers here.</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Add subscriber management content here */}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value='payments'>
          <Card>
            <CardHeader>
              <CardTitle>Payments</CardTitle>
              <CardDescription>View and manage payments.</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Add payment management content here */}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value='website'>
          <Card>
            <CardHeader>
              <CardTitle>Website Management</CardTitle>
              <CardDescription>Manage your NPO website.</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue='analytics'>
                <TabsList>
                  <TabsTrigger value='analytics'>Analytics</TabsTrigger>
                  <TabsTrigger value='visitors'>Visitors</TabsTrigger>
                  <TabsTrigger value='content'>Content</TabsTrigger>
                  <TabsTrigger value='theme'>Theme</TabsTrigger>
                </TabsList>
                <TabsContent value='analytics'>
                  {/* Add analytics content here */}
                </TabsContent>
                <TabsContent value='visitors'>
                  {/* Add visitors content here */}
                </TabsContent>
                <TabsContent value='content'>
                  {/* Add content management here */}
                </TabsContent>
                <TabsContent value='theme'>
                  {/* Add theme management here */}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Layout>
  );
}
