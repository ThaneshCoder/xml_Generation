import { MappingSelector } from "../FieldMapping/MappingSelector";

export type Option = { label: string; value: string };

export const EditMappingSelector = ({
  toOptions,
  fromOptions,
  initialMappings,
  onChange,
}: {
  toOptions: Option[];
  fromOptions: Option[];
  initialMappings: Record<string, string>;
  onChange: (m: Record<string, string>) => void;
}) => {
  return (
    <MappingSelector
      toOptions={toOptions}
      fromOptions={fromOptions}
      initialMappings={initialMappings}
      onChange={onChange}
    />
  );
};
