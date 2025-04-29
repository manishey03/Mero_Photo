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
import axiosInstance from "../../config/axiosInstance";

const registerSchema = yup.object().shape({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  address: yup.string().required("Address is required"),
  phoneNumber: yup.string().required("Phone number is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), undefined], "Passwords must match")
    .required("Confirm password is required"),
});

const Register = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(registerSchema),
    mode: "all",
  });

  const { mutate, isPending } = useMutation<
    void,
    ApiError,
    {
      firstName: string;
      lastName: string;
      address: string;
      phoneNumber: string;
      email: string;
      password: string;
      confirmPassword: string;
    }
  >({
    mutationFn: async (data) => {
      return await axiosInstance.post(`${API_URL}/auth/register`, data);
    },
    onSuccess: () => {
      toast.success("Registration successful! Please login.");
      navigate("/login");
    },
    onError: (error: ApiError) => {
      toast.error(error?.response?.data?.message ?? "Registration failed");
    },
  });

  return (
    <div className="h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white p-5 rounded-lg shadow-lg w-full max-w-3xl">
        <h2 className="text-3xl font-bold text-center mb-6">
          Create Your Account
        </h2>
        <h3 className="text-lg text-secondary text-center mb-10">
          Join Mero Photo
        </h3>

        <form
          onSubmit={handleSubmit((data) => mutate(data))}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="First Name"
              type="string"
              placeholder="Enter your First Name"
              name="firstName"
              register={register}
              error={errors["firstName"]}
              required
            />

            <Input
              label="Last Name"
              type="string"
              placeholder="Enter your Last Name"
              name="lastName"
              register={register}
              error={errors["lastName"]}
              required
            />
          </div>

          <Input
            label="Address"
            type="string"
            placeholder="Enter your Address"
            name="address"
            register={register}
            error={errors["address"]}
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="Phone Number"
              type="number"
              placeholder="Enter your Phone Number"
              name="phoneNumber"
              register={register}
              error={errors["phoneNumber"]}
              required
            />

            <Input
              label="Email"
              type="email"
              placeholder="Enter your Email"
              name="email"
              register={register}
              error={errors["email"]}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          </div>

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Signing Up..." : "Sign Up"}
          </Button>
        </form>

        <p className="text-center mt-4">
          Already have an account?
          <a href="/login" className="text-blue-600 ml-2">
            Sign In
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
