/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import PhotographerNav from "./photographerNav";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useMutation, useQuery } from "@tanstack/react-query";
import axiosInstance from "../../config/axiosInstance";
import { toast } from "react-toastify";
import { ApiError } from "../../types/api.types";
import Button from "../../components/button";
import Input from "../../components/input";
import { Pen, Trash } from "lucide-react";

// Package type definition
interface Package {
  _id: string;
  title: string;
  description: string;
  price: number;
}

// Validation Schema
export const createPackageSchema = yup.object({
  title: yup.string().required("Title is required"),
  description: yup.string().required("Description is required"),
  price: yup
    .number()
    .positive("Price must be positive")
    .required("Price is required"),
});

const PhotographerPackages = () => {
  const [showPackageForm, setShowPackageForm] = useState(false);
  const [editingPackage, setEditingPackage] = useState<Package | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, dirtyFields },
  } = useForm({
    resolver: yupResolver(createPackageSchema),
    mode: "all",
  });

  // Fetch Packages
  const {
    data: packages,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["packages"],
    queryFn: async () => {
      const response = await axiosInstance.get("/user/package");
      return response.data?.data;
    },
  });

  // Create Package Mutation
  const createPackageMutation = useMutation({
    mutationFn: async (data: Omit<Package, "_id">) => {
      return await axiosInstance.post("/user/package", data);
    },
    onSuccess: () => {
      toast.success("Package added successfully!");
      reset();
      refetch();
      setShowPackageForm(false);
    },
    onError: (error: ApiError) => {
      toast.error(error?.response?.data?.message ?? "Failed to add package");
    },
  });

  // Edit Package Mutation
  const editPackageMutation = useMutation({
    mutationFn: async (data: {
      id: string;
      changes: Partial<Omit<Package, "_id">>;
    }) => {
      return await axiosInstance.patch(
        `/user/package/${data.id}`,
        data.changes
      );
    },
    onSuccess: () => {
      toast.success("Package updated successfully!");
      reset();
      refetch();
      setShowPackageForm(false);
      setEditingPackage(null);
    },
    onError: (error: ApiError) => {
      toast.error(error?.response?.data?.message ?? "Failed to update package");
    },
  });

  // Delete Package Mutation
  const deletePackageMutation = useMutation({
    mutationFn: async (packageId: string) => {
      return await axiosInstance.delete(`/user/package/${packageId}`);
    },
    onSuccess: () => {
      toast.success("Package deleted successfully!");
      refetch();
    },
    onError: (error: ApiError) => {
      toast.error(error?.response?.data?.message ?? "Failed to delete package");
    },
  });

  // Form Submit Handler
  const onSubmitPackage = (formData: Omit<Package, "_id">) => {
    if (editingPackage) {
      // Get only the changed fields using dirtyFields
      const changes = Object.keys(dirtyFields).reduce((acc, key) => {
        const fieldKey = key as keyof typeof formData;
        if (fieldKey === "price") {
          acc[fieldKey] = Number(formData[fieldKey]);
        } else {
          acc[fieldKey] = String(formData[fieldKey]);
        }
        return acc;
      }, {} as Partial<Omit<Package, "_id">>);

      if (Object.keys(changes).length > 0) {
        editPackageMutation.mutate({ id: editingPackage._id, changes });
      } else {
        toast.info("No changes detected");
        setShowPackageForm(false);
        setEditingPackage(null);
        reset();
      }
    } else {
      createPackageMutation.mutate(formData);
    }
  };

  // Handle Edit Click
  const handleEditClick = (pkg: Package) => {
    setEditingPackage(pkg);
    setValue("title", pkg.title);
    setValue("description", pkg.description);
    setValue("price", pkg.price);
    setShowPackageForm(true);
  };

  const handleDeleteClick = (packageId: string) => {
    setShowDeleteModal(packageId);
  };

  const handleConfirmDelete = () => {
    if (showDeleteModal) {
      deletePackageMutation.mutate(showDeleteModal);
      setShowDeleteModal(null);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(null);
  };

  // Custom Modal Component
  const DeleteConfirmationModal = () => {
    if (!showDeleteModal) return null;

    return (
      <div className="fixed inset-0 bg-black/0 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
          <h3 className="text-lg font-semibold mb-4">Delete Package</h3>
          <p className="text-gray-600 mb-6">
            Are you sure you want to delete this package? This action cannot be
            undone.
          </p>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={handleCancelDelete}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirmDelete}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  return (
    <section className="flex">
      <PhotographerNav />
      <div className="flex-1 ml-64 pt-20 p-6 bg-gray-100 min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            {editingPackage ? "Edit Package" : "Create Package"}
          </h2>
          {!showPackageForm && (
            <Button onClick={() => setShowPackageForm(true)}>
              Add Package
            </Button>
          )}
        </div>

        {showPackageForm && (
          <div className="bg-white p-4 rounded-lg shadow-md mb-4">
            <form onSubmit={handleSubmit(onSubmitPackage)}>
              <Input
                label="Title"
                type="string"
                placeholder="Enter package title"
                name="title"
                register={register}
                error={errors.title}
                required
              />

              <Input
                label="Description"
                type="string"
                placeholder="Enter package description"
                name="description"
                register={register}
                error={errors.description}
                required
              />

              <Input
                label="Price"
                type="number"
                placeholder="Enter package price"
                name="price"
                register={register}
                error={errors.price}
                required
              />

              <div className="flex gap-2">
                <Button type="submit">
                  {editingPackage ? "Update Package" : "Save Package"}
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    setShowPackageForm(false);
                    setEditingPackage(null);
                    reset();
                  }}
                  className="bg-gray-500 hover:bg-gray-600"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Package List Table */}
        <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Available Packages</h3>
          {isLoading ? (
            <p>Loading packages...</p>
          ) : packages && packages.length > 0 ? (
            <table className="w-full border border-gray-300 rounded-lg">
              <thead className="bg-gray-200 text-gray-700">
                <tr>
                  <th className="p-3 text-left">Title</th>
                  <th className="p-3 text-left">Description</th>
                  <th className="p-3 text-left">Price</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {packages.map((pkg: Package) => (
                  <tr key={pkg._id} className="border-t">
                    <td className="p-3">{pkg.title}</td>
                    <td className="p-3">{pkg.description}</td>
                    <td className="p-3">{pkg.price}</td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => handleEditClick(pkg)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Pen size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteClick(pkg._id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No packages found.</p>
          )}
        </div>
        <DeleteConfirmationModal />
      </div>
    </section>
  );
};

export default PhotographerPackages;
