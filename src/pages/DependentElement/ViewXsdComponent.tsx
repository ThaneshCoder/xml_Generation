import { useParams } from "react-router-dom";
import { useLazyLoadXsdQuery } from "@/store/XmlServiceData/xmlServiceDataApi";
import { useEffect, useState } from "react";
import { Typography } from "pixel-react";

export const ViewXsd = () => {
  const { xsdName } = useParams<{ xsdName: string }>();
  const [loadXsdFile, { data, isFetching, error }] = useLazyLoadXsdQuery();
  const [xsdContent, setXsdContent] = useState<any>(null);

  useEffect(() => {
    if (xsdName) {
      const load = async () => {
        try {
          const response = await loadXsdFile(xsdName).unwrap();
          setXsdContent(response.responseObject);
        } catch (err) {
          console.error("Failed to load XSD:", err);
        }
      };
      load();
    }
  }, [xsdName, loadXsdFile]);

  return (
    <div>
      <Typography fontWeight="bold">XSD: {xsdName}</Typography>

      {isFetching && <Typography>Loading...</Typography>}
      {error && <Typography color="red">Error loading XSD</Typography>}
      <div style={{ height: "450px", overflow: "scroll",backgroundColor:'black',color:'white' }}>
        {xsdContent && (
          <pre style={{ whiteSpace: "pre-wrap" }}>
            {xsdContent}
          </pre>
        )}
      </div>
    </div>
  );
};
