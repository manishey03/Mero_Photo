/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import PhotographerNav from "./photographerNav";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../config/axiosInstance";
import { toast } from "react-toastify";
import Button from "../../components/button";
import { useAuth } from "../../hooks/authContext";
import { FaCamera } from "react-icons/fa";
import { Trash } from "lucide-react";

const PhotographerFeatureImages = () => {
  const { user } = useAuth();
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [featureImages, setFeatureImages] = useState<string[]>([]);

  const backendUrl =
    import.meta.env.VITE_API_IMAGE_URL ?? "http://localhost:3000";

  const queryClient = useQueryClient();

  // Fetch existing feature images from backends
  const { data: photographerFeatureImages } = useQuery({
    queryKey: ["featureImages"],
    queryFn: async () => {
      const response = await axiosInstance.get(
        `/user/photographer/${user?._id}`
      );
      return response.data?.data?.featureImages ?? [];
    },
  });

  const deleteFeatureImageMutation = useMutation({
    mutationFn: async (id: string) =>
      await axiosInstance.delete(`/user/image/${id}`),

    onSuccess: () => {
      toast.success("Feature image deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["featureImages"] });
    },
    onError: () => {
      toast.error("Failed to delete feature image.");
    },
  });

  useEffect(() => {
    if (photographerFeatureImages) {
      setFeatureImages(photographerFeatureImages);
    }
  }, [photographerFeatureImages, user, backendUrl]);

  // Handle multiple file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles(selectedFiles);

      // Generate image previews
      const previewUrls = selectedFiles.map((file) =>
        URL.createObjectURL(file)
      );
      setPreviews(previewUrls);
    }
  };

  // Upload multiple images mutation
  const uploadImagesMutation = useMutation({
    mutationFn: async (formData: FormData) =>
      axiosInstance.post("/user/upload-feature-images", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }),
    onSuccess: () => {
      toast.success("Feature images uploaded successfully!");
      queryClient.invalidateQueries({ queryKey: ["featureImages"] });
      setFiles([]);
      setPreviews([]);
    },
    onError: () => {
      toast.error("Failed to upload feature images.");
    },
  });

  // Handle image upload
  const handleUpload = () => {
    if (files.length === 0) {
      toast.error("Please select at least one image.");
      return;
    }

    const formData = new FormData();
    files.forEach((file) => {
      formData.append("file", file);
    });

    uploadImagesMutation.mutate(formData);
  };

  const handleDelete = (id: string) => {
    deleteFeatureImageMutation.mutate(id);
  };

  return (
    <section className="flex">
      <PhotographerNav />
      <div className="flex-1 ml-64 pt-20 p-6 bg-gray-100 min-h-screen">
        <h2 className="text-2xl font-semibold mb-4">Upload Feature Images</h2>

        <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
          {/* Upload Button with Icon */}
          <label
            htmlFor="featureImageUpload"
            className="cursor-pointer relative flex flex-col items-center"
          >
            <div className="w-24 h-24 flex items-center justify-center rounded-full bg-gray-200 text-gray-600 shadow-md">
              <FaCamera size={30} />
            </div>
            <span className="text-sm text-gray-500 mt-2">
              Click to upload images
            </span>

            {/* Hidden File Input */}
            <input
              id="featureImageUpload"
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>

          {/* Image Previews */}
          {previews.length > 0 && (
            <div className="mt-4 grid grid-cols-3 gap-4">
              {previews.map((src, index) => (
                <img
                  key={index}
                  src={src}
                  alt="Preview"
                  className="w-24 h-24 rounded-lg object-cover"
                />
              ))}
            </div>
          )}

          <Button onClick={handleUpload} className="mt-4">
            Upload Images
          </Button>
        </div>

        {/* Display Uploaded Feature Images */}
        <h3 className="text-xl font-semibold mt-8 mb-4">
          Uploaded Feature Images
        </h3>
        <div className="grid grid-cols-3 gap-4">
          {featureImages.length > 0 ? (
            featureImages.map((img: any, index: number) => (
              <div key={index} className="relative group">
                <img
                  src={`${backendUrl}/${img.imageUrl}`}
                  alt={`${img?.alt}`}
                  className="w-full h-auto rounded-lg"
                />
                <div className="absolute inset-0 bg-black bg-opacity-10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => handleDelete(img._id)}
                    className="p-2 hover:bg-red-500 rounded-full transition-colors"
                  >
                    <Trash size={24} className="text-white" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No images uploaded yet.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default PhotographerFeatureImages;
