// store/index.ts
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";

import { xmlServiceDataApi } from "./XmlServiceData/xmlServiceDataApi";
import xmlServiceReducer from "./XmlServiceData/xmlServiceDataSlice";

const rootReducer = combineReducers({
  xmlService: xmlServiceReducer,
  [xmlServiceDataApi.reducerPath]: xmlServiceDataApi.reducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(xmlServiceDataApi.middleware),
  devTools: import.meta.env.NODE_ENV !== "production",
});

setupListeners(store.dispatch);

export type RootStateType = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
