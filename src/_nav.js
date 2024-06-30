import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilSettings,
  cilClipboard,
  cilCalendar,
  cilPeople,
  cilGift,
  cilTruck,
  cilCart,
  cilUserPlus,
  cilHome
} from '@coreui/icons'
import { CNavItem } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/admin/dashboard',
    icon: <CIcon icon={cilClipboard} customClassName="nav-icon" />
  },
  {
    component: CNavItem,
    name: 'Depot',
    to: '/admin/depot',
    icon: <CIcon icon={cilHome} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Vehicle',
    to: '/admin/vehicle',
    icon: <CIcon icon={cilTruck} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Partner',
    to: '/admin/partner',
    icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Product',
    to: '/admin/product',
    icon: <CIcon icon={cilGift} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Order',
    to: '/admin/order',
    icon: <CIcon icon={cilCart} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Plan',
    to: '/admin/plan',
    icon: <CIcon icon={cilCalendar} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Schedule',
    to: '/admin/schedule',
    icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'User',
    to: '/admin/user',
    icon: <CIcon icon={cilUserPlus} customClassName="nav-icon" />,
  }
];

export default _nav