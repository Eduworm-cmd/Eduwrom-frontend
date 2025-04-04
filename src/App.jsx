import { BrowserRouter, Route, Routes } from "react-router-dom";
import { TeacherHomePage } from "./pages/Teacheradmin/TeacherHomePage/TeacherHomePage";
import { Layout } from "./layout/Layout";
import DaysView from "./pages/Teacheradmin/DaysView/DaysView";
import { MainLayout } from "./layout/MainLayout";
import { CourseView } from "./pages/Teacheradmin/CourseView/CourseView";
import UnitSummary from "./components/UnitSummary/UnitSummary";
import { AdminPannelLayout } from "./layout/AdminPannelLayout";
import { BookHomePage } from "./pages/Teacheradmin/Book/BookHomePage/BookHomePage";
import { BookPreview } from "./pages/Teacheradmin/Book/BookPreview/BookPreview";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<TeacherHomePage />} />
          <Route path="/books" element={<BookHomePage />} />
          <Route path="/book/preview/:id" element={<BookPreview />} />
        </Route>
        <Route element={<MainLayout />}>
          <Route path="/days" element={<DaysView />} />
          <Route path="/view" element={<CourseView />} />
          <Route path="/unit" element={<UnitSummary />} />
        </Route>
        <Route path="/super-admin-pannel" element={<AdminPannelLayout />}>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
