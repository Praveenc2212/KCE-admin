# Routes

The project uses React Router DOM for routing. 

## Structure
All authenticated admin routes are wrapped inside `AdminLayout.jsx` via `<Outlet />`. The left sidebar remains fixed, and only the right-side content area changes.

## Existing Routes
- `/` - Login Page
- `/dashboard` - Dashboard Page
- `/student/add` - Add Student
- `/student/manage` - Manage Students
- `/staff/add` - Add Staff
- `/staff/manage` - Manage Staff
- `/security/add` - Add Security
- `/security/manage` - Manage Security
- `/department` - Department Management
- `/tutor` - Tutor Mapping
- `/hod` - HOD Mapping
