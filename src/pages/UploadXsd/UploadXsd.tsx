import { useState, useEffect } from "react";
import {
  AttachmentButton,
  Button,
  checkEmpty,
  toast,
  Typography,
  Search,
} from "pixel-react";
import {
  useLazyXsdListQuery,
  useUploadXsdMutation,
} from "@/store/XmlServiceData/xmlServiceDataApi";

export const UploadXsd = () => {
  const [selectedFile, setSelectedFile] = useState<File[]>([]);
  const [uploadXsd, { isLoading, error, isSuccess }] = useUploadXsdMutation();
  const [fetchXsdList, { isFetching: isFetchingList, error: listError }] =
    useLazyXsdListQuery();
  const [xsdList, setXsdList] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    const loadXsdList = async () => {
      try {
        const res = await fetchXsdList().unwrap();
        setXsdList(res.responseObject);
      } catch (err) {
        console.error("Failed to fetch XSD list:", err);
        toast.error("Failed to load XSD list");
      }
    };
    loadXsdList();
  }, [fetchXsdList]);

  const handleUpload = async () => {
    if (checkEmpty(selectedFile)) return;
    try {
      const formData = new FormData();
      formData.append("file", selectedFile[0]);
      const res = await uploadXsd(formData).unwrap();
      if (res.responseCode === 200) {
        toast.success("File Uploaded Successfully");
        const updatedList = await fetchXsdList().unwrap();
        setXsdList(updatedList.responseObject);
        setSelectedFile([]);
      } else if (res.responseCode === 500) {
        toast.warning(res.message);
      } else {
        toast.error(res.message);
      }
    } catch (err) {
      toast.error("Uploaded Failed");
    }
  };

  const filteredList = xsdList.filter((fileName) =>
    fileName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ marginTop: "40px", padding: "20px" }}>
      <div
        style={{
          marginBottom: "20px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "20px",
        }}
      >
        <Typography fontSize={15}>Upload XSD file : </Typography>
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
        {!checkEmpty(selectedFile) && (
          <Button
            buttonHeight="25px"
            variant="secondary"
            onClick={handleUpload}
            disabled={isLoading}
          >
            {isLoading ? "Uploading..." : "Upload"}
          </Button>
        )}
      </div>
      <div
        style={{
          marginBottom: "20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2>XSD Available List</h2>
        <Search
          minLength={0}
          onSearch={(e: string) => {
            setSearchTerm(e);
          }}
          placeholder="Search by File Name"
          value={searchTerm}
          isExpand={true}
          width={200}
          showClose={false}
          onClose={function (): void {
            throw new Error("Function not implemented.");
          }}
          onExpand={function (isExpand: boolean): void {
            throw new Error("Function not implemented.");
          }}
        />
      </div>

      {/* Table */}
      {isFetchingList ? (
        <Typography>Loading XSD files...</Typography>
      ) : listError ? (
        <Typography color="red">Error loading XSD files</Typography>
      ) : filteredList.length === 0 ? (
        <Typography>No XSD files found</Typography>
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "10px",
          }}
        >
          <thead>
            <tr style={{ background: "#f5f5f5" }}>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>S.No</th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                File Name
              </th>
              <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                File Type
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredList.map((fileName, index) => (
              <tr key={fileName}>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {index + 1}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  {fileName}
                </td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                  XSD
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};
