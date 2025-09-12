import { ApiResponse } from "@/types";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { LoadXsdResponse, MappingResponse, XsdListResponse } from "../types";

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
    mappingList: builder.query<MappingResponse, void>({
      query: () => ({
        url: "/api/list-field-mapping",
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
    generateXmlData: builder.mutation<
      LoadXsdResponse,
      { mappingName: string; xml1: string }
    >({
      query: (payload) => {
        return {
          url: "/api/map-xml-data",
          method: "POST",
          body: payload,
          headers: {
            "Content-Type": "application/json",
          },
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
            "Content-Type": "application/json",
          },
          body: JSON.stringify(mappingData),
        };
      },
    }),
    updateMapping: builder.mutation<
      XsdListResponse,
      { mappingName: string; data: any }
    >({
      query: ({ mappingName, data }) => {
        return {
          url: `/api/update-mapping/${encodeURIComponent(mappingName)}`,
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        };
      },
    }),
    deleteMapping: builder.mutation<XsdListResponse, any>({
      query: (mappingName) => {
        return {
          url: `/api/delete-mapping/${mappingName}`,
          method: "DELETE",
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
  useLazyMappingListQuery,
  useUploadXsdMutation,
  useLoadXsdQuery,
  useExtractFieldsMutation,
  useSaveMappingMutation,
  useGenerateXmlMutation,
  useGenerateXmlDataMutation,
  useUpdateMappingMutation,
  useLazyLoadXsdQuery,
  useDeleteMappingMutation,
} = xmlServiceDataApi;
