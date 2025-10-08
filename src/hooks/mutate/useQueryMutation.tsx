/** @format */
"use client";
import { publicInstance, privateInstance } from "@/configs/axiosConfig";
import { useTranslations } from "@/providers/TranslationProviders";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";

interface MutateProps {
  isPublic?: boolean;
  url: string;
  config?: any;
  isUpdateMethod?: boolean;
}

export const useQueryMutation = ({
  isPublic = false,
  url,
  config = {},
  isUpdateMethod = false,
}: MutateProps) => {
  const [backendErrors, setBackendErrors] = useState<any>(null);
  const { tran } = useTranslations();
  const postData = async (body: { [key: string]: any }) => {
    if (isUpdateMethod) {
      body = { ...body, _method: "PUT" };
    }
    if (body?.updatedUrl) {
      url = body.updatedUrl;
      delete body.updatedUrl;
    }

    try {
      const response = await (isPublic ? publicInstance : privateInstance).post(
        url,
        body,
        config,
      );
      return response;
    } catch (err) {
      return Promise.reject(err);
    }
  };

  // React Query mutation with enhanced error handling
  const { mutate, isError, isPending } = useMutation({
    mutationFn: postData,
    onSuccess: () => {
      setBackendErrors(null);
    },
    onError: (err: any) => {
      let message = "An error occurred";
      const status = err?.response?.status;
      const responseData = err?.response?.data;

      // Handle different status codes
      switch (status) {
        case 422:
          const validationErrors = responseData?.errors;

          setBackendErrors({
            ...backendErrors,
            ...validationErrors,
          });
          message = responseData?.message || message;
          break;
        case 404:
          message = responseData?.message || message;
          break;
        case 417:
          message = responseData?.message || message;
          break;
        case 500:
          message = responseData?.message || message;
          break;
        default:
          message = responseData?.message || message;
          break;
      }

      // Display error message
      if (message) {
        toast.error(tran(message), {
          position: "top-right",
          iconTheme: { primary: "#FF5733", secondary: "#fff" },
        });
      }
    },
  });

  return {
    mutate,
    isError,
    isLoading: isPending,
    backendErrors,
  };
};
