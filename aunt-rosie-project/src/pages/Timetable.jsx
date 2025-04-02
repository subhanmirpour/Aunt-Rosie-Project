import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { supabase } from '../lib/supabase/supabaseClient';

const Timetable = () => {
  const [entries, setEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingFields, setEditingFields] = useState({});
  const [updateStatus, setUpdateStatus] = useState({});
  const [locations, setLocations] = useState([]);

  // Fetch timetable data from Supabase, joining with employees and locations
  const fetchTimetable = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('employee_hours')
        .select(
          '*, employee:employees(firstname, employeeid), location:locations(locationname, locationid)'
        );
      if (error) throw error;
      setEntries(data);
    } catch (error) {
      console.error('Error fetching timetable data:', error);
      toast.error('Error fetching timetable data');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch locations for the dropdown
  const fetchLocations = async () => {
    try {
      const { data, error } = await supabase.from('locations').select('*');
      if (error) throw error;
      setLocations(data);
    } catch (error) {
      console.error('Error fetching locations:', error);
      toast.error('Error fetching locations');
    }
  };

  useEffect(() => {
    fetchTimetable();
    fetchLocations();
  }, []);

  // Set up the editing fields for the selected entry
  const handleEditClick = (hoursid, entry) => {
    setEditingFields((prev) => ({
      ...prev,
      [hoursid]: {
        dateworked: entry.dateworked,
        hoursworked: entry.hoursworked,
        locationid: entry.location ? entry.location.locationid : entry.locationid,
      },
    }));
  };

  // Update the editing fields state on change
  const handleFieldChange = (hoursid, field, value) => {
    setEditingFields((prev) => ({
      ...prev,
      [hoursid]: {
        ...prev[hoursid],
        [field]: value,
      },
    }));
  };

  // Cancel editing mode for a row
  const cancelEdit = (hoursid) => {
    setEditingFields((prev) => {
      const newEditing = { ...prev };
      delete newEditing[hoursid];
      return newEditing;
    });
  };

  // Update the employee_hours record in Supabase
  const updateEmployeeHours = async (hoursid) => {
    const updatedData = editingFields[hoursid];
    try {
      const { error } = await supabase
        .from('employee_hours')
        .update(updatedData)
        .eq('hoursid', hoursid);
      if (error) throw error;
      toast.success('Timetable entry updated');

      // Update the local entries state with the new data
      setEntries((prevEntries) =>
        prevEntries.map((entry) =>
          entry.hoursid === hoursid ? { ...entry, ...updatedData } : entry
        )
      );

      // Remove editing state for the updated row
      setEditingFields((prev) => {
        const newEditing = { ...prev };
        delete newEditing[hoursid];
        return newEditing;
      });

      // Set a temporary "Saved" status
      setUpdateStatus((prev) => ({ ...prev, [hoursid]: 'Saved' }));
      setTimeout(() => {
        setUpdateStatus((prev) => {
          const newStatus = { ...prev };
          delete newStatus[hoursid];
          return newStatus;
        });
      }, 3000);
    } catch (error) {
      console.error('Error updating timetable entry:', error);
      toast.error('Error updating timetable entry');
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold text-rose-700 mb-6">Employee Timetable</h2>
      {isLoading ? (
        <p className="text-gray-500">Loading timetable...</p>
      ) : entries.length === 0 ? (
        <p className="text-gray-500">No timetable entries found.</p>
      ) : (
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Employee ID</th>
              <th className="py-2 px-4 border-b">Employee Name</th>
              <th className="py-2 px-4 border-b">Date Worked</th>
              <th className="py-2 px-4 border-b">Hours Worked</th>
              <th className="py-2 px-4 border-b">Location</th>
              <th className="py-2 px-4 border-b">Pay Rate</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => {
              const isEditing = editingFields.hasOwnProperty(entry.hoursid);
              return (
                <tr key={entry.hoursid} className="text-center">
                  <td className="py-2 px-4 border-b">
                    {entry.employee ? entry.employee.employeeid : entry.employeeid}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {entry.employee ? entry.employee.firstname : 'N/A'}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {isEditing ? (
                      <input
                        type="date"
                        value={editingFields[entry.hoursid].dateworked}
                        onChange={(e) =>
                          handleFieldChange(entry.hoursid, 'dateworked', e.target.value)
                        }
                        className="border rounded p-1"
                      />
                    ) : (
                      entry.dateworked
                    )}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {isEditing ? (
                      <input
                        type="number"
                        step="0.1"
                        value={editingFields[entry.hoursid].hoursworked}
                        onChange={(e) =>
                          handleFieldChange(entry.hoursid, 'hoursworked', e.target.value)
                        }
                        className="border rounded p-1 w-20"
                      />
                    ) : (
                      entry.hoursworked
                    )}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {isEditing ? (
                      <select
                        value={editingFields[entry.hoursid].locationid}
                        onChange={(e) =>
                          handleFieldChange(entry.hoursid, 'locationid', e.target.value)
                        }
                        className="border rounded p-1"
                      >
                        {locations.map((loc) => (
                          <option key={loc.locationid} value={loc.locationid}>
                            {loc.locationname}
                          </option>
                        ))}
                      </select>
                    ) : (
                      entry.location ? entry.location.locationname : entry.locationid
                    )}
                  </td>
                  <td className="py-2 px-4 border-b">{entry.payrateattime}</td>
                  <td className="py-2 px-4 border-b">
                    {isEditing ? (
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => updateEmployeeHours(entry.hoursid)}
                          className="bg-rose-600 hover:bg-rose-700 text-white py-1 px-3 rounded"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => cancelEdit(entry.hoursid)}
                          className="bg-gray-600 hover:bg-gray-700 text-white py-1 px-3 rounded"
                        >
                          Cancel
                        </button>
                        {updateStatus[entry.hoursid] && (
                          <span className="text-green-600 font-semibold">
                            {updateStatus[entry.hoursid]}
                          </span>
                        )}
                      </div>
                    ) : (
                      <button
                        onClick={() => handleEditClick(entry.hoursid, entry)}
                        className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded"
                      >
                        Edit
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Timetable;
