# EDEN — Devotion Content

The LINE LIFF app that guides a user through one daily devotion entry at a time, drawn from a published QT (Quiet Time) curriculum authored by คริสตจักรพันธกิจเชียงใหม่.

## Language

**Level**:
The curriculum track a user is enrolled in: either "สำหรับผู้เชื่อใหม่" (New Believer, 1 Book, 40 days) or "ปีที่ 1"–"ปีที่ 5" (Year 1–5, 12 Books each). Shown as the "ระดับ" selector on the book-selection screen.
_Avoid_: Program, track (unless disambiguating in code)

**Year** (ปี):
A container of exactly 12 Books, one per calendar-length Level (ปีที่ 1 … ปีที่ 5). Only meaningful within a ปีที่ N Level — the New Believer Level has no Year, just its single Book. Not yet a first-class UI concept; may never need to be.
_Avoid_: Program

**Book** (เล่ม):
One month's worth of daily entries (source files call this "ฉบับ," issue) — roughly 28–31 Days, authored around a specific calendar month (e.g. เล่ม 1 = มกราคม content, เล่ม 2 = กุมภาพันธ์ content). The book-selection screen's "คู่มือเฝ้าเดี่ยว QT เล่มที่ 1" card refers to this.
_Avoid_: Issue, ฉบับ (source-material term, not product-facing), volume

**Day** (in source: "วันที่ N [เดือน]"):
One dated daily-devotion entry within a Book. The printed month/date (e.g. "วันที่ 4 มกราคม") is source citation only — see Personal Calendar below for how a user's Day N is actually scheduled.
_Avoid_: Lesson (reserve for the abstract "one day's devotion" concept in UI copy; Day is the data/scheduling term)

**Personal Calendar**:
Each user's own Day-unlock timeline for one Enrollment, anchored to a Day-in-Book the user themself picks as their starting point (not always Day 1 — they may start mid-Book) rather than the real Gregorian calendar. From that start Day, one further Day unlocks per elapsed real day. The day boundary is evaluated using the user's own device timezone (`src/data/onboarding.ts`'s `getBookDayForDate`/`getPlanStartDate` use plain local `Date`) rather than a fixed `Asia/Bangkok` — accepted as fine in practice since the audience is assumed to be physically in Thailand, so device timezone and Asia/Bangkok coincide for virtually everyone. A user may skip the current Day and move on — the skipped Day is flagged rather than blocking progress. A Day whose content hasn't been authored/published yet is disabled regardless of unlock timing (see Day readiness).
_Avoid_: Calendar mode, ตามปฏิทิน (ambiguous — could misread as real-world-calendar-locked, which this explicitly is not)

**Enrollment**:
A user's record of studying one Book: which Day they chose to start on, and their progress since. Restarting a Book the user has an existing Enrollment for prompts a choice — migrate (keep progress, continue under the new framing) or start fresh (a new Enrollment; the old one is archived, not deleted).
_Avoid_: user_book_enrollment (fine as the table name; this is the concept it stores)

**Day readiness**:
Whether a Day's content has been authored and published yet. Independent of a user's Personal Calendar — a Day can be "unlocked" by elapsed time but still disabled in the UI if nobody has written it yet.
_Avoid_: Availability (too easily confused with unlock timing, which is a separate concept)

**Step**:
One of 7 content blocks that make up a Day, matching the source worksheet's actual structure: อธิษฐาน (opening prayer) → ภาวนาพระวจนะ (memory verse) → อ่านพระธรรม (scripture reading + embedded response) → ทำความเข้าใจพระคัมภีร์ (understanding) → ข้อคิดและการตอบสนอง (reflection & response) → บันทึก (journal, 2 separate prompts) → อธิษฐาน (closing prayer).
_Avoid_: 8-step flow (a stale concern from before the UI was collapsed to match the source — `STEP_DEFINITIONS` in `src/data/stepDefinitions.ts` is now the canonical 7)

**Template Step** vs **Authored Step**:
Confirmed by diffing every Day in Book 1 — the opening อธิษฐาน instruction and both บันทึก journal prompt labels are verbatim identical every single Day (Template Steps: fixed app copy, not per-Day content). ภาวนาพระวจนะ, อ่านพระธรรม, ทำความเข้าใจพระคัมภีร์, ข้อคิดและการตอบสนอง, and the closing อธิษฐาน all genuinely differ every Day (Authored Steps: require real content ingestion per Day) — confirmed for the closing prayer too once full-book extraction was done (`closingPrayer` runs a few hundred characters and differs Day to Day). Only the opening อธิษฐาน and บันทึก are Template Steps.
_Avoid_: treating all 7 Steps as equally needing content authoring — only the 5 Authored ones do

**Journal** (บันทึก):
The Day's closing reflection Step. Always exactly two separate prompts in the source — "ท่านได้บทเรียนอะไรบ้าง…" (what did you learn) and "พระเจ้าตรัสอะไรกับท่านบ้าง…" (what did God say to you) — modeled as two distinct fields, never flattened into one free-text box.
_Avoid_: Notes, reflection (Reflection is a different, earlier Step — "ข้อคิดและการตอบสนอง")
