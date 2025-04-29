/* eslint-disable @typescript-eslint/no-explicit-any */
import * as yup from "yup";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { useMutation } from "@tanstack/react-query";
import { yupResolver } from "@hookform/resolvers/yup";

import { API_URL } from "../../config/api";
import { ApiError } from "../../types/api.types";
import { ILoginResponse } from "../../types/auth.types";

import Input from "../../components/input";
import Button from "../../components/button";

import axiosInstance from "../../config/axiosInstance";

const loginSchema = yup.object().shape({
  email: yup.string().min(10, "Email is required"),
  password: yup.string().min(3, "Password is required"),
});

const Login = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
    mode: "all",
  });

  const { mutate, isPending } = useMutation({
    mutationKey: [],
    mutationFn: async (data: any) => {
      return await axiosInstance.post(`${API_URL}/auth/login`, data);
    },
    onSuccess(data: ILoginResponse) {
      const apiMessage = data?.data?.message;
      const apiResponse = data?.data?.data;
      Cookies.set("accessToken", apiResponse.refreshToken, { expires: 7 });
      Cookies.set("refreshToken", apiResponse.refreshToken, { expires: 7 });
      Cookies.set("user", JSON.stringify(apiResponse.user), { expires: 7 });

      toast.success(apiMessage ?? "Login Success");
      switch (apiResponse.user.role) {
        case "admin":
          navigate("/admin/dashboard");
          break;
        case "photographer":
          navigate("/photographer/dashboard");
          break;
        case "user":
          navigate("/");
          break;
        default:
          navigate("/");
      }
    },
    onError(error: ApiError) {
      toast.error(error?.response?.data?.message ?? "Something went wrong");
    },
  });

  return (
    <div className="h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-3xl font-bold text-center text-black mb-2">
          Welcome Back!
        </h2>
        <h3 className="text-xl text-secondary text-center mb-4 pt-3">
          Mero Photo
        </h3>
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
            placeholder="Enter your password"
            name="password"
            register={register}
            error={errors["password"]}
            required
          />

          <Button type="submit" className="w-full" disabled={isPending}>
            Sign In
          </Button>
        </form>

        <p className="text-center mt-2">
          <a href="/forgot-password">Forgot password</a>
        </p>

        <p className="text-center mt-4">
          <a href="/register" className="text-blue-600">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
