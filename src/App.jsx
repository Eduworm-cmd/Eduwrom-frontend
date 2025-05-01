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
import { Add_Content } from "./pages/ContentAdmin/Add_Content";
import { Content_Manage } from "./pages/ContentAdmin/Content_Manage";
import { Curriculum } from "./pages/Curriculum/Curriculum";
import { CommunicationHub } from "./pages/Notification Schedules/CommunicationHub";
import { InvoiceList } from "./pages/super-admin-pannel/Biiling/Invoice/InvoiceList";
import { Invoice } from "./pages/super-admin-pannel/Biiling/Invoice/Invoice";
import { Notification } from "./pages/Notification Schedules/Notification";
import { AddSchool } from "./pages/super-admin-pannel/School/AddSchool";
import { SchoolList } from "./pages/super-admin-pannel/School/SchoolList";
import { SchoolView } from "./pages/super-admin-pannel/School/SchoolView";
import { SALSHome } from "./pages/super-admin-pannel/SALicenseSubscription/SALSHome/SALSHome";
import { Lms } from "./pages/super-admin-pannel/LMS/Lms";
import { Login_SignUp } from "./auth/Login_SignUp";
import Content from "./pages/Teacheradmin/InteractiveContent/Content";
import ScheduleList from "./pages/Teacheradmin/InteractiveContent/ScheduleList";
import { SP_ScheduleList } from "./pages/super-admin-pannel/ScheduleList/SP_ScheduleList";
import { School_Teacher_Login } from "./auth/School_Teacher_Login";
import PageNotFound from "./components/PageNotFound/PageNotFound";
import AcademicData from "./pages/AcademicData";
import GradeManagement from "./pages/GradeManagement";
import ClassRoomMangement from "./pages/ClassRoomMangement";
import ToogleTabs from "./pages/super-admin-pannel/ToogleTabs";
import { PlayListAssignment } from "./pages/Teacheradmin/InteractiveContent/PlayListAssignment";
import { StudentList } from "./pages/super-admin-pannel/Student/StudentList";
import { AddStudent } from "./pages/super-admin-pannel/Student/AddStudent";
import { StaffList } from "./pages/super-admin-pannel/Staff/StaffList";
import { AddStaff } from "./pages/super-admin-pannel/Staff/AddStaff";
import { AcademicList } from "./pages/super-admin-pannel/AcademicYear/AcademicList";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/SPlogin" element={<Login_SignUp />} />
        <Route path="/login" element={<School_Teacher_Login />} />
        <Route path="*" element={<PageNotFound />} />
        <Route path="/" element={<School_Teacher_Login />} />

        <Route path="eduworm-Teacher" element={<Layout />}>
          <Route index element={<TeacherHomePage />} />
          <Route path="books" element={<BookHomePage />} />
          <Route path="book/preview/:id" element={<BookPreview />} />
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

          <Route path="staff" element={<StaffList/>} />
          <Route path="staff/add" element={<AddStaff/>} />
          <Route path="staff/edit" element={<AddStaff/>} />

          <Route path="academic Year" element={<AcademicList />} />
          <Route path="student" element={<StudentList />} />
          <Route path="grade" element={<GradeManagement />} />
          <Route path="classroom" element={<ClassRoomMangement />} />
          <Route path="students/add" element={<AddStudent />} />
          <Route path="students/edit/:id" element={<AddStudent />} />

          <Route path="schedule/List" element={<SP_ScheduleList />} />
          <Route path="lms" element={<Lms />} />
          <Route path="curriculum" element={<Curriculum />} />
          <Route path="communication-hub" element={<CommunicationHub />} />
          <Route path="Invoice-List" element={<InvoiceList />} />
          <Route path="Create/Invoice" element={<Invoice />} />
          <Route path="Notification" element={<Notification />} />
          <Route path="playlist" element={<PlayListAssignment />} />
          <Route path="content" element={<Content />} />
          <Route path="scheduleList" element={<ScheduleList />} />
          <Route path="toogletabs" element={<ToogleTabs />} />


          {/* Teacher Admin Panel Routes */}
          <Route path="content/mange" element={<Content_Manage />} />
          <Route path="content/add" element={<Add_Content />} />
        </Route>


        <Route path="/eduworm-school" element={<AdminPannelLayout />}>
          <Route index element={<SAHomePage />} />
          <Route path="home" element={<SAHomePage />} />
          <Route path="playlist" element={<PlayListAssignment />} />
          <Route path="content" element={<Content />} />
          <Route path="scheduleList" element={<ScheduleList />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
