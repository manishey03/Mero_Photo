/* eslint-disable @typescript-eslint/no-explicit-any */
import AdminNav from "./adminnav";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../config/axiosInstance";

const AdminDashboard = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["adminDashboard"],
    queryFn: async () => {
      const response = await axiosInstance.get("/user/dashboard/admin");
      return response?.data?.data;
    },
  });

  if (isLoading) {
    return <>Loading ....</>;
  }

  return (
    <section className="flex">
      {/* Sidebar / Navbar */}
      <AdminNav />

      {/* Main Content */}

      <div className="flex-1 ml-64 pt-20 p-6 bg-gray-100 min-h-screen">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Admin Dashboard
        </h2>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white shadow-lg rounded-lg p-6 text-center border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-700">
              Total Photographers
            </h3>
            <p className="text-3xl font-bold text-blue-500">
              {data?.totalPhotographerCount}
            </p>
          </div>

          <div className="bg-white shadow-lg rounded-lg p-6 text-center border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-700">
              Total Bookings
            </h3>
            <p className="text-3xl font-bold text-green-500">
              {" "}
              {data?.totalBookingCount}
            </p>
          </div>

          <div className="bg-white shadow-lg rounded-lg p-6 text-center border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-700">
              Pending Requests
            </h3>
            <p className="text-3xl font-bold text-orange-500">
              {" "}
              {data?.totalPendingBookingCount}
            </p>
          </div>

          <div className="bg-white shadow-lg rounded-lg p-6 text-center border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-700">Revenue</h3>
            <p className="text-3xl font-bold text-purple-500">
              NPR: {data?.totalRevenue}
            </p>
          </div>
        </div>

        {/* Recent Bookings Section */}
        <div className="bg-white shadow-lg rounded-lg p-6 mt-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Recent Bookings
          </h3>
          <table className="w-full border border-gray-300 rounded-lg">
            <thead className="bg-gray-200 text-gray-700">
              <tr>
                <th className="p-3 text-left">S.N</th>
                <th className="p-3 text-left">Photographer</th>
                <th className="p-3 text-left">Customer</th>
                <th className="p-3 text-left">Booking Date</th>
                <th className="p-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {data.latestBooking.length &&
                data.latestBooking.map((item: any, index: number) => {
                  return (
                    <tr className="border-t" key={index}>
                      <td className="p-3">{index + 1}</td>
                      <td className="p-3">
                        {item?.photographer?.firstName}{" "}
                        {item?.photographer?.lastName}{" "}
                      </td>
                      <td className="p-3">
                        {item?.user?.firstName} {item?.user?.lastName}{" "}
                      </td>

                      <td className="p-3">
                        {format(item?.availability?.date, "MMMM do yyyy")}
                      </td>
                      <td className="p-3 text-green-600">{item?.status}</td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default AdminDashboard;
