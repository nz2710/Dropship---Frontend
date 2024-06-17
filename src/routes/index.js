import OrderPage from "../pages/order";
import PartnerPage from "../pages/partner";
import LoginPage from "../pages/login";
import Settings from "../pages/setting";
import Product from "../pages/product";
import Depot from "../pages/depot";
import Customer from "../pages/customer";
import Dashboard from "../pages/dashboard";
import User from "../pages/user";
import Plan from "../pages/plan";
import Vehicle from "../pages/vehicle";
import Route from "../pages/route";
import PlanDetailForm from "../components/plan/PlanDetailForm";

const publicRoutes = [
    {path: '/dashboard' , component: Dashboard},
    { path: '/settings' , component: Settings},
    { path: '/order', component: OrderPage },
    { path: '/partner', component: PartnerPage },
    { path: '/product', component: Product },
    { path: '/customer', component: Customer},
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
