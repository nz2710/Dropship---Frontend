import AppSidebar from "../components/AppSidebar";
import AppHeader from "../components/AppHeader";

function AdminLayout({children}) {
  return (
    <div>
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100">
        <AppHeader />
        <div className="body flex-grow-1">
          {children}
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;
