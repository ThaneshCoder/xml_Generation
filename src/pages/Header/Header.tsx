import { AppHeader, Icon } from "pixel-react";
import { useEffect, useState } from "react";
import Style from "./Header.module.scss";
import { useLocation, useNavigate, useParams } from "react-router-dom";

export const Header = () => {
  const navigate = useNavigate();
  const path = useLocation();
  const [selectedHeader, setSelectedHeader] = useState({
    label: "",
    path: "",
  });
  useEffect(() => {
    headerMenuItems.forEach((e) => {
      if (e.path === path.pathname) {
        setSelectedHeader(e);
      }
    });
  }, [path]);

  const headerMenuItems = [
    { label: "XSD Uploader", path: "/upload-xsd" },
    { label: "XSD Translator", path: "/independent" },
    { label: "Fields Mapper", path: "/field-mapping" },
    { label: "Swift Simulator", path: "/dependent" },
  ];

  return (
    <div>
      <AppHeader
        appHeaderMenuItems={headerMenuItems}
        selectedMenu={selectedHeader.label}
        leftContent={<div style={{ height: "10px" }}></div>}
        width="100%"
        isClient={true}
        onMenuClick={(item) => {
          setSelectedHeader(item);
          navigate(item.path);
        }}
        logo={undefined}
      />
    </div>
  );
};
