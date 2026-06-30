import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";

const StudentForm = () => {
  const initialForm = {
    name: "",
    rollNo: "",
    gender: "",
    email: "",
    dob: "",
    dept: "",
    year: "",
    sec: "",
    studentType: "",
  };

  const [formData, setFormData] = useState(initialForm);
  const [students, setStudents] = useState(
  JSON.parse(localStorage.getItem("workingStudents")) || []
);
  const [editIndex, setEditIndex] = useState(null);
  const fileInputRef = useRef(null);


  const navigate = useNavigate();

  const saveStudents = (updatedStudents) => {
  setStudents(updatedStudents);

  localStorage.setItem(
    "workingStudents",
    JSON.stringify(updatedStudents)
    );
  };

  const saveFinalStudents = (updatedStudents) => {
  localStorage.setItem(
    "finalStudents",
    JSON.stringify(updatedStudents)
    );
  };

    useEffect(() => {
      const index = localStorage.getItem("editStudentIndex");

      if (index !== null) {
        const allStudents =
          JSON.parse(localStorage.getItem("workingStudents")) || [];

        if (allStudents[index]) {
          setFormData(allStudents[index]);
          setEditIndex(Number(index));
        }
      }
    }, []);


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
  let updatedStudents;

  if (editIndex !== null) {
    updatedStudents = [...students];

    updatedStudents[editIndex] = formData;

    localStorage.removeItem("editStudentIndex");

    setEditIndex(null);
  } else {
    updatedStudents = [...students, formData];
  }

  saveStudents(updatedStudents);

  setFormData(initialForm);

  };

  const handleEdit = (index) => {
  localStorage.setItem(
    "editStudentIndex",
    index
  );

  setFormData(students[index]);
  setEditIndex(index);
  };

  const handleDelete = (index) => {
  const updatedStudents = students.filter(
    (_, i) => i !== index
  );

  saveStudents(updatedStudents);
  };

  const handleAddAll = () => {
  saveFinalStudents(students);

  alert("All Students Added Successfully");
  };

  const handleExcelUpload = (e) => {
    console.log("File selected:");
  const file = e.target.files[0];

  if (!file) return;

  const reader = new FileReader();

  reader.onload = (evt) => {
    const data = evt.target.result;

    const workbook = XLSX.read(data, {
      type: "binary",
    });

    const sheetName = workbook.SheetNames[0];

    const worksheet = workbook.Sheets[sheetName];

    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    const formattedData = jsonData.map((row) => ({
      name: row.Name || "",
      rollNo: row.RollNo || "",
      gender: row.Gender || "",
      email: row.Email || "",
       dob:
    typeof row.DOB === "number"
      ? XLSX.SSF.format("dd-mm-yyyy", row.DOB)
      : row.DOB || "",
      dept: row.Dept || "",
      year: row.Year || "",
      sec: row.Sec || "",
      studentType: row.StudentType || "",
    }));

    const updatedStudents = [
  ...students,
  ...formattedData,
];

saveStudents(updatedStudents);
alert("Students imported successfully");
  };

  reader.readAsBinaryString(file);
};

  return (
    <div className="min-h-screen bg-[#f8f3ee] p-6">
      

      {/* Form Table */}
      <div className="overflow-x-auto mt-10">
        <div className="flex justify-between items-center mb-4 mt-10">
        <h2 className="text-4xl md:text-2xl font-bold text-[#ff6b00] ml-54 ">Student Form</h2>

      </div>

      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl mx-auto p-6 ml-84 ">
        <h2 className="text-2xl font-bold text-center text-orange-600 mb-8">
          Add Student
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Student Name
          </label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter Student Name"
            className="h-11 w-full px-4 border border-orange-200 rounded-lg"
          />
        </div>

          <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Roll Number
          </label>
          <input
            name="rollNo"
            value={formData.rollNo}
            onChange={handleChange}
            placeholder="Enter Roll Number"
            className="h-11 w-full px-4 border border-orange-200 rounded-lg"
          />
        </div>

          <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Gender
          </label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="h-11 w-full px-4 border border-orange-200 rounded-lg"
          >
            <option value="">Select Gender</option>
            <option>M</option>
            <option>F</option>
          </select>
        </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter Email"
              className="h-11 w-full px-4 border border-orange-200 rounded-lg"
            />
          </div>


          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date of Birth
            </label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              className="h-11 w-full px-4 border border-orange-200 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Department
            </label>
            <select
              name="dept"
              value={formData.dept}
              onChange={handleChange}
              className="h-11 w-full px-4 border border-orange-200 rounded-lg"
            >
              <option value="">Select Department</option>
              <option>CSE</option>
              <option>IT</option>
              <option>EEE</option>
              <option>MECH</option>
              <option>CIVIL</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Year
            </label>
            <select
              name="year"
              value={formData.year}
              onChange={handleChange}
              className="h-11 w-full px-4 border border-orange-200 rounded-lg"
            >
              <option value="">Select Year</option>
              <option>I</option>
              <option>II</option>
              <option>III</option>
              <option>IV</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Section
            </label>
            <select
              name="sec"
              value={formData.sec}
              onChange={handleChange}
              className="h-11 w-full px-4 border border-orange-200 rounded-lg"
            >
              <option value="">Select Section</option>
              <option>A</option>
              <option>B</option>
              <option>C</option>
            </select>
          </div>


          <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Student Type
              </label>
              <select
                name="studentType"
                value={formData.studentType}
                onChange={handleChange}
                className="h-11 w-212 px-4 border border-orange-200 rounded-lg "
              >
                <option value="">Select Student Type</option>
                <option>H</option>
                <option>D</option>
              </select>
            </div>
        </div>

        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={handleSubmit}
            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-2 rounded-lg"
          >
            {editIndex !== null ? "Update" : "Add"}
          </button>

           <button
            onClick={() => fileInputRef.current.click()}
            className="bg-green-500 hover:bg-green-600 text-white px-8 py-2 rounded-lg"
          >
            From Excel
          </button>

          <input
            type="file"
            accept=".xlsx,.xls"
            ref={fileInputRef}
            onChange={handleExcelUpload}
            className="hidden"
          />

          <button
            onClick={() => {
              setFormData(initialForm);
              setEditIndex(null);
              localStorage.removeItem("editStudentIndex");
            }}
            className="bg-red-500 hover:bg-red-600 text-white px-8 py-2 rounded-lg"
          >
            Cancel
          </button>

          <button
            onClick={() => navigate("/student-view")}
            className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-2 rounded-lg"
          >
            View Students
          </button>

        </div>
      </div>



      </div>

      

      {/* Student List */}
      {students.length > 0 && (
      <>

      <div className="flex justify-between items-center mt-10 mb-8 ml-54 mr-20">
        <h2 className="text-2xl font-bold text-[#ff6b00]">
          Student List
        </h2>

        <button
          onClick={handleAddAll}
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg"
        >
          Add All
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-300 border border-gray-300 ml-54">
          <thead className="bg-orange-200">
            <tr>
              <th className="border p-2 w-10">S.No</th>
              <th className="border p-2 w-25">Name</th>
              <th className="border p-2 w-20">Roll No</th>
              <th className="border p-2 w-15">Gender</th>
              <th className="border p-2 w-25">Email</th>
              <th className="border p-2 w-10">DOB</th>
              <th className="border p-2 w-10">Dept</th>
              <th className="border p-2 w-10">Year</th>
              <th className="border p-2 w-10">Sec</th>
              <th className="border p-2 w-10">Type</th>
              <th className="border p-2 w-10">Edit</th>
              <th className="border p-2 w-10">Remove</th>
            </tr>
          </thead>

          <tbody>
            {students.map((student, index) => (
              <tr key={index}>
                <td className="border p-2">{index + 1}</td>
                <td className="border p-2">{student.name}</td>
                <td className="border p-2">{student.rollNo}</td>
                <td className="border p-2">{student.gender}</td>
                <td className="border p-2">{student.email}</td>
                <td className="border p-2">{student.dob}</td>
                <td className="border p-2">{student.dept}</td>
                <td className="border p-2">{student.year}</td>
                <td className="border p-2">{student.sec}</td>
                <td className="border p-2">{student.studentType}</td>

                <td className="border p-2">
                  <button
                    onClick={() => handleEdit(index)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>
                </td>

                <td className="border p-2">
                  <button
                    onClick={() => handleDelete(index)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      </>
      )}
    </div>
  );
};

export default StudentForm;