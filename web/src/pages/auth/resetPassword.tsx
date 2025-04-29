/* eslint-disable @typescript-eslint/no-explicit-any */
import * as yup from "yup";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { yupResolver } from "@hookform/resolvers/yup";

import { API_URL } from "../../config/api";
import { ApiError } from "../../types/api.types";

import Input from "../../components/input";
import Button from "../../components/button";
import { IApiResponse } from "../../types/auth.types";
import axiosInstance from "../../config/axiosInstance";

const resetPasswordSchema = yup.object().shape({
  password: yup.string().min(3, "Password is required"),
  confirmPassword: yup.string().min(3, "Password should be match"),
});

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const email = searchParams.get("email");
  const token = searchParams.get("token");

  if (!email || !token) {
    toast.error("Invalid password reset link");
    navigate("/login");
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(resetPasswordSchema),
    mode: "all",
  });

  const { mutate, isPending } = useMutation({
    mutationKey: [],
    mutationFn: async (data: any) => {
      return await axiosInstance.post(
        `${API_URL}/auth/reset-password?email=${email}&token=${token}`,
        data
      );
    },
    onSuccess(data: IApiResponse) {
      const apiMessage = data?.data?.message;
      toast.success(apiMessage ?? "Password reset successfully");
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
          Reset Password
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
            label="Password"
            type="password"
            placeholder="Enter your password"
            name="password"
            register={register}
            error={errors["password"]}
            required
          />

          <Input
            label="Confirm Password"
            type="password"
            placeholder="Re-type password"
            name="confirmPassword"
            register={register}
            error={errors["confirmPassword"]}
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

export default ResetPassword;
