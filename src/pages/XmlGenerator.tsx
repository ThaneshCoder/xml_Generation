import { Outlet } from "react-router-dom";
import { Header } from "./Header/Header";

export const XmlGenerator = () => {
  return (
    <div>
      <Header />
      <Outlet />
    </div>
  );
};
