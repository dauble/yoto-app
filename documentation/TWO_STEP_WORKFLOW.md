# Two-Step Card Generation Workflow

## Overview

Version 1.3.0 introduces a two-step workflow for generating and deploying F1 cards. This development feature allows you to review generated content before sending it to Yoto.

## Workflow

### Step 1: Generate Card Data

**Button:** "Generate F1 Card"

**What Happens:**

1. Fetches meeting data from OpenF1 Meetings API
2. Gets driver and team standings
3. Fetches upcoming sessions for the race weekend
4. Downloads and uploads country flag icon
5. Builds chapter structure with TTS content
6. Returns data to UI for review

**No Yoto API calls are made yet!**

### Step 2: Send to Yoto

**Button:** "📤 Send to Yoto"

**What Happens:**

1. Takes generated chapter data
2. Creates TTS playlist via Yoto Labs API
3. Uploads cover image (if available)
4. Deploys to all connected devices
5. Returns job ID for status tracking
6. Polls for completion status

## UI Elements

### Development Mode Banner

```
🔧 Development Mode: Review the content and click 'Send to Yoto' when ready.
```

Appears between "Generate" and the generated content display.

### Send to Yoto Button

- **State**: Only appears after successful generation
- **Color**: Orange/amber (high visibility)
- **Disabled**: While sending (shows "Sending to Yoto...")
- **Action**: Triggers `/api/send-to-yoto` endpoint

### Status Display

After clicking "Send to Yoto":

- Job ID
- Status (Queued/Processing/Completed/Failed)
- Progress tracker (X of Y tracks)
- Device deployment status

## API Endpoints

### POST /api/generate-card

**Purpose:** Generate card data only

**Response:**

```json
{
  "success": true,
  "race": { ... },
  "drivers": [ ... ],
  "teams": [ ... ],
  "chapters": [ ... ],
  "message": "Formula 1 card data generated successfully!"
}
```

**No longer creates:**

- TTS playlist
- Yoto card
- Device deployments

### POST /api/send-to-yoto

**Purpose:** Deploy generated data to Yoto

**Request:**

```json
{
  "chapters": [ ... ],
  "title": "F1: Next Race",
  "updateExisting": true
}
```

**Response:**

```json
{
  "success": true,
  "yoto": {
    "jobId": "abc123",
    "cardId": "xyz789",
    "status": "queued",
    "progress": { ... }
  },
  "deviceDeployment": {
    "success": 2,
    "failed": 0,
    "total": 2
  },
  "message": "Formula 1 card created successfully!"
}
```

## Component State Management

### New State Variables (page.js)

```javascript
const [sendingToYoto, setSendingToYoto] = useState(false);
const [yotoResult, setYotoResult] = useState(null);
```

### State Flow

1. User clicks "Generate F1 Card"
   - `loading` = true
   - `result` = null
   - `yotoResult` = null

2. Generation completes
   - `loading` = false
   - `result` = { race, chapters, ... }
   - `yotoResult` = null (still)

3. User clicks "Send to Yoto"
   - `sendingToYoto` = true
   - `result` = unchanged
   - `yotoResult` = null

4. Sending completes
   - `sendingToYoto` = false
   - `result` = unchanged
   - `yotoResult` = { yoto, deviceDeployment, ... }

## Benefits

### For Development

1. **Content Review**: See exactly what will be narrated
2. **Debugging**: Isolate data fetching from API calls
3. **Testing**: Test generation without TTS costs
4. **Iteration**: Quickly modify content structure

### For Users

1. **Control**: Explicit action to send data
2. **Preview**: Review race information before deployment
3. **Transparency**: Clear understanding of what's happening
4. **Flexibility**: Can generate multiple times before sending

## Future Considerations

### Potential Enhancements

1. **Edit Before Send**: Allow users to modify chapter text
2. **Voice Selection**: Choose different TTS voices
3. **Chapter Reordering**: Rearrange chapter sequence
4. **Content Filtering**: Select which chapters to include

### Production Mode

The two-step workflow may become:

- **Optional**: Toggle in settings
- **Automatic**: Skip review step by default
- **Advanced Feature**: For power users only

## Code Structure

### Files Modified

- **src/app/page.js**: UI components and state management
- **src/app/api/send-to-yoto/route.js**: New endpoint (created)
- **src/app/api/generate-card/route.js**: Simplified to only generate
- **src/app/page.module.css**: New styles for dev mode UI

### Key Functions

```javascript
// Frontend
handleGenerateCard(); // Step 1: Generate
handleSendToYoto(); // Step 2: Send

// Backend
POST / api / generate - card; // Data generation
POST / api / send - to - yoto; // Yoto deployment
```

## Troubleshooting

### "Send to Yoto" Button Not Appearing

**Cause**: Generation didn't complete successfully

**Solution**:

- Check browser console for errors
- Ensure authentication is valid
- Verify OpenF1 API is accessible

### Content Shows But Status Doesn't Update

**Cause**: Separate state for generation and deployment

**Solution**:

- Check `yotoResult` state (not `result`)
- Verify job polling is active
- Check network tab for API calls

### Error After Clicking "Send to Yoto"

**Possible Causes**:

- Yoto authentication expired
- Network connectivity issues
- Malformed chapter data

**Debug Steps**:

1. Check browser console
2. Verify `/api/send-to-yoto` response
3. Ensure chapters array is valid
4. Check Yoto API status

## Migration Guide

### From Previous Versions

If upgrading from v1.2.0 or earlier:

**No action needed!** The UI will automatically show the new two-step workflow.

**What changed**:

- Old: Single button generates and sends
- New: Two buttons (generate, then send)

**Backward compatibility**: None (feature change only)

---

Last updated: January 17, 2026
