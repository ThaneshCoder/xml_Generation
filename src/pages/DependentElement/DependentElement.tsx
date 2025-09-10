import { useEffect, useState } from "react";
import { Button, Select, Typography } from "pixel-react";
import { useLazyXsdListQuery } from "@/store/XmlServiceData/xmlServiceDataApi";
import { useNavigate, Outlet, useParams } from "react-router-dom";
import Style from "./DependentElement.module.scss";

export const DependentElement = () => {
  const navigate = useNavigate();
  const { xsdName } = useParams<{ xsdName?: string }>();

  const [selectedType, setSelectedType] = useState({ label: "", value: "" });
  const [optionsList, setOptionsList] = useState<
    { label: string; value: string }[]
  >([]);

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
    if (xsdName && optionsList.length > 0) {
      const match = optionsList.find((opt) => opt.value === xsdName);
      if (match) {
        setSelectedType(match);
      }
    }
  }, [xsdName, optionsList]);

  const handleViewType = () => {
    if (!selectedType.value) return;
    navigate(`viewXsd/${selectedType.value}`);
  };

  return (
    <div style={{marginTop:'60px'}}>
      <div className={Style.DependentElement}>
        <Typography>Select Type</Typography>

        <Select
          optionsList={optionsList}
          selectedOption={selectedType}
          width={200}
          disabled={isFetchingList}
          onChange={(e) => {
            setSelectedType({ label: e.label, value: e.value });
            navigate(`viewXsd/${e.value}`); // update URL when user changes select
          }}
        />

        <Button
          variant="primary"
          disabled={!selectedType.value}
          onClick={handleViewType}
        >
          {isFetchingList ? "Loading..." : "View XSD"}
        </Button>

        {listError && <Typography color="red">Error loading list</Typography>}
      </div>

      <div>
        <Outlet />
      </div>
    </div>
  );
};
