import Dashboard from "../pages/admin/dashboard";
import Settings from "../pages/admin/setting";
import Order from "../pages/admin/order";
import Product from "../pages/admin/product";
import Plan from "../pages/admin/plan";
import User from "../pages/admin/user";
import Depot from "../pages/admin/depot";
import Partner from "../pages/admin/partner";
import Vehicle from "../pages/admin/vehicle";
import Route from "../pages/admin/route";
import PlanDetailForm from "../components/admin/plan/PlanDetailForm";

const adminRoutes = [
  { path: '/admin/dashboard', component: Dashboard },
  { path: '/admin/schedule', component: Settings },
  { path: '/admin/order', component: Order },
  { path: '/admin/product', component: Product },
  { path: '/admin/plan', component: Plan },
  { path: '/admin/user', component: User },
  { path: '/admin/depot', component: Depot },
  { path: '/admin/vehicle', component: Vehicle },
  { path: '/admin/route/:id', component: Route },
  { path: '/admin/partner', component: Partner },
  { path: '/admin/plan/:id', component: PlanDetailForm },
];

export default adminRoutes;