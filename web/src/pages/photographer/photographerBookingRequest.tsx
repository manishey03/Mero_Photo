/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import PhotographerNav from "./photographerNav";
import axiosInstance from "../../config/axiosInstance";
import { format } from "date-fns";
import { toast } from "react-toastify";

const PhotographerBookingRequest = () => {
  const queryClient = useQueryClient();
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [actionType, setActionType] = useState(null);

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ["bookings"],
    queryFn: async () => {
      const response = await axiosInstance.get("/booking/request");
      return response?.data?.data;
    },
  });

  const handleAction = (booking, type) => {
    setSelectedBooking(booking);
    setActionType(type);
  };

  const acceptMutation = useMutation({
    mutationFn: (id: string) => axiosInstance.post(`/booking/accept/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["bookings"]);
      toast.success("Booking Accept successfully");
      setSelectedBooking(null);
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (id) => axiosInstance.post(`/booking/reject/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["bookings"]);
      toast.success("Booking Reject successfully");
      setSelectedBooking(null);
    },
  });

  const confirmAction = () => {
    if (actionType === "accept") acceptMutation.mutate(selectedBooking._id);
    else rejectMutation.mutate(selectedBooking._id);
  };

  if (isLoading) {
    return (
      <>
        <div>Loading...</div>
      </>
    );
  }

  return (
    <section className="flex">
      <PhotographerNav />
      <div className="flex-1 ml-64 pt-20 p-6 bg-gray-100 min-h-screen">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          All Bookings
        </h2>
        <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200">
          <table className="w-full border border-gray-300 rounded-lg">
            <thead className="bg-gray-200 text-gray-700">
              <tr>
                <th className="p-3 text-left">S.N</th>
                <th className="p-3 text-left">Customer</th>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Amount</th>
                <th className="p-3 text-left">Package</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Action</th>
              </tr>
            </thead>
            {bookings?.length < 1 && (
              <tbody>
                <tr>
                  <td colSpan={7} className="py-10 text-center">
                    <p className="text-2xl font-semibold text-gray-600">
                      No booking requests available
                    </p>
                  </td>
                </tr>
              </tbody>
            )}
            <tbody>
              {bookings?.length &&
                bookings.map((booking: any, index: number) => (
                  <tr key={booking?._id} className="border-t">
                    <td className="p-3">{index + 1}</td>
                    <td className="p-3">
                      {booking?.user?.firstName} {booking?.user?.lastName}
                    </td>
                    <td className="p-3">
                      {format(booking?.availability?.date, "MMMM do yyyy")}
                    </td>
                    <td className="p-3">NPR: {booking?.package?.price}</td>
                    <td className="p-3">{booking?.package?.title}</td>
                    <td className="p-3">{booking?.status}</td>
                    <td className="p-3">
                      {booking?.status === "Requested" && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleAction(booking, "accept")}
                            className="bg-green-500 text-white px-2 py-1 rounded-md text-sm"
                          >
                            ✔
                          </button>
                          <button
                            onClick={() => handleAction(booking, "reject")}
                            className="bg-red-500 text-white px-2 py-1 rounded-md text-sm"
                          >
                            ✖
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
      {selectedBooking && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg z-50">
            <p className="mb-4">
              Are you sure you want to {actionType} this booking?
            </p>
            <div className="flex gap-4">
              <button
                onClick={confirmAction}
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
              >
                Confirm
              </button>
              <button
                onClick={() => setSelectedBooking(null)}
                className="bg-gray-500 text-white px-4 py-2 rounded-md"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default PhotographerBookingRequest;
