import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { supabase } from '../lib/supabase/supabaseClient';

const UserManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  // editingFields holds the updated values for each employee keyed by employeeid
  const [editingFields, setEditingFields] = useState({});
  // updateStatus holds temporary status messages for each employee row
  const [updateStatus, setUpdateStatus] = useState({});

  // Options for the dropdowns
  const roleOptions = [
    { value: 1, label: 'Admin' },
    { value: 2, label: 'Sales Staff' },
    { value: 3, label: 'Kitchen Staff' },
  ];

  const statusOptions = [
    { value: 'Active', label: 'Active' },
    { value: 'On Leave', label: 'On Leave' },
    { value: 'Terminated', label: 'Terminated' },
  ];

  const employmentTypeOptions = [
    { value: 'Full-Time', label: 'Full-Time' },
    { value: 'Part-Time', label: 'Part-Time' },
    { value: 'Contract', label: 'Contract' },
  ];

  // Fetch employees from Supabase
  const fetchEmployees = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.from('employees').select('*');
      if (error) throw error;
      setEmployees(data);
      // Initialize the editingFields state with current values from the DB
      const initialEditing = {};
      data.forEach(emp => {
        initialEditing[emp.employeeid] = {
          employmenttype: emp.employmenttype,
          phone: emp.phone,
          hourlywage: emp.hourlywage,
          status: emp.status,
          roleid: emp.roleid,
        };
      });
      setEditingFields(initialEditing);
    } catch (error) {
      console.error('Error fetching employees:', error);
      toast.error('Error fetching employees');
    } finally {
      setIsLoading(false);
    }
  };

  // Update employee data in the database for all editable fields
  const updateEmployeeData = async (employeeId) => {
    const updatedData = editingFields[employeeId];
    try {
      const { error } = await supabase
        .from('employees')
        .update(updatedData)
        .eq('employeeid', employeeId);
      if (error) throw error;
      toast.success('Employee updated');
      // Update local state so the UI reflects the change
      setEmployees((prev) =>
        prev.map((emp) =>
          emp.employeeid === employeeId ? { ...emp, ...updatedData } : emp
        )
      );
      // Set a "Saved" status message for this employee row
      setUpdateStatus((prev) => ({ ...prev, [employeeId]: 'Saved' }));
      setTimeout(() => {
        setUpdateStatus((prev) => {
          const newStatus = { ...prev };
          delete newStatus[employeeId];
          return newStatus;
        });
      }, 3000);
    } catch (error) {
      console.error('Error updating employee:', error);
      toast.error('Error updating employee');
    }
  };

  // Handle change for any editable field in a row
  const handleFieldChange = (employeeId, field, value) => {
    setEditingFields((prev) => ({
      ...prev,
      [employeeId]: {
        ...prev[employeeId],
        [field]: value,
      },
    }));
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold text-rose-700 mb-6">User Management</h2>
      {isLoading ? (
        <p className="text-gray-500">Loading employees...</p>
      ) : employees.length === 0 ? (
        <p className="text-gray-500">No employees found.</p>
      ) : (
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Employee ID</th>
              <th className="py-2 px-4 border-b">First Name</th>
              <th className="py-2 px-4 border-b">Last Name</th>
              <th className="py-2 px-4 border-b">Username</th>
              <th className="py-2 px-4 border-b">Employment Type</th>
              <th className="py-2 px-4 border-b">Phone</th>
              <th className="py-2 px-4 border-b">Hourly Wage</th>
              <th className="py-2 px-4 border-b">Status</th>
              <th className="py-2 px-4 border-b">Role</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp.employeeid} className="text-center">
                <td className="py-2 px-4 border-b">{emp.employeeid}</td>
                <td className="py-2 px-4 border-b">{emp.firstname}</td>
                <td className="py-2 px-4 border-b">{emp.lastname}</td>
                <td className="py-2 px-4 border-b">{emp.username}</td>
                <td className="py-2 px-4 border-b">
                  <select
                    value={editingFields[emp.employeeid]?.employmenttype || ''}
                    onChange={(e) =>
                      handleFieldChange(emp.employeeid, 'employmenttype', e.target.value)
                    }
                    className="border rounded p-1"
                  >
                    {employmentTypeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="py-2 px-4 border-b">
                  <input
                    type="tel"
                    value={editingFields[emp.employeeid]?.phone || ''}
                    onChange={(e) =>
                      handleFieldChange(emp.employeeid, 'phone', e.target.value)
                    }
                    className="border rounded p-1 w-30"
                    placeholder="905-343-3434"
                    pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                  />
                </td>
                <td className="py-2 px-4 border-b">
                  <input
                    type="number"
                    value={editingFields[emp.employeeid]?.hourlywage || ''}
                    onChange={(e) =>
                      handleFieldChange(emp.employeeid, 'hourlywage', parseFloat(e.target.value))
                    }
                    className="border rounded p-1 w-20"
                    step="0.01"
                    style={{ MozAppearance: 'textfield', WebkitAppearance: 'none' }}
                  />
                </td>
                <td className="py-2 px-4 border-b">
                  <select
                    value={editingFields[emp.employeeid]?.status || ''}
                    onChange={(e) =>
                      handleFieldChange(emp.employeeid, 'status', e.target.value)
                    }
                    className="border rounded p-1"
                  >
                    {statusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="py-2 px-4 border-b">
                  <select
                    value={editingFields[emp.employeeid]?.roleid || ''}
                    onChange={(e) =>
                      handleFieldChange(emp.employeeid, 'roleid', parseInt(e.target.value))
                    }
                    className="border rounded p-1"
                  >
                    {roleOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="py-2 px-4 border-b flex items-center justify-center space-x-2">
                  <button
                    onClick={() => updateEmployeeData(emp.employeeid)}
                    className="bg-rose-600 hover:bg-rose-700 text-white py-1 px-3 rounded"
                  >
                    Save
                  </button>
                  {updateStatus[emp.employeeid] && (
                    <span className="text-green-600 font-semibold">
                      {updateStatus[emp.employeeid]}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UserManagement;
