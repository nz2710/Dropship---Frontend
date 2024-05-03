import GoogleMapPage from "../pages/googlemap";
import OrderPage from "../pages/order";
import PartnerPage from "../pages/partner";
import LoginPage from "../pages/login";
import ShippingAddressPage from "../pages/shippingaddress";
import Settings from "../pages/setting";
import Vehicle from "../pages/vehicle";
import Depot from "../pages/depot";
import Customer from "../pages/customer";
import Dashboard from "../pages/dashboard";
import User from "../pages/user";

const publicRoutes = [
    {path: '/dashboard' , component: Dashboard},
    { path: '/settings' , component: Settings},
    { path: '/googlemap', component: GoogleMapPage },
    { path: '/order', component: OrderPage },
    { path: '/partner', component: PartnerPage },
    { path: '/shippingaddress', component: ShippingAddressPage },
    { path: '/vehicle', component: Vehicle },
    { path: '/customer', component: Customer},
    { path: '/user' , component: User},    
    { path: '/' , component: LoginPage, layout: null},     
    { path: '/depot', component: Depot},  
]
const privateRoutes = [] ;
export {publicRoutes , privateRoutes}
