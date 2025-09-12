import { useEffect, useState } from "react";
import { Button, Select, toast, Toggle, Typography } from "pixel-react";
import {
  useLazyXsdListQuery,
  useLazyLoadXsdQuery,
  useGenerateXmlMutation,
} from "@/store/XmlServiceData/xmlServiceDataApi";
import { ViewContent } from "../components/ViewContent";

export const IndependentElement = () => {
  const [selectedType, setSelectedType] = useState<{
    label: string;
    value: string;
  }>({ label: "", value: "" });
  const [optionsList, setOptionsList] = useState<
    { label: string; value: string }[]
  >([]);

  const [maxRepsUnbound, setMaxRepsUnbound] = useState(1);
  const [includeOptionalParams, setIncludeOptionalParams] = useState(false);

  const [fetchXsdList, { isFetching: isFetchingList, error: listError }] =
    useLazyXsdListQuery();
  const [fetchXsd] = useLazyLoadXsdQuery();
  const [generateXml, { isLoading: isGenerating }] = useGenerateXmlMutation();

  const [xmlContent, setXmlContent] = useState<string | null>(null);
  const [xsdContent, setXsdContent] = useState<string | null>(null);

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
    setSelectedType({ label: e.label, value: e.value });
    if (!e.value) return;
    const load = async () => {
      try {
        const res = await fetchXsd(e.value).unwrap();
        setXsdContent(res.responseObject);
      } catch (err) {
        toast.error("Failed to load XSD:");
      }
    };
    load();
  };

  const handleConvert = async () => {
    if (!selectedType.value) return;
    try {
      const formData = new FormData();
      formData.append("xsdFileName", selectedType.value);
      formData.append("maxRepsUnbound", maxRepsUnbound.toString());
      formData.append(
        "includeOptionalParams",
        includeOptionalParams.toString()
      );

      const res = await generateXml(formData).unwrap();
      if (res.responseCode === 200) {
        setXmlContent(res.responseObject);
      } else {
        toast.error(res.message);
      }
    } catch (err) {
      console.error("Error generating XML:", err);
    }
  };

  return (
    <div style={{ marginTop: "60px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography fontWeight="semi-bold">Select XSD Type : </Typography>

          <Select
            optionsList={optionsList}
            selectedOption={selectedType}
            width={200}
            label="Select XSD Type"
            disabled={isFetchingList}
            onChange={handleChange}
          />

          {listError && <Typography color="red">Error loading list</Typography>}
        </div>
      </div>

      {selectedType.value && xsdContent && (
        <div
          style={{
            height: "450px",
            display: "flex",
            justifyContent: "space-evenly",
            alignItems: "center",
          }}
        >
          <div style={{ height: "100%", width: "550px" }}>
            <ViewContent
              type="xsd"
              input={xsdContent}
              fileName={selectedType.value}
            />
          </div>

          <div
            style={{
              width: "180px",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
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
              onClick={handleConvert}
              disabled={isGenerating}
            >
              {isGenerating ? "Converting..." : "Generate XML"}
            </Button>
          </div>
          <div style={{ height: "100%", width: "550px" }}>
            {xmlContent && (
              <ViewContent
                type="xml"
                input={xmlContent}
                fileName={selectedType.value}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};
