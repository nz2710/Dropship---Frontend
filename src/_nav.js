import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilBoatAlt,
  // cilMap,
  cilSettings,
  cilClipboard,
  // cilContact,
  cilPeople,
  cilCarAlt,
  cilGift,
  // cilPeoplePlus,
  cilHome
} from '@coreui/icons'
import {  CNavItem } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilClipboard} customClassName="nav-icon" />
  },
  {
    component: CNavItem,
    name: 'Depot',
    to: '/depot',
    icon: <CIcon icon={cilHome} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Vehicle',
    to: '/vehicle',
    icon: <CIcon icon={cilHome} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Partner',
    to: '/partner',
    icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Product',
    to: '/product',
    icon: <CIcon icon={cilCarAlt} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Order',
    to: '/order',
    icon: <CIcon icon={cilBoatAlt} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Plan',
    to: '/plan',
    icon: <CIcon icon={cilGift} customClassName="nav-icon" />,
  },

  // {
  //   component: CNavItem,
  //   name: 'khách hàng',
  //   to: '/googlemap',
  //   icon: <CIcon icon={cilContact} customClassName="nav-icon" />,
  // },

  {
    component: CNavItem,
    name: 'Routing',
    to: '/settings',
    icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
  },
  // {
  //   component: CNavItem,
  //   name: 'Googlemap',
  //   to: '/googlemap',
  //   icon: <CIcon icon={cilMap} customClassName="nav-icon" />,
  // },
  {
    component: CNavItem,
    name: 'User',
    to: '/user',
    icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
  }
];


export default _nav
