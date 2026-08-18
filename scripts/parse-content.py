"""
Phase A content extraction: reliably splits each Year 1 monthly Book PDF into
per-Day raw text blocks with citation metadata (book, printed date, scripture
reference, PDF page). Step-level (7-block) segmentation is NOT done here —
header phrasing varies too much across books for regex to be trustworthy, so
that's a separate, language-understanding-driven pass over this output.
"""
import fitz
import json
import os
import re

SOURCE_DIR = "contents/year 1"
OUTPUT_DIR = "contents/parsed/year-1"

DAY_MARKER = re.compile(r"^วันที่\s*(\d+)\s*([ก-๙]+)\s*$")

BOOK_FILES = [f"QT_1_{n}.pdf" for n in range(1, 13)]


def parse_book(book_number: int, filename: str) -> dict:
    path = os.path.join(SOURCE_DIR, filename)
    doc = fitz.open(path)

    # Collect (day_number, month_name, page_index, line_index_in_page_text)
    markers = []
    page_texts = []
    for page_index in range(doc.page_count):
        text = doc[page_index].get_text()
        page_texts.append(text)
        for line in text.split("\n"):
            m = DAY_MARKER.match(line.strip())
            if m:
                markers.append(
                    {
                        "day": int(m.group(1)),
                        "month": m.group(2),
                        "page": page_index,
                    }
                )

    # Build a single (page, offset) -> global char position index so we can
    # slice raw text between consecutive day markers regardless of page breaks.
    full_text = ""
    page_start_offset = []
    for t in page_texts:
        page_start_offset.append(len(full_text))
        full_text += t + "\n"

    # Re-find marker positions as global char offsets (first match on/after
    # that page whose line equals the marker — safe since marker text is
    # short and distinctive after the own-line regex).
    day_positions = []
    for mk in markers:
        page_text = page_texts[mk["page"]]
        needle = f"วันที่ {mk['day']} {mk['month']}"
        # search allowing for the variable internal spacing seen in the PDFs
        pat = re.compile(
            r"วันที่\s*" + re.escape(str(mk["day"])) + r"\s*" + re.escape(mk["month"])
        )
        local_match = pat.search(page_text)
        if not local_match:
            continue
        global_pos = page_start_offset[mk["page"]] + local_match.start()
        day_positions.append({**mk, "global_pos": global_pos})

    day_positions.sort(key=lambda d: d["global_pos"])

    days = []
    for i, mk in enumerate(day_positions):
        start = mk["global_pos"]
        end = (
            day_positions[i + 1]["global_pos"]
            if i + 1 < len(day_positions)
            else len(full_text)
        )
        chunk = full_text[start:end].strip()

        # scripture reference = first non-empty line after the day-marker line
        chunk_lines = [l.strip() for l in chunk.split("\n") if l.strip()]
        scripture_ref = chunk_lines[1] if len(chunk_lines) > 1 else ""

        days.append(
            {
                "day": mk["day"],
                "sourceMonth": mk["month"],
                "sourcePage": mk["page"] + 1,  # 1-indexed for humans
                "scriptureReference": scripture_ref,
                "rawText": chunk,
                "citation": f"เล่มที่ {book_number} ({mk['month']}), วันที่ {mk['day']}, หน้า {mk['page'] + 1}",
            }
        )

    return {
        "book": book_number,
        "level": "year-1",
        "sourceFile": filename,
        "sourceMonth": markers[0]["month"] if markers else None,
        "totalPages": doc.page_count,
        "dayCount": len(days),
        "days": days,
    }


def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    summary = []
    for book_number, filename in enumerate(BOOK_FILES, start=1):
        result = parse_book(book_number, filename)
        out_path = os.path.join(OUTPUT_DIR, f"book-{book_number:02d}.json")
        with open(out_path, "w", encoding="utf-8") as f:
            json.dump(result, f, ensure_ascii=False, indent=2)
        summary.append((filename, result["dayCount"], result["totalPages"]))
        print(f"{filename}: {result['dayCount']} days -> {out_path}")

    total_days = sum(s[1] for s in summary)
    print(f"\nTotal Year 1 days extracted: {total_days}")


if __name__ == "__main__":
    main()
