import React from 'react';
import StudentForm from '../../components/forms/StudentForm';

const InsertStudentPage = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-orange-600">Add New Student</h1>
      <div className="bg-white p-6 rounded-lg shadow-sm border border-orange-100">
        <StudentForm />
      </div>
    </div>
  );
};

export default InsertStudentPage;
