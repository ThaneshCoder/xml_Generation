import { ApiResponse } from "@/types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { LoadXsdResponse, XsdListResponse } from "../types";

export const xmlServiceDataApi = createApi({
  reducerPath: "xmlServiceDataApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:9090",
  }),
  endpoints: (builder) => ({
    xsdList: builder.query<XsdListResponse, void>({
      query: () => ({
        url: "/api/xsdList",
      }),
    }),
    uploadXsd: builder.mutation({
      query: (file) => {
        const formData = new FormData();
        formData.append("file", file);
        return {
          url: "/api/uploadXsd",
          method: "POST",
          body: formData,
        };
      },
    }),
    loadXsd: builder.query<LoadXsdResponse, string>({
      query: (xsdId: string) => ({
        url: `/api/loadXsd/${xsdId}`,
      }),
    }),
  }),
});

export const {
  useLazyXsdListQuery,
  useUploadXsdMutation,
  useLoadXsdQuery,
  useLazyLoadXsdQuery,
} = xmlServiceDataApi;
