import OrderPage from "../pages/admin/order";
import PartnerPage from "../pages/admin/partner";
import LoginPage from "../pages/admin/login";
import Settings from "../pages/admin/setting";
import Product from "../pages/admin/product";
import Depot from "../pages/admin/depot";
import Dashboard from "../pages/admin/dashboard";
import User from "../pages/admin/user";
import Plan from "../pages/admin/plan";
import Vehicle from "../pages/admin/vehicle";
import Route from "../pages/admin/route";
import PlanDetailForm from "../components/plan/PlanDetailForm";


const publicRoutes = [
    {path: '/dashboard' , component: Dashboard},
    { path: '/schedule' , component: Settings},
    { path: '/order', component: OrderPage },
    { path: '/partner', component: PartnerPage },
    { path: '/product', component: Product },
    { path: '/plan' , component: Plan},
    { path: '/user' , component: User},    
    { path: '/' , component: LoginPage, layout: null},     
    { path: '/depot', component: Depot}, 
    { path: '/vehicle', component: Vehicle}, 
    { path: '/route/:id', component: Route}, 
    { path: '/plan/:id', component: PlanDetailForm },
]
const privateRoutes = [] ;
export {publicRoutes , privateRoutes}
