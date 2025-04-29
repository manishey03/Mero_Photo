/* eslint-disable @typescript-eslint/no-explicit-any */
import Navbar from "../layout/navbar";
import Footer from "../layout/footer";
import Button from "../../components/button";
import { useMutation, useQuery } from "@tanstack/react-query";
import axiosInstance from "../../config/axiosInstance";
import { House, User } from "lucide-react";
import { format } from "date-fns";
import { object, string, number } from "yup";
import { toast } from "react-toastify";
import { ApiError } from "../../types/api.types";
import { useState } from "react";

import bookingImage from "../../assets/banner.webp";

export const paymentInitiateSchema = object({
  amount: number()
    .min(1, "Minimum should be at least 1")
    .max(9999999)
    .required("Amount is required"),
  bookingId: string().min(6).required("Booking ID is required"),
});

const BookingRequest = () => {
  const backendUrl =
    import.meta.env.VITE_API_IMAGE_URL ?? "http://localhost:3000";

  // State for review text and rating
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState<number | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<string | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["userBookings"],
    queryFn: async () => {
      const response = await axiosInstance.get("/booking");
      return response?.data?.data;
    },
  });

  const paymentMutation = useMutation({
    mutationFn: async ({
      amount,
      bookingId,
    }: {
      amount: number;
      bookingId: string;
    }) => {
      await paymentInitiateSchema.validate({ amount, bookingId });
      const response = await axiosInstance.post("/payment/initiate-payment", {
        amount,
        bookingId,
      });
      return response?.data;
    },
    onSuccess: (data: { url: string }) => {
      toast.success("Payment initiated success");
      if (data?.url) {
        window.location.href = data.url;
      } else {
        toast.error("Failed to initiate payment.");
      }
    },
    onError: (error: ApiError) =>
      toast.error(error.response?.data?.message || "Payment failed!"),
  });

  // Mutation for submitting a review
  const reviewMutation = useMutation({
    mutationFn: async ({
      bookingId,
      comment,
      rating,
    }: {
      bookingId: string;
      comment: string;
      rating: number;
    }) => {
      const response = await axiosInstance.post(
        `/booking/review/${bookingId}`,
        {
          comment,
          rating,
        }
      );
      return response?.data;
    },
    onSuccess: () => {
      toast.success("Review submitted successfully!");
      setReviewText("");
      setRating(null);
      setSelectedBooking(null);
      setTimeout(() => {
        window.location.reload();
      }, 500);
    },
    onError: (error: ApiError) =>
      toast.error(error.response?.data?.message || "Failed to submit review."),
  });

  if (isLoading)
    return <div className="text-center py-20 text-lg">Loading...</div>;
  if (error)
    return (
      <div className="text-center text-2xl py-20 text-red-500">
        Failed to load bookings.
      </div>
    );

  if (!data?.length) {
    return (
      <>
        <p className="text-2xl font-semibold text-gray-600 mt-3">
          No booking requests available
        </p>
      </>
    );
  }

  return (
    <section className="bg-light overflow-hidden relative pt-20 p-4">
      <Navbar />
      <div className="container py-10 grid gap-10">
        {data?.length &&
          data?.map((booking: any) => (
            <div
              key={booking?._id}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6 bg-white p-6 shadow-lg rounded-xl"
            >
              {/* Left Side - Images */}
              <div>
                {booking?.photographer?.image ? (
                  <img
                    src={`${backendUrl}/${booking?.photographer?.image}`}
                    alt="Photographer"
                    className="w-full h-122 object-cover rounded-xl"
                  />
                ) : (
                  <img
                    src={bookingImage}
                    alt="Default Booking"
                    className="w-full h-122 object-cover rounded-xl"
                  />
                )}
              </div>

              {/* Right Side - Details */}
              <div>
                <h4 className="text-2xl font-bold text-gray-900 mb-2">
                  📸 Photographer Details
                </h4>
                <hr className="border-t-2 border-gray-300 mb-4" />

                <div className="flex items-center gap-2">
                  <User className="text-gray-500" size={20} />
                  <p className="text-xl font-semibold text-gray-800">
                    {booking?.photographer?.firstName}{" "}
                    {booking?.photographer?.lastName}
                  </p>
                </div>

                <div className="flex items-center gap-2 mt-2">
                  <House className="text-gray-500" size={20} />
                  <p className="text-lg text-gray-700">
                    {booking?.photographer?.address}
                  </p>
                </div>

                {/* <div className="flex items-center gap-2 mt-2">
                  <Phone className="text-gray-500" size={20} />
                  <p className="text-lg text-gray-700">
                    {booking?.photographer?.contact}
                  </p>
                </div> */}

                {/* Booking Details */}
                <div className="bg-white p-6 shadow-lg rounded-xl border mt-6">
                  <h4 className="text-2xl font-bold text-gray-900 mb-2">
                    📅 Booking Details
                  </h4>
                  <hr className="border-t-2 border-gray-300 mb-4" />

                  {/* Booking Date */}
                  <div className="flex items-center gap-2">
                    <p className="text-lg font-semibold text-gray-800">Date:</p>
                    <p className="text-lg text-gray-700">
                      {format(
                        new Date(booking?.availability?.date),
                        "MMMM d, yyyy"
                      )}
                    </p>
                  </div>

                  {/* Booking Status */}
                  <div className="flex items-center gap-2 mt-2">
                    <p className="text-lg font-semibold text-gray-800">
                      Status:
                    </p>
                    <span
                      className={`px-3 py-1 text-sm font-semibold rounded-lg ${
                        booking?.status === "Completed"
                          ? "bg-green-500 text-white"
                          : "bg-yellow-500 text-white"
                      }`}
                    >
                      {booking?.status}
                    </span>
                  </div>

                  {/* Amount */}
                  <div className="flex items-center gap-2 mt-2">
                    <p className="text-lg font-semibold text-gray-800">
                      Amount:
                    </p>
                    <p className="text-lg text-gray-700">
                      NPR. {booking?.amount ?? 0}
                    </p>
                  </div>

                  {/* Package */}
                  <div className="flex items-center gap-2 mt-2">
                    <p className="text-lg font-semibold text-gray-800">
                      Package:
                    </p>
                    <p className="text-lg text-gray-700">
                      {booking?.package?.title}
                    </p>
                  </div>

                  {/* Payment Status */}
                  <div className="flex items-center gap-2 mt-2">
                    <p className="text-lg font-semibold text-gray-800">
                      Payment:
                    </p>
                    <span
                      className={`px-3 py-1 text-sm font-semibold rounded-lg ${
                        booking.paidStatus === "Paid"
                          ? "bg-green-500 text-white"
                          : "bg-red-500 text-white"
                      }`}
                    >
                      {booking?.paidStatus}
                    </span>
                  </div>

                  {/* Review And Comment display */}
                  {booking?.review?._id && (
                    <>
                      <div className="flex items-center gap-2 mt-2">
                        <p className="text-lg font-semibold text-gray-800">
                          Review:
                        </p>
                        <p className="text-lg text-gray-700">
                          {booking?.review?.comment?.length > 40
                            ? booking?.review?.comment.slice(0, 40) + "..."
                            : booking?.review?.comment}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 mt-2">
                        <p className="text-lg font-semibold text-gray-800">
                          Rating:
                        </p>
                        <p className="text-lg text-gray-700">
                          {booking?.review?.rating} / 5
                        </p>
                      </div>
                    </>
                  )}

                  {/* Pay Now Button */}
                  {booking.status === "Accepted" &&
                    booking.paidStatus !== "Paid" && (
                      <Button
                        className="mt-4 w-full bg-blue-500 text-white hover:bg-blue-600 py-2 rounded-lg"
                        onClick={() =>
                          paymentMutation.mutate({
                            amount: Number(booking?.amount),
                            bookingId: String(booking?._id),
                          })
                        }
                      >
                        Pay Now
                      </Button>
                    )}

                  {/* Review Form */}
                  {booking.paidStatus === "Paid" &&
                    booking?.review === null && (
                      <div className="mt-4">
                        <textarea
                          placeholder="Write your review..."
                          className="w-full p-2 border rounded-md"
                          value={reviewText}
                          onChange={(e) => setReviewText(e.target.value)}
                        />
                        <input
                          type="number"
                          max="5"
                          min="1"
                          placeholder="Rating (1-5)"
                          className="w-full p-2 border rounded-md mt-2"
                          value={rating || ""}
                          onChange={(e) => setRating(Number(e.target.value))}
                        />
                        <Button
                          className="mt-2 w-full bg-green-500 text-white hover:bg-green-600 py-2 rounded-lg"
                          onClick={() =>
                            reviewMutation.mutate({
                              bookingId: booking?._id,
                              comment: reviewText,
                              rating: rating ?? 0,
                            })
                          }
                        >
                          Submit Review
                        </Button>
                      </div>
                    )}
                </div>
              </div>
            </div>
          ))}
      </div>
      <Footer />
    </section>
  );
};

export default BookingRequest;
