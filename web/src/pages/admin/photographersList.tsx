/* eslint-disable @typescript-eslint/no-explicit-any */
// // src/pages/admin/photographersList.tsx
// import React from "react";

// import AdminNav from "./adminnav";
// import Table from "../../components/table";
// import { useQuery } from "@tanstack/react-query";
// import { API_URL } from "../../config/api";
// import { useNavigate } from "react-router-dom";
// import Loading from "../../components/loading";
// import axiosInstance from "../../config/axiosInstance";

// interface IPhotographer {
//   _id: string;
//   firstName: string;
//   lastName: string;
//   email: string;
// }

// const PhotographersList = () => {
//   const navigate = useNavigate();
//   const {
//     data: photographers,
//     isLoading,
//     isError,
//   } = useQuery({
//     queryKey: ["photographers"],
//     queryFn: async () => {
//       const response = await axiosInstance.get(`${API_URL}/user/photographer`);
//       return response.data?.data;
//     },
//   });

//   const columns: {
//     header: string;
//     accessor: keyof IPhotographer;
//     render?: (photographer: IPhotographer) => React.ReactNode;
//   }[] = [
//     { header: "First Name", accessor: "firstName" },
//     { header: "Last Name", accessor: "lastName" },
//     {
//       header: "Email",
//       accessor: "email",
//     },
//   ];

//   const handleRowClick = (photographer: IPhotographer) => {
//     navigate(`/admin/photographer/${photographer._id}`);
//   };

//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <Loading />
//       </div>
//     );
//   }

//   if (isError) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <p>"Failed to fetch photographers"</p>
//       </div>
//     );
//   }

//   return (
//     <section className="flex">
//       <AdminNav />
//       <div className="flex-1 ml-64 pt-20 p-6 bg-gray-100 min-h-screen flex">
//         <div className="w-full pr-6">
//           <h2 className="text-2xl font-semibold text-gray-800 mb-6">
//             All Photographers
//           </h2>
//           {photographers && (
//             <Table
//               data={photographers}
//               columns={columns}
//               onRowClick={handleRowClick}
//             />
//           )}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default PhotographersList;

//
import { useState } from "react";
import AdminNav from "./adminnav";
import Table from "../../components/table";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { API_URL } from "../../config/api";
import { useNavigate } from "react-router-dom";
import Loading from "../../components/loading";
import axiosInstance from "../../config/axiosInstance";
import ConfirmModal from "../../components/confirmModel";
import { toast } from "react-toastify";

interface IPhotographer {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  isDeactivated: boolean;
}

const PhotographersList = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [selectedPhotographer, setSelectedPhotographer] =
    useState<IPhotographer | null>(null);
  const [showModal, setShowModal] = useState(false);

  const {
    data: photographers,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["photographers"],
    queryFn: async () => {
      const response = await axiosInstance.get(`${API_URL}/user/photographer`);
      return response.data?.data;
    },
  });

  const deactivateMutation = useMutation({
    mutationFn: async (photographer: IPhotographer) => {
      const action = photographer.isDeactivated ? "activate" : "deactivate";
      const response = await axiosInstance.patch(
        `${API_URL}/user/${action}/${photographer._id}`
      );
      return { ...response.data, action };
    },
    onSuccess: ({ message, action }) => {
      toast.success(
        message ||
          `Photographer ${
            action === "deactivate" ? "deactivated" : "activated"
          } successfully`
      );
      queryClient.invalidateQueries({ queryKey: ["photographers"] });
      setShowModal(false);
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.message || "Something went wrong";
      toast.error(errorMessage);
      setShowModal(false);
    },
  });

  const handleDeactivateClick = (photographer: IPhotographer) => {
    console.log(photographer, "check photographer");
    setSelectedPhotographer(photographer);
    setShowModal(true);
  };

  const handleConfirmDeactivate = () => {
    if (selectedPhotographer) {
      deactivateMutation.mutate(selectedPhotographer);
    }
  };

  const columns = [
    { header: "First Name", accessor: "firstName" },
    { header: "Last Name", accessor: "lastName" },
    { header: "Email", accessor: "email" },
    {
      header: "Action",
      accessor: "email", // can be any unique field, required by your Table component
      render: (photographer: IPhotographer) => {
        return (
          <>
            <button
              className={`px-3 py-1 rounded text-white ${
                photographer && photographer.isDeactivated === true
                  ? "bg-green-500 hover:bg-green-600"
                  : "bg-red-500 hover:bg-red-600"
              }`}
              onClick={(e) => {
                e.stopPropagation(); // prevent triggering row click
                handleDeactivateClick(photographer);
              }}
            >
              {photographer && photographer.isDeactivated === true
                ? "Activate"
                : "Deactivate"}
            </button>
          </>
        );
      },
    },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loading />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>"Failed to fetch photographers"</p>
      </div>
    );
  }

  console.log(photographers, "---");

  return (
    <section className="flex">
      <AdminNav />
      <div className="flex-1 ml-64 pt-20 p-6 bg-gray-100 min-h-screen flex">
        <div className="w-full pr-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            All Photographers
          </h2>
          {photographers && (
            <Table
              data={photographers}
              columns={columns}
              // onRowClick={handleRowClick}
            />
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleConfirmDeactivate}
        message={`Are you sure you want to ${
          selectedPhotographer && selectedPhotographer?.isDeactivated === true
            ? "Activate"
            : "Deactivate"
        } ${selectedPhotographer?.firstName} ${
          selectedPhotographer?.lastName
        }?`}
        cancelButtonName="Cancel"
        submitButtonName={
          selectedPhotographer && selectedPhotographer?.isDeactivated === true
            ? "Activate"
            : "Deactivate"
        }
      />
    </section>
  );
};

export default PhotographersList;
