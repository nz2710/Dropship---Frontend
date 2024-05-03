import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import './scss/style.scss'
import AdminLayout from "./partial/admin-layout";
import AuthLayout from "./partial/auth-layout";
import { publicRoutes } from './routes';

function App() {
  return (
            <Router basename="/">
                <div className="App">
                    <Routes>
                        {publicRoutes.map((route, index) => {
                            const Layout = route.layout === null ? AuthLayout : AdminLayout;
                            const Page = route.component;
                            return (
                                <Route
                                    key={index}
                                    path={route.path}
                                    element={
                                        // isAuthenticated || (route.layout === null) ? (
                                        //     <Layout>
                                        //         <Page />
                                        //     </Layout>
                                        // ) : (
                                        //     <Navigate to="/" replace />
                                        // )
                                        <Layout>
                                                <Page />
                                          </Layout>
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
