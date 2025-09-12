import { ApiResponse, Mapping } from "@/types";

export interface XsdListResponse extends ApiResponse {
  responseObject: string[];
}
export interface LoadXsdResponse extends ApiResponse {
  responseObject: string;
}
export interface MappingResponse extends ApiResponse {
  responseObject: Mapping[];
}
