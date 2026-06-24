import { useState } from "react";
import useStudentStore from "../../store/studentStore";

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
    dob: "",
  };

  const [formData, setFormData] = useState(initialForm);
  const [localStudents, setLocalStudents] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  
  const { bulkCreateStudents, isLoading, error } = useStudentStore();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddOrUpdateLocal = () => {
    if (editIndex !== null) {
      const updated = [...localStudents];
      updated[editIndex] = formData;
      setLocalStudents(updated);
      setEditIndex(null);
    } else {
      setLocalStudents([...localStudents, formData]);
    }
    setFormData(initialForm);
  };

  const handleEditLocal = (index) => {
    setFormData(localStudents[index]);
    setEditIndex(index);
  };

  const handleDeleteLocal = (index) => {
    setLocalStudents(localStudents.filter((_, i) => i !== index));
  };

  const handleSaveAllToDatabase = async () => {
    if (localStudents.length === 0) {
      alert("No students to add. Please add some students first.");
      return;
    }

    const formattedStudents = localStudents.map(student => ({
      name: student.name,
      rollno: student.rollNo,
      gender: student.gender,
      email: student.email,
      department: student.dept,
      year: student.year,
      section: student.sec,
      studentType: student.studentType,
      dateOfBirth: student.dob
    }));

    try {
      const response = await bulkCreateStudents({ students: formattedStudents });
      if (response && response.success) {
        const stats = response.data;
        if (stats.failed > 0 || stats.duplicates > 0) {
          const failReasons = stats.failedRecords.map(r => `${r.rollno || 'Unknown'}: ${r.reason}`).join("\n");
          alert(`Import complete: ${stats.inserted} added. ${stats.failed} failed. ${stats.duplicates} duplicates.\n\nReasons:\n${failReasons}\n\nPlease check console for details.`);
          console.error("Failed records:", stats.failedRecords);
          console.error("Duplicate records:", stats.duplicateRecords);
        } else {
          alert("All students added successfully!");
          setLocalStudents([]);
        }
      }
    } catch (err) {
      alert(err.message || "Failed to save students to database.");
    }
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
          {editIndex !== null ? "Edit Student in List" : "Add Student to List"}
        </h2>

        {error && <div className="text-red-500 mb-4 text-center">{error}</div>}

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
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
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
            <option value="HOSTELLER">Hosteller</option>
            <option value="DAYSCHOLAR">Day Scholar</option>
          </select>

          <input
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            placeholder="DOB (DD/MM/YYYY)"
            className="h-11 px-4 border border-orange-200 rounded-lg"
          />
        </div>

        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={handleAddOrUpdateLocal}
            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-2 rounded-lg"
          >
            {editIndex !== null ? "Update in List" : "Add to List"}
          </button>

          <button
            onClick={() => {
              setFormData(initialForm);
              setEditIndex(null);
            }}
            className="bg-red-500 hover:bg-red-600 text-white px-8 py-2 rounded-lg"
          >
            Clear Form
          </button>
        </div>
      </div>



      </div>

      

      {/* Student List */}
      <div className="flex justify-between items-center ml-54 mt-10 mb-8 max-w-[calc(100%-250px)]">
        <h2 className="text-2xl font-bold text-[#ff6b00]">Students to be Added ({localStudents.length})</h2>
        <button
          onClick={handleSaveAllToDatabase}
          disabled={isLoading || localStudents.length === 0}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-bold disabled:opacity-50"
        >
          {isLoading ? "Saving to Database..." : "Save All to Database"}
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-300 border border-gray-300 ml-54 bg-white mb-20">
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
              <th className="border p-2 w-15">DOB</th>
              <th className="border p-2 w-10">Edit</th>
              <th className="border p-2 w-10">Remove</th>
            </tr>
          </thead>

          <tbody>
            {localStudents.length === 0 ? (
              <tr>
                <td colSpan="11" className="text-center p-4 text-gray-500">
                  No students added to the list yet.
                </td>
              </tr>
            ) : (
              localStudents.map((student, index) => (
                <tr key={index}>
                  <td className="border p-2 text-center">{index + 1}</td>
                  <td className="border p-2 text-center">{student.name}</td>
                  <td className="border p-2 text-center">{student.rollNo}</td>
                  <td className="border p-2 text-center">{student.gender}</td>
                  <td className="border p-2 text-center">{student.email}</td>
                  <td className="border p-2 text-center">{student.dept}</td>
                  <td className="border p-2 text-center">{student.year}</td>
                  <td className="border p-2 text-center">{student.sec}</td>
                  <td className="border p-2 text-center">{student.studentType}</td>
                  <td className="border p-2 text-center">{student.dob}</td>

                  <td className="border p-2 text-center">
                    <button
                      onClick={() => handleEditLocal(index)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>
                  </td>

                  <td className="border p-2 text-center">
                    <button
                      onClick={() => handleDeleteLocal(index)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentForm;