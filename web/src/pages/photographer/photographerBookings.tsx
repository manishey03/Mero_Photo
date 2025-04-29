/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../../config/axiosInstance";
import PhotographerNav from "./photographerNav";
import { format } from "date-fns";

const PhotographerBookings = () => {
  const {
    data: bookings,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["photographerDashboard"],
    queryFn: async () => {
      const response = await axiosInstance.get("/booking/photographer");
      return response?.data?.data;
    },
  });

  if (isLoading) {
    return (
      <section className="flex">
        <PhotographerNav />
        <div className="flex-1 ml-64 pt-20 p-6 bg-gray-100 min-h-screen">
          <p>Loading...</p>
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="flex">
        <PhotographerNav />
        <div className="flex-1 ml-64 pt-20 p-6 bg-gray-100 min-h-screen">
          <p>Error: {error.message}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="flex">
      <PhotographerNav />

      <div className="flex-1 ml-64 pt-20 p-6 bg-gray-100 min-h-screen">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          All Bookings
        </h2>

        {bookings?.length < 1 && (
          <>
            <div className="flex-1 ml-64 pt-20 p-6 bg-gray-100 min-h-screen">
              <p>No bookings available.</p>
            </div>
          </>
        )}

        <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200">
          <table className="w-full border border-gray-300 rounded-lg">
            <thead className="bg-gray-200 text-gray-700">
              <tr>
                <th className="p-3 text-left">S.N</th>
                <th className="p-3 text-left">Customer</th>
                <th className="p-3 text-left">Payment</th>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Amount</th>
                <th className="p-3 text-left">Package</th>
                <th className="p-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings?.length &&
                bookings?.map((booking: any, index: number) => (
                  <tr key={booking?._id} className="border-t">
                    <td className="p-3">{index + 1}</td>
                    <td className="p-3 flex items-center gap-3">
                      {`${booking?.user?.firstName} ${booking?.user?.lastName}`}
                    </td>
                    <td className="p-3">
                      <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-lg text-sm">
                        {booking?.paidStatus}
                      </span>
                    </td>
                    <td className="p-3">
                      {format(booking?.availability?.date, "MMMM do yyyy")}
                    </td>
                    <td className="p-3">NPR: {booking?.amount}</td>
                    <td className="p-3">{booking?.package?.title}</td>
                    <td className="p-3">{booking?.status}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default PhotographerBookings;
