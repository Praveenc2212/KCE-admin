import { useState } from "react";

const StudentForm = () => {
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
            <option value="" >Select Student Type</option>
            <option>H</option>
            <option>D</option>
          </select>
        </div>

        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={handleSubmit}
            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-2 rounded-lg"
          >
            {editIndex !== null ? "Update" : "Add"}
          </button>

          <button
            onClick={() => setFormData(initialForm)}
            className="bg-red-500 hover:bg-red-600 text-white px-8 py-2 rounded-lg"
          >
            Cancel
          </button>
        </div>
      </div>



      </div>

      

      {/* Student List */}
      <h2 className="text-2xl font-bold text-[#ff6b00] mb-8 mt-10 ml-54">Student List</h2>

      <div className="overflow-x-auto">
        <table className="w-300 border border-gray-300 ml-54">
          <thead className="bg-orange-200">
            <tr>
              <th className="border p-2 w-10">S.No</th>
              <th className="border p-2 w-25">Name</th>
              <th className="border p-2 w-20">Roll No</th>
              <th className="border p-2 w-15">Gender</th>
              <th className="border p-2 w-25">Email</th>
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
    </div>
  );
};

export default StudentForm;