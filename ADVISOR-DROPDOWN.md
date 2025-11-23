# Advisor Dropdown Feature

## Overview
The Advisor Name field has been converted from a text input to a dropdown that loads advisor data from a JSON file. Each advisor has their own Calendly link, which is automatically used on the final booking page.

## How It Works

### 1. **Advisors Data File** (`advisors.json`)
Located in the root directory, this file contains an array of advisor objects:

```json
[
    {
        "name": "John Smith",
        "calendlyLink": "https://calendly.com/john-smith/strategy-call"
    },
    {
        "name": "Sarah Johnson",
        "calendlyLink": "https://calendly.com/sarah-johnson/strategy-call"
    }
]
```

**Structure:**
- `name`: The advisor's full name (displayed in dropdown)
- `calendlyLink`: The advisor's personal Calendly booking link

### 2. **Dropdown Population**
When the page loads:
1. The app fetches `advisors.json`
2. Populates the dropdown with advisor names
3. Stores each advisor's Calendly link in the option's `data-calendly-link` attribute

### 3. **Form Submission**
When a user submits the form:
1. Captures the selected advisor's name
2. Retrieves the associated Calendly link from the selected option
3. Stores both in `userData` object:
   - `userData.advisorName`: The advisor's name
   - `userData.advisorCalendlyLink`: The advisor's Calendly link

### 4. **Final Booking Page**
On the final screen (Step 4):
- The "Book Strategy Call" button uses the **selected advisor's Calendly link**
- Falls back to the default `config.calendlyUrl` if no advisor was selected

## Adding/Updating Advisors

### To Add a New Advisor:
1. Open `advisors.json`
2. Add a new object to the array:
```json
{
    "name": "New Advisor Name",
    "calendlyLink": "https://calendly.com/new-advisor/meeting"
}
```
3. Save the file
4. The dropdown will automatically update on next page load

### To Update an Advisor:
1. Find the advisor in `advisors.json`
2. Update their `name` or `calendlyLink`
3. Save the file

### To Remove an Advisor:
1. Delete their object from the `advisors.json` array
2. Save the file

## Example Usage

### Sample advisors.json:
```json
[
    {
        "name": "John Smith - Retirement Planning",
        "calendlyLink": "https://calendly.com/john-smith/retirement"
    },
    {
        "name": "Sarah Johnson - Investment Strategy",
        "calendlyLink": "https://calendly.com/sarah-johnson/investments"
    },
    {
        "name": "Michael Brown - Tax Planning",
        "calendlyLink": "https://calendly.com/michael-brown/tax-planning"
    }
]
```

## Data Flow

```
User selects advisor from dropdown
        ↓
Form submission captures:
  - Advisor Name: "John Smith"
  - Calendly Link: "https://calendly.com/john-smith/strategy-call"
        ↓
User completes video flow
        ↓
Final page shows "Book Strategy Call" button
        ↓
Button links to John Smith's Calendly page
```

## Google Sheets Integration

The selected advisor's name is saved to Google Sheets in the "Advisor Name" column, allowing you to track which advisor each lead is assigned to.

## Validation

The advisor dropdown is marked as `required`, so users must select an advisor before submitting the form.

## Fallback Behavior

If:
- `advisors.json` fails to load
- No advisor is selected (shouldn't happen due to validation)
- The Calendly link is missing

The system will fall back to the default `calendlyUrl` from `config.js`.

## Technical Details

### Files Modified:
- `advisors.json` - New file containing advisor data
- `index.html` - Changed input to select dropdown
- `app.js` - Added advisor loading and link handling logic

### Key Functions:
- `loadAdvisors()` - Fetches and populates advisor dropdown
- `setupFinalScreen()` - Sets the correct Calendly link on final page

### Data Storage:
- `advisors` array - Global variable storing all advisor data
- `userData.advisorName` - Selected advisor's name
- `userData.advisorCalendlyLink` - Selected advisor's Calendly URL
