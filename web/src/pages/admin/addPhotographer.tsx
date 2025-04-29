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

import AdminNav from "./adminnav";
import axiosInstance from "../../config/axiosInstance";

const registerSchema = yup.object().shape({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
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

const AddPhotographer = () => {
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
      email: string;
      password: string;
      confirmPassword: string;
    }
  >({
    mutationFn: async (data) => {
      return await axiosInstance.post(`${API_URL}/auth/photographer`, data);
    },
    onSuccess: () => {
      toast.success("Photographer Register successfully.");
      navigate("/admin/photographer-list");
    },
    onError: (error: ApiError) => {
      toast.error(error?.response?.data?.message ?? "Registration failed");
    },
  });
  return (
    <section className="flex">
      {/* Sidebar / Navbar Section */}
      <AdminNav />

      {/* Main Content */}
      <div className="flex-1 ml-64 pt-20 p-6 bg-gray-100 min-h-screen flex justify-center items-center">
        <div className="w-full max-w-5xl bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Add Photographer
          </h2>

          <form
            onSubmit={handleSubmit((data) => mutate(data))}
            className="grid grid-cols-1 md:grid-cols-1 gap-6"
          >
            <div className="space-y-4">
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
                label="Email"
                type="email"
                placeholder="Enter your Email"
                name="email"
                register={register}
                error={errors["email"]}
                required
              />

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
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Signing Up..." : "Register Photographer"}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default AddPhotographer;
