import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  Home,
  Users,
  DollarSign,
  BarChart2,
  FileText,
  User,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Sidebar,
  SidebarContent,
  SidebarTrigger,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const menuItems = [
  { icon: Home, label: 'Home', href: '/app' },
  { icon: Users, label: 'Subscriptions', href: '/app/subscriptions' },
  { icon: Users, label: 'Referrals', href: '/app/referrals' },
  { icon: DollarSign, label: 'Earnings', href: '/app/earnings' },
  { icon: BarChart2, label: 'NPOs', href: '/app/npos' },
  { icon: FileText, label: 'Blog Posts', href: '/app/blog' },
  { icon: User, label: 'Profile', href: '/app/profile' },
  { icon: HelpCircle, label: 'Support', href: '/app/support' },
];

export default function SidebarComponent({ expanded, setExpanded }) {
  const router = useRouter();

  return (
    <Sidebar
      collapsible='icon'
      defaultCollapsed={!expanded}
      className='border-r border-gray-700'
    >
      <SidebarHeader className='flex items-center justify-between p-4'>
        <h2
          className={cn(
            'text-lg font-semibold text-pink-700',
            !expanded && 'hidden'
          )}
        >
          Inaethe
        </h2>
        <SidebarTrigger
          onClick={() => setExpanded(!expanded)}
          className='text-gray-400 hover:text-pink-700'
        >
          {expanded ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
        </SidebarTrigger>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <SidebarMenuButton
                      asChild
                      isActive={router.pathname === item.href}
                    >
                      <Link
                        href={item.href}
                        className='flex items-center space-x-2 text-gray-300 hover:text-pink-700'
                      >
                        <item.icon size={20} />
                        <span
                          className={cn(
                            'transition-opacity',
                            !expanded && 'opacity-0'
                          )}
                        >
                          {item.label}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </TooltipTrigger>
                  <TooltipContent
                    side='right'
                    className='bg-gray-700 text-gray-100'
                  >
                    {item.label}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className='p-4'>
        <p className={cn('text-sm text-gray-500', !expanded && 'hidden')}>
          © 2023 Inaethe
        </p>
      </SidebarFooter>
    </Sidebar>
  );
}

SidebarComponent.propTypes = {
  expanded: PropTypes.bool.isRequired,
  setExpanded: PropTypes.func.isRequired,
};
