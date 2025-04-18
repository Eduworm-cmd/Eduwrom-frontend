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
import { Curriculum } from "./pages/Curriculum/Curriculum";
import { CommunicationHub } from "./pages/Notification Schedules/CommunicationHub";
import { InvoiceList } from "./pages/super-admin-pannel/Biiling/Invoice/InvoiceList";
import { Invoice } from "./pages/super-admin-pannel/Biiling/Invoice/Invoice";
import { Notification } from "./pages/Notification Schedules/Notification";
import { AddStaff } from "./pages/super-admin-pannel/Staff/AddStaff";
import { StaffList } from "./pages/super-admin-pannel/Staff/StaffList";
import { AddSchool } from "./pages/super-admin-pannel/School/AddSchool";
import { SchoolList } from "./pages/super-admin-pannel/School/SchoolList";
import { SchoolView } from "./pages/super-admin-pannel/School/SchoolView";
import { StaffView } from "./pages/super-admin-pannel/Staff/StaffView.";
import { SALSHome } from "./pages/super-admin-pannel/SALicenseSubscription/SALSHome/SALSHome";
import { Lms } from "./pages/super-admin-pannel/LMS/Lms";
import { Login_SignUp } from "./auth/Login_SignUp";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login_SignUp />} />
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

        <Route path="/eduworm-admin" element={<AdminPannelLayout />}>
          <Route index element={<SAHomePage />} />
          <Route path="home" element={<SAHomePage />} />
          <Route path="Admin" element={<SALSHome />} />
          <Route path="school/list" element={<SchoolList />} />
          <Route path="school/add" element={<AddSchool />} />
          <Route path="school/edit/:id" element={<AddSchool />} />
          <Route path="school/view/:id" element={<SchoolView />} />

          <Route path="staff/list" element={<StaffList />} />
          <Route path="staff/add" element={<AddStaff />} />
          <Route path="staff/edit/:id" element={<AddStaff />} />
          <Route path="staff/view/:id" element={<StaffView />} />

          <Route path="lms" element={<Lms/>}/>
          <Route path="video-chapter-upload" element={<Add_Vedio />} />
          <Route path="curriculum" element={<Curriculum />} />
          <Route path="communication-hub" element={<CommunicationHub />} />
          <Route path="Invoice-List" element={<InvoiceList />} />
          <Route path="Create/Invoice" element={<Invoice />} />
          <Route path="Notification" element={<Notification />} />


          {/* Teacher Admin Panel Routes */}
          <Route path="content/mange" element={<Content_Manage />} />
          <Route path="content/add" element={<Add_Content />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
