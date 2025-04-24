import { useState } from 'react';
import Layout from '@/components/app/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
export default function SubscriberDashboard() {
  const [activeTab, setActiveTab] = useState('subscriptions');
  return (
    <Layout userType='subscriber'>
      <h1 className='text-3xl font-bold mb-6'>Subscriber Dashboard</h1>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value='subscriptions'>My Subscriptions</TabsTrigger>
          <TabsTrigger value='npos'>NPO Organizations</TabsTrigger>
          <TabsTrigger value='affiliates'>My Affiliates</TabsTrigger>
          <TabsTrigger value='payments'>Affiliate Payments</TabsTrigger>
        </TabsList>
        <TabsContent value='subscriptions'>
          <Card>
            <CardHeader>
              <CardTitle>My Subscriptions</CardTitle>
              <CardDescription>
                Manage your NPO subscriptions here.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Add subscription management content here */}
              <Button>Make a One-Time Donation</Button>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value='npos'>
          <Card>
            <CardHeader>
              <CardTitle>NPO Organizations</CardTitle>
              <CardDescription>
                Discover and subscribe to NPO organizations.
              </CardDescription>
            </CardHeader>
            <CardContent>{/* Add NPO organization cards here */}</CardContent>
          </Card>
        </TabsContent>
        <TabsContent value='affiliates'>
          <Card>
            <CardHeader>
              <CardTitle>My Affiliates</CardTitle>
              <CardDescription>Manage your affiliate network.</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Add affiliate management content here */}
              <Button>Share Invite Link</Button>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value='payments'>
          <Card>
            <CardHeader>
              <CardTitle>Affiliate Payments</CardTitle>
              <CardDescription>
                Track payments from your affiliates.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Add affiliate payment tracking content here */}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Layout>
  );
}
