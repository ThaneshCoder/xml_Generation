import { UnknownAction } from "@reduxjs/toolkit";
import type {
  BaseQueryFn,
  EndpointBuilder,
  FetchArgs,
} from "@reduxjs/toolkit/query";

export interface TrackableAction extends UnknownAction {
  meta?: {
    requestId?: string;
    arg?: {
      type?: string;
      originalArgs?: {
        action?: string;
      };
      endpointName?: string;
    };
  };
}

export interface DynamicObj {
  [key: string]: any /*TO DO */;
}

export type BaseQuery = BaseQueryFn<string | FetchArgs, Error, {}>;
export type TagTypes = string;
export type ReducerPath = string;
export type Builder = EndpointBuilder<BaseQuery, TagTypes, ReducerPath>;
export interface AddModuleInputPayload {
  name: string;
  navigateTo?: string;
  sourceId: string | undefined;
  inputAction: string;
  hierarchy?: number;
  parentId?: string;
  type?: "input";
  desc?: string;
  id?: string;
  projectId?: string;
  folderName?: string;
  containerLevel?: boolean;
}

export interface ApiResponse {
  errorCode: number;
  message: string;
  responseCode: number;
  responseMap: object | null;
  status: string;
}
