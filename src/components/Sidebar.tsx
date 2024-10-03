import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { FiList, FiPlusCircle } from 'react-icons/fi';
import NavItem from './NavItem';
import NavSubItem from './NavSubItem';

const Sidebar = ({ isOpen }: { isOpen: boolean }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [router, setRouter] = useState(null);

  useEffect(() => {
    // Ensure the router is only set on the client-side
    setIsMounted(true);
    if (typeof window !== 'undefined') {
      setRouter(useRouter());
    }
  }, []);

  if (!isMounted || !router) {
    return null; // Return null until the router is ready
  }

  return (
    <nav>
      <ul>
        <NavItem
          icon={<FiList />}
          title="Campaigns"
          isActive={router.pathname.startsWith('/campaigns')}
        >
          <NavSubItem
            icon={<FiList />}
            title="All Campaigns"
            href="/campaigns/all"
            isActive={router.pathname === '/campaigns/all'}
          />
          <NavSubItem
            icon={<FiPlusCircle />}
            title="Create Campaign"
            href="/campaigns/create"
            isActive={router.pathname === '/campaigns/create'}
          />
        </NavItem>
        {/* Add more NavItems here */}
      </ul>
    </nav>
  );
};

export default Sidebar;
