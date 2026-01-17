# Meetings API Integration

## Overview

Version 1.3.0 migrates from the OpenF1 Sessions API to the Meetings API for fetching primary race information. This provides richer metadata and more accurate Grand Prix naming.

## API Comparison

### Sessions API (v1.2.0 and earlier)

**Endpoint:**
```
GET https://api.openf1.org/v1/sessions?session_name=Race&year=2026
```

**Data Structure:**
```json
{
  "session_name": "Race",
  "meeting_name": "Australian Grand Prix",
  "location": "Melbourne",
  "circuit_short_name": "Melbourne",
  "country_name": "Australia",
  "date_start": "2026-03-15T05:00:00Z",
  "meeting_key": 1234
}
```

**Issues:**
- Generic naming (location repeated in multiple fields)
- Limited metadata
- Session-focused rather than event-focused

### Meetings API (v1.3.0+)

**Endpoint:**
```
GET https://api.openf1.org/v1/meetings?year=2026&date_start>=2026-01-17
```

**Data Structure:**
```json
{
  "meeting_key": 1234,
  "meeting_name": "Australian Grand Prix",
  "meeting_official_name": "FORMULA 1 ROLEX AUSTRALIAN GRAND PRIX 2026",
  "location": "Melbourne",
  "country_name": "Australia",
  "country_code": "AUS",
  "country_key": 14,
  "country_flag": "https://media.formula1.com/.../australia-flag.png",
  "circuit_short_name": "Albert Park",
  "circuit_key": 1,
  "circuit_type": "Permanent",
  "circuit_image": "https://media.formula1.com/.../albert-park.png",
  "date_start": "2026-03-13T00:00:00Z",
  "date_end": "2026-03-15T06:00:00Z",
  "gmt_offset": "+11:00:00",
  "year": 2026
}
```

**Benefits:**
- Proper Grand Prix naming
- Rich visual assets (flags, circuit images)
- Circuit classification
- Official event names
- Complete geographical data

## Implementation Changes

### getNextRace() Function

**Before (v1.2.0):**
```javascript
export async function getNextRace() {
  const response = await fetch(
    `${F1_API_BASE}/sessions?session_name=Race&year=${currentYear}&date_start>=${now.split('T')[0]}`
  );
  const sessions = await response.json();
  return formatRaceData(sessions[0]);
}
```

**After (v1.3.0):**
```javascript
export async function getNextRace() {
  const response = await fetch(
    `${F1_API_BASE}/meetings?year=${currentYear}&date_start>=${now.split('T')[0]}`
  );
  const meetings = await response.json();
  return formatRaceData(meetings[0]);
}
```

### formatRaceData() Function

**Before (v1.2.0):**
```javascript
function formatRaceData(session) {
  return {
    name: session.meeting_name || session.location,
    location: session.location || session.country_name,
    circuit: session.circuit_short_name,
    dateStart: session.date_start,
    year: session.year,
    meetingKey: session.meeting_key
  };
}
```

**After (v1.3.0):**
```javascript
function formatRaceData(meeting) {
  return {
    name: meeting.meeting_name,
    officialName: meeting.meeting_official_name,
    location: meeting.location,
    country: meeting.country_name,
    circuit: meeting.circuit_short_name,
    circuitType: meeting.circuit_type,
    countryFlag: meeting.country_flag,
    dateStart: meeting.date_start,
    dateEnd: meeting.date_end,
    year: meeting.year,
    meetingKey: meeting.meeting_key
  };
}
```

## UI Impact

### Display Changes

**Before:**
```
Race: Melbourne
Location: Melbourne
Circuit: Melbourne
```

**After:**
```
Name: Australian Grand Prix
Location: Melbourne, Australia
Circuit: Albert Park
```

### TTS Content Changes

**Before:**
```
Hello Formula 1 fans! Let me tell you about the next race.

The next race is the Melbourne, taking place in Melbourne.

The race will be held on [date] at [time].

Get ready for an exciting race at Melbourne!
```

**After:**
```
Hello Formula 1 fans! Let me tell you about the upcoming 
Australian Grand Prix in the 2026 season.

This race weekend takes place in Melbourne, Australia.

The drivers will be racing at the Albert Park circuit, 
which is a permanent racing circuit.

The race is scheduled for [date] at [time].
```

## New Data Fields

### Circuit Type

**Values:**
- `"Permanent"` - Purpose-built racing circuits
- `"Temporary - Street"` - Street circuits in cities
- `"Temporary - Road"` - Temporary tracks on public roads

**Usage:** Included in TTS narration for educational context

### Country Flag

**Value:** URL to high-resolution flag image

**Usage:** 
- Downloaded and uploaded as 16x16 icon
- Displayed on first chapter of F1 card
- Provides visual context for race location

### Official Name

**Example:** "FORMULA 1 SINGAPORE AIRLINES SINGAPORE GRAND PRIX 2026"

**Usage:**
- Mentioned in TTS if different from meeting_name
- Adds official gravitas to content

### Circuit Image

**Value:** URL to circuit map/illustration

**Current Status:** Available but not yet used

**Future:** Could be used for:
- Card cover images
- UI displays
- Educational content

## Session Data Still Used

The Meetings API provides the overall event information, but session-specific data still comes from the Sessions API:

```javascript
// Get meeting data
const raceData = await getNextRace(); // Uses Meetings API

// Get session data for this meeting
const sessions = await getUpcomingSessions(raceData.meetingKey); // Uses Sessions API
```

This hybrid approach provides:
- **Meeting-level**: Grand Prix name, country, circuit type
- **Session-level**: Individual practice, qualifying, race times

## Migration Benefits

### 1. Accurate Naming

Instead of repeating location names, proper Grand Prix titles:
- "Australian Grand Prix" not "Melbourne"
- "Singapore Grand Prix" not "Singapore"
- "United States Grand Prix" not "Austin"

### 2. Rich Metadata

Access to:
- Official event names
- Circuit classifications
- Country flags
- Circuit images
- GMT offsets

### 3. Better User Experience

- More professional presentation
- Educational circuit type information
- Visual country context via flags
- Accurate geographical data

### 4. Future-Proofing

Additional fields available for future features:
- Circuit images for cards
- Country codes for filtering
- Official names for formal contexts
- Circuit keys for detailed data lookups

## Backward Compatibility

### Breaking Changes

None - the data structure returned by `getNextRace()` is enhanced, not changed:
- All existing fields still present
- New fields added without removing old ones
- Mock data updated to match new structure

### Testing

Mock data in `f1Service.js` updated to reflect Meetings structure:
```javascript
const MOCK_DATA = {
  nextRace: {
    name: "Australian Grand Prix",
    location: "Melbourne",
    country: "Australia",
    circuit: "Albert Park Circuit",
    circuitType: "Permanent",
    // ... other fields
  }
}
```

## API Documentation

Full OpenF1 Meetings API documentation:
https://openf1.org/#meetings

Key sections:
- Meeting attributes
- Filtering by year and date
- Date format requirements
- Rate limiting (3 requests/second)

## Error Handling

### Fallback Strategy

1. Try current year meetings
2. If none found, try next year
3. If still none, return mock data
4. Log errors but don't crash

```javascript
try {
  const meetings = await response.json();
  if (!meetings || meetings.length === 0) {
    // Try next year
  }
  return formatRaceData(meetings[0]);
} catch (error) {
  console.log("Using mock race data:", error.message);
  return MOCK_DATA.nextRace;
}
```

## Performance Considerations

### Request Frequency

Same as before - one request to fetch next race:
- v1.2.0: 1 request to Sessions API
- v1.3.0: 1 request to Meetings API

No performance impact.

### Data Size

Meetings API returns more data per object, but:
- Only one meeting fetched (next race)
- Additional fields are small (strings, URLs)
- Negligible impact on bandwidth

### Rate Limiting

OpenF1 limit: 3 requests/second

Current usage per card generation:
1. Meetings (next race)
2. Driver standings
3. Team standings
4. Upcoming sessions
5. Meeting details (optional)
6. Weather data (optional)

All stay within rate limit with 400ms delays between requests.

---

Last updated: January 17, 2026
