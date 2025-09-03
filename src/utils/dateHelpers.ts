export interface JournalEntry {
  imgUrl: string;
  rating: number;
  categories: string[];
  date: string; // Format: DD/MM/YYYY
  description: string;
}

export const parseDate = (dateString: string): Date => {
  const [day, month, year] = dateString.split('/').map(Number);
  return new Date(year, month - 1, day);
};

export const formatDate = (date: Date): string => {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

export const isSameDay = (date1: Date, date2: Date): boolean => {
  return date1.getFullYear() === date2.getFullYear() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getDate() === date2.getDate();
};

export const getMonthName = (month: number): string => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return months[month];
};

export const getDaysInMonth = (year: number, month: number): number => {
  return new Date(year, month + 1, 0).getDate();
};

export const getFirstDayOfMonth = (year: number, month: number): number => {
  return new Date(year, month, 1).getDay();
};

export const getMonthData = (year: number, month: number) => {
  const daysInMonth = getDaysInMonth(year, month);
  const days = [];
  
  // Current month days only
  for (let day = 1; day <= daysInMonth; day++) {
    days.push({
      day,
      isCurrentMonth: true,
      date: new Date(year, month, day),
      isPrevMonth: false
    });
  }
  
  return days;
};

export const getContinuousMonthData = (year: number, month: number) => {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOfWeek = getFirstDayOfMonth(year, month);
  const daysInPrevMonth = getDaysInMonth(year, month - 1);
  
  const days = [];
  
  // Previous month's trailing days
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    days.push({
      day: daysInPrevMonth - i,
      isCurrentMonth: false,
      date: new Date(year, month - 1, daysInPrevMonth - i),
      isPrevMonth: true
    });
  }
  
  // Current month days
  for (let day = 1; day <= daysInMonth; day++) {
    days.push({
      day,
      isCurrentMonth: true,
      date: new Date(year, month, day),
      isPrevMonth: false
    });
  }
  
  // Only add next month days if we need to complete the last week
  const totalDays = days.length;
  const remainingInWeek = totalDays % 7;
  if (remainingInWeek !== 0) {
    const daysToAdd = 7 - remainingInWeek;
    for (let day = 1; day <= daysToAdd; day++) {
      days.push({
        day,
        isCurrentMonth: false,
        date: new Date(year, month + 1, day),
        isPrevMonth: false
      });
    }
  }
  
  return days;
};

export const getJournalEntriesForDate = (entries: JournalEntry[], date: Date): JournalEntry[] => {
  return entries.filter(entry => {
    const entryDate = parseDate(entry.date);
    return isSameDay(entryDate, date);
  });
};

export const getAllJournalEntries = (): JournalEntry[] => [
  {
    imgUrl: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg",
    rating: 4.8,
    categories: ["Deep Conditioning", "Moisture", "Hair Growth", "Natural Products"],
    date: "05/08/2025",
    description: "Finally tried the coconut oil deep conditioning treatment. My hair feels incredibly soft and manageable. Noticed significantly less breakage during combing."
  },
  {
    imgUrl: "https://images.pexels.com/photos/33669506/pexels-photo-33669506.jpeg",
    rating: 3.5,
    categories: ["Protein Treatment", "Hair Repair", "Salon Visit"],
    date: "12/08/2025",
    description: "Protein treatment at the salon. Hair feels a bit stiff - might have been too much protein. Need to balance with more moisture next time."
  },
  {
    imgUrl: "https://images.pexels.com/photos/33653029/pexels-photo-33653029.jpeg",
    rating: 4.5,
    categories: ["Protective Style", "Braids", "Scalp Care"],
    date: "20/08/2025",
    description: "Got box braids installed. Used tea tree oil on scalp before installation. Feeling confident about this protective style for the next few weeks."
  },
  {
    imgUrl: "https://images.pexels.com/photos/33659051/pexels-photo-33659051.png",
    rating: 4.2,
    categories: ["Hair Mask", "DIY Treatment", "Hydration"],
    date: "28/08/2025",
    description: "Made a DIY avocado and honey hair mask. Hair feels incredibly nourished. Will definitely repeat this treatment next month."
  },
  {
    imgUrl: "https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg",
    rating: 5.0,
    categories: ["New Product", "Leave-in Conditioner", "Curl Definition"],
    date: "03/09/2025",
    description: "Tried the new curl-defining leave-in conditioner. Amazing results! Perfect curl definition without any crunch. Found my holy grail product!"
  },
  {
    imgUrl: "https://images.pexels.com/photos/33699867/pexels-photo-33699867.jpeg",
    rating: 3.8,
    categories: ["Trim", "Hair Health", "Split Ends"],
    date: "10/09/2025",
    description: "Got a much-needed trim today. Removed about an inch of damaged ends. Hair looks healthier but shorter than expected."
  },
  {
    imgUrl: "https://images.pexels.com/photos/33703919/pexels-photo-33703919.jpeg",
    rating: 4.6,
    categories: ["Oil Treatment", "Scalp Massage", "Growth"],
    date: "15/09/2025",
    description: "Weekly scalp massage with rosemary oil blend. Starting to notice new growth at temples. Consistent routine is paying off!"
  },
  {
    imgUrl: "https://images.pexels.com/photos/33681810/pexels-photo-33681810.jpeg",
    rating: 4.0,
    categories: ["Wash Day", "Detangling", "Deep Clean"],
    date: "20/09/2025",
    description: "Thorough wash day with clarifying shampoo. Took time to properly section and detangle. Hair feels clean and refreshed."
  },
  {
    imgUrl: "https://images.pexels.com/photos/33711580/pexels-photo-33711580.jpeg",
    rating: 4.7,
    categories: ["Heatless Styling", "Overnight Routine", "Waves"],
    date: "25/09/2025",
    description: "Tried silk rope braid overnight for heatless waves. Woke up to beautiful, bouncy waves. Love this damage-free styling method!"
  },
  {
    imgUrl: "https://images.pexels.com/photos/33714711/pexels-photo-33714711.jpeg",
    rating: 4.3,
    categories: ["Color Care", "Purple Shampoo", "Toning"],
    date: "30/09/2025",
    description: "Used purple shampoo to tone highlights. Color looks refreshed and brassy tones are gone. Need to remember not to leave it on too long next time."
  },



  // Add some more data for testing
  {
    imgUrl: "https://images.pexels.com/photos/33693712/pexels-photo-33693712.jpeg",
    rating: 4.5,
    categories: ["Hydration", "Mask", "Moisture"],
    date: "07/09/2025",
    description: "Applied a deep hydration mask. Hair feels softer and less frizzy."
  },
  {
    imgUrl: "https://images.pexels.com/photos/33694713/pexels-photo-33694713.jpeg",
    rating: 4.2,
    categories: ["Styling", "Heat Protection"],
    date: "08/09/2025",
    description: "Straightened hair with heat protectant. Smooth finish, but ends felt a little dry."
  },
  {
    imgUrl: "https://images.pexels.com/photos/33695714/pexels-photo-33695714.jpeg",
    rating: 3.9,
    categories: ["Color Care", "Gloss Treatment"],
    date: "09/09/2025",
    description: "Tried a gloss treatment. Shine improved, but color difference was subtle."
  },
  {
    imgUrl: "https://images.pexels.com/photos/33696715/pexels-photo-33696715.jpeg",
    rating: 4.7,
    categories: ["Repair", "Serum"],
    date: "11/09/2025",
    description: "Applied repair serum. Split ends look less noticeable, overall healthier look."
  },

   {
    imgUrl: "https://images.pexels.com/photos/33697716/pexels-photo-33697716.jpeg",
    rating: 4.4,
    categories: ["Purple Shampoo", "Toning"],
    date: "12/09/2025",
    description: "Used purple shampoo again. Blonde highlights look fresh, brassiness controlled well."
  },
  {
    imgUrl: "https://images.pexels.com/photos/33698717/pexels-photo-33698717.jpeg",
    rating: 4.1,
    categories: ["Scalp Care", "Exfoliation"],
    date: "13/09/2025",
    description: "Did a scalp exfoliation treatment. Roots feel cleaner and lighter, less product buildup."
  }
];