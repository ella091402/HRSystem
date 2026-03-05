import { format, isAfter, setHours, setMinutes, parseISO } from "date-fns";

// Seed Data
const SEED_USERS = [
  { id: 1, name: "Admin", email: "admin@company.com", password: "password", role: "admin", department: "HR" },
  { id: 2, name: "John Doe", email: "john@company.com", password: "password", role: "employee", department: "Engineering", leaveBalance: { SL: 10, VL: 15, EL: 2 } },
  { id: 3, name: "Jane Smith", email: "jane@company.com", password: "password", role: "employee", department: "Design", leaveBalance: { SL: 12, VL: 10, EL: 5 } }
];

const SEED_ATTENDANCE = []; 
// Logs format: { id, userId, date: "YYYY-MM-DD", timeIn: "HH:mm", timeOut: "HH:mm" | null, status: "Present" | "Late" | "Absent" }

export const initDB = () => {
  if (!localStorage.getItem("hrms_users")) {
    localStorage.setItem("hrms_users", JSON.stringify(SEED_USERS));
  }
  if (!localStorage.getItem("hrms_attendance")) {
    localStorage.setItem("hrms_attendance", JSON.stringify(SEED_ATTENDANCE));
  }
  if (!localStorage.getItem("hrms_settings")) {
    localStorage.setItem("hrms_settings", JSON.stringify({ workStart: "09:00", workEnd: "17:00" }));
  }
};

// Users
export const getUsers = () => JSON.parse(localStorage.getItem("hrms_users")) || [];
export const saveUsers = (users) => localStorage.setItem("hrms_users", JSON.stringify(users));
export const getUserById = (id) => getUsers().find(u => u.id === id);

// Attendance
export const getAttendance = () => JSON.parse(localStorage.getItem("hrms_attendance")) || [];
export const saveAttendance = (logs) => localStorage.setItem("hrms_attendance", JSON.stringify(logs));

export const getDailyAttendance = (dateStr) => {
  return getAttendance().filter(log => log.date === dateStr);
};

export const getUserAttendance = (userId) => {
  return getAttendance().filter(log => log.userId === userId).sort((a,b) => new Date(b.date) - new Date(a.date));
};

// Check-in / Check-out Logic
export const checkIn = (userId) => {
  const users = getUsers();
  const user = users.find(u => u.id === userId);
  if (!user) throw new Error("User not found");

  const now = new Date();
  const dateStr = format(now, "yyyy-MM-dd");
  const timeStr = format(now, "HH:mm");
  
  const attendance = getAttendance();
  const existingLog = attendance.find(log => log.userId === userId && log.date === dateStr);
  
  if (existingLog) {
    if (existingLog.timeIn) throw new Error("Already checked in today.");
  }

  const settings = JSON.parse(localStorage.getItem("hrms_settings"));
  const cutoffTime = parseISO(`${dateStr}T${settings.workStart}`);
  
  let status = "Present";
  if (isAfter(now, cutoffTime)) {
    status = "Late";
  }

  const newLog = {
    id: Date.now(),
    userId,
    userName: user.name,
    date: dateStr,
    timeIn: timeStr,
    timeOut: null,
    status
  };

  attendance.push(newLog);
  saveAttendance(attendance);
  return newLog;
};

export const checkOut = (userId) => {
  const now = new Date();
  const dateStr = format(now, "yyyy-MM-dd");
  const timeStr = format(now, "HH:mm");
  
  const attendance = getAttendance();
  const logIndex = attendance.findIndex(log => log.userId === userId && log.date === dateStr);
  
  if (logIndex === -1 || !attendance[logIndex].timeIn) {
    throw new Error("Cannot check out without checking in first.");
  }
  
  if (attendance[logIndex].timeOut) {
    throw new Error("Already checked out today.");
  }

  attendance[logIndex].timeOut = timeStr;
  saveAttendance(attendance);
  return attendance[logIndex];
};

export const getTodayStatus = (userId) => {
  const dateStr = format(new Date(), "yyyy-MM-dd");
  const attendance = getAttendance();
  return attendance.find(log => log.userId === userId && log.date === dateStr) || null;
};
