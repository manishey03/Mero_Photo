/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from "@tanstack/react-query";
import PhotographerNav from "./photographerNav";
import axiosInstance from "../../config/axiosInstance";
import { format } from "date-fns";

const PhotographerDashboard = () => {
  const backendUrl =
    import.meta.env.VITE_API_IMAGE_URL ?? "http://localhost:3000";

  const { data, isLoading } = useQuery({
    queryKey: ["photographerDashboard"],
    queryFn: async () => {
      const response = await axiosInstance.get("/user/dashboard/photographer");
      return response?.data?.data;
    },
  });

  if (isLoading) {
    return <>Loading ....</>;
  }
  return (
    <section className="flex">
      {/* Sidebar / Navbar */}
      <PhotographerNav />

      {/* Main Content */}
      <div className="flex-1 ml-64 pt-20 p-6 bg-gray-100 min-h-screen">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Photographer Dashboard
        </h2>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div className="bg-white shadow-lg rounded-lg p-6 flex items-center justify-between border border-gray-200">
            <div>
              <h3 className="text-lg font-semibold text-gray-700">Earnings</h3>
              <p className="text-3xl font-bold text-blue-500">
                NPR: {data?.totalEarningAmount}
              </p>
            </div>
            <span className="text-blue-500 text-3xl">💰</span>
          </div>

          <div className="bg-white shadow-lg rounded-lg p-6 flex items-center justify-between border border-gray-200">
            <div>
              <h3 className="text-lg font-semibold text-gray-700">
                Booking Requests
              </h3>
              <p className="text-3xl font-bold text-gray-700">
                {data?.bookingRequestCount}
              </p>
            </div>
          </div>

          <div className="bg-white shadow-lg rounded-lg p-6 flex items-center justify-between border border-gray-200">
            <div>
              <h3 className="text-lg font-semibold text-gray-700">Clients</h3>
              <p className="text-3xl font-bold text-gray-700">
                {data?.bookingCompletedCount}
              </p>
            </div>
            <span className="text-gray-500 text-3xl">👤</span>
          </div>
        </div>

        {/* Latest Bookings Section */}
        <div className="bg-white shadow-lg rounded-lg p-6 mt-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Latest Bookings
          </h3>
          {data?.latestBookingRequests?.length < 1 ? (
            <>
              <div className="flex-1 ml-64 pt-20 p-6 bg-gray-100 min-h-screen">
                <p>No bookings available.</p>
              </div>
            </>
          ) : (
            <>
              <ul className="space-y-4">
                {data?.latestBookingRequests?.length &&
                  data?.latestBookingRequests?.map((item: any) => (
                    <>
                      <li className="flex items-center justify-between border-b pb-3">
                        <div className="flex items-center gap-4">
                          <img
                            src={`${backendUrl}/${item?.user?.image}`}
                            alt="User"
                            className="w-12 h-12 rounded-full"
                          />
                          <div>
                            <h4 className="text-md font-semibold">
                              {item?.user?.firstName} {item?.user?.lastName}
                            </h4>
                            <p className="text-sm text-gray-600">
                              Booking on{" "}
                              {format(item?.availability?.date, "MMMM do yyyy")}
                            </p>
                          </div>
                        </div>
                        <p className="text-red-500 font-medium">
                          {item?.status}
                        </p>
                      </li>
                    </>
                  ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default PhotographerDashboard;
