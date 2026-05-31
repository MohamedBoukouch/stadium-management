import { BrowserRouter, Routes, Route } from "react-router-dom";

// Client Pages
import ClientLayout from "./layouts/ClientLayout";
import Home from "./pages/client/Home";
import Reservation from "./pages/client/Reservation";
import Login from "./pages/client/Login";
import Signup from "./pages/client/Signup";

// Admin Pages
import AdminLayout from "./layouts/AdminLayout";

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

        <Route path="/admin" element={<AdminLayout />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;