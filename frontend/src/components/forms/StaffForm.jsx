import { useState } from "react";

const StaffForm = () => {
  const initialForm = {
    staffid: "",
    name: "",
    email: "",
    dob: "",
    dept: "",
    des: "",
  };

  const [formData, setFormData] = useState(initialForm);
  const [staffs, setStaffs] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
    if (editIndex !== null) {
      const updated = [...staffs];
      updated[editIndex] = formData;
      setStaffs(updated);
      setEditIndex(null);
    } else {
      setStaffs([...staffs, formData]);
    }

    setFormData(initialForm);
  };

  const handleEdit = (index) => {
    setFormData(staffs[index]);
    setEditIndex(index);
  };

  const handleDelete = (index) => {
    setStaffs(staffs.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-[#f8f3ee] p-6">
      

      {/* Form Table */}
      <div className="overflow-x-auto mt-10">
        <div className="flex justify-between items-center mb-4 mt-10">
        <h2 className="text-4xl md:text-2xl font-bold text-[#ff6b00] ml-54 ">Staff Form</h2>

      </div>

      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl mx-auto p-6 ml-84 ">
        <h2 className="text-2xl font-bold text-center text-orange-600 mb-8">
          Add Staff
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <input
            name="staffid"
            value={formData.staffid}
            onChange={handleChange}
            placeholder="Staff ID"
            className="h-11 px-4 border border-orange-200 rounded-lg"
          />

          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Staff Name"
            className="h-11 px-4 border border-orange-200 rounded-lg"
          />

          

          {/* <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="h-11 px-4 border border-orange-200 rounded-lg"
          >
            <option value="">Select Gender</option>
            <option>M</option>
            <option>F</option>
          </select> */}

          

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="h-11 px-4 border border-orange-200 rounded-lg"
          />

          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
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
            name="des"
            value={formData.des}
            onChange={handleChange}
            className="h-11 px-4 border border-orange-200 rounded-lg"
          >
            <option value="">Select Designation</option>
            <option>Staff</option>
            <option>HOD</option>
            <option>Principal</option>
            <option>Technician</option>
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

      

      {/* Staff List */}
      <h2 className="text-2xl font-bold text-[#ff6b00] mb-8 mt-10 ml-54">Staff List</h2>

      <div className="overflow-x-auto">
        <table className="w-300 border border-gray-300 ml-54">
          <thead className="bg-orange-200">
            <tr>
              <th className="border p-2 w-10 text-center">S.No</th>
              <th className="border p-2 w-25 text-center">Staff Id</th>
              <th className="border p-2 w-20 text-center">Name</th>
              <th className="border p-2 w-15 text-center">Email</th>
              <th className="border p-2 w-10 text-center">DOB</th>
              <th className="border p-2 w-10 text-center">Dept</th>
              <th className="border p-2 w-10 text-center">Des</th>
              <th className="border p-2 w-10 text-center">Edit</th>
              <th className="border p-2 w-10 text-center">Remove</th>
            </tr>
          </thead>

          <tbody>
            {staffs.map((staff, index) => (
              <tr key={index}>
                <td className="border p-2 text-center">{index + 1}</td>
                <td className="border p-2 text-center">{staff.staffid}</td>
                <td className="border p-2 text-center">{staff.name}</td>
                <td className="border p-2 text-center">{staff.email}</td>
                <td className="border p-2 text-center">{staff.dob}</td>
                <td className="border p-2 text-center">{staff.dept}</td>
                <td className="border p-2 text-center">{staff.des}</td>

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

export default StaffForm;