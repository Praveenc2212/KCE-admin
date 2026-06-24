import React, { useState, useEffect } from 'react';
import useClassStore from '../../store/classStore';
import useFacultyStore from '../../store/facultyStore';

const CreateClass = () => {
  const { classes, isLoading: classLoading, error: classError, fetchClasses, createClass, updateClassTutor, deleteClass } = useClassStore();
  const { staffs, fetchStaffs } = useFacultyStore();

  const [formData, setFormData] = useState({
    department: '',
    year: '',
    section: '',
    staffId: ''
  });

  const [editMode, setEditMode] = useState(null); // stores 'dept-year-sec'
  const [newTutorId, setNewTutorId] = useState('');

  useEffect(() => {
    fetchClasses();
    // Fetch only STAFF designated faculty as per backend rules
    fetchStaffs({ designation: 'STAFF' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!formData.department || !formData.year || !formData.section || !formData.staffId) {
      alert("Please fill all fields to create a class.");
      return;
    }
    try {
      await createClass(formData);
      alert("Class created successfully!");
      setFormData({ department: '', year: '', section: '', staffId: '' });
      // Refresh staff list because the selected staff is now a TUTOR
      fetchStaffs({ designation: 'STAFF' });
    } catch (err) {
      alert("Failed to create class: " + (err.message || err));
    }
  };

  const handleDelete = async (cls) => {
    if (window.confirm(`Are you sure you want to delete Class ${cls.department} ${cls.year} ${cls.section}?`)) {
      try {
        await deleteClass({ department: cls.department, year: cls.year, section: cls.section });
        alert("Class deleted successfully.");
        // Refresh staff list since the tutor became STAFF again
        fetchStaffs({ designation: 'STAFF' });
      } catch (err) {
        alert("Failed to delete class: " + (err.message || err));
      }
    }
  };

  const handleEditClick = (cls) => {
    setEditMode(`${cls.department}-${cls.year}-${cls.section}`);
    setNewTutorId(''); // Reset new tutor selection
  };

  const handleUpdateTutor = async (cls) => {
    if (!newTutorId) {
      alert("Please select a new tutor to reassign.");
      return;
    }
    try {
      await updateClassTutor({
        department: cls.department,
        year: cls.year,
        section: cls.section,
        newStaffId: newTutorId
      });
      alert("Tutor reassigned successfully!");
      setEditMode(null);
      // Refresh staff list
      fetchStaffs({ designation: 'STAFF' });
    } catch (err) {
      alert("Failed to reassign tutor: " + (err.message || err));
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow border border-orange-100 min-h-screen max-w-[calc(100%-250px)] ml-54 mt-10">
      <h2 className="text-3xl font-bold text-orange-600 mb-8">Manage Classes</h2>
      
      {/* Create Class Form */}
      <div className="mb-10 bg-orange-50 p-6 rounded-xl border border-orange-100">
        <h3 className="text-xl font-semibold text-orange-800 mb-4">Create New Class</h3>
        <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Department</label>
            <select name="department" value={formData.department} onChange={handleChange} className="h-11 px-4 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
              <option value="">Select Dept</option>
              <option value="CSE">CSE</option>
              <option value="IT">IT</option>
              <option value="EEE">EEE</option>
              <option value="MECH">MECH</option>
              <option value="CIVIL">CIVIL</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Year</label>
            <select name="year" value={formData.year} onChange={handleChange} className="h-11 px-4 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
              <option value="">Select Year</option>
              <option value="I">I</option>
              <option value="II">II</option>
              <option value="III">III</option>
              <option value="IV">IV</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Section</label>
            <select name="section" value={formData.section} onChange={handleChange} className="h-11 px-4 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
              <option value="">Select Sec</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Assign Tutor</label>
            <select name="staffId" value={formData.staffId} onChange={handleChange} className="h-11 px-4 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
              <option value="">Select Available Staff</option>
              {staffs.map(staff => (
                <option key={staff.staffId} value={staff.staffId}>
                  {staff.name} ({staff.staffId})
                </option>
              ))}
            </select>
          </div>

          <button type="submit" disabled={classLoading} className="h-11 bg-orange-600 hover:bg-orange-700 text-white px-6 rounded-lg font-bold transition-colors disabled:opacity-50 shadow-sm">
            {classLoading ? 'Creating...' : 'Create Class'}
          </button>
        </form>
        {staffs.length === 0 && !classLoading && (
          <p className="text-xs text-red-500 mt-2">No STAFF designated faculty available. You must add Staff before creating a class.</p>
        )}
      </div>

      {classError && <div className="text-red-500 mb-4 p-3 bg-red-50 rounded-lg border border-red-200">{classError}</div>}

      {/* Existing Classes Table */}
      <h3 className="text-xl font-semibold text-orange-800 mb-4">Existing Classes</h3>
      <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
        <table className="w-full border-collapse bg-white">
          <thead className="bg-orange-100 text-orange-800">
            <tr>
              <th className="border-b p-3 text-center font-semibold">Department</th>
              <th className="border-b p-3 text-center font-semibold">Year</th>
              <th className="border-b p-3 text-center font-semibold">Section</th>
              <th className="border-b p-3 text-center font-semibold">Current Tutor</th>
              <th className="border-b p-3 text-center font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {classLoading && classes.length === 0 ? (
              <tr><td colSpan="5" className="text-center p-8 text-gray-500">Loading classes...</td></tr>
            ) : classes.length === 0 ? (
              <tr><td colSpan="5" className="text-center p-8 text-gray-500">No classes created yet.</td></tr>
            ) : (
              classes.map((cls) => {
                const classKey = `${cls.department}-${cls.year}-${cls.section}`;
                const isEditing = editMode === classKey;
                // Currently only one tutor per class based on backend rules for create/update
                const currentTutor = cls.tutors?.[0]; 

                return (
                  <tr key={classKey} className="hover:bg-orange-50/50 transition-colors">
                    <td className="p-4 text-center align-middle font-medium text-gray-800">{cls.department}</td>
                    <td className="p-4 text-center align-middle font-medium text-gray-800">{cls.year}</td>
                    <td className="p-4 text-center align-middle font-medium text-gray-800">{cls.section}</td>
                    
                    <td className="p-4 text-center align-middle">
                      {isEditing ? (
                        <div className="flex flex-col items-center gap-2">
                          <select 
                            value={newTutorId} 
                            onChange={(e) => setNewTutorId(e.target.value)} 
                            className="h-9 border border-orange-300 px-3 rounded-lg w-full max-w-xs focus:ring-2 focus:ring-orange-500 focus:outline-none"
                          >
                            <option value="">Select New Tutor...</option>
                            {staffs.map(staff => (
                              <option key={staff.staffId} value={staff.staffId}>
                                {staff.name} ({staff.staffId})
                              </option>
                            ))}
                          </select>
                        </div>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                          {currentTutor ? `${currentTutor.name} (${currentTutor.staffId})` : 'Unassigned'}
                        </span>
                      )}
                    </td>

                    <td className="p-4 text-center align-middle">
                      {isEditing ? (
                        <div className="flex justify-center gap-2">
                          <button onClick={() => handleUpdateTutor(cls)} className="bg-green-500 hover:bg-green-600 text-white px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors shadow-sm">Save</button>
                          <button onClick={() => setEditMode(null)} className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors shadow-sm">Cancel</button>
                        </div>
                      ) : (
                        <div className="flex justify-center gap-2">
                          <button onClick={() => handleEditClick(cls)} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors shadow-sm">Reassign Tutor</button>
                          <button onClick={() => handleDelete(cls)} className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors shadow-sm">Delete</button>
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

export default CreateClass;
