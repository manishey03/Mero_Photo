import Cookies from "js-cookie";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../config/axiosInstance";
import { toast } from "react-toastify";
import PhotographerNavbar from "./photographerNav";
import Button from "../../components/button";
import Input from "../../components/input";
import { ApiError } from "../../types/api.types";
import { FaCamera } from "react-icons/fa"; // Import Camera Icon

const updateProfileSchema = yup.object().shape({
  firstName: yup.string().min(2).max(100).optional(),
  lastName: yup.string().min(2).max(100).optional(),
  bio: yup.string().min(10).max(1000).optional(),
  address: yup.string().min(2).max(1000).optional(),
  contact: yup
    .string()
    .length(10, "Contact number must be 10 digits")
    .optional(),
});

const EditProfile = () => {
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const queryClient = useQueryClient();
  const backendUrl =
    import.meta.env.VITE_API_IMAGE_URL ?? "http://localhost:3000";

  const { data: user } = useQuery({
    queryKey: ["auth/me"],
    queryFn: async () => {
      const response = await axiosInstance.get("/auth/me");
      return response.data?.data;
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(updateProfileSchema),
    mode: "onBlur",
    defaultValues: {
      firstName: "",
      lastName: "",
      address: "",
      bio: "",
      contact: "",
    },
  });

  useEffect(() => {
    if (user) {
      Cookies.remove("user");
      Cookies.set("user", JSON.stringify(user));
      reset({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        address: user.address || "",
        bio: user.bio || "",
        contact: user.contact || "",
      });
      if (user.image) {
        setPreview(`${backendUrl}/${user.image}`);
      } else {
        setPreview(null);
      }
    }
  }, [user, reset, backendUrl]);

  const updateMutation = useMutation({
    mutationFn: async (data) =>
      axiosInstance.patch("/auth/update-profile", data),
    onSuccess: () => {
      toast.success("Profile updated successfully!");
      queryClient.invalidateQueries(["auth/me"]);
    },
    onError: () => toast.error("Failed to update profile."),
  });

  const uploadMutation = useMutation({
    mutationFn: async (formData): Promise<void> =>
      axiosInstance.post("/user/upload-profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }),
    onSuccess: () => {
      toast.success("Profile picture uploaded successfully!");
      queryClient.invalidateQueries(["upload-profile"]);
    },
    onError: (error: ApiError) => {
      console.log(error, "check error");
      toast.error(error?.response?.data?.message);
    },
  });

  const onSubmit = (data: any) => {
    updateMutation.mutate(data);
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      uploadMutation.mutate(formData);
    }
  };

  const handleFileChange = (e: any) => {
    const selectedFile = e.target.files[0];
    console.log(selectedFile, "selected file");
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    } else {
      setFile(null);
      setPreview(null);
    }
  };

  return (
    <section className="flex">
      <PhotographerNavbar />
      <div className="flex-1 ml-64 pt-20 p-6 bg-gray-100 min-h-screen">
        <h2 className="text-2xl font-bold text-center mb-4">Edit Profile</h2>
        <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="First Name"
              name="firstName"
              register={register}
              error={errors.firstName}
              type={"string"}
              placeholder={""}
            />
            <Input
              label="Last Name"
              name="lastName"
              register={register}
              error={errors.lastName}
              type={"string"}
              placeholder={""}
            />
            <Input
              label="Address"
              name="address"
              register={register}
              error={errors.address}
              type={"string"}
              placeholder={""}
            />
            <Input
              label="Bio"
              name="bio"
              register={register}
              error={errors.bio}
              type={"string"}
              placeholder={""}
            />
            <Input
              label="Contact"
              name="contact"
              register={register}
              error={errors.contact}
              type={"string"}
              placeholder={""}
            />

            {/* Profile Picture Upload with Camera Icon */}
            <div className="flex flex-col items-center">
              <label htmlFor="profilePic" className="cursor-pointer relative">
                {/* If image exists, show preview; otherwise, show camera icon */}
                {preview ? (
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-24 h-24 object-cover rounded-full border-2 border-gray-300 shadow-md"
                  />
                ) : (
                  <div className="w-24 h-24 flex items-center justify-center rounded-full bg-gray-200 text-gray-600 shadow-md">
                    <FaCamera size={30} />
                  </div>
                )}

                {/* Hidden File Input */}
                <input
                  id="profilePic"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
            </div>

            <Button type="submit" className="w-full">
              Update Profile
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default EditProfile;
