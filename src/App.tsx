import { Routes, Route } from "react-router-dom";

import HomePage from "./pages/homePage";
import AdminLogin from "./pages/admin/adminLogin";
import AdminLayout from "./pages/admin/adminLayout";

import "./App.css";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />

      <Route
        path="/admin"
        element={
          <>
            <HomePage />
            <AdminLogin />
          </>
        }
      />

      <Route element={<AdminLayout />}>
        <Route path="/admin/edit" element={<HomePage />} />
      </Route>
    </Routes>
  );
}
