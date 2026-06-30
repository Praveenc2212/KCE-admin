import { useNavigate } from "react-router-dom";

const StudentView = () => {
  
  const navigate = useNavigate();
  

  const students = [
  {
    name: "Praveen",
    rollNo: "22CS001",
    gender: "M",
    email: "praveen@gmail.com",
    dob: "2004-01-01",
    dept: "CSE",
    year: "III",
    sec: "C",
    studentType: "H",
  },
  {
    name: "Niranjan",
    rollNo: "22CS002",
    gender: "M",
    email: "niranjan@gmail.com",
    dob: "2004-02-10",
    dept: "CSE",
    year: "III",
    sec: "B",
    studentType: "D",
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
              localStorage.removeItem("editStudent");
              navigate("/student-form");
            }}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg"
          >
            Add Student
          </button>
        </div>

        {students.length === 0 ? (
          <div className="bg-white  shadow-md p-10 text-center">
            <p className="text-gray-500 text-lg">
              No Students Found
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto bg-white  shadow-md">
            <table className="w-full border border-gray-300">
              <thead className="bg-orange-200">
                <tr>
                  <th className="border p-3">S.No</th>
                  <th className="border p-3">Name</th>
                  <th className="border p-3">Roll No</th>
                  <th className="border p-3">Gender</th>
                  <th className="border p-3">Email</th>
                  <th className="border p-3">DOB</th>
                  <th className="border p-3">Department</th>
                  <th className="border p-3">Year</th>
                  <th className="border p-3">Section</th>
                  <th className="border p-3">Type</th>
                  <th className="border p-3">Edit</th>
                  <th className="border p-3">Delete</th>
                </tr>
              </thead>

              <tbody>
                {students.map((student, index) => (
                  <tr key={index}>
                    <td className="border p-2 text-center">
                      {index + 1}
                    </td>

                    <td className="border p-2">
                      {student.name}
                    </td>

                    <td className="border p-2">
                      {student.rollNo}
                    </td>

                    <td className="border p-2 text-center">
                      {student.gender}
                    </td>

                    <td className="border p-2">
                      {student.email}
                    </td>

                    <td className="border p-2 text-center">
                      {student.dob}
                    </td>

                    <td className="border p-2 text-center">
                      {student.dept}
                    </td>

                    <td className="border p-2 text-center">
                      {student.year}
                    </td>

                    <td className="border p-2 text-center">
                      {student.sec}
                    </td>

                    <td className="border p-2 text-center">
                      {student.studentType}
                    </td>

                    <td className="border p-2 text-center">
                      <button
                        onClick={() => handleEdit(student)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                      >
                        Edit
                      </button>
                    </td>

                    <td className="border p-2 text-center">
                      <button
                        onClick={() => handleDelete(student)}
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
  );
};

export default StudentView;