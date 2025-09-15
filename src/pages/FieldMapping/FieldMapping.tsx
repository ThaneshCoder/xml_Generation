import { useEffect, useState } from "react";
import { Button, checkEmpty, Input, toast, Typography } from "pixel-react";
import { FieldCard } from "./FieldCard";
import {
  useExtractFieldsMutation,
  useSaveMappingMutation,
} from "@/store/XmlServiceData/xmlServiceDataApi";
import { MappingSelector } from "./MappingSelector";

export const FieldMapping = () => {
  const [fromSelection, setFromSelection] = useState<{
    xsdFileName: string;
    maxRepsUnbound: number;
    includeOptionalParams: boolean;
  }>({ xsdFileName: "", maxRepsUnbound: 0, includeOptionalParams: false });

  const [toSelection, setToSelection] = useState<{
    xsdFileName: string;
    maxRepsUnbound: number;
    includeOptionalParams: boolean;
  }>({ xsdFileName: "", maxRepsUnbound: 0, includeOptionalParams: false });
  const [extractFields] = useExtractFieldsMutation();
  const [saveMapping] = useSaveMappingMutation();

  const [fromFields, setFromFields] = useState<
    { label: string; value: string }[]
  >([]);
  const [toFields, setToFields] = useState<{ label: string; value: string }[]>(
    []
  );

  const [mappings, setMappings] = useState<Record<string, string>>({});
  const [mappingName, setMappingName] = useState<string>("");

  const getExtractFields = async () => {
    try {
      if (fromSelection.xsdFileName) {
        const formData = new FormData();
        formData.append("xsdFileName", fromSelection.xsdFileName);
        formData.append(
          "maxRepsUnbound",
          fromSelection.maxRepsUnbound.toString()
        );
        formData.append(
          "includeOptionalParams",
          fromSelection.includeOptionalParams.toString()
        );

        const res = await extractFields(formData).unwrap();
        if (res.responseCode === 200) {
          const formatted = res.responseObject.map((item: string) => ({
            label: item,
            value: item,
          }));
          setFromFields(formatted);
        } else {
          toast.error(res.message);
        }
      }

      if (toSelection.xsdFileName) {
        const formData = new FormData();
        formData.append("xsdFileName", toSelection.xsdFileName);
        formData.append(
          "maxRepsUnbound",
          toSelection.maxRepsUnbound.toString()
        );
        formData.append(
          "includeOptionalParams",
          toSelection.includeOptionalParams.toString()
        );

        const res = await extractFields(formData).unwrap();
        if (res.responseCode === 200) {
          const formatted = res.responseObject.map((item: string) => ({
            label: item,
            value: item,
          }));
          setToFields(formatted);
        } else {
          toast.error(res.message);
        }
      }
    } catch (err) {
      console.error("Error extracting fields:", err);
      toast.error("Something went wrong while extracting fields");
    }
  };
  const submitFields = async () => {
    try {
      if (!fromSelection.xsdFileName || !toSelection.xsdFileName) {
        toast.error("Please select both From and To XSD files");
        return;
      }

      if (Object.keys(mappings).length === 0) {
        toast.error("Please create at least one mapping");
        return;
      }

      const mappingData = {
        name: mappingName,
        fromXsd: fromSelection.xsdFileName,
        fromMaxRepsUnbound: fromSelection.maxRepsUnbound,
        fromIncludeParams: fromSelection.includeOptionalParams,
        toXsd: toSelection.xsdFileName,
        toMaxRepsUnbound: toSelection.maxRepsUnbound,
        toIncludeParams: toSelection.includeOptionalParams,
        mappings: mappings,
      };
      const res = await saveMapping(mappingData).unwrap();
      if (res.responseCode === 200) {
        toast.success("Mapping Saved Successfully");
      } else {
        toast.error(res.message);
      }
    } catch (err) {
      console.error("Error saving mapping:", err);
      toast.error("Something went wrong while saving mapping");
    }
  };

  return (
    <div style={{ marginTop: "60px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-evenly",
          alignItems: "center",
        }}
      >
        <FieldCard
          key={"from"}
          mapName="From XSD Type"
          onSelectionChange={setFromSelection}
        />
        <FieldCard
          key={"to"}
          mapName="To XSD Type"
          onSelectionChange={setToSelection}
        />
      </div>

      <div
        style={{
          marginTop: "20px",
          textAlign: "center",
          display: "flex",
          justifyContent: "space-evenly",
        }}
      >
        <Button
          variant="secondary"
          onClick={getExtractFields}
          disabled={
            checkEmpty(fromSelection.xsdFileName) ||
            checkEmpty(toSelection.xsdFileName)
          }
        >
          Extract Fields
        </Button>
      </div>
      {!(checkEmpty(toFields) || checkEmpty(fromFields)) && (
        <MappingSelector
          fromOptions={fromFields}
          toOptions={toFields}
          onChange={setMappings}
        />
      )}
      {!checkEmpty(mappings) && (
        <div
          style={{
            display: "flex",
            width: "90%",
            justifyContent: "center",
            position: "absolute",
            bottom: "20px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              gap: "20px",
            }}
          >
            <Typography fontSize={18}>
              Please Enter Mapping Name To proceed :{" "}
            </Typography>
            <div style={{ width: "200px" }}>
              <Input
                label="Enter Mapping Name"
                value={mappingName}
                onChange={(e) => {
                  setMappingName(e.target.value);
                }}
                type={"text"}
                name={""}
              />
            </div>

            <Button
              variant="secondary"
              onClick={submitFields}
              disabled={checkEmpty(mappingName)}
              buttonWidth="200px"
            >
              Submit Mapping
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
