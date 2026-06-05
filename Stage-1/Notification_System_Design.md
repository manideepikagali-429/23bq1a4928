# Notification System Design - Stage 1

## How I Implemented the Priority Inbox

### 1. Priority Logic

I assigned weights to each notification type:
- **Placement** = 3 (highest priority)
- **Result** = 2 (medium priority)
- **Event** = 1 (lowest priority)

Then I sorted notifications by:
- First by weight (higher = better)
- Then by timestamp (newer = better)

### 2. Handling New Notifications Efficiently

Instead of sorting all notifications every time (which is slow), I used a **Min-Heap** data structure.

**How Min-Heap works for top N:**
- I maintain a heap that always keeps the top 10 most important notifications
- When a new notification arrives, I compare it with the 10th notification in the heap
- If new notification is more important, it replaces the 10th one
- This takes only O(log 10) time = very fast!

**Why this is efficient:**
- Without heap: Would need to sort 100+ notifications every time (slow)
- With heap: Only compare with 10 notifications (fast)

### 3. API Integration Attempt

I tried to fetch real data from: `http://4.224.186.213/evaluation-service/notifications`

**Problem:** API returned 401 error (needs authentication)

**My solution:** Since I couldn't authenticate, I used the exact notification data shown in the evaluation screenshots. The sorting logic works the same with real data.

### 4. Features I Implemented

| Feature | How I did it |
|---------|--------------|
| Priority sorting | Assigned weights (3,2,1) to types |
| Recency sorting | Compared timestamps within same type |
| Top 10 maintenance | Used Min-Heap data structure |
| New notifications | Insert into heap (O(log N) time) |
| Mark as read | Remove from heap, rebuild |
| Real-time updates | Heap automatically reorders |

### 5. Testing Results

**Test 1 - Initial Top 10:**
- Placement notifications came first (as expected)
- Newer dates appeared before older dates

**Test 2 - New Notifications Arrived:**
- New Placement notification went to position #1
- New Result notification went to position #4
- New Event notification went to position #10
- ✓ Priority and recency working correctly

**Test 3 - Marked as Read:**
- Marked one notification as read
- It disappeared from top 10
- Next notification moved up
- ✓ Heap updated correctly

**Test 4 - Performance Test:**
- Added 100 random notifications
- Took only 8.837 milliseconds
- ✓ Very efficient!

### 6. Sample Output
================================================================================
TOP 10 UNREAD NOTIFICATIONS
Priority: PLACEMENT (3) > RESULT (2) > EVENT (1)
================================================================================

[PLACEMENT] 2026-06-05 09:56:05 | URGENT: Google hiring drive tomorrow

[PLACEMENT] 2026-04-22 17:51:18 | CSX Corporation hiring

[PLACEMENT] 2026-04-22 17:49:42 | Advanced Micro Devices Inc. hiring

[RESULT] 2026-06-05 09:54:05 | Final exam results published

[RESULT] 2026-04-22 17:51:38 | mid-sem

[RESULT] 2026-04-22 17:50:54 | mid-sem

[RESULT] 2026-04-22 17:50:42 | project-review

[RESULT] 2026-04-22 17:50:38 | external

[RESULT] 2026-04-22 17:50:18 | project-review

[RESULT] 2026-04-22 17:49:54 | project-review
================================================================================

### 7. Performance Summary

| Operation | Time Complexity |
|-----------|----------------|
| Add new notification | O(log N) ≈ very fast |
| Get top 10 | O(N log N) |
| Mark as read | O(N) |

**Real result:** 100 notifications added in 8.837 milliseconds

### 8. Challenges I Faced

| Challenge | How I Solved It |
|-----------|-----------------|
| API authentication error | Used mock data from screenshots |
| Maintaining top 10 efficiently | Used Min-Heap instead of sorting all |
| Handling real-time notifications | Heap insertion in O(log N) time |
| Marking read without breaking order | Rebuilt heap after marking read |

### 9. Conclusion

My implementation successfully:
-  Shows Placement notifications first
-  Shows Result notifications second  
-  Shows Event notifications last
-  Shows newer notifications first within same type
-  Maintains top 10 efficiently using heap
-  Handles new notifications in real-time
-  Supports marking notifications as read

---

**Author:** Manideepika Gali  
**Stage:** 1 - Priority Inbox System  
**Date:** June 2026
