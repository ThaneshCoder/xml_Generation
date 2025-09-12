import { Toggle, Typography } from "pixel-react";

type EditCardProps = {
  mapCard: {
    xsdFileName: string;
    maxRepsUnbound: number;
    includeOptionalParams: boolean;
  };
};

export const EditCard = ({ mapCard }: EditCardProps) => {
  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-evenly",
        }}
      >
        <div
          style={{
            width: "260px",
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
            <Typography>xsdFileName:</Typography>
            <div style={{ width: "140px", textAlign: "right" }}>{mapCard.xsdFileName}</div>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography>maxRepsUnbound:</Typography>
            <div style={{ width: "140px", textAlign: "right" }}>{mapCard.maxRepsUnbound}</div>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography>Include Optional Params:</Typography>
            <Toggle checked={mapCard.includeOptionalParams} disabled />
          </div>
        </div>
      </div>
    </div>
  );
};
