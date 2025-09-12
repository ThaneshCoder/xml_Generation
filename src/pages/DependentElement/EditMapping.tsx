import { useEffect, useState } from "react";
import { Button, Drawer, Typography, toast } from "pixel-react";
import {
  useExtractFieldsMutation,
  useUpdateMappingMutation,
} from "@/store/XmlServiceData/xmlServiceDataApi";
import { EditCard } from "./EditCard";
import { EditMappingSelector } from "./EditMappingSelector";

type Mapping = {
  id: number;
  name: string;
  fromXsd: string;
  fromMaxRepsUnbound: number;
  fromIncludeParams: boolean;
  mappings: Record<string, string>;
  toXsd: string;
  toMaxRepsUnbound: number;
  toIncludeParams: boolean;
};

type EditMappingProps = {
  mapping: Mapping;
  onClose: () => void;
  onSaved: (updated: Partial<Mapping> & { id: number }) => void;
};

export const EditMapping = ({
  mapping,
  onClose,
  onSaved,
}: EditMappingProps) => {
  const [mappings, setMappings] = useState<Record<string, string>>({
    ...mapping.mappings,
  });
  const [updateMapping, { isLoading }] = useUpdateMappingMutation();
  const [extractFields] = useExtractFieldsMutation();

  const [fromFields, setFromFields] = useState<
    { label: string; value: string }[]
  >([]);
  const [toFields, setToFields] = useState<{ label: string; value: string }[]>(
    []
  );

  useEffect(() => {
    const loadFields = async () => {
      try {
        if (mapping.fromXsd) {
          const fd = new FormData();
          fd.append("xsdFileName", mapping.fromXsd);
          fd.append("maxRepsUnbound", String(mapping.fromMaxRepsUnbound));
          fd.append("includeOptionalParams", String(mapping.fromIncludeParams));
          const res = await extractFields(fd).unwrap();
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
        if (mapping.toXsd) {
          const fd = new FormData();
          fd.append("xsdFileName", mapping.toXsd);
          fd.append("maxRepsUnbound", String(mapping.toMaxRepsUnbound));
          fd.append("includeOptionalParams", String(mapping.toIncludeParams));
          const res = await extractFields(fd).unwrap();
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
        toast.error("Failed to load fields");
      }
    };
    loadFields();
  }, [mapping.fromXsd, mapping.toXsd]);

  const handleUpdate = async () => {
    const data = {
      name: mapping.name,
      fromXsd: mapping.fromXsd,
      fromMaxRepsUnbound: mapping.fromMaxRepsUnbound,
      fromIncludeParams: mapping.fromIncludeParams,
      toXsd: mapping.toXsd,
      toMaxRepsUnbound: mapping.toMaxRepsUnbound,
      toIncludeParams: mapping.toIncludeParams,
      mappings,
    };
    try {
      const res = await updateMapping({
        mappingName: mapping.name,
        data,
      }).unwrap();
      if (res.responseCode === 200) {
        onSaved({ id: mapping.id, mappings });
        toast.success("Mapping Updated Successfully");
      } else {
        toast.error(res.message);
      }
    } catch (e) {
      toast.error("Failed To Updated Mapping");
    }
  };

  return (
    <Drawer
      isOpen={true}
      title={"Edit Mapping Keys/Values"}
      onClose={onClose}
      size="large"
    >
      <div
        style={{
          padding: "12px",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        <div>
          <Typography fontSize={20}>Mapping Name - {mapping.name}</Typography>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-evenly",
            gap: "24px",
            marginTop: "8px",
          }}
        >
          <EditCard
            mapCard={{
              xsdFileName: mapping.fromXsd,
              maxRepsUnbound: mapping.fromMaxRepsUnbound,
              includeOptionalParams: mapping.fromIncludeParams,
            }}
          />
          <EditCard
            mapCard={{
              xsdFileName: mapping.toXsd,
              maxRepsUnbound: mapping.toMaxRepsUnbound,
              includeOptionalParams: mapping.toIncludeParams,
            }}
          />
        </div>

        {fromFields.length > 0 && toFields.length > 0 && (
          <div style={{ marginTop: "16px" }}>
            <EditMappingSelector
              fromOptions={fromFields}
              toOptions={toFields}
              initialMappings={mappings}
              onChange={(m) => setMappings(m)}
            />
          </div>
        )}

        <div
          style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}
        >
          <Button variant="tertiary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            disabled={isLoading || Object.keys(mappings).length === 0}
            onClick={handleUpdate}
          >
            Update
          </Button>
        </div>
      </div>
    </Drawer>
  );
};
