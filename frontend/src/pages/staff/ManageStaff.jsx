import React, { useState, useEffect } from 'react';
import useFacultyStore from '../../store/facultyStore';

const ManageStaff = () => {
  const { staffs, isLoading, error, fetchStaffs, deleteFaculty, updateFaculty } = useFacultyStore();
  
  const [filters, setFilters] = useState({
    staffId: '',
    department: '',
    designation: ''
  });

  const [editingStaffId, setEditingStaffId] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  useEffect(() => {
    fetchStaffs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const applyFilters = () => {
    const activeFilters = Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== ''));
    fetchStaffs(activeFilters);
  };

  const clearFilters = () => {
    setFilters({ staffId: '', department: '', designation: '' });
    fetchStaffs();
  };

  const handleDelete = async (staffId) => {
    if (window.confirm(`Are you sure you want to delete staff member ${staffId}?`)) {
      try {
        await deleteFaculty(staffId);
        alert("Staff deleted successfully");
      } catch (err) {
        alert("Failed to delete staff: " + (err.message || err));
      }
    }
  };

  const startEditing = (staff) => {
    setEditingStaffId(staff.staffId);
    setEditFormData({
      name: staff.name,
      email: staff.email,
      department: staff.department,
      designation: staff.designation,
      dateOfBirth: '' // Optional to update
    });
  };

  const handleEditChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  const cancelEditing = () => {
    setEditingStaffId(null);
    setEditFormData({});
  };

  const saveEdit = async (staffId) => {
    try {
      // Only send dateOfBirth if it was actually provided
      const updatePayload = { ...editFormData };
      
      // The backend API explicitly rejects "TUTOR" designation updates.
      // Since we lock the designation field for tutors anyway, we can safely omit it from the payload.
      if (updatePayload.designation === 'TUTOR') {
        delete updatePayload.designation;
      }

      if (updatePayload.dateOfBirth) {
         updatePayload.dateOfBirth = updatePayload.dateOfBirth.split('-').reverse().join('/');
      } else {
         delete updatePayload.dateOfBirth;
      }

      await updateFaculty(staffId, updatePayload);
      alert("Staff updated successfully");
      setEditingStaffId(null);
    } catch (err) {
      alert("Failed to update staff: " + (err.message || err));
    }
  };

  return (
    <div className="bg-[#f8f3ee] min-h-screen p-6 ml-54 mt-10">
      <h2 className="text-3xl font-bold text-[#ff6b00] mb-8">Manage Staff</h2>

      {/* Filters Section */}
      <div className="bg-white p-6 rounded-2xl shadow-xl mb-8">
        <h3 className="text-xl font-semibold text-orange-600 mb-4">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-1">Staff ID</label>
            <input
              name="staffId"
              value={filters.staffId}
              onChange={handleFilterChange}
              placeholder="e.g. S123"
              className="h-11 px-4 border border-orange-200 rounded-lg"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-1">Department</label>
            <select
              name="department"
              value={filters.department}
              onChange={handleFilterChange}
              className="h-11 px-4 border border-orange-200 rounded-lg"
            >
              <option value="">All</option>
              <option value="CSE">CSE</option>
              <option value="IT">IT</option>
              <option value="EEE">EEE</option>
              <option value="MECH">MECH</option>
              <option value="CIVIL">CIVIL</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-1">Designation</label>
            <select
              name="designation"
              value={filters.designation}
              onChange={handleFilterChange}
              className="h-11 px-4 border border-orange-200 rounded-lg"
            >
              <option value="">All</option>
              <option value="STAFF">Staff</option>
              <option value="HOD">HOD</option>
              <option value="ADMIN">Admin</option>
              <option value="PRINCIPLE">Principal</option>
              <option value="SECURITY">Security</option>
              <option value="TUTOR">Tutor</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button onClick={applyFilters} className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-bold h-11 w-full">Search</button>
            <button onClick={clearFilters} className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded-lg font-bold h-11 w-full">Clear</button>
          </div>
        </div>
      </div>

      {error && <div className="text-red-500 mb-4 p-4 bg-red-100 rounded-lg">{error}</div>}

      {/* Staff Table */}
      <div className="bg-white rounded-2xl shadow-xl overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-orange-200">
            <tr>
              <th className="p-4 text-left font-semibold">Staff ID</th>
              <th className="p-4 text-left font-semibold">Name</th>
              <th className="p-4 text-left font-semibold">Email</th>
              <th className="p-4 text-left font-semibold">Department</th>
              <th className="p-4 text-left font-semibold">Designation</th>
              <th className="p-4 text-left font-semibold">New DOB (Optional)</th>
              <th className="p-4 text-center font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && staffs.length === 0 ? (
              <tr><td colSpan="7" className="text-center p-8 text-gray-500">Loading staff...</td></tr>
            ) : staffs.length === 0 ? (
              <tr><td colSpan="7" className="text-center p-8 text-gray-500">No staff found.</td></tr>
            ) : (
              staffs.map((staff) => {
                const isEditing = editingStaffId === staff.staffId;
                return (
                  <tr key={staff.staffId} className="border-b hover:bg-orange-50 transition-colors">
                    <td className="p-4">{staff.staffId}</td>
                    
                    <td className="p-4">
                      {isEditing ? (
                        <input name="name" value={editFormData.name} onChange={handleEditChange} className="border px-2 py-1 w-full rounded" />
                      ) : (
                        staff.name
                      )}
                    </td>

                    <td className="p-4">
                      {isEditing ? (
                        <input name="email" value={editFormData.email} onChange={handleEditChange} className="border px-2 py-1 w-full rounded" />
                      ) : (
                        staff.email
                      )}
                    </td>

                    <td className="p-4">
                      {isEditing ? (
                        <select name="department" value={editFormData.department} onChange={handleEditChange} className="border px-2 py-1 w-full rounded">
                          <option value="CSE">CSE</option>
                          <option value="IT">IT</option>
                          <option value="EEE">EEE</option>
                          <option value="MECH">MECH</option>
                          <option value="CIVIL">CIVIL</option>
                        </select>
                      ) : (
                        staff.department
                      )}
                    </td>

                    <td className="p-4">
                      {isEditing ? (
                        <select name="designation" value={editFormData.designation} onChange={handleEditChange} className="border px-2 py-1 w-full rounded" disabled={staff.designation === 'TUTOR'}>
                          <option value="STAFF">Staff</option>
                          <option value="HOD">HOD</option>
                          <option value="ADMIN">Admin</option>
                          <option value="PRINCIPLE">Principal</option>
                          <option value="SECURITY">Security</option>
                          <option value="TUTOR">Tutor</option>
                        </select>
                      ) : (
                        <span className={`px-2 py-1 rounded text-xs font-bold ${staff.designation === 'TUTOR' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                          {staff.designation}
                        </span>
                      )}
                    </td>
                    
                    <td className="p-4">
                      {isEditing ? (
                        <input type="date" name="dateOfBirth" value={editFormData.dateOfBirth} onChange={handleEditChange} className="border px-2 py-1 w-full rounded text-sm" />
                      ) : (
                        <span className="text-gray-400 text-sm">N/A</span>
                      )}
                    </td>

                    <td className="p-4 text-center">
                      {isEditing ? (
                        <div className="flex gap-2 justify-center">
                          <button onClick={() => saveEdit(staff.staffId)} className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded shadow-sm text-sm">Save</button>
                          <button onClick={cancelEditing} className="bg-gray-400 hover:bg-gray-500 text-white px-3 py-1 rounded shadow-sm text-sm">Cancel</button>
                        </div>
                      ) : (
                        <div className="flex gap-2 justify-center">
                          <button onClick={() => startEditing(staff)} className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded shadow-sm text-sm">Edit</button>
                          <button onClick={() => handleDelete(staff.staffId)} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded shadow-sm text-sm">Delete</button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageStaff;
