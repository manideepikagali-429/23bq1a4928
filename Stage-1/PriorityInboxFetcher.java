import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

class Notification implements Comparable<Notification> {
    String id;
    String type;
    String message;
    LocalDateTime timestamp;
    boolean isRead;

    public Notification(String id, String type, String message, String timestampStr) {
        this.id = id;
        this.type = type;
        this.message = message;
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        this.timestamp = LocalDateTime.parse(timestampStr, formatter);
        this.isRead = false;
    }

    public int getPriorityWeight() {
        switch (type.toLowerCase()) {
            case "placement": return 3;  // Highest priority
            case "result": return 2;
            case "event": return 1;      // Lowest priority
            default: return 0;
        }
    }

    @Override
    public int compareTo(Notification other) {
        // Higher weight first
        if (this.getPriorityWeight() != other.getPriorityWeight()) {
            return Integer.compare(other.getPriorityWeight(), this.getPriorityWeight());
        }
        // Then newer timestamp first
        return other.timestamp.compareTo(this.timestamp);
    }

    @Override
    public String toString() {
        return String.format("[%s] %s | %s", 
            type.toUpperCase(), 
            timestamp.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")), 
            message);
    }
}

// Min-Heap wrapper for efficient top-N maintenance
class PriorityInbox {
    private PriorityQueue<Notification> minHeap;
    private List<Notification> allNotifications;
    private int topN;
    
    public PriorityInbox(int topN) {
        this.topN = topN;
        this.allNotifications = new ArrayList<>();
        // Min-heap based on lowest priority (weight + timestamp)
        this.minHeap = new PriorityQueue<>((a, b) -> {
            if (a.getPriorityWeight() != b.getPriorityWeight()) {
                return Integer.compare(a.getPriorityWeight(), b.getPriorityWeight());
            }
            return a.timestamp.compareTo(b.timestamp);
        });
    }
    
    // Add notification and maintain top N efficiently (O(log N))
    public void addNotification(Notification notification) {
        allNotifications.add(notification);
        
        if (!notification.isRead) {
            minHeap.offer(notification);
            
            // Keep only top N in heap
            if (minHeap.size() > topN) {
                minHeap.poll();
            }
        }
    }
    
    // Add multiple notifications
    public void addAllNotifications(List<Notification> notifications) {
        for (Notification n : notifications) {
            addNotification(n);
        }
    }
    
    // Get top N notifications sorted by priority
    public List<Notification> getTopNotifications() {
        List<Notification> topList = new ArrayList<>(minHeap);
        topList.sort((a, b) -> {
            if (a.getPriorityWeight() != b.getPriorityWeight()) {
                return Integer.compare(b.getPriorityWeight(), a.getPriorityWeight());
            }
            return b.timestamp.compareTo(a.timestamp);
        });
        return topList;
    }
    
    // Mark notification as read and update heap
    public void markAsRead(String notificationId) {
        for (Notification n : allNotifications) {
            if (n.id.equals(notificationId) && !n.isRead) {
                n.isRead = true;
                rebuildHeap();
                break;
            }
        }
    }
    
    // Rebuild heap efficiently when notifications are marked as read
    private void rebuildHeap() {
        minHeap.clear();
        for (Notification n : allNotifications) {
            if (!n.isRead) {
                minHeap.offer(n);
                if (minHeap.size() > topN) {
                    minHeap.poll();
                }
            }
        }
    }
    
    public void displayTopNotifications() {
        List<Notification> top = getTopNotifications();
        System.out.println("\n" + "=".repeat(80));
        System.out.println("📬 TOP " + topN + " UNREAD NOTIFICATIONS");
        System.out.println("Priority: PLACEMENT (3) > RESULT (2) > EVENT (1)");
        System.out.println("Within same type: Newer notifications first");
        System.out.println("=".repeat(80));
        
        if (top.isEmpty()) {
            System.out.println("  No unread notifications.");
        } else {
            for (int i = 0; i < top.size(); i++) {
                System.out.printf("%2d. %s%n", (i + 1), top.get(i));
            }
        }
        System.out.println("=".repeat(80));
    }
    
    public void displayStatistics() {
        long placementCount = allNotifications.stream()
            .filter(n -> n.type.equalsIgnoreCase("Placement")).count();
        long resultCount = allNotifications.stream()
            .filter(n -> n.type.equalsIgnoreCase("Result")).count();
        long eventCount = allNotifications.stream()
            .filter(n -> n.type.equalsIgnoreCase("Event")).count();
        long unreadCount = allNotifications.stream()
            .filter(n -> !n.isRead).count();
        
        System.out.println("\n📊 SYSTEM STATISTICS");
        System.out.println("-".repeat(40));
        System.out.println("Total Notifications: " + allNotifications.size());
        System.out.println("Unread: " + unreadCount);
        System.out.println("Read: " + (allNotifications.size() - unreadCount));
        System.out.println("\nBy Type:");
        System.out.println("  📍 Placement: " + placementCount);
        System.out.println("  📝 Result: " + resultCount);
        System.out.println("  🎉 Event: " + eventCount);
        System.out.println("-".repeat(40));
    }
}

public class PriorityInboxFetcher {
    
    // Mock data based on actual API response from screenshots
    private static List<Notification> getMockNotifications() {
        List<Notification> notifications = new ArrayList<>();
        
        // Data from Screenshot (94).png and (95).png
        notifications.add(new Notification("d146095a-0d86-4a34-9e69-3900a14576bc", "Result", "mid-sem", "2026-04-22 17:51:38"));
        notifications.add(new Notification("b283218f-ea5a-4b7c-93a9-1f2f240d64b0", "Placement", "CSX Corporation hiring", "2026-04-22 17:51:18"));
        notifications.add(new Notification("81589ada-0ad3-4f77-9554-f2f5b558e09d", "Event", "farewell", "2026-04-22 17:51:06"));
        notifications.add(new Notification("0005513a-142b-4bbc-8678-efec65e1ede", "Result", "mid-sem", "2026-04-22 17:50:54"));
        notifications.add(new Notification("ea836726-c25e-4f21-a72f-546a4f8a37f", "Result", "project-review", "2026-04-22 17:50:42"));
        notifications.add(new Notification("003cb427-8fc6-47f7-bb00-ba228f6b0d2c", "Result", "external", "2026-04-22 17:50:38"));
        notifications.add(new Notification("e5c4ff20-31bf-4d40-8f02-72fa59e8918", "Result", "project-review", "2026-04-22 17:50:18"));
        notifications.add(new Notification("1cfce5ee-ad37-4894-8946-d707627176a5", "Event", "tech-test", "2026-04-22 17:50:06"));
        notifications.add(new Notification("cf2885a6-45ac-4ba0-b548-6e9e9d4c52c8", "Result", "project-review", "2026-04-22 17:49:54"));
        notifications.add(new Notification("8a7412bd-6065-4d09-8501-a37f11cc848b", "Placement", "Advanced Micro Devices Inc. hiring", "2026-04-22 17:49:42"));
        
        return notifications;
    }
    
    // Simulate new notifications arriving in real-time
    private static List<Notification> getNewNotifications() {
        List<Notification> newNotifs = new ArrayList<>();
        LocalDateTime now = LocalDateTime.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        
        newNotifs.add(new Notification("new1", "Placement", "🚨 URGENT: Google hiring drive tomorrow", now.format(formatter)));
        newNotifs.add(new Notification("new2", "Result", "📊 Final exam results published", now.minusMinutes(2).format(formatter)));
        newNotifs.add(new Notification("new3", "Event", "🎪 Annual tech summit registration", now.minusMinutes(5).format(formatter)));
        
        return newNotifs;
    }
    
    public static void main(String[] args) throws Exception {
        System.out.println("\n" + "🏢".repeat(40));
        System.out.println("     AFFORD MEDICAL TECHNOLOGIES - PRIORITY INBOX SYSTEM");
        System.out.println("🏢".repeat(40));
        
        int topN = 10; // Configurable (can be 10, 15, 20, etc.)
        
        // Create priority inbox
        PriorityInbox inbox = new PriorityInbox(topN);
        
        // Load initial notifications (from API mock data)
        System.out.println("\n📡 Fetching notifications from API...");
        List<Notification> initialNotifications = getMockNotifications();
        inbox.addAllNotifications(initialNotifications);
        System.out.println("✓ Loaded " + initialNotifications.size() + " notifications successfully!");
        
        // Display initial top 10 notifications
        inbox.displayTopNotifications();
        inbox.displayStatistics();
        
        // Simulate new notifications arriving
        System.out.println("\n" + "🔄".repeat(40));
        System.out.println("     SIMULATING REAL-TIME NOTIFICATIONS ARRIVAL");
        System.out.println("🔄".repeat(40));
        
        System.out.println("\n📨 New notifications received:");
        List<Notification> newNotifications = getNewNotifications();
        for (Notification n : newNotifications) {
            System.out.println("  + " + n);
            inbox.addNotification(n);
        }
        
        // Display updated top notifications after new arrivals
        inbox.displayTopNotifications();
        
        // Simulate marking a notification as read
        System.out.println("\n📖 Marking 'CSX Corporation hiring' as read...");
        inbox.markAsRead("b283218f-ea5a-4b7c-93a9-1f2f240d64b0");
        inbox.displayTopNotifications();
        
        // Demonstrate heap efficiency with bulk addition
        System.out.println("\n PERFORMANCE DEMONSTRATION");
        System.out.println("-".repeat(60));
        System.out.println("Adding 100 random notifications to test efficiency...");
        
        PriorityInbox performanceInbox = new PriorityInbox(10);
        Random random = new Random();
        String[] categories = {"Placement", "Result", "Event"};
        LocalDateTime baseTime = LocalDateTime.now();
        
        long startTime = System.nanoTime();
        for (int i = 0; i < 100; i++) {
            String category = categories[random.nextInt(3)];
            String timestamp = baseTime.minusMinutes(random.nextInt(1000))
                .format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
            Notification n = new Notification(
                "perf_" + i, 
                category, 
                "Test notification " + i, 
                timestamp
            );
            performanceInbox.addNotification(n);
        }
        long endTime = System.nanoTime();
        
        performanceInbox.displayTopNotifications();
        System.out.printf("\n✓ Added 100 notifications in %.3f ms%n", (endTime - startTime) / 1_000_000.0);
        System.out.println("✓ Each insertion: O(log N) where N=10 (constant time)");
        System.out.println("✓ Memory usage: O(N + M) where N=top count, M=total notifications");
        
        System.out.println("\n" + "✅".repeat(40));
        System.out.println("     SYSTEM READY - PRIORITY INBOX WORKING EFFICIENTLY");
        System.out.println("✅".repeat(40));
        System.out.println("\n💡 NOTE: This implementation uses mock data based on the API response");
        System.out.println("   from your screenshots. The actual API requires authentication");
        System.out.println("   (401 Unauthorized), so mock data is used for demonstration.");
        System.out.println("\n   To use real API, add authentication headers when available.");
    }
}
