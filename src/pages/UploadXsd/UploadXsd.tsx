import { useState } from "react";
import {
  AttachmentButton,
  Button,
  checkEmpty,
  toast,
  Typography,
} from "pixel-react";
import { useUploadXsdMutation } from "@/store/XmlServiceData/xmlServiceDataApi";

export const UploadXsd = () => {
  const [selectedFile, setSelectedFile] = useState<File[]>([]);
  const [uploadXsd, { isLoading, error, isSuccess }] = useUploadXsdMutation();

  const handleUpload = async () => {
    if (checkEmpty(selectedFile)) return;
    try {
      const formData = new FormData();
      formData.append("file", selectedFile[0]);
      const res = await uploadXsd(formData).unwrap();
      if (res.responseCode === 200) {
        toast.success("File Uploaded Successfully");
      } else {
        toast.error(res.message);
      }
    } catch (err) {
      toast.error("Uploaded Failed");
    }
  };

  return (
    <div
      style={{
        marginTop: "70px",
        height: "50px",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography fontSize={15}>Add XSD file : </Typography>
        <div style={{ display: "flex" }}>
          <AttachmentButton
            multiple={false}
            label={"Upload XSD"}
            maxFiles={3}
            selectedFiles={selectedFile}
            onFilesChange={(e) => {
              setSelectedFile(e);
            }}
            deleteButton={true}
            addAttachmentButton={false}
            isInfoIconRequired={false}
          />
        </div>
      </div>
      {!checkEmpty(selectedFile) && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "10px",
          }}
        >
          <Button
            buttonHeight="25px"
            variant="secondary"
            onClick={handleUpload}
          >
            Upload to Database
          </Button>
        </div>
      )}
    </div>
  );
};
