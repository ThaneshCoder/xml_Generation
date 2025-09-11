import { useEffect, useState } from "react";
import {
  Button,
  getExtension,
  saveFileFromBlob,
  toast,
  Typography,
} from "pixel-react";

type ViewContentProps = {
  type: "xsd" | "xml";
  input: string;
  fileName: string;
};

export const ViewContent = ({ type, input, fileName }: ViewContentProps) => {
  const fileNameWithExtension =
    type === "xml" ? fileName.replace("xsd", "xml") : fileName;
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(input);
      toast.success("Copied to Clipboard");
    } catch (err) {
      toast.error("Failed to copy:");
    }
  };

  const handleDownload = () => {
    const blob = new Blob([input], {
      type: type === "xml" ? "application/xml" : "application/xsd+xml",
    });
    saveFileFromBlob(blob, fileNameWithExtension);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems:'center'
        }}
      >
        <Typography fontWeight="bold" fontSize={15}>{fileNameWithExtension}</Typography>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "10px",
            padding: "5px",
          }}
        >
          <Button variant="secondary" onClick={handleCopy}>
            Copy
          </Button>
          <Button variant="secondary" onClick={handleDownload}>
            Download
          </Button>
        </div>
      </div>

      {/* Content */}
      <pre
        style={{
          flex: 1,
          overflow: "auto",
          background: "#f5f5f5",
          padding: "10px",
          margin: 0,
          borderRadius: "6px",
          scrollbarWidth:"thin"
        }}
      >
        {input}
      </pre>
    </div>
  );
};
