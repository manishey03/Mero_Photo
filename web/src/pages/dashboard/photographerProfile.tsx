/* eslint-disable @typescript-eslint/no-explicit-any */
import Navbar from "../layout/navbar";
import Footer from "../layout/footer";
import Button from "../../components/button";
import { useMutation, useQuery } from "@tanstack/react-query";
import axiosInstance from "../../config/axiosInstance";
import { useParams } from "react-router-dom"; // Ensure proper ID fetching
import { House, User } from "lucide-react"; // Install lucide-react if not already installed
import { format } from "date-fns";
import { object, string } from "yup";
import { useState } from "react";
import { toast } from "react-toastify";

const bookingSchema = object({
  packageId: string().trim().required("Package ID is required"),
  availabilityId: string().trim().required("Availability ID is required"),
});

const PhotographerProfile = () => {
  const { id } = useParams(); // Get ID from URL
  const [selectedAvailability, setSelectedAvailability] = useState<
    string | null
  >(null);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);

  const [previewImageUrl, setPreviewImageUrl] = useState(null);

  const openPreview = (imageUrl: string) => {
    setPreviewImageUrl(imageUrl);
  };

  const closePreview = () => {
    setPreviewImageUrl(null);
  };

  const backendUrl =
    import.meta.env.VITE_API_IMAGE_URL ?? "http://localhost:3000";

  const { data, isLoading, error } = useQuery({
    queryKey: ["photographerDashboard", id],
    queryFn: async () => {
      const response = await axiosInstance.get(`/user/photographer/${id}`);
      return response?.data?.data;
    },
    enabled: !!id, // Ensures the query only runs when an ID exists
  });

  const bookingMutation = useMutation({
    mutationFn: async ({
      availabilityId,
      packageId,
    }: {
      availabilityId: string;
      packageId: string;
    }) => {
      await bookingSchema.validate({ availabilityId, packageId }); // Validate before sending request
      return axiosInstance.post("/booking", { availabilityId, packageId });
    },
    onSuccess: () => {
      toast.success("Booking successful!");
      setSelectedAvailability(null);
    },
    onError: (error: any) => {
      console.log(error, "check error");
      toast.error(error.response?.data?.message || "Booking failed!");
    },
  });

  if (isLoading) {
    return <div className="text-center py-20 text-lg">Loading...</div>;
  }

  if (error) {
    return (
      <div className="text-center text-2xl py-20 text-red-500">
        Failed to load photographer details.
      </div>
    );
  }

  const photographer = data?.photographer;
  const featureImages = data?.featureImages ?? [];
  const availabilities = data?.availabilities ?? [];
  const reviews = data?.reviews ?? [];

  return (
    <section className="bg-light overflow-hidden relative pt-20 p-4">
      <Navbar />

      <div className="container py-10 grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div>
          {photographer?.image && (
            <>
              <img
                src={`${backendUrl}/${photographer?.image}`}
                alt={"Image"}
                className="w-full h-120 object-cover rounded-xl"
              />
            </>
          )}

          <h4 className="mt-4 font-semibold">Featured Images</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            {featureImages.map((img: any, index: number) => (
              <img
                key={index}
                src={`${backendUrl}/${img?.imageUrl}`}
                alt="Gallery"
                // className="w-full h-32 object-cover rounded-lg"
                className="w-full h-32 object-cover rounded-lg cursor-pointer hover:opacity-60 transition-opacity duration-200"
                onClick={() => openPreview(`${backendUrl}/${img?.imageUrl}`)}
              />
            ))}

            {previewImageUrl && (
              <div
                className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-80 flex justify-center items-center z-50 cursor-pointer"
                onClick={closePreview}
              >
                <img
                  src={previewImageUrl}
                  alt="Full Size Preview"
                  className="max-w-full max-h-full object-contain"
                  onClick={(e) => e.stopPropagation()} // Prevent closing when clicking on the image
                />
                <button
                  onClick={closePreview}
                  className="absolute top-4 right-4 text-white text-2xl font-bold focus:outline-none"
                >
                  &times;
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white p-6 shadow-lg rounded-xl">
          <div className="bg-white p-6 shadow-lg rounded-xl border">
            <h4 className="text-2xl font-bold text-gray-900 mb-2">
              📸 Photographer Details
            </h4>
            <hr className="border-t-2 border-gray-300 mb-4" />

            {/* Photographer Name */}
            <div className="flex items-center gap-2">
              <User className="text-gray-500" size={20} />
              <p className="text-xl font-semibold text-gray-800">
                {photographer?.firstName} {photographer?.lastName}
              </p>
            </div>

            {/* Address */}
            <div className="flex items-center gap-2 mt-2">
              <House className="text-gray-500" size={20} />
              <p className="text-lg text-gray-700">{photographer?.address}</p>
            </div>

            {/* Contact */}
            {/* <div className="flex items-center gap-2 mt-2">
              <Phone className="text-gray-500" size={20} />
              <p className="text-lg text-gray-700">{photographer?.contact}</p>
            </div> */}

            {/* Bio */}
            <p className="text-md text-gray-600 italic mt-4 bg-gray-100 p-3 rounded-lg">
              {photographer?.bio}
            </p>
          </div>

          <div className="mt-8">
            <h3 className="text-2xl font-semibold text-gray-700 mb-4">
              Available Dates
            </h3>
            <ul className="space-y-4">
              {availabilities?.map((availability: any, index: number) => (
                <li
                  key={index}
                  className={`p-4 rounded-lg flex items-center justify-between shadow-sm border cursor-pointer transition-all
      ${
        selectedAvailability === availability?._id
          ? "bg-blue-500 text-white border-blue-700"
          : "bg-gray-50 hover:bg-gray-100"
      }`}
                  onClick={() => setSelectedAvailability(availability?._id)}
                >
                  <span>{format(availability?.date, "MMMM do yyyy")}</span>
                  <span className="font-medium">{availability?.status}</span>
                  <span className="text-black-500">{availability?.amount}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-8">
            <h3 className="text-2xl font-semibold text-gray-700 mb-4">
              Packages
            </h3>

            {/* Render only if both availability and duration are selected */}
            {selectedAvailability ? (
              <div className="flex gap-4 overflow-x-auto py-2">
                {data?.packages?.map((pkg: any, index: number) => (
                  <div
                    key={index}
                    className={`p-4 w-64 min-w-[250px] rounded-lg shadow-md border cursor-pointer transition-all ${
                      selectedPackage === pkg?._id
                        ? "bg-blue-500 text-white border-blue-700"
                        : "bg-gray-50 hover:bg-gray-100"
                    }`}
                    onClick={() => setSelectedPackage(pkg?._id)}
                  >
                    <h4 className="text-lg font-bold">{pkg.title}</h4>
                    <p className="text-gray-600">{pkg.description}</p>
                    <p className="text-black-500 font-semibold mt-2">
                      Rs. {pkg.price}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">
                Please select availability and package first.
              </p>
            )}
          </div>

          <div className="flex gap-4 mt-6">
            <Button
              className="w-full bg-green-500 text-white hover:bg-green-600 disabled:opacity-50"
              disabled={!selectedAvailability}
              onClick={() =>
                selectedAvailability &&
                selectedPackage &&
                bookingMutation.mutate({
                  availabilityId: selectedAvailability,
                  packageId: selectedPackage,
                })
              }
            >
              Book Now
            </Button>
          </div>
        </div>
      </div>

      <div className="container py-10">
        <h2 className="text-2xl font-bold">Customer Reviews</h2>

        <div className="mt-4 space-y-4">
          {reviews.map((review: any, index: number) => (
            <div key={index} className="bg-white p-4 shadow-md rounded-lg">
              <div className="flex justify-between">
                <span className="font-semibold">
                  {review?.user?.firstName} {review?.user?.lastName}
                </span>
                <span className="text-yellow-500">⭐ {review?.rating}</span>
              </div>
              <p className="text-gray-600 mt-1">{review?.comment}</p>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </section>
  );
};

export default PhotographerProfile;
