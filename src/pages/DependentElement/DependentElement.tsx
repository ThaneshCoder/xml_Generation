import { useEffect, useState } from "react";
import {
  useLazyMappingListQuery,
  useDeleteMappingMutation,
} from "@/store/XmlServiceData/xmlServiceDataApi";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Icon, Tooltip, Search, toast } from "pixel-react";
import { GenerateXml } from "./GenerateXml";
import { EditMapping } from "./EditMapping";
import { Mapping } from "@/types";

export const DependentElement = () => {
  const [mappingList, setMappingList] = useState<Mapping[]>([]);
  const [generateMapping, setGenerateMapping] = useState<Mapping | null>(null);
  const [editMapping, setEditMapping] = useState<Mapping | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const [getMappingList] = useLazyMappingListQuery();
  const [deleteMapping] = useDeleteMappingMutation();

  useEffect(() => {
    const loadList = async () => {
      try {
        const res = await getMappingList().unwrap();
        setMappingList(res.responseObject || []);
      } catch (err) {
        console.error("Failed to fetch mapping list:", err);
      }
    };
    loadList();
  }, []);

  const handleEdit = (id: number) => {
    const found = mappingList.find((m) => m.id === id) || null;
    setEditMapping(found);
  };

  const handleDelete = async (mappingName: string) => {
    try {
      const response = await deleteMapping(mappingName).unwrap();
      if (response.responseCode === 200) {
        setMappingList((prev) =>
          prev.filter((item) => item.name !== mappingName)
        );
        toast.success("Mapping deleted Successfully");
      } else {
        toast.error(response.message);
      }
    } catch (e) {
      console.error("Failed to delete mapping", e);
    }
  };

  const handleGenerate = (mappingData: Mapping) => {
    setGenerateMapping(mappingData);
  };

  const filteredList = mappingList.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ marginTop: "40px", padding: "20px" }}>
      <div
        style={{
          marginBottom: "20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2>Mapping List</h2>
        <Search
          minLength={0}
          onSearch={(e: string) => {
            setSearchTerm(e);
          }}
          placeholder="Search by Name"
          value={searchTerm}
          isExpand={true}
          width={150}
          showClose={false}
          onClose={function (): void {
            throw new Error("Function not implemented.");
          }}
          onExpand={function (isExpand: boolean): void {
            throw new Error("Function not implemented.");
          }}
        />
      </div>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginTop: "10px",
        }}
      >
        <thead>
          <tr style={{ background: "#f5f5f5" }}>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>ID</th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>Name</th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>
              From XSD
            </th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>
              From Max Reps
            </th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>
              From Params
            </th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>To XSD</th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>
              To Max Reps
            </th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>
              To Params
            </th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>
              Generator
            </th>
            <th style={{ border: "1px solid #ddd", padding: "8px" }}>
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredList.map((item, index) => (
            <tr key={item.id}>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {index + 1}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {item.name}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {item.fromXsd}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {item.fromMaxRepsUnbound}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {item.fromIncludeParams ? "Yes" : "No"}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {item.toXsd}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {item.toMaxRepsUnbound}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                {item.toIncludeParams ? "Yes" : "No"}
              </td>

              <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                <Button
                  size="medium"
                  variant="secondary"
                  onClick={() => handleGenerate(item)}
                >
                  Generate
                </Button>
              </td>
              <td
                style={{
                  border: "1px solid #ddd",
                  padding: "8px",
                  display: "flex",
                  justifyContent: "space-evenly",
                }}
              >
                <Tooltip title="Edit Mapping">
                  <Icon
                    hoverEffect
                    height={18}
                    width={18}
                    name="edit"
                    onClick={() => handleEdit(item.id)}
                  />
                </Tooltip>
                <Tooltip title="Delete Mapping">
                  <Icon
                    hoverEffect
                    height={18}
                    width={18}
                    name="delete"
                    color="red"
                    onClick={() => handleDelete(item.name)}
                  />
                </Tooltip>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <GenerateXml
        generateMapping={generateMapping}
        setGenerateMapping={setGenerateMapping}
      />
      {editMapping && (
        <EditMapping
          mapping={editMapping}
          onClose={() => setEditMapping(null)}
          onSaved={(updated) => {
            setMappingList((prev) =>
              prev.map((m) => (m.id === updated.id ? { ...m, ...updated } : m))
            );
            setEditMapping(null);
          }}
        />
      )}
    </div>
  );
};
