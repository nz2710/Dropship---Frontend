import Dashboard from "../pages/partner/dashboard";
import Order from "../pages/partner/order";
import Product from "../pages/partner/product";
import PartnerCommissionStats from "../pages/partner/commission";


const partnerRoutes = [
  { path: '/partner/dashboard', component: Dashboard },
  { path: '/partner/orders', component: Order },
  { path: '/partner/products', component: Product },
  { path: '/partner/commission', component: PartnerCommissionStats },
];

export default partnerRoutes;