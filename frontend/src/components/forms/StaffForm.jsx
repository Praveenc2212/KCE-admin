import { useState } from "react";
import useFacultyStore from "../../store/facultyStore";

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
  const [localStaffs, setLocalStaffs] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  const { bulkCreateFaculties, isLoading, error } = useFacultyStore();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddOrUpdateLocal = () => {
    if (editIndex !== null) {
      const updated = [...localStaffs];
      updated[editIndex] = formData;
      setLocalStaffs(updated);
      setEditIndex(null);
    } else {
      setLocalStaffs([...localStaffs, formData]);
    }

    setFormData(initialForm);
  };

  const handleEditLocal = (index) => {
    setFormData(localStaffs[index]);
    setEditIndex(index);
  };

  const handleDeleteLocal = (index) => {
    setLocalStaffs(localStaffs.filter((_, i) => i !== index));
  };

  const handleSaveAllToDatabase = async () => {
    if (localStaffs.length === 0) {
      alert("No staff to add. Please add some staff first.");
      return;
    }

    const formattedStaffs = localStaffs.map(staff => ({
      staffId: staff.staffid,
      name: staff.name,
      email: staff.email,
      dateOfBirth: staff.dob ? staff.dob.split('-').reverse().join('/') : '', // Format YYYY-MM-DD to DD/MM/YYYY
      department: staff.dept,
      designation: staff.des
    }));

    try {
      const response = await bulkCreateFaculties({ faculties: formattedStaffs });
      if (response && response.success) {
        const stats = response.data;
        if (stats.failed > 0 || stats.duplicates > 0) {
          const failReasons = stats.failedRecords.map(r => `${r.staffId || 'Unknown'}: ${r.reason}`).join("\n");
          alert(`Import complete: ${stats.inserted} added. ${stats.failed} failed. ${stats.duplicates} duplicates.\n\nReasons:\n${failReasons}\n\nPlease check console for details.`);
          console.error("Failed records:", stats.failedRecords);
          console.error("Duplicate records:", stats.duplicateRecords);
        } else {
          alert("All staff added successfully!");
          setLocalStaffs([]);
        }
      }
    } catch (err) {
      alert(err.message || "Failed to save staff to database.");
    }
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
            placeholder="DOB (DD/MM/YYYY)"
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
            <option value="STAFF">Staff</option>
            <option value="HOD">HOD</option>
            <option value="ADMIN">Admin</option>
            <option value="PRINCIPLE">Principal</option>
            <option value="SECURITY">Security</option>
          </select>

          

          
        </div>

        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={handleAddOrUpdateLocal}
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
      <div className="flex justify-between items-center ml-54 mt-10 mb-8 max-w-[calc(100%-250px)]">
        <h2 className="text-2xl font-bold text-[#ff6b00]">Staff to be Added ({localStaffs.length})</h2>
        <button
          onClick={handleSaveAllToDatabase}
          disabled={isLoading || localStaffs.length === 0}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-bold disabled:opacity-50"
        >
          {isLoading ? "Saving to Database..." : "Save All to Database"}
        </button>
      </div>

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
            {localStaffs.length === 0 ? (
              <tr>
                <td colSpan="9" className="text-center p-4 text-gray-500">
                  No staff added to the list yet.
                </td>
              </tr>
            ) : (
              localStaffs.map((staff, index) => (
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
                      onClick={() => handleEditLocal(index)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>
                  </td>

                  <td className="border p-2">
                    <button
                      onClick={() => handleDeleteLocal(index)}
                      className="bg-red-500 text-white px-3 py-1 rounded"
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

export default StaffForm;