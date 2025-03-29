import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { supabase } from '../lib/supabase/supabaseClient';

const Timetable = () => {
  const [entries, setEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch timetable data from Supabase, joining with employees and locations
  const fetchTimetable = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('employee_hours')
        .select('*, employee:employees(firstname, employeeid), location:locations(locationname)');
      if (error) throw error;
      setEntries(data);
    } catch (error) {
      console.error('Error fetching timetable data:', error);
      toast.error('Error fetching timetable data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTimetable();
  }, []);

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
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr key={entry.hoursid} className="text-center">
                <td className="py-2 px-4 border-b">
                  {entry.employee ? entry.employee.employeeid : entry.employeeid}
                </td>
                <td className="py-2 px-4 border-b">
                  {entry.employee ? entry.employee.firstname : 'N/A'}
                </td>
                <td className="py-2 px-4 border-b">{entry.dateworked}</td>
                <td className="py-2 px-4 border-b">{entry.hoursworked}</td>
                <td className="py-2 px-4 border-b">
                  {entry.location ? entry.location.locationname : entry.locationid}
                </td>
                <td className="py-2 px-4 border-b">{entry.payrateattime}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Timetable;
