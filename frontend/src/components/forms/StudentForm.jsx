
import { useState } from "react";

function StudentForm() {

  const initialForm = {
    name: "",
    rollNo: "",
    gender: "",
    email: "",
    dept: "",
    year: "",
    sec: "",
    studentType: "",
  };

  const [formData, setFormData] = useState(initialForm);
  const [students, setStudents] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
    if (editIndex !== null) {
      const updated = [...students];
      updated[editIndex] = formData;
      setStudents(updated);
      setEditIndex(null);
    } else {
      setStudents([...students, formData]);
    }

    setFormData(initialForm);
  };

  const handleEdit = (index) => {
    setFormData(students[index]);
    setEditIndex(index);
  };

  const handleDelete = (index) => {
    setStudents(students.filter((_, i) => i !== index));
  };



    return (
  <div className="min-h-screen bg-[#f8f3ee] p-6">

    {/* Header */}
    <div className="max-w-7xl mx-auto mb-8">
      <h1 className="text-3xl font-bold text-[#ff6b00]">
        Student Form
      </h1>
    </div>

    {/* Form */}
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8 mb-10">
        <h2 className="text-3xl font-bold text-center text-[#ff6b00] mb-8">
          {editIndex !== null ? "Update Student" : "Add Student"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Student Name"
            className="h-11 px-4 border border-orange-200 rounded-lg"
          />

          <input
            name="rollNo"
            value={formData.rollNo}
            onChange={handleChange}
            placeholder="Roll Number"
            className="h-11 px-4 border border-orange-200 rounded-lg"
          />

          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="h-11 px-4 border border-orange-200 rounded-lg"
          >
            <option value="">Select Gender</option>
            <option>M</option>
            <option>F</option>
          </select>

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="h-11 px-4 border border-orange-200 rounded-lg"
          />

          <select
            name="dept"
            value={formData.dept}
            onChange={handleChange}
            className="h-11 px-4 border border-orange-200 rounded-lg"
          >
            <option value="">Select Department</option>
            <option>CSE</option>
            <option>IT</option>
            <option>EEE</option>
            <option>MECH</option>
            <option>CIVIL</option>
          </select>

          <select
            name="year"
            value={formData.year}
            onChange={handleChange}
            className="h-11 px-4 border border-orange-200 rounded-lg"
          >
            <option value="">Select Year</option>
            <option>I</option>
            <option>II</option>
            <option>III</option>
            <option>IV</option>
          </select>

          <select
            name="sec"
            value={formData.sec}
            onChange={handleChange}
            className="h-11 px-4 border border-orange-200 rounded-lg"
          >
            <option value="">Select Section</option>
            <option>A</option>
            <option>B</option>
            <option>C</option>
          </select>

          <select
            name="studentType"
            value={formData.studentType}
            onChange={handleChange}
            className="h-11 px-4 border border-orange-200 rounded-lg"
          >
            <option value="">Select Type</option>
            <option>Hosteller</option>
            <option>Dayscholar</option>
          </select>

        </div>

        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={handleSubmit}
            className="bg-[#ff6b00] hover:bg-orange-700 text-white px-8 py-2 rounded-lg"
          >
            {editIndex !== null ? "Update" : "Submit"}
          </button>

          <button
            onClick={() => {
              setFormData(initialForm);
              setEditIndex(null);
            }}
            className="bg-gray-500 hover:bg-gray-600 text-white px-8 py-2 rounded-lg"
          >
            Cancel
          </button>
        </div>
      </div>

    {/* Student List */}
    <div className="max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold text-[#ff6b00] mb-6">
        Student List
      </h2>

      <table className="w-full bg-white shadow-md rounded-lg overflow-hidden border border-gray-300">
        <thead className="bg-orange-200">
          <tr>
            <th className="border p-3">S.No</th>
            <th className="border p-3">Name</th>
            <th className="border p-3">Roll No</th>
            <th className="border p-3">Gender</th>
            <th className="border p-3">Email</th>
            <th className="border p-3">Dept</th>
            <th className="border p-3">Year</th>
            <th className="border p-3">Sec</th>
            <th className="border p-3">Type</th>
            <th className="border p-3">Edit</th>
            <th className="border p-3">Remove</th>
          </tr>
        </thead>

        <tbody>
          {students.map((student, index) => (
            <tr key={index}>
              <td className="border p-2 text-center">{index + 1}</td>
              <td className="border p-2">{student.name}</td>
              <td className="border p-2">{student.rollNo}</td>
              <td className="border p-2">{student.gender}</td>
              <td className="border p-2">{student.email}</td>
              <td className="border p-2">{student.dept}</td>
              <td className="border p-2">{student.year}</td>
              <td className="border p-2">{student.sec}</td>
              <td className="border p-2">{student.studentType}</td>

              <td className="border p-2 text-center">
                <button
                  onClick={() => handleEdit(index)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                >
                  Edit
                </button>
              </td>

              <td className="border p-2 text-center">
                <button
                  onClick={() => handleDelete(index)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);
}
export default StudentForm;
