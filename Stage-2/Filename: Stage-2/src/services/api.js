Filename: Stage-2/src/services/api.js
Content: // This is MOCK data (fake data) since the API is not working
// The data is based on the screenshots from your evaluation

const getMockNotifications = () => {
  return {
    notifications: [
      {
        ID: "1",
        Type: "Placement",
        Message: "CSX Corporation hiring",
        Timestamp: "2026-04-22 17:51:18"
      },
      {
        ID: "2",
        Type: "Result",
        Message: "mid-sem",
        Timestamp: "2026-04-22 17:51:38"
      },
      {
        ID: "3",
        Type: "Event",
        Message: "farewell",
        Timestamp: "2026-04-22 17:51:06"
      },
      {
        ID: "4",
        Type: "Result",
        Message: "mid-sem",
        Timestamp: "2026-04-22 17:50:54"
      },
      {
        ID: "5",
        Type: "Result",
        Message: "project-review",
        Timestamp: "2026-04-22 17:50:42"
      },
      {
        ID: "6",
        Type: "Result",
        Message: "external",
        Timestamp: "2026-04-22 17:50:38"
      },
      {
        ID: "7",
        Type: "Result",
        Message: "project-review",
        Timestamp: "2026-04-22 17:50:18"
      },
      {
        ID: "8",
        Type: "Event",
        Message: "tech-test",
        Timestamp: "2026-04-22 17:50:06"
      },
      {
        ID: "9",
        Type: "Result",
        Message: "project-review",
        Timestamp: "2026-04-22 17:49:54"
      },
      {
        ID: "10",
        Type: "Placement",
        Message: "Advanced Micro Devices Inc. hiring",
        Timestamp: "2026-04-22 17:49:42"
      },
      {
        ID: "11",
        Type: "Placement",
        Message: "Google Summer Internship",
        Timestamp: "2026-04-21 10:00:00"
      },
      {
        ID: "12",
        Type: "Result",
        Message: "Final Exam Results",
        Timestamp: "2026-04-20 15:30:00"
      },
      {
        ID: "13",
        Type: "Event",
        Message: "Annual Tech Fest",
        Timestamp: "2026-04-19 09:00:00"
      },
      {
        ID: "14",
        Type: "Placement",
        Message: "Amazon Hiring Drive",
        Timestamp: "2026-04-18 14:00:00"
      },
      {
        ID: "15",
        Type: "Result",
        Message: "Project Presentation Results",
        Timestamp: "2026-04-17 11:00:00"
      }
    ],
    total: 15
  };
};

export const fetchNotifications = async (limit = 10, page = 1, type = null) => {
  // Simulate network delay (like real API)
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Get all mock data
  let allData = getMockNotifications();
  let notifications = [...allData.notifications];
  
  // Filter by type if specified
  if (type && type !== '') {
    notifications = notifications.filter(n => n.Type === type);
  }
  
  // Calculate pagination
  const start = (page - 1) * limit;
  const end = start + limit;
  const paginatedNotifications = notifications.slice(start, end);
  
  return {
    notifications: paginatedNotifications,
    total: notifications.length
  };
};
