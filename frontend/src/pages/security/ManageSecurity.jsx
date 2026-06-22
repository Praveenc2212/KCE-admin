import React, { useState, useEffect, useMemo } from 'react';
import useFacultyStore from '../../store/facultyStore';

const ManageSecurity = () => {
  const { staffs, isLoading, error, fetchStaffs, bulkCreateFaculties, updateFaculty, deleteFaculty } = useFacultyStore();

  const [formData, setFormData] = useState({
    staffId: '',
    name: '',
    email: '',
    dateOfBirth: '',
    department: 'SECURITY', // Defaulting department to SECURITY for clarity
    designation: 'SECURITY'
  });

  const [editingStaffId, setEditingStaffId] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  useEffect(() => {
    fetchStaffs({ designation: 'SECURITY' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filter only security staffs (in case backend filter drops or we want to be strictly safe)
  const securityStaffs = useMemo(() => staffs.filter(s => s.designation === 'SECURITY'), [staffs]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!formData.staffId || !formData.name || !formData.email || !formData.dateOfBirth) {
      alert("Please fill all required fields to add a security member.");
      return;
    }

    const newSecurity = {
      ...formData,
      dateOfBirth: formData.dateOfBirth.split('-').reverse().join('/') // Format YYYY-MM-DD to DD/MM/YYYY
    };

    try {
      const response = await bulkCreateFaculties({ faculties: [newSecurity] });
      if (response && response.success) {
        const stats = response.data;
        if (stats.failed > 0 || stats.duplicates > 0) {
          const failReasons = stats.failedRecords.map(r => `${r.staffId}: ${r.reason}`).join("\n");
          alert(`Creation failed.\n\nReasons:\n${failReasons}`);
        } else {
          alert("Security member added successfully!");
          setFormData({ staffId: '', name: '', email: '', dateOfBirth: '', department: 'SECURITY', designation: 'SECURITY' });
          fetchStaffs({ designation: 'SECURITY' }); // Refresh list
        }
      }
    } catch (err) {
      alert("Failed to add security: " + (err.message || err));
    }
  };

  const handleDelete = async (staffId) => {
    if (window.confirm(`Are you sure you want to delete security member ${staffId}?`)) {
      try {
        await deleteFaculty(staffId);
        alert("Security member deleted successfully.");
      } catch (err) {
        alert("Failed to delete: " + (err.message || err));
      }
    }
  };

  const startEditing = (staff) => {
    setEditingStaffId(staff.staffId);
    setEditFormData({
      name: staff.name,
      email: staff.email,
      dateOfBirth: ''
    });
  };

  const handleEditChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  const saveEdit = async (staffId) => {
    try {
      const updatePayload = { ...editFormData };
      if (updatePayload.dateOfBirth) {
         updatePayload.dateOfBirth = updatePayload.dateOfBirth.split('-').reverse().join('/');
      } else {
         delete updatePayload.dateOfBirth;
      }

      await updateFaculty(staffId, updatePayload);
      alert("Security member updated successfully");
      setEditingStaffId(null);
    } catch (err) {
      alert("Failed to update: " + (err.message || err));
    }
  };

  return (
    <div className="bg-[#f8f3ee] min-h-screen p-6 ml-54 mt-10">
      <h2 className="text-3xl font-bold text-[#ff6b00] mb-8">Security Management</h2>

      {error && <div className="text-red-500 mb-4 p-4 bg-red-100 rounded-lg shadow-sm border border-red-200">{error}</div>}

      {/* Add Security Form */}
      <div className="bg-white p-6 rounded-2xl shadow-xl mb-8 border border-orange-100">
        <h3 className="text-xl font-semibold text-orange-600 mb-4">Add New Security Personnel</h3>
        <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-1 font-medium">Staff ID</label>
            <input name="staffId" value={formData.staffId} onChange={handleChange} placeholder="e.g. SEC001" className="h-11 px-4 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none" />
          </div>
          <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-1 font-medium">Name</label>
            <input name="name" value={formData.name} onChange={handleChange} placeholder="Full Name" className="h-11 px-4 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none" />
          </div>
          <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-1 font-medium">Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" className="h-11 px-4 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none" />
          </div>
          <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-1 font-medium">Date of Birth</label>
            <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} className="h-11 px-4 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none" />
          </div>
          <button type="submit" disabled={isLoading} className="h-11 bg-orange-600 hover:bg-orange-700 text-white px-6 rounded-lg font-bold shadow-sm transition-colors disabled:opacity-50">
            {isLoading ? 'Adding...' : 'Add Security'}
          </button>
        </form>
      </div>

      {/* Security List Table */}
      <div className="bg-white rounded-2xl shadow-xl overflow-x-auto border border-orange-100">
        <table className="w-full border-collapse">
          <thead className="bg-orange-100 text-orange-800">
            <tr>
              <th className="p-4 text-left font-semibold border-b">Staff ID</th>
              <th className="p-4 text-left font-semibold border-b">Name</th>
              <th className="p-4 text-left font-semibold border-b">Email</th>
              <th className="p-4 text-left font-semibold border-b">New DOB (Optional)</th>
              <th className="p-4 text-center font-semibold border-b w-48">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {isLoading && securityStaffs.length === 0 ? (
              <tr><td colSpan="5" className="p-8 text-center text-gray-500">Loading security personnel...</td></tr>
            ) : securityStaffs.length === 0 ? (
              <tr><td colSpan="5" className="p-8 text-center text-gray-500">No security personnel found.</td></tr>
            ) : (
              securityStaffs.map(staff => {
                const isEditing = editingStaffId === staff.staffId;
                return (
                  <tr key={staff.staffId} className="hover:bg-orange-50 transition-colors">
                    <td className="p-4 font-medium text-gray-800">{staff.staffId}</td>
                    
                    <td className="p-4">
                      {isEditing ? (
                        <input name="name" value={editFormData.name} onChange={handleEditChange} className="border border-orange-300 px-3 py-1.5 w-full rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none" />
                      ) : (
                        <span className="text-gray-800">{staff.name}</span>
                      )}
                    </td>

                    <td className="p-4">
                      {isEditing ? (
                        <input name="email" value={editFormData.email} onChange={handleEditChange} className="border border-orange-300 px-3 py-1.5 w-full rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none" />
                      ) : (
                        <span className="text-gray-600">{staff.email}</span>
                      )}
                    </td>

                    <td className="p-4">
                      {isEditing ? (
                        <input type="date" name="dateOfBirth" value={editFormData.dateOfBirth} onChange={handleEditChange} className="border border-orange-300 px-3 py-1.5 w-full rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none text-sm" />
                      ) : (
                        <span className="text-gray-400 text-sm">N/A</span>
                      )}
                    </td>

                    <td className="p-4 text-center">
                      {isEditing ? (
                        <div className="flex gap-2 justify-center">
                          <button onClick={() => saveEdit(staff.staffId)} className="bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-lg font-bold text-sm shadow-sm">Save</button>
                          <button onClick={() => setEditingStaffId(null)} className="bg-gray-400 hover:bg-gray-500 text-white px-3 py-1.5 rounded-lg font-bold text-sm shadow-sm">Cancel</button>
                        </div>
                      ) : (
                        <div className="flex gap-2 justify-center">
                          <button onClick={() => startEditing(staff)} className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg font-bold text-sm shadow-sm">Edit</button>
                          <button onClick={() => handleDelete(staff.staffId)} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg font-bold text-sm shadow-sm">Remove</button>
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

export default ManageSecurity;
