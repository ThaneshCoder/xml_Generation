import { useEffect, useState } from "react";
import { Select, Toggle, Typography } from "pixel-react";
import { useLazyXsdListQuery } from "@/store/XmlServiceData/xmlServiceDataApi";

type Selection = {
  xsdFileName: string;
  maxRepsUnbound: number;
  includeOptionalParams: boolean;
};

type FieldCardProps = {
  mapName: string;
  onSelectionChange: (selection: Selection) => void;
};

export const FieldCard = ({ mapName, onSelectionChange }: FieldCardProps) => {
  const [selectedType, setSelectedType] = useState<{
    label: string;
    value: string;
  }>({
    label: "",
    value: "",
  });
  const [optionsList, setOptionsList] = useState<
    { label: string; value: string }[]
  >([]);
  const [maxRepsUnbound, setMaxRepsUnbound] = useState(1);
  const [includeOptionalParams, setIncludeOptionalParams] = useState(false);

  const [fetchXsdList, { isFetching: isFetchingList, error: listError }] =
    useLazyXsdListQuery();

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

  useEffect(() => {
    onSelectionChange({
      xsdFileName: selectedType.value,
      maxRepsUnbound,
      includeOptionalParams,
    });
  }, [selectedType, maxRepsUnbound, includeOptionalParams]);

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
          onChange={(e) => setSelectedType({ label: e.label, value: e.value })}
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
            <input
              type="number"
              style={{ width: "40px" }}
              value={maxRepsUnbound}
              onChange={(e) => setMaxRepsUnbound(Number(e.target.value))}
            />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography>Include Optional Params : </Typography>
            <input
              type="checkbox"
              checked={includeOptionalParams}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setIncludeOptionalParams(e.target.checked)
              }
            />{" "}
            {/* <Toggle
              key={`${mapName}-toggle`}
              checked={includeOptionalParams}
              onChange={(e) => {
                const input = e.target as HTMLInputElement;
                setIncludeOptionalParams(input.checked);
              }}
            /> */}
          </div>
        </div>
      </div>
    </div>
  );
};
