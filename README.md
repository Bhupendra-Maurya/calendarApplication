# Calendar Application 
## [Live Demo](https://calendar-application-two.vercel.app/)

Infinite-scrolling calendar with journal entries, search, and keyboard navigation. Built with React and TypeScript.

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


### 1. Infinite Scroll
- ✅ Scrolls infinitely into past and future months
- ✅ Seamless loading without jumps or flickers
- ✅ Pre-loads  months with background expansion

### 2. Continuous Scrolling
- ✅ Smooth, fluid scrolling on desktop and mobile
- ✅ Days flow continuously across month boundaries
- ✅ Multiple months can be partially visible
- ✅ Social media-like scrolling experience

### 3. Month & Year Display
- ✅ Header shows current visible month and year
- ✅ Updates dynamically based on scroll position
- ✅ Shows month with most visible area in viewport

### 4. Day Grid Layout
- ✅ Proper 7-column calendar grid (Monday-Sunday)
- ✅ Real 2025 calendar with correct date alignment
- ✅ Clean, consistent day cell sizing

### 5. Journal Entry Integration
- ✅ Complete JSON dataset integration
- ✅ All entry data: Image URL, Rating, Categories, Date, Description
- ✅ Swipable modal navigation between entries

### 6. Responsiveness & Mobile Optimization
- ✅ Works perfectly on desktop, laptop, and mobile
- ✅ Adaptive layouts for different screen sizes
- ✅ Touch-optimized interactions

### 7. Performance & Memory Management
- ✅ Smooth scrolling even after extensive navigation
- ✅ Efficient memory management with smart pre-loading
- ✅ No lag or performance degradation

##  Features
- ✅ **TypeScript** - Full type safety
- ✅ **Keyboard Navigation** - Arrow keys for months/entries
- ✅ **Event Search/Filtering** - Real-time search functionality
- ✅ **Animated Month Header** - Smooth transitions when month changes


### Calendar Layout
- **Week format** - Sunday to Saturday
- **Continuous flow** - Days seamlessly flow across month boundaries
- **Current month highlighting** - Always highlights actual current month
- **Today highlighting** - Blue circle and border on current date

### Search Functionality
- **Real-time filtering** - Updates as you type
- **Case-insensitive** - Searches descriptions and categories
- **Partial matching** - Finds entries containing search term
- **Modal navigation** - Navigate within filtered results


### Mobile Experience
- **Touch gestures** - Swipe support for modal navigation
- **Responsive design** - Consistent experience across devices
- **Optimized sizing** - Perfect day cell dimensions for mobile
