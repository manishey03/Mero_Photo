import { createBrowserRouter } from "react-router";

// Auth
import Login from "../pages/auth/login.tsx";
import Register from "../pages/auth/register.tsx";
import ResetPassword from "../pages/auth/resetPassword.tsx";
import ForgotPassword from "../pages/auth/forgotPassword.tsx";
import ChangePassword from "../pages/auth/changePassword.tsx";

// Dashboard
import AboutUs from "../pages/dashboard/about.tsx";
import Home from "../pages/dashboard/home.tsx";
import ContactUs from "../pages/dashboard/contact.tsx";
import Photographers from "../pages/dashboard/photographer.tsx";
import EditUserProfile from "../pages/dashboard/editUserProfile.tsx";
//Admin
import Bookings from "../pages/admin/bookings.tsx";
import AdminDashboard from "../pages/admin/adminDashboard.tsx";
import AddPhotographer from "../pages/admin/addPhotographer.tsx";
import PhotographersList from "../pages/admin/photographersList.tsx";

//Photographer
import EditProfile from "../pages/photographer/editProfile.tsx";
import PhotographerBookings from "../pages/photographer/photographerBookings.tsx";
import PhotographerDashboard from "../pages/photographer/photographerDashboard.tsx";
import { ProtectedRouteMod } from "../components/RootLayout.tsx";
import PhotographerAvailability from "../pages/photographer/photographerAvailability.tsx";
import PhotographerProfile from "../pages/dashboard/photographerProfile.tsx";
import PhotographerFeatureImages from "../pages/photographer/featureImages.tsx";
import BookingRequests from "../pages/dashboard/bookingRequest.tsx";
import PhotographerBookingRequest from "../pages/photographer/photographerBookingRequest.tsx";
import PhotographerPackage from "../pages/photographer/photographerPackage.tsx";

//
export const router = createBrowserRouter([
  {
    path: "/",
    children: [
      {
        path: "/change-password",
        element: <ChangePassword />,
      },
      {
        path: "/booking-request",
        element: <BookingRequests />,
      },
      //Admin
      {
        path: "/admin/dashboard",
        element: <AdminDashboard />,
      },
      {
        path: "/admin/add-photographer",
        element: <AddPhotographer />,
      },
      {
        path: "/admin/bookings",
        element: <Bookings />,
      },
      {
        path: "/admin/photographer-list",
        element: <PhotographersList />,
      },

      //Photographer
      {
        path: "/photographer/dashboard",
        element: <PhotographerDashboard />,
      },
      {
        path: "/photographer/booking",
        element: <PhotographerBookings />,
      },
      {
        path: "/photographer/edit-profile",
        element: <EditProfile />,
      },
      {
        path: "/photographer/availability",
        element: <PhotographerAvailability />,
      },
      {
        path: "/photographer/profile/:id",
        element: <PhotographerProfile />,
      },
      {
        path: "/photographer/feature-images",
        element: <PhotographerFeatureImages />,
      },
      {
        path: "/photographer/booking-request",
        element: <PhotographerBookingRequest />,
      },
      {
        path: "/photographer/package",
        element: <PhotographerPackage />,
      },
    ],
    element: <ProtectedRouteMod />,
  },
  {
    index: true,
    element: <Home />,
  },
  // Auth
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/reset-password",
    element: <ResetPassword />,
  },

  // Home Pages
  {
    path: "/contact-us",
    element: <ContactUs />,
  },
  {
    path: "/about-us",
    element: <AboutUs />,
  },
  {
    path: "/photographers",
    element: <Photographers />,
  },
  {
    path: "/reset-password",
    element: <ResetPassword />,
  },
  {
    path: "/edit-user-profile",
    element: <EditUserProfile />,
  },
]);
