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
    uploadXsd: builder.mutation<XsdListResponse, FormData>({
      query: (formData) => {
        return {
          url: "/api/uploadXsd",
          method: "POST",
          body: formData,
        };
      },
    }),
    generateXml: builder.mutation<LoadXsdResponse, FormData>({
      query: (formData) => {
        return {
          url: "/api/generate-xml",
          method: "POST",
          body: formData,
        };
      },
    }),
    extractFields: builder.mutation<XsdListResponse, FormData>({
      query: (formData) => {
        return {
          url: "/api/extract-fields",
          method: "POST",
          body: formData,
        };
      },
    }),
    saveMapping: builder.mutation<XsdListResponse, any>({
      query: (mappingData) => {
        return {
          url: "/api/save-mapping",
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(mappingData),
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
  useExtractFieldsMutation,
  useSaveMappingMutation,
  useGenerateXmlMutation,
  useLazyLoadXsdQuery,
} = xmlServiceDataApi;
