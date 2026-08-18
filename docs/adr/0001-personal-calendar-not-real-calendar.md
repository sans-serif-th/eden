# Personal Calendar instead of real-calendar-locked scheduling

**Status:** accepted

The source QT devotion booklets print a real calendar date on every Day ("วันที่ 4 มกราคม"), and content must be studied strictly in order. We considered locking Day-unlock to those literal real-world dates (the plan's original "ตามปฏิทิน" option), but rejected it: a LINE mini-app audience signs up on arbitrary dates, and calendar-lockstep would greet most new users with weeks of "missed" content on day one. Instead, each user picks their own start Day when they begin a Book, and Days unlock one per elapsed real day *from that personal start point* — the printed month/date becomes citation-only metadata (see `source_reference` in CONTEXT.md), not a scheduling constraint.

## Consequences

- Enrollment records need their own start-Day and unlock-timestamp basis per user, not one content-wide calendar shared by everyone.
- A user restarting a Book (see Enrollment in CONTEXT.md) gets a new start point — Day-unlock timestamps must be re-derived from the new Enrollment, not the original one.
