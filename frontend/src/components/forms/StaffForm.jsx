import { useNavigate } from "react-router-dom";
import  { useState ,useEffect , useRef } from "react";
import * as XLSX from "xlsx";

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
  const [staffs, setStaffs] = useState(
  JSON.parse(localStorage.getItem("workingStaffs")) || []
);
  const [editIndex, setEditIndex] = useState(null);
  const fileInputRef = useRef(null);

  const navigate = useNavigate();

  const saveStaffs = (updatedStaffs) => {
  setStaffs(updatedStaffs);

  localStorage.setItem(
    "workingStaffs",
    JSON.stringify(updatedStaffs)
    );
  };

  const saveFinalStaffs = (updatedStaffs) => {
  localStorage.setItem(
    "finalStaffs",
    JSON.stringify(updatedStaffs)
    );
  };

  useEffect(() => {
        const index = localStorage.getItem("editStaffIndex");
  
        if (index !== null) {
          const allStaffs =
            JSON.parse(localStorage.getItem("workingStaffs  ")) || [];
  
          if (allStaffs[index]) {
            setFormData(allStaffs[index]);
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
  let updatedStaffs ;

  if (editIndex !== null) {
    updatedStaffs = [...staffs];

    updatedStaffs[editIndex] = formData;

    localStorage.removeItem("editStaffIndex");

    setEditIndex(null);
  } else {
    updatedStaffs = [...staffs, formData];
  }

  saveStaffs(updatedStaffs);

  setFormData(initialForm);

  };

  const handleEdit = (index) => {
  localStorage.setItem(
    "editStudentIndex",
    index
  );

  setFormData(staffs[index]);
  setEditIndex(index);
  };

  const handleDelete = (index) => {
  const updatedStaffs = staffs.filter(
    (_, i) => i !== index
  );

  saveStaffs(updatedStaffs);
  };

  const handleAddAll = () => {
  saveFinalStaffs(staffs);

  alert("All Staff Added Successfully");
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
        staffid: row["StaffId"] || row.Staffid || "",
        name: row.Name || "",
        email: row.Email || "",
         dob:
      typeof row.DOB === "number"
        ? XLSX.SSF.format("dd-mm-yyyy", row.DOB)
        : row.DOB || "",
        dept: row.Dept || "",
        des: row.Des || "",
      }));
  
      const updatedStaffs = [
    ...staffs,
    ...formattedData,
    
  ];
  
  saveStaffs(updatedStaffs);
  alert("Staff imported successfully");
    };
  
    reader.readAsBinaryString(file);
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Staff ID
            </label>
            <input
              name="staffid"
              value={formData.staffid}
              onChange={handleChange}
              placeholder="Enter Staff ID"
              className="h-11 w-full px-4 border border-orange-200 rounded-lg"
            />
          </div>

          <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Staff Name
          </label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter Staff Name"
            className="h-11 w-full px-4 border border-orange-200 rounded-lg"
          />
        </div>
          

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
              Designation
            </label>
            <select
              name="des"
              value={formData.des}
              onChange={handleChange}
              className="h-11 w-full px-4 border border-orange-200 rounded-lg"
            >
              <option value="">Select Designation</option>
              <option>Staff</option>
              <option>HOD</option>
              <option>Principal</option>
              <option>Technician</option>
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
            onClick={() => setFormData(initialForm)}
            className="bg-red-500 hover:bg-red-600 text-white px-8 py-2 rounded-lg"
          >
            Cancel
          </button>

          <button
            onClick={() => navigate("/staff-view")}
            className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-2 rounded-lg"
          >
            View Staff
          </button>

        </div>
      </div>



      </div>

      
      {staffs.length > 0 && (
      <>
      {/* Staff List */}
      <div className="flex justify-between items-center mt-10 mb-8 ml-54 mr-20">
        <h2 className="text-2xl font-bold text-[#ff6b00]">
          Staff List
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
      </>
      )}

    </div>
  );
};

export default StaffForm;