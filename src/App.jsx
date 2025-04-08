import { BrowserRouter, Route, Routes } from "react-router-dom";
import { TeacherHomePage } from "./pages/Teacheradmin/TeacherHomePage/TeacherHomePage";
import { Layout } from "./layout/Layout";
import DaysView from "./pages/Teacheradmin/DaysView/DaysView";
import { MainLayout } from "./layout/MainLayout";
import { CourseView } from "./pages/Teacheradmin/CourseView/CourseView";
import UnitSummary from "./components/UnitSummary/UnitSummary";
import { AdminPannelLayout } from "./layout/AdminPannelLayout";
import { SAHomePage } from "./pages/super-admin-pannel/SAHomePage/SAHomePage";
import { BookHomePage } from "./pages/Teacheradmin/Book/BookHomePage/BookHomePage";
import { BookPreview } from "./pages/Teacheradmin/Book/BookPreview/BookPreview";
import { Add_Vedio } from "./components/Add_Vedio/Add_Vedio";
import { Add_Content } from "./pages/ContentAdmin/Add_Content";
import RichtoolEditor from "./components/RichtoolEditor/RichtoolEditor";
import { Content_Manage } from "./pages/ContentAdmin/Content_Manage";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<TeacherHomePage />} />
          <Route path="/books" element={<BookHomePage />} />
          <Route path="/book/preview/:id" element={<BookPreview/>} />
        </Route>
        
        <Route element={<MainLayout />}>
          <Route path="/days" element={<DaysView />} />
          <Route path="/view" element={<CourseView />} />
          <Route path="/unit" element={<UnitSummary />} />
        </Route>

        <Route path="/super-admin-pannel" element={<AdminPannelLayout />}>
          {/* Super Admin Panel Routes */}
          <Route path="home" element={<SAHomePage />} />
          <Route path="video-chapter-upload" element={<Add_Vedio />} />

          
         {/* Teacher Admin Panel Routes */}
          <Route path="content/mange" element={<Content_Manage/>} />
          <Route path="content/add" element={<Add_Content />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
