import { useEffect, useState } from "react";
import {
  Button,
  Checkbox,
  Input,
  Select,
  toast,
  Toggle,
  Typography,
} from "pixel-react";
import {
  useLazyXsdListQuery,
  useLazyLoadXsdQuery,
  useGenerateXmlMutation,
} from "@/store/XmlServiceData/xmlServiceDataApi";
import Style from "./FieldMapping.module.scss";
import { ViewContent } from "../../components/ViewContent";
import { FieldCard } from "./FieldCard";

export const FieldMapping = () => {
  return (
    <div
      style={{
        marginTop: "60px",
        display: "flex",
        justifyContent: "space-evenly",
        alignItems: "center",
      }}
    >
      <FieldCard mapName={"From XSD Type"}/>
      <FieldCard mapName={"To XSD Type"}/>
    </div>
  );
};
