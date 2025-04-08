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
import { Content_Manage } from "./pages/ContentAdmin/Content_Manage";
import { SchoolList } from "./pages/super-admin-pannel/SAThemeBrandingControl/SchoolList/SchoolList";
import { AddSchool } from "./pages/super-admin-pannel/SAThemeBrandingControl/AddSchool/AddSchool";
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

        <Route path="/eduworm-admin" element={<AdminPannelLayout />}>
          {/* Super Admin Panel Routes */}
          <Route path="home" element={<SAHomePage />} />
          <Route path="school/list" element={<SchoolList />} />
          <Route path="school/add" element={<AddSchool />} />


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
