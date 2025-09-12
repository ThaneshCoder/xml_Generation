import { useState } from "react";
import { Button, Select } from "pixel-react";

type Option = { label: string; value: string };

type MappingSelectorProps = {
  toOptions: Option[];
  fromOptions: Option[];
  onChange?: (mappings: Record<string, string>) => void;
  initialMappings?: Record<string, string>;
};

export const MappingSelector = ({
  toOptions,
  fromOptions,
  onChange,
  initialMappings,
}: MappingSelectorProps) => {
  const [rows, setRows] = useState<
    { toValue: string | null; fromValue: string | null }[]
  >(
    initialMappings
      ? Object.entries(initialMappings).map(([toValue, fromValue]) => ({
          toValue,
          fromValue,
        }))
      : [{ toValue: null, fromValue: null }]
  );

  const handleChange = (
    index: number,
    field: "toValue" | "fromValue",
    value: string
  ) => {
    const updated = [...rows];
    updated[index][field] = value;
    setRows(updated);

    if (onChange) {
      const mappings: Record<string, string> = {};
      updated
        .filter((r) => r.toValue && r.fromValue)
        .forEach((row) => {
          mappings[row.toValue!] = row.fromValue!;
        });
      onChange(mappings);
    }
  };

  const handleAddRow = () => {
    setRows([...rows, { toValue: null, fromValue: null }]);
  };

  const usedToValues = rows.map((r) => r.toValue).filter(Boolean);
  const usedFromValues = rows.map((r) => r.fromValue).filter(Boolean);

  return (
    <div
      style={{
        marginTop: "10px",
        paddingTop: "10px",
        height: "300px",
        overflow: "scroll",
      }}
    >
      {rows.map((row, index) => {
        const isAddDisabled = !row.toValue || !row.fromValue;
        const availableToOptions = toOptions.filter(
          (o) => !usedToValues.includes(o.value) || o.value === row.toValue
        );
        const availableFromOptions = fromOptions.filter(
          (o) => !usedFromValues.includes(o.value) || o.value === row.fromValue
        );

        return (
          <div
            key={index}
            style={{
              marginBottom: "12px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "16px",
            }}
          >
            <Select
              optionsList={availableToOptions}
              width="250px"
              selectedOption={
                row.toValue
                  ? toOptions.find((o) => o.value === row.toValue) ?? {}
                  : {}
              }
              onChange={(e) => handleChange(index, "toValue", e.value)}
            />

            <Select
              optionsList={availableFromOptions}
              width="250px"
              selectedOption={
                row.fromValue
                  ? fromOptions.find((o) => o.value === row.fromValue) ?? {}
                  : {}
              }
              onChange={(e) => handleChange(index, "fromValue", e.value)}
            />

            {index === rows.length - 1 && (
              <Button
                variant="primary"
                disabled={isAddDisabled}
                onClick={handleAddRow}
              >
                Add
              </Button>
            )}
          </div>
        );
      })}
    </div>
  );
};
