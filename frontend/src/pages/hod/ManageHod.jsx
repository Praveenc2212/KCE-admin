import React, { useState, useEffect, useMemo } from 'react';
import useFacultyStore from '../../store/facultyStore';

const DEPARTMENTS = ['CSE', 'IT', 'EEE', 'MECH', 'CIVIL'];

const ManageHod = () => {
  const { staffs, isLoading, fetchStaffs, updateFaculty } = useFacultyStore();
  const [editingDept, setEditingDept] = useState(null);
  const [newHodId, setNewHodId] = useState('');

  useEffect(() => {
    fetchStaffs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Map departments to their current HOD and available STAFF candidates
  const departmentData = useMemo(() => {
    const data = {};
    DEPARTMENTS.forEach(dept => {
      data[dept] = {
        currentHod: staffs.find(s => s.department === dept && s.designation === 'HOD'),
        candidates: staffs.filter(s => s.department === dept && (s.designation === 'STAFF' || s.designation === 'HOD'))
      };
    });
    return data;
  }, [staffs]);

  const handleEditClick = (dept) => {
    setEditingDept(dept);
    const currentHod = departmentData[dept].currentHod;
    setNewHodId(currentHod ? currentHod.staffId : '');
  };

  const handleSave = async (dept) => {
    const currentHod = departmentData[dept].currentHod;
    
    // If no change
    if (currentHod && currentHod.staffId === newHodId) {
      setEditingDept(null);
      return;
    }

    try {
      // 1. If there's an existing HOD, demote them to STAFF
      if (currentHod) {
        await updateFaculty(currentHod.staffId, { designation: 'STAFF' });
      }

      // 2. If a new HOD is selected, promote them
      if (newHodId) {
        await updateFaculty(newHodId, { designation: 'HOD' });
      }

      alert("HOD reassigned successfully!");
      setEditingDept(null);
      fetchStaffs(); // Refresh to ensure sync
    } catch (err) {
      alert("Failed to assign HOD: " + (err.message || err));
    }
  };

  return (
    <div className="bg-[#f8f3ee] min-h-screen p-6 ml-54 mt-10">
      <h2 className="text-3xl font-bold text-[#ff6b00] mb-8">Head of Department (HOD) Mapping</h2>

      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-5xl">
        <p className="text-gray-600 mb-6">
          Assign a Head of Department for each academic branch. Only faculty members with the "STAFF" designation inside that department are eligible candidates.
        </p>

        <div className="overflow-x-auto border border-gray-200 rounded-xl">
          <table className="w-full border-collapse">
            <thead className="bg-orange-100 text-orange-800">
              <tr>
                <th className="p-4 text-left font-semibold border-b">Department</th>
                <th className="p-4 text-left font-semibold border-b">Current HOD</th>
                <th className="p-4 text-center font-semibold border-b w-48">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {isLoading && staffs.length === 0 ? (
                <tr><td colSpan="3" className="p-8 text-center text-gray-500">Loading faculty data...</td></tr>
              ) : (
                DEPARTMENTS.map(dept => {
                  const { currentHod, candidates } = departmentData[dept];
                  const isEditing = editingDept === dept;

                  return (
                    <tr key={dept} className="hover:bg-orange-50 transition-colors">
                      <td className="p-4 font-bold text-gray-800">{dept}</td>
                      <td className="p-4">
                        {isEditing ? (
                          <select 
                            value={newHodId} 
                            onChange={(e) => setNewHodId(e.target.value)}
                            className="w-full max-w-md h-10 px-3 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none"
                          >
                            <option value="">-- No HOD Assigned --</option>
                            {candidates.map(c => (
                              <option key={c.staffId} value={c.staffId}>
                                {c.name} ({c.staffId})
                              </option>
                            ))}
                          </select>
                        ) : (
                          currentHod ? (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 shadow-sm border border-purple-200">
                              {currentHod.name} ({currentHod.staffId})
                            </span>
                          ) : (
                            <span className="text-gray-400 italic text-sm">Unassigned</span>
                          )
                        )}
                      </td>
                      <td className="p-4 text-center">
                        {isEditing ? (
                          <div className="flex gap-2 justify-center">
                            <button onClick={() => handleSave(dept)} className="bg-green-500 hover:bg-green-600 text-white px-4 py-1.5 rounded-lg text-sm font-bold shadow-sm">Save</button>
                            <button onClick={() => setEditingDept(null)} className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-1.5 rounded-lg text-sm font-bold shadow-sm">Cancel</button>
                          </div>
                        ) : (
                          <button onClick={() => handleEditClick(dept)} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm font-bold shadow-sm">
                            {currentHod ? 'Reassign' : 'Assign'}
                          </button>
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
    </div>
  );
};

export default ManageHod;
