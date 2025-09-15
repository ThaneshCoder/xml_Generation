import { useEffect, useState } from "react";
import {
  AttachmentButton,
  Button,
  Drawer,
  checkEmpty,
  saveFileFromBlob,
  toast,
} from "pixel-react";
import { useGenerateXmlDataMutation } from "@/store/XmlServiceData/xmlServiceDataApi";
import { Mapping } from "@/types";

interface GenerateXmlType {
  generateMapping: Mapping | null;
  setGenerateMapping: React.Dispatch<React.SetStateAction<Mapping | null>>;
}

export const GenerateXml = ({
  generateMapping,
  setGenerateMapping,
}: GenerateXmlType) => {
  const [fromContent, setFromContent] = useState<string>("");
  const [toContent, setToContent] = useState<string>("");
  const [generateXmlData, { isLoading: isGenerating }] =
    useGenerateXmlDataMutation();

  const handlePasteIntoFrom = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setFromContent(text || "");
      toast.success("Pasted to Clipboard Successfully");
    } catch (e) {
      toast.error("Failed to paste in Clipboard");
    }
  };

  const handleUploadIntoFrom = async (file: File) => {
    console.log(file);

    const text = await file.text();
    setFromContent(text);
  };

  const handleDownload = (content: string, filename: string) => {
    const blob = new Blob([content], {
      type: "application/xml",
    });
    saveFileFromBlob(blob, filename);
    toast.success(`Downloaded File ${filename} Successfully`);
  };

  const handleGenerate = async () => {
    if (!generateMapping?.name || !fromContent) {
      return;
    }
    try {
      const formData = new FormData();
      formData.append("mappingName", generateMapping.name);
      formData.append("xml1", fromContent);
      const res = await generateXmlData({
        mappingName: generateMapping.name,
        xml1: fromContent,
      }).unwrap();
      if (res.responseCode === 200 && typeof res.responseObject === "string") {
        setToContent(res.responseObject);
      } else {
        setToContent("");
      }
    } catch (err) {
      console.error("Error generating XML:", err);
    }
  };
  const handleCopy = async (toContent: any) => {
    try {
      await navigator.clipboard.writeText(toContent);
      toast.success("Copied to Clipboard");
    } catch (err) {
      toast.error("Failed to copy:");
    }
  };
  return (
    <Drawer
      isOpen={!checkEmpty(generateMapping?.id)}
      title={`${generateMapping?.name} - Generate and Map XML data`}
      onClose={() => {
        setGenerateMapping(null);
      }}
      size="large"
    >
      <div
        style={{
          display: "flex",
          gap: "16px",
          height: "70vh",
        }}
      >
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            padding: "12px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "8px",
            }}
          >
            <strong>From</strong>
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <Button variant="secondary" onClick={handlePasteIntoFrom}>
                Paste
              </Button>
              <label>
                <AttachmentButton
                  label={""}
                  isInfoIconRequired={false}
                  selectedFiles={[]}
                  buttonLabel="Upload"
                  onFilesChange={(e) => {
                    const file = e[0];
                    if (file) handleUploadIntoFrom(file);
                  }}
                  deleteButton={false}
                  addAttachmentButton={false}
                />
              </label>
              <Button
                variant="secondary"
                onClick={() => setFromContent("")}
                disabled={!fromContent}
              >
                Clear
              </Button>
            </div>
          </div>
          <textarea
            value={fromContent}
            onChange={(e) => setFromContent(e.target.value)}
            placeholder="Paste or upload your source XML/data here"
            style={{
              width: "100%",
              flex: 1,
              resize: "none",
              fontFamily:
                "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
              fontSize: "12px",
              lineHeight: 1.5,
              padding: "8px",
              border: "1px solid #e5e7eb",
              borderRadius: "6px",
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Button
            variant={"primary"}
            onClick={handleGenerate}
            disabled={!fromContent || !generateMapping?.name || isGenerating}
          >
            Generate
          </Button>
        </div>

        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            padding: "12px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "8px",
            }}
          >
            <strong>To</strong>
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <Button
                variant="secondary"
                onClick={() => handleDownload(toContent, "to.xml")}
                disabled={!toContent}
              >
                Download
              </Button>
              <Button
                variant="secondary"
                onClick={() => {
                  handleCopy(toContent);
                }}
                disabled={!toContent}
              >
                copy
              </Button>
            </div>
          </div>
          <textarea
            value={toContent}
            disabled
            onChange={(e) => setToContent(e.target.value)}
            placeholder="Generated XML/data will appear here"
            style={{
              width: "100%",
              flex: 1,
              resize: "none",
              fontFamily:
                "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
              fontSize: "12px",
              lineHeight: 1.5,
              padding: "8px",
              border: "1px solid #e5e7eb",
              borderRadius: "6px",
            }}
          />
        </div>
      </div>
    </Drawer>
  );
};
