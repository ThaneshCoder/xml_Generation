import { ApiResponse } from "@/types";

export interface XsdListResponse extends ApiResponse {
  responseObject: string[];
}
export interface LoadXsdResponse extends ApiResponse {
  responseObject: string;
}
