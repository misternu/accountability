# Sleep Tracker - Accountability App

## Project Overview
A React-based sleep tracking application that helps users log and visualize their daily sleep habits. Users complete a morning check-in to record sleep hours and quality scores, with historical data displayed in an interactive D3.js chart.

## Tech Stack
- React 19.2.0
- Vite 7.2.4 (build tool)
- D3.js 7.9.0 (data visualization)
- Tailwind CSS 4.1.17 (styling)
- Lucide React (icons)
- LocalStorage (data persistence)

## Project Structure
```
/
├── src/
│   ├── App.jsx          # Main application component
│   ├── main.jsx         # Application entry point
│   └── App.css          # Component styles
├── package.json         # Dependencies and scripts
└── vite.config.js       # Vite configuration
```

## Key Features

### Daily Check-in System
- Users log sleep hours and sleep score each morning
- One check-in per day (prevents duplicate entries for same date)
- Form validation ensures required fields are filled
- Enter key submits form when both fields are filled
- Input constraints: hours >= 0 (any decimal), score 1-100 (whole numbers)
- Data persists in browser localStorage

### Data Visualization
- Bar chart showing last 7 calendar days using D3.js
- Always displays 7 bars: blue for days with data, gray placeholder for missed days
- Horizontal red line at score of 70 as reference threshold
- Day-of-week labels (Mon, Tue, etc.) displayed below bars
- Actual scores displayed inside bars (only for days with data)

### Data Management
- All sleep history stored in localStorage as JSON
- Entries sorted by date (most recent first)
- Debug modal available to inspect raw localStorage data
- Today's date calculated using `en-CA` locale format (YYYY-MM-DD)

### UI States
1. **Check-in Form**: Displayed when user hasn't completed today's check-in
2. **Completion View**: Shows confirmation and historical chart after check-in

## Data Structure

### Sleep Entry Object
```javascript
{
  date: "2025-12-07",           // ISO date string (YYYY-MM-DD)
  hours: 7.5,                   // Float: hours of sleep
  score: 85,                    // Integer 1-100: sleep quality score
  timestamp: "2025-12-07T10:30:00Z"  // ISO timestamp of check-in
}
```

### LocalStorage Key
- `sleepHistory`: Array of sleep entry objects

## Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Component Architecture

### App.jsx
Main component managing all application state and logic:

**State Variables:**
- `sleepHours` - Current input for hours
- `sleepScore` - Current input for score
- `history` - Array of all sleep entries
- `todayCompleted` - Boolean tracking if today's check-in is done
- `showDebug` - Boolean controlling debug modal visibility
- `showDeleteConfirm` - Boolean for delete confirmation dialog

**Key Functions:**
- `loadData()` - Loads history from localStorage on mount
- `submitCheckin()` - Saves new entry and updates state
- `getLast7Days()` - Returns array of last 7 calendar days (with null values for missing days)
- `deleteAllData()` - Clears all history from localStorage and resets state
- `drawChart()` - Renders D3 bar chart
- `formatDate()` - Converts YYYY-MM-DD to "Day M/D" format

## Important Implementation Details

### Date Handling
- Uses `en-CA` locale for consistent YYYY-MM-DD format
- Manually parses date strings to avoid timezone issues
- Month is 0-indexed when creating Date objects from parts

### Chart Rendering
- Chart redraws when `todayCompleted` or `history` changes
- SVG cleared before each render to prevent duplicates
- Margins: 20px on all sides
- Chart dimensions: 600x300px total (560x260px drawable area)
- Y-axis scale: 0-100 (matching score range)

### Data Updates
- Today's existing entry is filtered out before adding new one
- History always sorted by date descending
- localStorage updated synchronously with state

## Debug Tools
- Bug icon button in header reveals debug modal
- Modal displays raw JSON of entire sleep history
- Delete All Data button with confirmation dialog to clear history
- Useful for inspecting data structure and troubleshooting

## Known Constraints
- No backend - all data stored locally
- Data lost if localStorage cleared
- No user authentication
- No data export/import functionality
- Limited to browser where data was entered

## Development Notes
- Uses React hooks (useState, useEffect, useRef)
- D3 chart uses imperative DOM manipulation via ref
- Tailwind classes for all styling
- Hours input accepts any decimal (step="any"), score input accepts whole numbers (step="1")
