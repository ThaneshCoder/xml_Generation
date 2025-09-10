import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface XmlServiceState {
  xsdList: string[];
  selectedXsd: string | null;
  uploadStatus: "idle" | "loading" | "success" | "error";
  loadedXsd: any | null;
}

const initialState: XmlServiceState = {
  xsdList: [],
  selectedXsd: null,
  uploadStatus: "idle",
  loadedXsd: null,
};

const xmlServiceSlice = createSlice({
  name: "xmlService",
  initialState,
  reducers: {
    setXsdList: (state, action: PayloadAction<string[]>) => {
      state.xsdList = action.payload;
    },
    setSelectedXsd: (state, action: PayloadAction<string>) => {
      state.selectedXsd = action.payload;
    },
    setUploadStatus: (
      state,
      action: PayloadAction<"idle" | "loading" | "success" | "error">
    ) => {
      state.uploadStatus = action.payload;
    },
    setLoadedXsd: (state, action: PayloadAction<any>) => {
      state.loadedXsd = action.payload;
    },
    resetXmlService: () => initialState,
  },
});

export const {
  setXsdList,
  setSelectedXsd,
  setUploadStatus,
  setLoadedXsd,
  resetXmlService,
} = xmlServiceSlice.actions;

export default xmlServiceSlice.reducer;
