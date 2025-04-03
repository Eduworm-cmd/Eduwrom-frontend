import { BrowserRouter, Route, Routes } from "react-router-dom";
import { TeacherHomePage } from "./pages/Teacheradmin/TeacherHomePage/TeacherHomePage";
import { Layout } from "./layout/Layout";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<TeacherHomePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
