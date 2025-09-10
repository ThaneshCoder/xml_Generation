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
    { label: "Independent Message", path: "/independent" },
    { label: "Dependent Message", path: "/dependent" },
    { label: "Fields Mapping", path: "/fields-mapping" },
    { label: "Upload XSD", path: "/upload-xsd" },
  ];

  return (
    <div className={Style.AppHeader} style={{ height: "20px" }}>
      <AppHeader
        logo={
          <Icon name="xml_file_type" color="white" isSelected hoverEffect />
        }
        appHeaderMenuItems={headerMenuItems}
        selectedMenu={selectedHeader.label}
        width="100%"
        onMenuClick={(item) => {
          setSelectedHeader(item);
          navigate(item.path);
        }}

        // hideNavbar
      />
    </div>
  );
};
