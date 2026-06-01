import { BrowserRouter, Routes, Route } from "react-router-dom";

// Client Pages
import ClientLayout from "./layouts/ClientLayout";
import Home from "./pages/client/Home";
import Reservation from "./pages/client/Reservation";
import Login from "./pages/client/Login";
import Signup from "./pages/client/Signup";

// Admin Pages
import AdminLayout from "./layouts/AdminLayout";
import Reservations from "./pages/admin/Reservations";
import Dashboard from "./pages/admin/Dashboard";
import Terrains from "./pages/admin/Terrains";
import Reports from "./pages/admin/Reports";
import Settings from "./pages/admin/Settings";
import Clients from "./pages/admin/Clients";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ClientLayout />}>
          <Route index element={<Home />} />
          <Route path="reservation" element={<Reservation />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="reservations" element={<Reservations />} />
          <Route path="terrains" element={<Terrains />} />
          <Route path="reports" element={<Reports />} />
          <Route path="settings" element={<Settings />} />
          <Route path="users" element={<Clients />} />
          
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;