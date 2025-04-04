import { BrowserRouter, Route, Routes } from "react-router-dom";
import { TeacherHomePage } from "./pages/Teacheradmin/TeacherHomePage/TeacherHomePage";
import { Layout } from "./layout/Layout";
import DaysView from "./pages/DaysView/DaysView";
import { MainLayout } from "./layout/MainLayout";
import { CourseView } from "./pages/CourseView/CourseView";
import { BookHomePage } from "./pages/Book/BookHomePage/BookHomePage";
import { BookPreview } from "./pages/Book/BookPreview/BookPreview";
import { AdminPannelLayout } from "./layout/AdminPannelLayout";
import { SAHomePage } from "./pages/super-admin-pannel/SAHomePage/SAHomePage";
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
        </Route>
        <Route path="/super-admin-pannel" element={<AdminPannelLayout />}>
          <Route path="home" element={<SAHomePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
