/* eslint-disable @typescript-eslint/no-explicit-any */
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";

import AdminNav from "./adminnav";
import axiosInstance from "../../config/axiosInstance";

const Bookings = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["adminBookings"],
    queryFn: async () => {
      const response = await axiosInstance.get("/booking");
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
        <div className="w-full max-w-5xl bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            All Bookings
          </h2>

          {/* Table for Bookings */}
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-300 rounded-lg">
              <thead className="bg-gray-200 text-gray-700">
                <tr>
                  <th className="p-3 text-left">S.N</th>
                  <th className="p-3 text-left">Customer</th>
                  <th className="p-3 text-left">Photographer</th>
                  <th className="p-3 text-left">Date</th>
                  <th className="p-3 text-left">status</th>
                  <th className="p-3 text-left">Amount</th>
                </tr>
              </thead>
              <tbody>
                {data?.length &&
                  data?.map((item: any, index: number) => (
                    <>
                      <tr className="border-t">
                        <td className="p-3">{index + 1}</td>
                        <td className="p-3">
                          {item?.user?.firstName} {item?.user?.lastName}
                        </td>
                        <td className="p-3">
                          {item?.photographer?.firstName}{" "}
                          {item?.photographer?.lastName}
                        </td>
                        <td className="p-3">
                          {format(item?.availability?.date, "MMMM do yyyy")}
                        </td>
                        <td className="p-3">{item?.status}</td>
                        <td className="p-3">{item?.amount}</td>
                      </tr>
                    </>
                  ))}
                {/* Example row */}
                {/* More rows can be added dynamically */}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Bookings;
