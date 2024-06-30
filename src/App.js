// App.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import './scss/style.scss';
import AdminLayout from "./partial/admin-layout";
import PartnerLayout from "./partial/partner-layout";
import AuthLayout from "./partial/auth-layout";
import adminRoutes from './routes/adminRoutes';
import partnerRoutes from './routes/partnerRoutes';
import publicRoutes from './routes/publicRoutes';

function App() {
  return (
    <Router basename="/">
      <div className="App">
        <Routes>
          {/* Public routes */}
          {publicRoutes.map((route, index) => {
            const Layout = route.layout === null ? AuthLayout : AdminLayout;
            const Page = route.component;
            return (
              <Route
                key={index}
                path={route.path}
                element={
                  <Layout>
                    <Page />
                  </Layout>
                }
              />
            );
          })}

          {/* Admin routes */}
          {adminRoutes.map((route, index) => {
            const Page = route.component;
            return (
              <Route
                key={index}
                path={route.path}
                element={
                  <AdminLayout>
                    <Page />
                  </AdminLayout>
                }
              />
            );
          })}

          {/* Partner routes */}
          {partnerRoutes.map((route, index) => {
            const Page = route.component;
            return (
              <Route
                key={index}
                path={route.path}
                element={
                  <PartnerLayout>
                    <Page />
                  </PartnerLayout>
                }
              />
            );
          })}
        </Routes>
      </div>
    </Router>
  );
}

export default App;