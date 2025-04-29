/* eslint-disable @typescript-eslint/no-explicit-any */
import * as yup from "yup";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { yupResolver } from "@hookform/resolvers/yup";

import { API_URL } from "../../config/api";
import { ApiError } from "../../types/api.types";

import Input from "../../components/input";
import Button from "../../components/button";
import { IApiResponse } from "../../types/auth.types";
import axiosInstance from "../../config/axiosInstance";

const changePasswordSchema = yup.object().shape({
  email: yup.string().min(10, "Email is required"),
  oldPassword: yup.string().min(3, "Old password is required"),
  newPassword: yup.string().min(3, "New Password is required"),
});

const ChangePassword = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(changePasswordSchema),
    mode: "all",
  });

  const { mutate, isPending } = useMutation({
    mutationKey: [],
    mutationFn: async (data: any) => {
      return await axiosInstance.post(`${API_URL}/auth/change-password`, data);
    },
    onSuccess(data: IApiResponse) {
      const apiMessage = data?.data?.message;
      toast.success(apiMessage ?? "Password changed successfully");
      return navigate("/login");
    },
    onError(error: ApiError) {
      console.log(error, "error");
      toast.error(error?.response?.data?.message ?? "Something went wrong");
    },
  });

  return (
    <div className="h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-3xl font-bold text-center text-black mb-2">
          Change Password
        </h2>
        <p className="text-center text-gray-600 mb-5">
          Your one-stop platform to book professional photographers and capture
          special moments.
        </p>

        <form
          onSubmit={handleSubmit((data) => {
            mutate(data);
          })}
          className="space-y-6"
        >
          <Input
            label="Email"
            type="email"
            placeholder="Enter your email"
            name="email"
            register={register}
            error={errors["email"]}
            required
          />

          <Input
            label="Password"
            type="password"
            placeholder="Enter your old password"
            name="oldPassword"
            register={register}
            error={errors["oldPassword"]}
            required
          />

          <Input
            label="New Password"
            type="password"
            placeholder="Enter your new password"
            name="newPassword"
            register={register}
            error={errors["newPassword"]}
            required
          />

          <Button type="submit" className="w-full" disabled={isPending}>
            Submit
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
