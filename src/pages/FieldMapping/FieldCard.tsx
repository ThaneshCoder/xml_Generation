import { useEffect, useState } from "react";
import {
  Button,
  Checkbox,
  checkEmpty,
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
  useExtractFieldsMutation,
} from "@/store/XmlServiceData/xmlServiceDataApi";
import { ViewContent } from "@/components/ViewContent";

export const FieldCard = ({ mapName }) => {
  const [selectedType, setSelectedType] = useState<{
    label: string;
    value: string;
  }>({ label: "", value: "" });
  const [optionsList, setOptionsList] = useState<
    { label: string; value: string }[]
  >([]);
  const [FieldList, setFieldList] = useState<
    { label: string; value: string }[]
  >([]);
  const [SelectedFieldList, setSelectedFieldList] = useState<{
    label: string;
    value: string;
  }>({ label: "", value: "" });

  const [maxRepsUnbound, setMaxRepsUnbound] = useState(1);
  const [includeOptionalParams, setIncludeOptionalParams] = useState(false);

  const [fetchXsdList, { isFetching: isFetchingList, error: listError }] =
    useLazyXsdListQuery();
  const [fetchXsd] = useLazyLoadXsdQuery();
  const [extractFields] = useExtractFieldsMutation();

  useEffect(() => {
    const loadList = async () => {
      try {
        const res = await fetchXsdList().unwrap();
        const formatted = res.responseObject.map((item: string) => ({
          label: item,
          value: item,
        }));
        setOptionsList(formatted);
      } catch (err) {
        console.error("Failed to fetch XSD list:", err);
      }
    };
    loadList();
  }, [fetchXsdList]);

  const handleChange = (e: any) => {
    const selectedValue = { label: e.label, value: e.value };
    setSelectedType(selectedValue);
  };
  const handleFieldChange = (e: any) => {
    const selectedValue = { label: e.label, value: e.value };
    setSelectedFieldList(selectedValue);
  };

  const getExtractFields = async () => {
    if (!selectedType.value) return;
    try {
      const formData = new FormData();
      formData.append("xsdFileName", selectedType.value);
      formData.append("maxRepsUnbound", maxRepsUnbound.toString());
      formData.append(
        "includeOptionalParams",
        includeOptionalParams.toString()
      );
      const res = await extractFields(formData).unwrap();
      if (res.responseCode === 200) {
        const formatted = res.responseObject.map((item: string) => ({
          label: item,
          value: item,
        }));
        setFieldList(formatted);
      } else {
        toast.error(res.message);
      }
    } catch (err) {
      console.error("Error generating XML:", err);
    }
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography>{mapName} : </Typography>

        <Select
          optionsList={optionsList}
          selectedOption={selectedType}
          label={mapName}
          width={200}
          disabled={isFetchingList}
          onChange={handleChange}
        />

        {listError && <Typography color="red">Error loading list</Typography>}
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-evenly",
        }}
      >
        {/* <Button variant={"primary"} onClick={handleViewXsd}>
          View XSD
        </Button>
        <Button variant={"primary"}>View XML</Button>
        <Button variant={"primary"}>Extract Field</Button> */}

        <div
          style={{
            width: "180px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            marginTop: "10px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography>maxRepsUnbound : </Typography>
            <div style={{ width: "40px" }}>
              <input
                type="number"
                style={{ width: "40px" }}
                value={maxRepsUnbound}
                onChange={(e) => {
                  setMaxRepsUnbound(Number(e.target.value));
                }}
              />
            </div>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography>Include Optional Params : </Typography>
            <Toggle
              checked={includeOptionalParams}
              onChange={(e) => {
                console.log(e);
                setIncludeOptionalParams(e.target.checked);
              }}
            />
          </div>
          <Button
            backgroundColor=""
            variant="secondary"
            onClick={getExtractFields}
            disabled={checkEmpty(selectedType.value)}
          >
            "Extract Fields
          </Button>
        </div>
      </div>
      {!checkEmpty(FieldList) && (
        <div>
          <Select
            optionsList={FieldList}
            selectedOption={SelectedFieldList}
            label={"Field List"}
            width={200}
            disabled={isFetchingList}
            onChange={handleFieldChange}
          />
        </div>
      )}
      {/* <div>
        <ViewContent type={"xsd"} input={""} fileName={""} />
      </div> */}
    </div>
  );
};
