function getShowStatus(date = new Date()) {
  // Use local/IST time for the schedule:
  // 10:00 AM = 10 * 60 = 600 mins
  // 2:00 PM  = 14 * 60 = 840 mins
  // 6:30 PM  = 18 * 60 + 30 = 1110 mins
  // 9:00 PM  = 21 * 60 = 1260 mins
  const SHOWS = [
    { name: "Morning Show", hours: 10, mins: 0, duration: 2 * 3600 + 30 * 60 }, // 10:00 - 12:30 (9000s)
    { name: "Matinee Show", hours: 14, mins: 0, duration: 2 * 3600 + 30 * 60 }, // 14:00 - 16:30 (9000s)
    { name: "Evening Show", hours: 18, mins: 30, duration: 2 * 3600 + 20 * 60 }, // 18:30 - 20:50 (8400s)
    { name: "Night Show",   hours: 21, mins: 0, duration: 2 * 3600 + 30 * 60 }  // 21:00 - 23:30 (9000s)
  ];

  const nowMs = date.getTime();
  const nowSecs = Math.floor(nowMs / 1000);

  // Convert each show to timestamp for today
  let activeShow = null;
  let nextShow = null;

  for (let dayOffset = -1; dayOffset <= 1; dayOffset++) {
    for (const show of SHOWS) {
      const showDate = new Date(date);
      showDate.setDate(showDate.getDate() + dayOffset);
      showDate.setHours(show.hours, show.mins, 0, 0);
      const startSecs = Math.floor(showDate.getTime() / 1000);
      const endSecs = startSecs + show.duration;

      if (nowSecs >= startSecs && nowSecs < endSecs) {
        activeShow = { ...show, start: startSecs, end: endSecs };
      } else if (startSecs > nowSecs) {
        if (!nextShow || startSecs < nextShow.start) {
          nextShow = { ...show, start: startSecs, end: endSecs };
        }
      }
    }
  }

  if (activeShow) {
    const elapsed = nowSecs - activeShow.start;
    return {
      mode: "daily",
      phase: "running",
      duration: activeShow.duration,
      start: activeShow.start,
      end: activeShow.end,
      next: nextShow ? nextShow.start : activeShow.end + 3600,
      pos: elapsed, // E.g. at 10:30 AM, elapsed = 1800s (30m)
      left: activeShow.end - nowSecs
    };
  }

  // If between shows (e.g. doors open for next show)
  const nextStart = nextShow ? nextShow.start : nowSecs + 1800;
  return {
    mode: "daily",
    phase: "doors",
    duration: 9000,
    start: 0,
    end: 0,
    next: nextStart,
    pos: 0,
    left: Math.max(0, nextStart - nowSecs)
  };
}

// Test cases:
// 1. 10:30 AM
const test1030 = new Date();
test1030.setHours(10, 30, 0, 0);
console.log("10:30 AM status:", getShowStatus(test1030));

// 2. 2:15 PM
const test1415 = new Date();
test1415.setHours(14, 15, 0, 0);
console.log("2:15 PM status:", getShowStatus(test1415));

// 3. Current time
console.log("Current time status:", getShowStatus(new Date()));
