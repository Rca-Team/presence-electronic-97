
import React from 'react';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { UserCheck, Clock, X } from 'lucide-react';

interface DailyAttendanceDetailsProps {
  selectedDate: Date | undefined;
  dailyAttendance: {
    id: string;
    timestamp: string;
    status: string;
  }[];
  isDateInArray: (date: Date, dateArray: Date[]) => boolean;
  attendanceDays: Date[];
  lateAttendanceDays: Date[];
  absentDays: Date[];
}

const DailyAttendanceDetails: React.FC<DailyAttendanceDetailsProps> = ({
  selectedDate,
  dailyAttendance,
  isDateInArray,
  attendanceDays = [],
  lateAttendanceDays = [],
  absentDays = []
}) => {
  // Format time to 12-hour format with AM/PM
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'h:mm a');
  };

  // Format date to show day of week and date
  const formatDateWithDay = (date: Date) => {
    return format(date, 'EEEE, MMMM d, yyyy');
  };

  // Check if the selected date is today
  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };

  // Check if the selected date is in the future
  const isFutureDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date > today;
  };

  if (!selectedDate) return null;

  return (
    <div className="border-t pt-4 mt-4">
      <h3 className="font-medium mb-2">
        {formatDateWithDay(selectedDate)}
        {isToday(selectedDate) && <span className="ml-2 text-sm text-green-500">(Today)</span>}
      </h3>
      
      {isFutureDate(selectedDate) ? (
        <p className="text-sm text-muted-foreground">Future date selected. No attendance data available yet.</p>
      ) : dailyAttendance && dailyAttendance.length > 0 ? (
        <div className="space-y-2">
          {dailyAttendance.map((record) => (
            <div key={record.id} className="flex items-center justify-between p-2 bg-muted/50 rounded-md">
              <div className="flex items-center">
                {record.status === 'late' ? (
                  <Clock className="h-4 w-4 text-amber-500 mr-2" />
                ) : (
                  <UserCheck className="h-4 w-4 text-green-500 mr-2" />
                )}
                <span>
                  {formatTime(record.timestamp)}
                </span>
              </div>
              <Badge variant={record.status === 'late' ? "outline" : "default"}>
                {record.status === 'late' ? 'Late' : 'Present'}
              </Badge>
            </div>
          ))}
        </div>
      ) : isDateInArray && attendanceDays && lateAttendanceDays && 
          (isDateInArray(selectedDate, attendanceDays) || isDateInArray(selectedDate, lateAttendanceDays)) ? (
        <p className="text-sm text-muted-foreground">Loading attendance details...</p>
      ) : isDateInArray && absentDays && isDateInArray(selectedDate, absentDays) ? (
        <div className="flex items-center justify-center p-4 bg-red-50 rounded-md">
          <X className="h-5 w-5 text-red-500 mr-2" />
          <span className="text-red-500 font-medium">Absent</span>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">No attendance recorded for this date.</p>
      )}
    </div>
  );
};

export default DailyAttendanceDetails;
