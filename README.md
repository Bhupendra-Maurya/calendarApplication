# Calendar Application

Infinite-scrolling calendar with journal entries, search, and keyboard navigation.

## How to Run Locally

1. **Clone and install**
```bash
git clone https://github.com/Bhupendra-Maurya/calendarApplication
cd calendarApplication
npm install
```

2. **Start development server**
```bash
npm run dev
```

3. **Open browser** - Navigate to `http://localhost:5173`

## Design 

### Calendar Layout
- **Week starts on Sunday** - Standard US calendar format
- **Infinite scroll** - Loads 6 months before/after current view for performance
- **Dynamic header** - Shows month with most visible area in viewport
- **Today highlighting** - Blue circle on current date (only in current month)

### Journal Entries
- **Date format** - DD/MM/YYYY in JSON data, parsed correctly
- **Multiple entries per day** - Grid layout when >1 entry on same date
- **Image fallback** - SVG placeholder for broken/missing images
- **Navigation scope** - Modal navigation works within filtered search results

### Search Functionality
- **Real-time filtering** - Updates as you type
- **Case-insensitive** - Searches descriptions and categories
- **Partial matching** - Finds entries containing search term

### Keyboard Navigation
- **Arrow Up/Down** - Navigate between months
- **Arrow Left/Right** - Navigate journal entries in modal
- **Escape** - Close modal

### Performance
- **Throttled scroll** - 16ms throttle for smooth performance
- **Lazy loading** - Months added/removed based on scroll position
- **Touch optimized** - Swipe gestures for mobile navigation