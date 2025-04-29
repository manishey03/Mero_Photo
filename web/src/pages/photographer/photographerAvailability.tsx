/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import PhotographerNav from "./photographerNav";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation, useQuery } from "@tanstack/react-query";
import axiosInstance from "../../config/axiosInstance";
import { toast } from "react-toastify";
import { ApiError } from "../../types/api.types";
import Button from "../../components/button";

export const createAvailabilitySchema = yup.object({
  date: yup
    .string()
    .matches(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")
    .test("is-future-date", "Date must be greater than today", (value) => {
      if (!value) return true;
      return new Date() < new Date(value);
    })
    .optional(),
});

const PhotographerBookings = () => {
  const [showAvailabilityForm, setShowAvailabilityForm] = useState(false);
  const [searchDate, setSearchDate] = useState<string | null>(null);

  const {
    register: registerAvailability,
    handleSubmit: handleSubmitAvailability,
    reset: resetAvailability,
    formState: { errors: availabilityErrors },
  } = useForm({
    resolver: yupResolver(createAvailabilitySchema),
    mode: "all",
  });

  const {
    data: availabilities,
    isLoading: availabilityLoading,
    refetch: refetchAvailabilities,
  } = useQuery({
    queryKey: ["availabilities", searchDate],
    queryFn: async () => {
      let url = "/availability";
      if (searchDate) {
        url += `?date=${searchDate}`;
      }
      const response = await axiosInstance.get(url);
      return response.data?.data;
    },
  });

  const createAvailabilityMutation = useMutation({
    mutationFn: async (data: { date: string }) => {
      return await axiosInstance.post("/availability", data);
    },
    onSuccess: () => {
      toast.success("Availability added successfully!");
      resetAvailability();
      refetchAvailabilities();
      setShowAvailabilityForm(false);
    },
    onError: (error: ApiError) => {
      toast.error(
        error?.response?.data?.message ?? "Failed to add availability"
      );
    },
  });

  const handleAddAvailability = () => {
    setShowAvailabilityForm(true);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmitAvailability = (data: any) => {
    createAvailabilityMutation.mutate(data);
  };

  const handleSearchDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchDate(e.target.value);
  };

  if (availabilityLoading) {
    return (
      <>
        <div>Loading ...</div>
      </>
    );
  }

  return (
    <section className="flex">
      <PhotographerNav />
      <div className="flex-1 ml-64 pt-20 p-6 bg-gray-100 min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            Photographer Availability
          </h2>
          <Button onClick={handleAddAvailability}>Add Availability</Button>
        </div>

        {showAvailabilityForm && (
          <div className="bg-white p-4 rounded-lg shadow-md mb-4">
            <form onSubmit={handleSubmitAvailability(onSubmitAvailability)}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Date
                </label>
                <input
                  type="date"
                  {...registerAvailability("date")}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />

                {availabilityErrors.date && (
                  <p className="text-red-500 text-xs italic">
                    {availabilityErrors.date.message}
                  </p>
                )}
              </div>
              <Button type="submit">Save Availability</Button>
            </form>
          </div>
        )}

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Search by Date
          </label>
          <input
            type="date"
            onChange={handleSearchDateChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        {/* Availability Table */}
        <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Availabilities</h3>
          {availabilityLoading ? (
            <p>Loading availabilities...</p>
          ) : availabilities && availabilities.length > 0 ? (
            <table className="w-full border border-gray-300 rounded-lg">
              <thead className="bg-gray-200 text-gray-700">
                <tr>
                  <th className="p-3 text-left">Date</th>
                  <th className="p-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {availabilities?.map((availability: any) => (
                  <tr key={availability?._id} className="border-t">
                    <td className="p-3">
                      {new Date(availability?.date).toISOString().split("T")[0]}
                    </td>
                    <td className="p-3">{availability?.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No availabilities found.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default PhotographerBookings;
