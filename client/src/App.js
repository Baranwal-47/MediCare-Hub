import { RouterProvider, createBrowserRouter } from "react-router-dom";
import ReceptionistDash from "./pages/Receptionist/ReceptionistDash";
import PatientAdd from "./pages/Receptionist/PatientAdd";
import BillingAmount from "./pages/Receptionist/BillingAmount";
import DoctorDash from "./pages/Doctor/DoctorDash";
import PatientChecker from "./pages/Doctor/PatientChecker";
import Auth from "./pages/Auth/Auth";
import UserInfo from "./pages/Receptionist/UserInfo";
import UserDocInfo from "./pages/Doctor/UserDocInfo";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Auth />,
    },
    {
      path: "/recept/dashboard",
      element: (
        <ProtectedRoute role="receptionist">
          <ReceptionistDash />
        </ProtectedRoute>
      ),
    },
    {
      path: "/recept/pats",
      element: (
        <ProtectedRoute role="receptionist">
          <PatientAdd />
        </ProtectedRoute>
      ),
    },
    {
      path: "/recept/bill",
      element: (
        <ProtectedRoute role="receptionist">
          <BillingAmount />
        </ProtectedRoute>
      ),
    },
    {
      path: "/doc/dash",
      element: (
        <ProtectedRoute role="doctor">
          <DoctorDash />
        </ProtectedRoute>
      ),
    },
    {
      path: "/doc/pats",
      element: (
        <ProtectedRoute role="doctor">
          <PatientChecker />
        </ProtectedRoute>
      ),
    },
    {
      path: "/recept/userinfo",
      element: (
        <ProtectedRoute role="receptionist">
          <UserInfo />
        </ProtectedRoute>
      ),
    },
    {
      path: "/doc/docinfo",
      element: (
        <ProtectedRoute role="doctor">
          <UserDocInfo />
        </ProtectedRoute>
      ),
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
