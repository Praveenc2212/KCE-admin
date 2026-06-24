import React, { useState, useEffect } from 'react';
import useStudentStore from '../../store/studentStore';

const ManageStudents = () => {
  const { students, isLoading, error, fetchStudents, deleteStudent, updateStudent } = useStudentStore();
  
  const [filters, setFilters] = useState({
    rollno: '',
    department: '',
    year: '',
    section: ''
  });

  const [editMode, setEditMode] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  useEffect(() => {
    fetchStudents(filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const applyFilters = () => {
    // clean empty filters
    const cleanFilters = Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== ''));
    fetchStudents(cleanFilters);
  };

  const clearFilters = () => {
    setFilters({ rollno: '', department: '', year: '', section: '' });
    fetchStudents({});
  };

  const handleDelete = async (rollno) => {
    if (window.confirm(`Are you sure you want to delete student ${rollno}?`)) {
      await deleteStudent(rollno);
    }
  };

  const handleEditClick = (student) => {
    setEditMode(student.rollno);
    setEditFormData({
      name: student.name,
      department: student.classId?.department || '',
      year: student.classId?.year || '',
      section: student.classId?.section || '',
      studentType: student.studentType
    });
  };

  const handleEditChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (rollno) => {
    try {
      await updateStudent(rollno, editFormData);
      setEditMode(null);
    } catch (err) {
      alert("Error updating student: " + (err.message || err));
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow border border-orange-100 min-h-screen max-w-[calc(100%-250px)] ml-54 mt-10">
      <h2 className="text-3xl font-bold text-orange-600 mb-8">Manage Students</h2>
      
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8 bg-orange-50 p-4 rounded-lg border border-orange-100">
        <input 
          type="text" 
          name="rollno" 
          value={filters.rollno} 
          onChange={handleFilterChange} 
          placeholder="Roll Number" 
          className="h-11 px-4 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" 
        />
        <select name="department" value={filters.department} onChange={handleFilterChange} className="h-11 px-4 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
          <option value="">All Departments</option>
          <option>CSE</option>
          <option>IT</option>
          <option>EEE</option>
          <option>MECH</option>
          <option>CIVIL</option>
        </select>
        <select name="year" value={filters.year} onChange={handleFilterChange} className="h-11 px-4 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
          <option value="">All Years</option>
          <option>I</option>
          <option>II</option>
          <option>III</option>
          <option>IV</option>
        </select>
        <select name="section" value={filters.section} onChange={handleFilterChange} className="h-11 px-4 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
          <option value="">All Sections</option>
          <option>A</option>
          <option>B</option>
          <option>C</option>
        </select>
        <div className="flex gap-2">
          <button onClick={applyFilters} className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg flex-1 transition-colors font-semibold">Search</button>
          <button onClick={clearFilters} className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition-colors font-semibold">Clear</button>
        </div>
      </div>

      {error && <div className="text-red-500 mb-4 p-3 bg-red-50 rounded-lg border border-red-200">{error}</div>}

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
        <table className="w-full border-collapse bg-white">
          <thead className="bg-orange-100 text-orange-800">
            <tr>
              <th className="border-b p-3 text-left font-semibold">Roll No</th>
              <th className="border-b p-3 text-left font-semibold">Name</th>
              <th className="border-b p-3 text-center font-semibold">Dept</th>
              <th className="border-b p-3 text-center font-semibold">Year</th>
              <th className="border-b p-3 text-center font-semibold">Sec</th>
              <th className="border-b p-3 text-center font-semibold">Type</th>
              <th className="border-b p-3 text-center font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {isLoading ? (
              <tr><td colSpan="7" className="text-center p-8 text-gray-500">Loading students...</td></tr>
            ) : students.length === 0 ? (
              <tr><td colSpan="7" className="text-center p-8 text-gray-500">No students found matching the criteria.</td></tr>
            ) : (
              students.map((student) => (
                <tr key={student.rollno} className="hover:bg-orange-50/50 transition-colors">
                  <td className="p-3 align-middle">{student.rollno}</td>
                  
                  {editMode === student.rollno ? (
                    <>
                      <td className="p-2"><input name="name" value={editFormData.name} onChange={handleEditChange} className="h-9 border border-gray-300 px-2 rounded w-full focus:ring-2 focus:ring-orange-500 focus:outline-none" /></td>
                      <td className="p-2">
                        <select name="department" value={editFormData.department} onChange={handleEditChange} className="h-9 border border-gray-300 px-2 rounded w-full focus:ring-2 focus:ring-orange-500 focus:outline-none">
                          <option>CSE</option><option>IT</option><option>EEE</option><option>MECH</option><option>CIVIL</option>
                        </select>
                      </td>
                      <td className="p-2">
                        <select name="year" value={editFormData.year} onChange={handleEditChange} className="h-9 border border-gray-300 px-2 rounded w-full focus:ring-2 focus:ring-orange-500 focus:outline-none">
                          <option>I</option><option>II</option><option>III</option><option>IV</option>
                        </select>
                      </td>
                      <td className="p-2">
                        <select name="section" value={editFormData.section} onChange={handleEditChange} className="h-9 border border-gray-300 px-2 rounded w-full focus:ring-2 focus:ring-orange-500 focus:outline-none">
                          <option>A</option><option>B</option><option>C</option>
                        </select>
                      </td>
                      <td className="p-2">
                        <select name="studentType" value={editFormData.studentType} onChange={handleEditChange} className="h-9 border border-gray-300 px-2 rounded w-full focus:ring-2 focus:ring-orange-500 focus:outline-none">
                          <option value="HOSTELLER">HOSTELLER</option><option value="DAYSCHOLAR">DAYSCHOLAR</option>
                        </select>
                      </td>
                      <td className="p-2 text-center">
                        <div className="flex justify-center gap-2">
                          <button onClick={() => handleUpdate(student.rollno)} className="bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-md text-sm font-medium transition-colors">Save</button>
                          <button onClick={() => setEditMode(null)} className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1.5 rounded-md text-sm font-medium transition-colors">Cancel</button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="p-3 align-middle">{student.name}</td>
                      <td className="p-3 text-center align-middle">{student.classId?.department || '-'}</td>
                      <td className="p-3 text-center align-middle">{student.classId?.year || '-'}</td>
                      <td className="p-3 text-center align-middle">{student.classId?.section || '-'}</td>
                      <td className="p-3 text-center align-middle">{student.studentType}</td>
                      <td className="p-3 text-center align-middle">
                        <div className="flex justify-center gap-2">
                          <button onClick={() => handleEditClick(student)} className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1.5 rounded-md text-sm font-medium transition-colors">Edit</button>
                          <button onClick={() => handleDelete(student.rollno)} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-md text-sm font-medium transition-colors">Delete</button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageStudents;
