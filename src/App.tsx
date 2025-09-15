import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import { XmlGenerator } from "./pages/XmlGenerator";
import { DependentElement } from "./pages/DependentElement/DependentElement";
import { IndependentElement } from "./pages/IndependentElement/IndependentElement";
import { UploadXsd } from "./pages/UploadXsd/UploadXsd";
import { FieldMapping } from "./pages/FieldMapping/FieldMapping";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<XmlGenerator />}>
          <Route index element={<Navigate to="/dependent" replace />} />

          <Route path="dependent" element={<DependentElement />}></Route>
          <Route path="independent" element={<IndependentElement />}></Route>
          <Route path="field-mapping" element={<FieldMapping />} />
          <Route path="upload-xsd" element={<UploadXsd />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
