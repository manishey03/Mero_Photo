/* eslint-disable @typescript-eslint/no-explicit-any */
import * as yup from "yup";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { yupResolver } from "@hookform/resolvers/yup";

import Button from "../../components/button";
import Input from "../../components/input";

import { API_URL } from "../../config/api";
import { ApiError } from "../../types/api.types";
import { IApiResponse } from "../../types/auth.types";
import axiosInstance from "../../config/axiosInstance";

const forgotPasswordSchema = yup.object().shape({
  email: yup.string().min(10, "Email is required"),
});

const ForgotPassword = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(forgotPasswordSchema),
    mode: "all",
  });

  const { mutate, isPending } = useMutation({
    mutationKey: [],
    mutationFn: async (data: any) => {
      return await axiosInstance.post(`${API_URL}/auth/forgot-password`, data);
    },
    onSuccess(data: IApiResponse) {
      const apiMessage = data?.data?.message;
      toast.success(apiMessage ?? "Forgot Password Successfully");
      return navigate("/");
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
          Forgot Password
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

          <Button type="submit" className="w-full" disabled={isPending}>
            Submit
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
