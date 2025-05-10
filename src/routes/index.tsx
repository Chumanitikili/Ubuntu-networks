import { Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/routing/ProtectedRoute";

// Pages
import Index from "@/pages/Index";
import Login from "@/pages/Auth/Login";
import Register from "@/pages/Auth/Register";
import ForgotPassword from "@/pages/Auth/ForgotPassword";
import ResetPassword from "@/pages/Auth/ResetPassword";
import NotFound from "@/pages/NotFound";
import AccountManagement from "@/pages/Admin/AccountManagement";
import TicketsList from "@/pages/Tickets/TicketsList";
import TicketDetail from "@/pages/Tickets/TicketDetail";

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      
      {/* Protected Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Index />
          </ProtectedRoute>
        }
      />
      
      {/* Admin Routes */}
      <Route
        path="/accounts"
        element={
          <ProtectedRoute requireAdmin>
            <AccountManagement />
          </ProtectedRoute>
        }
      />
      
      {/* User Routes */}
      <Route
        path="/tickets"
        element={
          <ProtectedRoute>
            <TicketsList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/tickets/:ticketId"
        element={
          <ProtectedRoute>
            <TicketDetail />
          </ProtectedRoute>
        }
      />
      
      {/* Catch-all Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
