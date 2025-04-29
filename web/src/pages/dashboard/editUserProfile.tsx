import Cookies from "js-cookie";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../config/axiosInstance";
import { toast } from "react-toastify";

import Button from "../../components/button";
import Input from "../../components/input";
import { ApiError } from "../../types/api.types";
import { FaCamera } from "react-icons/fa";
import Navbar from "../layout/navbar";

const updateProfileSchema = yup.object().shape({
  firstName: yup.string().min(2).max(10).optional(),
  lastName: yup.string().min(2).max(10).optional(),
  contact: yup
    .string()
    .length(10, "Contact number must be 10 digits")
    .optional(),
});

const EditUserProfile = () => {
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
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    } else {
      setFile(null);
      setPreview(null);
    }
  };

  return (
    <section className="flex items-center justify-center min-h-screen bg-gray-100">
      <Navbar />
      <div className="bg-white p-8 rounded-lg shadow-lg w-[400px] mx-auto text-center">
        <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-left">
          <div>
            <label>First Name</label>
            <Input
              name="firstName"
              register={register}
              error={errors.firstName}
              label={""}
              type={"string"}
              placeholder={""}
            />
          </div>
          <div>
            <label>Last Name</label>
            <Input
              name="lastName"
              register={register}
              error={errors.lastName}
              label={""}
              type={"string"}
              placeholder={""}
            />
          </div>
          <div>
            <label>Contact</label>
            <Input
              name="contact"
              register={register}
              error={errors.contact}
              label={""}
              type={"string"}
              placeholder={""}
            />
          </div>
          <div className="flex flex-col items-center">
            <label htmlFor="profilePic" className="cursor-pointer relative">
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
              <input
                id="profilePic"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
          </div>
          <Button type="submit" className="w-full mt-4">
            Update Profile
          </Button>
        </form>
      </div>
    </section>
  );
};

export default EditUserProfile;
