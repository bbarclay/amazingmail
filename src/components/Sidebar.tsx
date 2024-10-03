import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { FiList, FiPlusCircle } from 'react-icons/fi';
import NavItem from './NavItem';
import NavSubItem from './NavSubItem';

const Sidebar = ({ isOpen }: { isOpen: boolean }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [router, setRouter] = useState(null);

  useEffect(() => {
    setIsMounted(true);
    setRouter(useRouter());
  }, []);

  if (!isMounted || !router) {
    return null;
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