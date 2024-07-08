// _partnerNav.js
import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilClipboard,
  cilCart,
  cilHome,
  cilChart
} from '@coreui/icons'
import { CNavItem } from '@coreui/react'

const _partnerNav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/partner/dashboard',
    icon: <CIcon icon={cilClipboard} customClassName="nav-icon" />
  },
  {
    component: CNavItem,
    name: 'Orders',
    to: '/partner/orders',
    icon: <CIcon icon={cilCart} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Products',
    to: '/partner/products',
    icon: <CIcon icon={cilHome} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Commission',
    to: '/partner/commission',
    icon: <CIcon icon={cilChart} customClassName="nav-icon" />,
  },
];

export default _partnerNav