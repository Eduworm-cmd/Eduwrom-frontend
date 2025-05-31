import { BrowserRouter, Route, Routes } from "react-router-dom";
import { TeacherHomePage } from "./pages/Teacheradmin/TeacherHomePage/TeacherHomePage";
import { Layout } from "./layout/Layout";
import { MainLayout } from "./layout/MainLayout";
import { CourseView } from "./pages/Teacheradmin/CourseView/CourseView";
import UnitSummary from "./components/UnitSummary/UnitSummary";
import { AdminPannelLayout } from "./layout/AdminPannelLayout";
import { SAHomePage } from "./pages/super-admin-pannel/SAHomePage/SAHomePage";
import { BookHomePage } from "./pages/Teacheradmin/Book/BookHomePage/BookHomePage";
import { Add_Content } from "./pages/ContentAdmin/Add_Content";
import { Content_Manage } from "./pages/ContentAdmin/Content_Manage";
import { Curriculum } from "./pages/Curriculum/Curriculum";
import { CommunicationHub } from "./pages/Notification Schedules/CommunicationHub";
import { InvoiceList } from "./pages/super-admin-pannel/Biiling/Invoice/InvoiceList";
import { Invoice } from "./pages/super-admin-pannel/Biiling/Invoice/Invoice";
import { Notification } from "./pages/Notification Schedules/Notification";
import { SALSHome } from "./pages/super-admin-pannel/SALicenseSubscription/SALSHome/SALSHome";
import { Lms } from "./pages/super-admin-pannel/LMS/Lms";
import { Login_SignUp } from "./auth/Login_SignUp";
import Content from "./pages/Teacheradmin/InteractiveContent/Content";
import ScheduleList from "./pages/Teacheradmin/InteractiveContent/ScheduleList";
import { SP_ScheduleList } from "./pages/super-admin-pannel/ScheduleList/SP_ScheduleList";
import { School_Teacher_Login } from "./auth/School_Teacher_Login";
import PageNotFound from "./components/PageNotFound/PageNotFound";
import { PlayListAssignment } from "./pages/Teacheradmin/InteractiveContent/PlayListAssignment";
import { StudentList } from "./pages/super-admin-pannel/Student/StudentList";
import { AddStudent } from "./pages/super-admin-pannel/Student/AddStudent";
import { StaffList } from "./pages/super-admin-pannel/Staff/StaffList";
import { AcademicList } from "./pages/super-admin-pannel/AcademicYear/AcademicList";
import { CreateStaff } from "./pages/super-admin-pannel/Staff/CreateStaff";
import { BranchList } from "./pages/super-admin-pannel/Branch/BranchList";
import { AddBranch } from "./pages/super-admin-pannel/Branch/AddBranch";
import { BranchView } from "./pages/super-admin-pannel/Branch/BranchView";
import { SchoolList } from "./pages/super-admin-pannel/School/SchoolList";
import { AddSchool } from "./pages/super-admin-pannel/School/AddSchool";
import { SchoolView } from "./pages/super-admin-pannel/School/SchoolView";
import { ClassList } from "./pages/super-admin-pannel/ClassList/ClassList";
import { SA_StaffList } from "./pages/ShoolAdmin/SA_Staff/SA_StaffList";
import { SA_AddStaff } from "./pages/ShoolAdmin/SA_Staff/SA_AddStaff";
import { SA_Add_Student } from "./pages/ShoolAdmin/SA_Stundent/SA_Add_Student";
import { StudentView } from "./pages/super-admin-pannel/Student/StudentView";
import { SA_StundentList } from "./pages/ShoolAdmin/SA_Stundent/SA_StundentList";
import { SA_StaffView } from "./pages/ShoolAdmin/SA_Staff/SA_StaffView";
import { All_View_StaffList } from "./pages/super-admin-pannel/Staff/AllStaff/All_View_StaffList";
import { All_Add_StaffList } from "./pages/super-admin-pannel/Staff/AllStaff/All_Add_StaffList";
import { StaffByBranch } from "./pages/super-admin-pannel/Staff/StaffByBranch/StaffByBranch";
import CreateUnit from "./pages/ContentAdmin/CreateUnit";
import SubjectCreate from "./pages/ContentCreateForBook/SubjectCreate";
import SubjectPageCreate from "./pages/ContentCreateForBook/SubjectPageCreate";
import BookPages from "./pages/Teacheradmin/Book/BookHomePage/BookPages/BookPages";
import BookPgContentOverView from "./pages/Teacheradmin/Book/BookHomePage/BookPageContentOverView/BookPgContentOverView";
import SubjectPageCreateContent from "./pages/ContentCreateForBook/SubjectPageCreateContent";
import BookContentPreview from "./pages/Teacheradmin/Book/BookPreview/BookContentPreview";
import SubjectPageContentEdit from "./pages/ContentCreateForBook/SubjectPageContentEdit";
import { DaysView } from "./pages/Teacheradmin/DaysView/DaysView";
import { StaffView } from "./pages/super-admin-pannel/Staff/StaffView.";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Routes */}
              <Route path="/SPlogin" element={<Login_SignUp />} />
        <Route path="/login" element={<School_Teacher_Login />} />
        <Route path="/" element={<School_Teacher_Login/>} />        
        <Route path="*" element={<PageNotFound />} />

        {/* Teacher Routes with Layout */}
        <Route path="/eduworm-teacher" element={<Layout />}>
          <Route index element={<TeacherHomePage />} />
          <Route path="books" element={<BookHomePage />} />
          <Route path="book/pages/:id" element={<BookPages />} />
          <Route path="book/pgcontent/:id" element={<BookPgContentOverView />} />
        </Route>

        {/* MainLayout Routes */}
        <Route element={<MainLayout />}>
          <Route path="days/:id" element={<DaysView />} />
          <Route path="view/:id" element={<CourseView />} />
          <Route path="unit" element={<UnitSummary />} />
          <Route path="book/preview/:id" element={<BookContentPreview />} />
        </Route>

        {/* Super Admin Panel */}
        <Route path="/eduworm-admin" element={<AdminPannelLayout />}>
          <Route index element={<SAHomePage />} />
          <Route path="home" element={<SAHomePage />} />
          <Route path="admin" element={<SALSHome />} />

          {/* School Branch */}
          <Route path="schoolbranch/list" element={<BranchList />} />
          <Route path="schoolbranch/add" element={<AddBranch />} />
          <Route path="schoolbranch/view/:id" element={<BranchView />} />
          <Route path="schoolbranch/edit/:id" element={<AddBranch />} />

          {/* School */}
          <Route path="school/list" element={<SchoolList />} />
          <Route path="school/add" element={<AddSchool />} />
          <Route path="school/edit/:id" element={<AddSchool />} />
          <Route path="school/view/:id" element={<SchoolView />} />

          {/* Staff */}
          <Route path="staff" element={<StaffList />} />
          <Route path="staff/add" element={<CreateStaff />} />
          <Route path="staff/view/:id" element={<StaffView />} />
          <Route path="staff/edit/:id" element={<CreateStaff />} />

          {/* Staff by branch */}
          <Route path="branchstaff/list/:id" element={<StaffByBranch />} />

          {/* All Staff */}
          <Route path="allstaff/list" element={<All_View_StaffList />} />
          <Route path="allstaff/add" element={<All_Add_StaffList />} />
          <Route path="allstaff/edit/:id" element={<All_Add_StaffList />} />

          {/* Other resources */}
          <Route path="academic-year" element={<AcademicList />} />
          <Route path="class" element={<ClassList />} />
          <Route path="students/list/:id" element={<StudentList />} />
          <Route path="students/add" element={<AddStudent />} />
          <Route path="students/edit/:id" element={<AddStudent />} />
          <Route path="students/view/:id" element={<StudentView />} />

          <Route path="schedule/list" element={<SP_ScheduleList />} />
          <Route path="lms" element={<Lms />} />
          <Route path="curriculum" element={<Curriculum />} />
          <Route path="communication-hub" element={<CommunicationHub />} />
          <Route path="invoice-list" element={<InvoiceList />} />
          <Route path="create/invoice" element={<Invoice />} />
          <Route path="notification" element={<Notification />} />
          <Route path="playlist" element={<PlayListAssignment />} />
          <Route path="content" element={<Content />} />
          <Route path="schedule-list" element={<ScheduleList />} />
        </Route>

        {/* Content Admin Panel */}
        <Route path="/eduworm-content" element={<AdminPannelLayout />}>
          <Route path="content/manage" element={<Content_Manage />} />
          <Route path="content/add" element={<Add_Content />} />
          <Route path="unit/add" element={<CreateUnit />} />
          <Route path="subject/add" element={<SubjectCreate />} />
          <Route path="subjectpage/add/:id" element={<SubjectPageCreate />} />
          <Route path="subjectpage/add/content/:id" element={<SubjectPageCreateContent />} />
          <Route path="subjectpage/edit/content/:id" element={<SubjectPageContentEdit />} />
        </Route>

        {/* School Admin Panel */}
        <Route path="/eduworm-school" element={<AdminPannelLayout />}>
          <Route index element={<SAHomePage />} />

          <Route path="staff/list" element={<SA_StaffList />} />
          <Route path="staff/add" element={<SA_AddStaff />} />
          <Route path="staff/edit/:id" element={<SA_AddStaff />} />
          <Route path="staff/view/:id" element={<SA_StaffView />} />

          <Route path="student/list" element={<SA_StundentList />} />
          <Route path="student/add" element={<SA_Add_Student />} />
          <Route path="student/edit/:id" element={<SA_Add_Student />} />
          <Route path="student/view/:id" element={<StudentView />} />

          <Route path="home" element={<SAHomePage />} />
          <Route path="playlist" element={<PlayListAssignment />} />
          <Route path="content" element={<Content />} />
          <Route path="schedule-list" element={<ScheduleList />} />
        </Route>

        {/* 404 catch-all route */}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
