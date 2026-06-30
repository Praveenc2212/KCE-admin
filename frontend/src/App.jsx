// // import { BrowserRouter } from 'react-router-dom';
// // import AppRoutes from './routes/AppRoutes';

// // import StaffForm from "./components/forms/StaffForm";
// import StudentForm from "./components/forms/StudentForm";

// function App() {
//   return (
//     // <BrowserRouter>
//     //   <AppRoutes />
//     // </BrowserRouter>
//     <StudentForm />
//     // <StaffForm />
//   );
// }

// export default App;

import { BrowserRouter, Routes, Route } from "react-router-dom";
import StudentForm from "./components/forms/StudentForm";
import StudentView from "./components/forms/StudentView";
import StaffForm from "./components/forms/StaffForm";
import StaffView from "./components/forms/StaffView";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<StudentForm />} />
        <Route path="/student-form" element={<StudentForm />} />
        <Route path="/student-view" element={<StudentView />} />
        <Route path="/staff-form" element={<StaffForm />} />
        <Route path="/staff-view" element={<StaffView />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;