import { BrowserRouter, Routes, Route } from "react-router-dom";

// Client Pages
import ClientLayout from "./layouts/ClientLayout";
import Home from "./pages/client/Home";
import Reservation from "./pages/client/Reservation";

// Admin Pages
import AdminLayout from "./layouts/AdminLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Client Routes */}
        <Route path="/" element={<ClientLayout />}>
          <Route index element={<Home />} />
          <Route path="reservation" element={<Reservation />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;