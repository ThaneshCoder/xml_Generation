import { useState } from "react";
import { AttachmentButton, Button, checkEmpty, Typography } from "pixel-react";
import { useUploadXsdMutation } from "@/store/XmlServiceData/xmlServiceDataApi";

export const UploadXsd = () => {
  const [selectedFile, setSelectedFile] = useState<File[]>([]);
  const [uploadXsd, { isLoading, error, isSuccess }] = useUploadXsdMutation();

  const handleUpload = async () => {
    if (checkEmpty(selectedFile)) return;
    try {
      const res = await uploadXsd(selectedFile[0]).unwrap();
      console.log("Upload success:", res);
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  return (
    <div style={{ marginTop: "60px",height:"30px" ,width:"100%", }}>
      <AttachmentButton
        multiple={false}
        label={"Upload XSD"}
        maxFiles={3}
        selectedFiles={selectedFile}
        onFilesChange={(e) => {
          console.log(e);
          setSelectedFile(e);
        }}
        deleteButton={true}
        addAttachmentButton={false}
      />
      <Button
        variant="primary"
        disabled={checkEmpty(selectedFile) || isLoading}
        onClick={handleUpload}
      >
        {isLoading ? "Uploading..." : "Upload XSD"}
      </Button>

      {isSuccess && <Typography color="green">Upload successful ✅</Typography>}
      {error && <Typography color="red">Failed to upload ❌</Typography>}
    </div>
  );
};
