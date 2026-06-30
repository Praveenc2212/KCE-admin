import { useNavigate } from "react-router-dom";

export default function StaffView() {
    
  const navigate = useNavigate();

  const students = [
  {
    staffid: "22CS001",
    name: "Vignesh",
    email: "vignesh@gmail.com",
    dob: "1978-01-01",
    dept: "CSE",
    des: "Staff",
  },
  {
    staffid: "22CS002",
    name: "Murugavel",
    email: "murugavel@gmail.com",
    dob: "1967-01-01",
    dept: "EEE",
    des: "HOD",
  },
  ];


  const handleDelete = (student) => {
  const confirmDelete = window.confirm(
    `Delete ${student.name}?`
  );

  if (confirmDelete) {
    alert("Delete will be implemented after DB integration");
  }
  };

  const handleEdit = (student) => {
  localStorage.setItem(
    "editStudent",
    JSON.stringify(student)
  );

  navigate("/student-form");
  };


  return (
    <div className="min-h-screen bg-[#f8f3ee] p-6">
      <div className="max-w-7xl mx-auto ml-60 mt-40">

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-[#ff6b00]">
            Student List
          </h1>

          <button
            onClick={() => {
              localStorage.removeItem("editStaff");
              navigate("/staff-form");
            }}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg"
          >
            Add Staff
          </button>
        </div>

        {students.length === 0 ? (
          <div className="bg-white  shadow-md p-10 text-center">
            <p className="text-gray-500 text-lg">
              No Staff Found
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto bg-white  shadow-md">
            <table className="w-full border border-gray-300">
              <thead className="bg-orange-200">
                <tr>
                  <th className="border p-3">S.No</th>
                  <th className="border p-3">ID</th>
                  <th className="border p-3">Name</th>
                  <th className="border p-3">Email</th>
                  <th className="border p-3">DOB</th>
                  <th className="border p-3">Department</th>
                  <th className="border p-3">Designation</th>
                  <th className="border p-3">Edit</th>
                  <th className="border p-3">Delete</th>
                </tr>
              </thead>

              <tbody>
                {students.map((staff, index) => (
                  <tr key={index}>
                    <td className="border p-2 text-center">
                      {index + 1}
                    </td>

                    <td className="border p-2">
                      {staff.staffid}
                    </td>

                    <td className="border p-2">
                      {staff.name}
                    </td>

                    <td className="border p-2">
                      {staff.email}
                    </td>

                    <td className="border p-2 text-center">
                      {staff.dob}
                    </td>

                    <td className="border p-2 text-center">
                      {staff.dept}
                    </td>

                    <td className="border p-2 text-center">
                      {staff.des}
                    </td>

                    

                    <td className="border p-2 text-center">
                      <button
                        onClick={() => handleEdit(staff)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                      >
                        Edit
                      </button>
                    </td>

                    <td className="border p-2 text-center">
                      <button
                        onClick={() => handleDelete(staff)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        )}
      </div>
    </div>
  )
}
