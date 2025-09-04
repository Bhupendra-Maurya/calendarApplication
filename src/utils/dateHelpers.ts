export interface JournalEntry {
  imgUrl: string;
  rating: number;
  categories: string[];
  date: string; // Format: DD/MM/YYYY
  description: string;
}

export const parseDate = (dateString: string): Date => {
  const [day, month, year] = dateString.split("/").map(Number);
  return new Date(year, month - 1, day);
};

export const formatDate = (date: Date): string => {
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

export const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

export const getMonthName = (month: number): string => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return months[month];
};

export const getDaysInMonth = (year: number, month: number): number => {
  return new Date(year, month + 1, 0).getDate();
};

export const getFirstDayOfMonth = (year: number, month: number): number => {
  return new Date(year, month, 1).getDay();
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
      isPrevMonth: true,
    });
  }

  // Current month days
  for (let day = 1; day <= daysInMonth; day++) {
    days.push({
      day,
      isCurrentMonth: true,
      date: new Date(year, month, day),
      isPrevMonth: false,
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
        isPrevMonth: false,
      });
    }
  }

  return days;
};

export const getMonthData = (year: number, month: number) => {
  const daysInMonth = getDaysInMonth(year, month);
  const days = [];

  // Generate continuous days for current month only
  for (let day = 1; day <= daysInMonth; day++) {
    days.push({
      day,
      isCurrentMonth: true,
      date: new Date(year, month, day),
      isPrevMonth: false,
    });
  }

  return days;
};

export const getJournalEntriesForDate = (
  entries: JournalEntry[],
  date: Date
): JournalEntry[] => {
  return entries.filter((entry) => {
    const entryDate = parseDate(entry.date);
    return isSameDay(entryDate, date);
  });
};

// export const getAllJournalEntries = (): JournalEntry[] => [
//   {
//     imgUrl: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg",
//     rating: 4.8,
//     categories: ["Deep Conditioning", "Moisture", "Hair Growth", "Natural Products"],
//     date: "05/08/2025",
//     description: "Finally tried the coconut oil deep conditioning treatment. My hair feels incredibly soft and manageable. Noticed significantly less breakage during combing."
//   },
//   {
//     imgUrl: "https://images.pexels.com/photos/33669506/pexels-photo-33669506.jpeg",
//     rating: 3.5,
//     categories: ["Protein Treatment", "Hair Repair", "Salon Visit"],
//     date: "12/08/2025",
//     description: "Protein treatment at the salon. Hair feels a bit stiff - might have been too much protein. Need to balance with more moisture next time."
//   },
//   {
//     imgUrl: "https://images.pexels.com/photos/33653029/pexels-photo-33653029.jpeg",
//     rating: 4.5,
//     categories: ["Protective Style", "Braids", "Scalp Care"],
//     date: "20/08/2025",
//     description: "Got box braids installed. Used tea tree oil on scalp before installation. Feeling confident about this protective style for the next few weeks."
//   },
//   {
//     imgUrl: "https://images.pexels.com/photos/33659051/pexels-photo-33659051.png",
//     rating: 4.2,
//     categories: ["Hair Mask", "DIY Treatment", "Hydration"],
//     date: "28/08/2025",
//     description: "Made a DIY avocado and honey hair mask. Hair feels incredibly nourished. Will definitely repeat this treatment next month."
//   },
//   {
//     imgUrl: "https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg",
//     rating: 5.0,
//     categories: ["New Product", "Leave-in Conditioner", "Curl Definition"],
//     date: "03/09/2025",
//     description: "Tried the new curl-defining leave-in conditioner. Amazing results! Perfect curl definition without any crunch. Found my holy grail product!"
//   },
//   {
//     imgUrl: "https://images.pexels.com/photos/33699867/pexels-photo-33699867.jpeg",
//     rating: 3.8,
//     categories: ["Trim", "Hair Health", "Split Ends"],
//     date: "10/09/2025",
//     description: "Got a much-needed trim today. Removed about an inch of damaged ends. Hair looks healthier but shorter than expected."
//   },
//   {
//     imgUrl: "https://images.pexels.com/photos/33703919/pexels-photo-33703919.jpeg",
//     rating: 4.6,
//     categories: ["Oil Treatment", "Scalp Massage", "Growth"],
//     date: "15/09/2025",
//     description: "Weekly scalp massage with rosemary oil blend. Starting to notice new growth at temples. Consistent routine is paying off!"
//   },
//   {
//     imgUrl: "https://images.pexels.com/photos/33681810/pexels-photo-33681810.jpeg",
//     rating: 4.0,
//     categories: ["Wash Day", "Detangling", "Deep Clean"],
//     date: "20/09/2025",
//     description: "Thorough wash day with clarifying shampoo. Took time to properly section and detangle. Hair feels clean and refreshed."
//   },
//   {
//     imgUrl: "https://images.pexels.com/photos/33711580/pexels-photo-33711580.jpeg",
//     rating: 4.7,
//     categories: ["Heatless Styling", "Overnight Routine", "Waves"],
//     date: "25/09/2025",
//     description: "Tried silk rope braid overnight for heatless waves. Woke up to beautiful, bouncy waves. Love this damage-free styling method!"
//   },
//   {
//     imgUrl: "https://images.pexels.com/photos/33714711/pexels-photo-33714711.jpeg",
//     rating: 4.3,
//     categories: ["Color Care", "Purple Shampoo", "Toning"],
//     date: "30/09/2025",
//     description: "Used purple shampoo to tone highlights. Color looks refreshed and brassy tones are gone. Need to remember not to leave it on too long next time."
//   },

//   // Add some more data for testing
// {
//   imgUrl: "https://images.pexels.com/photos/33693712/pexels-photo-33693712.jpeg",
//   rating: 4.5,
//   categories: ["Hydration", "Mask", "Moisture"],
//   date: "07/09/2025",
//   description: "Applied a deep hydration mask. Hair feels softer and less frizzy."
// },
// {
//   imgUrl: "https://images.pexels.com/photos/33694713/pexels-photo-33694713.jpeg",
//   rating: 4.2,
//   categories: ["Styling", "Heat Protection"],
//   date: "08/09/2025",
//   description: "Straightened hair with heat protectant. Smooth finish, but ends felt a little dry."
// },
// {
//   imgUrl: "https://images.pexels.com/photos/33695714/pexels-photo-33695714.jpeg",
//   rating: 3.9,
//   categories: ["Color Care", "Gloss Treatment"],
//   date: "09/09/2025",
//   description: "Tried a gloss treatment. Shine improved, but color difference was subtle."
// },
// {
//   imgUrl: "https://images.pexels.com/photos/33696715/pexels-photo-33696715.jpeg",
//   rating: 4.7,
//   categories: ["Repair", "Serum"],
//   date: "11/09/2025",
//   description: "Applied repair serum. Split ends look less noticeable, overall healthier look."
// },

//  {
//   imgUrl: "https://images.pexels.com/photos/33697716/pexels-photo-33697716.jpeg",
//   rating: 4.4,
//   categories: ["Purple Shampoo", "Toning"],
//   date: "12/09/2025",
//   description: "Used purple shampoo again. Blonde highlights look fresh, brassiness controlled well."
// },
// {
//   imgUrl: "https://images.pexels.com/photos/33698717/pexels-photo-33698717.jpeg",
//   rating: 4.1,
//   categories: ["Scalp Care", "Exfoliation"],
//   date: "13/09/2025",
//   description: "Did a scalp exfoliation treatment. Roots feel cleaner and lighter, less product buildup."
// }
// ];

export const getAllJournalEntries = (): JournalEntry[] => [
  // Month 1 - August 2025
  {
    imgUrl: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg",
    rating: 4.5,
    categories: ["Deep Conditioning", "Moisture"],
    date: "02/08/2025",
    description:
      "Tried a new deep conditioning mask. Hair feels soft and hydrated.",
  },
  {
    imgUrl:
      "https://images.pexels.com/photos/33693712/pexels-photo-33693712.jpeg",
    rating: 4.5,
    categories: ["Hydration", "Mask", "Moisture"],
    date: "07/09/2025",
    description:
      "Applied a deep hydration mask. Hair feels softer and less frizzy.",
  },
  {
    imgUrl:
      "https://images.pexels.com/photos/33694713/pexels-photo-33694713.jpeg",
    rating: 4.2,
    categories: ["Styling", "Heat Protection"],
    date: "08/09/2025",
    description:
      "Straightened hair with heat protectant. Smooth finish, but ends felt a little dry.",
  },
  {
    imgUrl:
      "https://images.pexels.com/photos/33695714/pexels-photo-33695714.jpeg",
    rating: 3.9,
    categories: ["Color Care", "Gloss Treatment"],
    date: "09/09/2025",
    description:
      "Tried a gloss treatment. Shine improved, but color difference was subtle.",
  },
  {
    imgUrl:
      "https://images.pexels.com/photos/33696715/pexels-photo-33696715.jpeg",
    rating: 4.7,
    categories: ["Repair", "Serum"],
    date: "11/09/2025",
    description:
      "Applied repair serum. Split ends look less noticeable, overall healthier look.",
  },

  {
    imgUrl:
      "https://images.pexels.com/photos/33697716/pexels-photo-33697716.jpeg",
    rating: 4.4,
    categories: ["Purple Shampoo", "Toning"],
    date: "12/09/2025",
    description:
      "Used purple shampoo again. Blonde highlights look fresh, brassiness controlled well.",
  },
  {
    imgUrl:
      "https://images.pexels.com/photos/33698717/pexels-photo-33698717.jpeg",
    rating: 4.1,
    categories: ["Scalp Care", "Exfoliation"],
    date: "13/09/2025",
    description:
      "Did a scalp exfoliation treatment. Roots feel cleaner and lighter, less product buildup.",
  },
  {
    imgUrl:
      "https://images.pexels.com/photos/33669506/pexels-photo-33669506.jpeg",
    rating: 3.8,
    categories: ["Protein Treatment", "Hair Repair"],
    date: "15/08/2025",
    description:
      "Protein treatment done at home. Hair feels a bit stiff but stronger.",
  },
  {
    imgUrl:
      "https://images.pexels.com/photos/33653029/pexels-photo-33653029.jpeg",
    rating: 4.2,
    categories: ["Protective Style", "Braids"],
    date: "25/08/2025",
    description:
      "Installed protective braids. Scalp feels healthy after applying oil.",
  },

  // Month 2 - September 2025
  {
    imgUrl:
      "https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg",
    rating: 4.9,
    categories: ["Leave-in Conditioner", "Curl Definition"],
    date: "04/09/2025",
    description:
      "Tried a new leave-in conditioner. Curl definition improved significantly.",
  },
  {
    imgUrl:
      "https://images.pexels.com/photos/33699867/pexels-photo-33699867.jpeg",
    rating: 4.0,
    categories: ["Trim", "Split Ends"],
    date: "12/09/2025",
    description:
      "Trimmed hair to remove split ends. Hair feels healthier and lighter.",
  },
  {
    imgUrl:
      "https://images.pexels.com/photos/33703919/pexels-photo-33703919.jpeg",
    rating: 4.6,
    categories: ["Scalp Massage", "Growth"],
    date: "20/09/2025",
    description: "Weekly scalp massage. Noticing new growth around hairline.",
  },

  // Month 3 - October 2025
  {
    imgUrl:
      "https://images.pexels.com/photos/33681810/pexels-photo-33681810.jpeg",
    rating: 4.3,
    categories: ["Wash Day", "Detangling"],
    date: "05/10/2025",
    description:
      "Detangled hair thoroughly. Used hydrating shampoo and conditioner.",
  },
  {
    imgUrl:
      "https://images.pexels.com/photos/33711580/pexels-photo-33711580.jpeg",
    rating: 4.7,
    categories: ["Heatless Styling", "Waves"],
    date: "14/10/2025",
    description:
      "Overnight braids for heatless waves. Hair looks bouncy and shiny.",
  },
  {
    imgUrl:
      "https://images.pexels.com/photos/33714711/pexels-photo-33714711.jpeg",
    rating: 4.1,
    categories: ["Color Care", "Toning"],
    date: "23/10/2025",
    description:
      "Applied toning shampoo. Highlights look fresher and less brassy.",
  },

  // Month 4 - November 2025
  {
    imgUrl:
      "https://images.pexels.com/photos/33693712/pexels-photo-33693712.jpeg",
    rating: 4.4,
    categories: ["Mask", "Moisture"],
    date: "03/11/2025",
    description:
      "Deep hydration mask applied. Hair feels smooth and frizz-free.",
  },
  {
    imgUrl:
      "https://images.pexels.com/photos/33694713/pexels-photo-33694713.jpeg",
    rating: 4.2,
    categories: ["Styling", "Heat Protection"],
    date: "18/11/2025",
    description:
      "Used heat protectant before straightening. Hair feels silky afterward.",
  },
  {
    imgUrl:
      "https://images.pexels.com/photos/33695714/pexels-photo-33695714.jpeg",
    rating: 4.6,
    categories: ["Color Care", "Gloss Treatment"],
    date: "27/11/2025",
    description: "Gloss treatment added shine. Hair looks vibrant and healthy.",
  },

  // Month 5 - December 2025
  {
    imgUrl:
      "https://images.pexels.com/photos/33696715/pexels-photo-33696715.jpeg",
    rating: 4.8,
    categories: ["Repair", "Serum"],
    date: "07/12/2025",
    description: "Applied repair serum. Split ends are less noticeable.",
  },
  {
    imgUrl:
      "https://images.pexels.com/photos/33697716/pexels-photo-33697716.jpeg",
    rating: 4.5,
    categories: ["Purple Shampoo", "Toning"],
    date: "16/12/2025",
    description:
      "Purple shampoo used to maintain blonde highlights. Works well!",
  },
  {
    imgUrl:
      "https://images.pexels.com/photos/33698717/pexels-photo-33698717.jpeg",
    rating: 4.3,
    categories: ["Scalp Care", "Exfoliation"],
    date: "29/12/2025",
    description: "Scalp exfoliation done. Hair feels lighter and cleaner.",
  },
  {
    imgUrl: "https://images.pexels.com/photos/33669555/pexels-photo-33669555.jpeg",
    rating: 4.5,
    categories: ["Facial Cleanser", "Charcoal"],
    date: "08/27/2025",
    description: "The charcoal cleanser feels like a deep clean. It helps with my oily T-zone and leaves my skin feeling fresh, but it can be a bit drying."
  },
  {
    imgUrl: "https://images.pexels.com/photos/33669556/pexels-photo-33669556.jpeg",
    rating: 4.7,
    categories: ["SPF Lip Balm", "Moisturizing"],
    date: "08/28/2025",
    description: "This lip balm is perfect for sun protection and keeps my lips soft and moisturized. I love that it's not waxy and doesn't have a strong scent."
  },
  {
    imgUrl: "https://images.pexels.com/photos/33669557/pexels-photo-33669557.jpeg",
    rating: 4.6,
    categories: ["Hair Mask", "Repairing"],
    date: "08/29/2025",
    description: "This repairing hair mask has made a huge difference in my damaged hair. It feels stronger, looks shinier, and is much less frizzy. A great weekly treatment."
  },
  {
    imgUrl: "https://images.pexels.com/photos/33669558/pexels-photo-33669558.jpeg",
    rating: 4.1,
    categories: ["Body Mist", "Light Scent"],
    date: "08/30/2025",
    description: "A nice, light body mist for a quick refresh. The scent doesn't last very long, but it's perfect for a subtle fragrance. Very convenient."
  },
  {
    imgUrl: "https://images.pexels.com/photos/33669559/pexels-photo-33669559.jpeg",
    rating: 4.3,
    categories: ["Foot Mask", "Exfoliating"],
    date: "08/31/2025",
    description: "The exfoliating foot mask worked wonders! My feet are so soft now. The process is a bit messy and takes a few days, but the results are incredible."
  },
  {
    imgUrl: "https://images.pexels.com/photos/33669560/pexels-photo-33669560.jpeg",
    rating: 4.9,
    categories: ["Serum", "Hyaluronic Acid"],
    date: "09/01/2025",
    description: "This hyaluronic acid serum has become a cornerstone of my routine. My skin is noticeably more plump and hydrated. I use it both morning and night."
  },
  {
    imgUrl: "https://images.pexels.com/photos/33669561/pexels-photo-33669561.jpeg",
    rating: 3.9,
    categories: ["Sunscreen", "Face"],
    date: "09/02/2025",
    description: "The facial sunscreen is effective, but it pills a little under my makeup. It's a great product for no-makeup days, but I'll need to find a different one for daily wear."
  },
  {
    imgUrl: "https://images.pexels.com/photos/33669562/pexels-photo-33669562.jpeg",
    rating: 4.5,
    categories: ["Eye Serum", "Brightening"],
    date: "09/03/2025",
    description: "This eye serum has helped to brighten my under-eye area. It's lightweight and absorbs quickly. I feel like I look a little more awake."
  },
  {
    imgUrl: "https://images.pexels.com/photos/33669563/pexels-photo-33669563.jpeg",
    rating: 4.6,
    categories: ["Foundation", "Dewy Finish"],
    date: "09/04/2025",
    description: "I'm loving this dewy foundation. It makes my skin look radiant and healthy without being greasy. It has good medium coverage and lasts all day."
  },
  {
    imgUrl: "https://images.pexels.com/photos/33669564/pexels-photo-33669564.jpeg",
    rating: 4.2,
    categories: ["Mascara", "Volumizing"],
    date: "09/05/2025",
    description: "This mascara gives my lashes great volume and length. It doesn't clump, but it can smudge a little in humid weather. Overall, a good product."
  },
  {
    imgUrl: "https://images.pexels.com/photos/33669565/pexels-photo-33669565.jpeg",
    rating: 4.8,
    categories: ["Lip Gloss", "Non-Sticky"],
    date: "09/06/2025",
    description: "This lip gloss is a winner! It's super shiny and, most importantly, not sticky at all. The shade is beautiful and it makes my lips feel hydrated."
  },
  {
    imgUrl: "https://images.pexels.com/photos/33669566/pexels-photo-33669566.jpeg",
    rating: 4.0,
    categories: ["Shave Cream", "Soothing"],
    date: "09/07/2025",
    description: "The shave cream provides a smooth glide and prevents irritation. It's great, but I wish the scent was a bit stronger. It's very subtle."
  },
  {
    imgUrl: "https://images.pexels.com/photos/33669567/pexels-photo-33669567.jpeg",
    rating: 5.0,
    categories: ["Acne Patch", "Hydrocolloid"],
    date: "09/08/2025",
    description: "These acne patches are magic! They shrink pimples overnight and protect the area from picking. A must-have for anyone dealing with breakouts."
  },
  {
    imgUrl: "https://images.pexels.com/photos/33669568/pexels-photo-33669568.jpeg",
    rating: 4.7,
    categories: ["Hair Oil", "Heat Protectant"],
    date: "09/09/2025",
    description: "This hair oil doubles as a heat protectant. It makes my hair so soft and shiny after blow-drying. It doesn't feel heavy or greasy, which is a big plus."
  },
  {
    imgUrl: "https://images.pexels.com/photos/33669569/pexels-photo-33669569.jpeg",
    rating: 4.4,
    categories: ["Toner", "Rose Water"],
    date: "09/10/2025",
    description: "The rose water toner is so soothing and refreshing. It has a beautiful, natural scent and preps my skin perfectly for the next step. A great, simple product."
  },
  {
    imgUrl: "https://images.pexels.com/photos/33669570/pexels-photo-33669570.jpeg",
    rating: 4.9,
    categories: ["Body Wash", "Exfoliating"],
    date: "09/11/2025",
    description: "This body wash with exfoliating beads is fantastic. It leaves my skin feeling incredibly smooth and clean. The scent is invigorating."
  },
  {
    imgUrl: "https://images.pexels.com/photos/33669571/pexels-photo-33669571.jpeg",
    rating: 3.6,
    categories: ["Hair Gel", "Strong Hold"],
    date: "09/12/2025",
    description: "The hair gel provides a very strong hold, but it leaves my hair feeling a bit crunchy. It's good for certain styles but not for everyday use."
  },
  {
    imgUrl: "https://images.pexels.com/photos/33669572/pexels-photo-33669572.jpeg",
    rating: 4.5,
    categories: ["Face Mask", "Brightening"],
    date: "09/13/2025",
    description: "This brightening mask has given me a noticeable glow. It feels so luxurious and makes my skin look more radiant and even-toned. I use it once a week."
  },
  {
    imgUrl: "https://images.pexels.com/photos/33669574/pexels-photo-33669574.jpeg",
    rating: 4.2,
    categories: ["Cleanser", "Creamy"],
    date: "09/15/2025",
    description: "This creamy cleanser is perfect for my dry, sensitive skin. It cleanses effectively without stripping moisture. My skin feels comforted and clean."
  },
  {
    imgUrl: "https://images.pexels.com/photos/33669575/pexels-photo-33669575.jpeg",
    rating: 4.9,
    categories: ["Serum", "Retinol"],
    date: "09/16/2025",
    description: "This retinol serum has visibly improved the texture of my skin. My pores look smaller and my complexion is smoother. I've had no irritation so far."
  },
  {
    imgUrl: "https://images.pexels.com/photos/33669576/pexels-photo-33669576.jpeg",
    rating: 3.7,
    categories: ["Hand Soap", "Foaming"],
    date: "09/17/2025",
    description: "The foaming hand soap is nice, but it feels a bit drying after multiple uses. The scent is lovely, but I might switch to a more moisturizing option."
  },
  {
    imgUrl: "https://images.pexels.com/photos/33669577/pexels-photo-33669577.jpeg",
    rating: 4.6,
    categories: ["Dry Shampoo", "Dark Hair"],
    date: "09/18/2025",
    description: "Finally, a dry shampoo that doesn't leave a white cast on my dark hair! It adds volume and refreshes my hair on non-wash days. A great product."
  },
  {
    imgUrl: "https://images.pexels.com/photos/33669578/pexels-photo-33669578.jpeg",
    rating: 4.4,
    categories: ["Eye Cream", "Hydrating"],
    date: "09/19/2025",
    description: "This hydrating eye cream has made my under-eyes feel much less dry. It sits well under concealer and provides a smooth base. I'm happy with it."
  },
  {
    imgUrl: "https://images.pexels.com/photos/33669579/pexels-photo-33669579.jpeg",
    rating: 4.8,
    categories: ["Lip Mask", "Overnight"],
    date: "09/20/2025",
    description: "I wake up with the softest, most plump lips after using this overnight lip mask. It's a miracle product for chapped lips. The scent is delicious."
  },
  {
    imgUrl: "https://images.pexels.com/photos/33669580/pexels-photo-33669580.jpeg",
    rating: 4.0,
    categories: ["Sunscreen", "Body Spray"],
    date: "09/21/2025",
    description: "The body sunscreen spray is so convenient to apply. It provides good protection, but I have to be careful to rub it in thoroughly to avoid streaks."
  },
  
  {
    imgUrl: "https://images.pexels.com/photos/33669594/pexels-photo-33669594.jpeg",
    rating: 4.9,
    categories: ["Hair Cream", "Smoothing"],
    date: "10/05/2025",
    description: "This hair cream tames frizz and adds a beautiful, healthy shine. My hair feels so smooth and soft. A little goes a long way for great results."
  },
  {
    imgUrl: "https://images.pexels.com/photos/33669595/pexels-photo-33669595.jpeg",
    rating: 3.8,
    categories: ["Hand Cream", "Coconut"],
    date: "10/06/2025",
    description: "The coconut hand cream smells amazing, but it's a bit too light for my very dry hands. It's good for a quick moisture boost but not for intensive care."
  },
  {
    imgUrl: "https://images.pexels.com/photos/33669596/pexels-photo-33669596.jpeg",
    rating: 4.7,
    categories: ["Shampoo", "Clarifying"],
    date: "10/07/2025",
    description: "This clarifying shampoo is fantastic for a deep clean. It removes all product buildup and leaves my scalp feeling so fresh. I use it once a week."
  },
  {
    imgUrl: "https://images.pexels.com/photos/33669597/pexels-photo-33669597.jpeg",
    rating: 4.6,
    categories: ["Body Wash", "Moisturizing"],
    date: "10/08/2025",
    description: "This moisturizing body wash leaves my skin feeling soft and clean. It has a lovely scent and a rich lather. A great product for everyday use."
  },
  {
    imgUrl: "https://images.pexels.com/photos/33669598/pexels-photo-33669598.jpeg",
    rating: 4.2,
    categories: ["Face Scrub", "Coffee"],
    date: "10/09/2025",
    description: "The coffee face scrub is a bit too abrasive for my sensitive skin, but it smells wonderful. I'll stick to using it on my body instead."
  },
  {
    imgUrl: "https://images.pexels.com/photos/33669599/pexels-photo-33669599.jpeg",
    rating: 4.8,
    categories: ["Lip Tint", "Stain"],
    date: "10/10/2025",
    description: "This lip tint is amazing! It gives a natural-looking flush of color that lasts for hours. It feels weightless on the lips and doesn't smudge."
  },
  {
    imgUrl: "https://images.pexels.com/photos/33669600/pexels-photo-33669600.jpeg",
    rating: 4.1,
    categories: ["Body Lotion", "Firming"],
    date: "10/11/2025",
    description: "The firming body lotion provides decent hydration. I'm not sure if it's actually firming my skin yet, but it feels nice and absorbs quickly."
  },
  {
    imgUrl: "https://images.pexels.com/photos/33669601/pexels-photo-33669601.jpeg",
    rating: 5.0,
    categories: ["Hair Serum", "Shine"],
    date: "10/12/2025",
    description: "This hair serum gives me the most incredible shine. It's the perfect finishing touch and makes my hair look so healthy. I can't live without it."
  },
  {
    imgUrl: "https://images.pexels.com/photos/33669602/pexels-photo-33669602.jpeg",
    rating: 3.9,
    categories: ["Face Primer", "Hydrating"],
    date: "10/13/2025",
    description: "The hydrating primer is okay, but I feel like I need to use a lot of it for it to make a difference. It does make my makeup last a bit longer, though."
  },
  {
    imgUrl: "https://images.pexels.com/photos/33669603/pexels-photo-33669603.jpeg",
    rating: 4.7,
    categories: ["Face Mask", "Peel-Off"],
    date: "10/14/2025",
    description: "This peel-off mask is very satisfying to use. It pulls out impurities and leaves my skin feeling incredibly smooth. It can be a little painful to peel off."
  },
  {
    imgUrl: "https://images.pexels.com/photos/33669604/pexels-photo-33669604.jpeg",
    rating: 4.4,
    categories: ["Body Butter", "Mango"],
    date: "10/15/2025",
    description: "The mango body butter smells absolutely heavenly. It's rich and creamy, perfect for dry patches. It absorbs well and leaves my skin feeling great."
  },
  {
    imgUrl: "https://images.pexels.com/photos/33669605/pexels-photo-33669605.jpeg",
    rating: 4.6,
    categories: ["Cleanser", "Micellar Water"],
    date: "10/16/2025",
    description: "This micellar water is my go-to for removing makeup. It's gentle, effective, and doesn't require rinsing. Perfect for lazy nights."
  },
  {
    imgUrl: "https://images.pexels.com/photos/33669606/pexels-photo-33669606.jpeg",
    rating: 4.2,
    categories: ["Shampoo", "Dandruff"],
    date: "10/17/2025",
    description: "The anti-dandruff shampoo has helped a lot with my itchy scalp. It has a slight medicinal scent, but it works well and leaves my hair feeling clean."
  },
  {
    imgUrl: "https://images.pexels.com/photos/33669607/pexels-photo-33669607.jpeg",
    rating: 4.8,
    categories: ["Lip Scrub", "Balm"],
    date: "10/18/2025",
    description: "This lip scrub and balm duo is fantastic. The scrub is gentle and the balm is super hydrating. My lips have never been this smooth and soft."
  },
  {
    imgUrl: "https://images.pexels.com/photos/33669608/pexels-photo-33669608.jpeg",
    rating: 4.0,
    categories: ["Body Mist", "Citrus"],
    date: "10/19/2025",
    description: "The citrus body mist is so refreshing, especially in the morning. The scent is a bit too subtle and doesn't last very long. It's a nice, quick spritz."
  },
  {
    imgUrl: "https://images.pexels.com/photos/33669609/pexels-photo-33669609.jpeg",
    rating: 4.9,
    categories: ["Moisturizer", "SPF"],
    date: "10/20/2025",
    description: "This moisturizer with SPF is a dream come true. It's lightweight, non-greasy, and provides excellent sun protection. My new daily essential."
  },
  {
    imgUrl: "https://images.pexels.com/photos/33669610/pexels-photo-33669610.jpeg",
    rating: 3.5,
    categories: ["Hair Spray", "Extra Hold"],
    date: "10/21/2025",
    description: "The extra-hold hair spray is a bit too stiff for my liking. It holds my style, but makes my hair feel like a helmet. Not a fan of the crunchy feeling."
  },
  {
    imgUrl: "https://images.pexels.com/photos/33669611/pexels-photo-33669611.jpeg",
    rating: 4.7,
    categories: ["Foot Cream", "Urea"],
    date: "10/22/2025",
    description: "This foot cream with urea is a powerhouse for cracked heels. It has made my feet incredibly soft and smooth. The results are visible after just a few uses."
  },
  {
    imgUrl: "https://images.pexels.com/photos/33669590/pexels-photo-33669590.jpeg",
    rating: 4.5,
    categories: ["Deodorant", "Antiperspirant"],
    date: "10/01/2025",
    description: "This antiperspirant works great for keeping me dry and fresh all day. It doesn't leave any white marks on my clothes, which is a big bonus."
  },
  
  {
    imgUrl: "https://images.pexels.com/photos/33669598/pexels-photo-33669598.jpeg",
    rating: 4.2,
    categories: ["Face Scrub", "Coffee"],
    date: "10/09/2025",
    description: "The coffee face scrub is a bit too abrasive for my sensitive skin, but it smells wonderful. I'll stick to using it on my body instead."
  },
  {
    imgUrl: "https://images.pexels.com/photos/33669599/pexels-photo-33669599.jpeg",
    rating: 4.8,
    categories: ["Lip Tint", "Stain"],
    date: "10/10/2025",
    description: "This lip tint is amazing! It gives a natural-looking flush of color that lasts for hours. It feels weightless on the lips and doesn't smudge."
  },
  {
    imgUrl: "https://images.pexels.com/photos/33669600/pexels-photo-33669600.jpeg",
    rating: 4.1,
    categories: ["Body Lotion", "Firming"],
    date: "10/11/2025",
    description: "The firming body lotion provides decent hydration. I'm not sure if it's actually firming my skin yet, but it feels nice and absorbs quickly."
  },
  {
    imgUrl: "https://images.pexels.com/photos/33669601/pexels-photo-33669601.jpeg",
    rating: 5.0,
    categories: ["Hair Serum", "Shine"],
    date: "10/12/2025",
    description: "This hair serum gives me the most incredible shine. It's the perfect finishing touch and makes my hair look so healthy. I can't live without it."
  },
  {
    imgUrl: "https://images.pexels.com/photos/33669602/pexels-photo-33669602.jpeg",
    rating: 3.9,
    categories: ["Face Primer", "Hydrating"],
    date: "10/13/2025",
    description: "The hydrating primer is okay, but I feel like I need to use a lot of it for it to make a difference. It does make my makeup last a bit longer, though."
  },
  {
    imgUrl: "https://images.pexels.com/photos/33669603/pexels-photo-33669603.jpeg",
    rating: 4.7,
    categories: ["Face Mask", "Peel-Off"],
    date: "10/14/2025",
    description: "This peel-off mask is very satisfying to use. It pulls out impurities and leaves my skin feeling incredibly smooth. It can be a little painful to peel off."
  },
];





// export const getAllJournalEntries = (): JournalEntry[] => [
//   {
//     imgUrl: "https://images.pexels.com/photos/33669506/pexels-photo-33669506.jpeg",
//     rating: 4.9,
//     categories: ["Hair Mask", "DIY Treatment"],
//     date: "07/09/2025",
//     description: "Experimented with a new hair serum. My hair feels incredibly nourished and soft, with a noticeable shine. The scent is subtle and pleasant."
//   },
//   {
//     imgUrl: "https://images.pexels.com/photos/33669507/pexels-photo-33669507.jpeg",
//     rating: 4.5,
//     categories: ["Face Mask", "Hydration"],
//     date: "07/10/2025",
//     description: "Used a new sheet mask. My skin feels deeply hydrated and plump. It was a bit sticky at first, but the results were worth it. Perfect for a quick glow."
//   },
//   {
//     imgUrl: "https://images.pexels.com/photos/33669508/pexels-photo-33669508.jpeg",
//     rating: 4.0,
//     categories: ["Exfoliator", "T-Zone"],
//     date: "07/11/2025",
//     description: "Tried a new salicylic acid exfoliator on my T-zone. It's effective but a little strong for my sensitive skin. Need to use it sparingly."
//   },
//   {
//     imgUrl: "https://images.pexels.com/photos/33669509/pexels-photo-33669509.jpeg",
//     rating: 5.0,
//     categories: ["Moisturizer", "Anti-Aging"],
//     date: "07/12/2025",
//     description: "This moisturizer is a game-changer! My fine lines seem less visible, and my skin feels incredibly supple. Absorbs quickly without leaving a greasy residue."
//   },
//   {
//     imgUrl: "https://images.pexels.com/photos/33669510/pexels-photo-33669510.jpeg",
//     rating: 3.5,
//     categories: ["Sunscreen", "Mineral"],
//     date: "07/13/2025",
//     description: "The mineral sunscreen leaves a slight white cast, which is a bit disappointing. It does, however, provide good protection and doesn't irritate my eyes."
//   },
//   {
//     imgUrl: "https://images.pexels.com/photos/33669511/pexels-photo-33669511.jpeg",
//     rating: 4.8,
//     categories: ["Lip Balm", "Tinted"],
//     date: "07/14/2025",
//     description: "I'm in love with this tinted lip balm. It provides a natural flush of color while keeping my lips moisturized for hours. The perfect everyday product."
//   },
//   {
//     imgUrl: "https://images.pexels.com/photos/33669512/pexels-photo-33669512.jpeg",
//     rating: 4.2,
//     categories: ["Body Lotion", "Scented"],
//     date: "07/15/2025",
//     description: "The scent of this body lotion is divine! It's lightweight and absorbs quickly, but I wish it were a bit more hydrating for my dry elbows."
//   },
//   {
//     imgUrl: "https://images.pexels.com/photos/33669513/pexels-photo-33669513.jpeg",
//     rating: 4.7,
//     categories: ["Cleanser", "Gel"],
//     date: "07/16/2025",
//     description: "This gel cleanser is great. It removes makeup effectively without stripping my skin of its natural oils. My face feels clean and refreshed."
//   },
//   {
//     imgUrl: "https://images.pexels.com/photos/33669514/pexels-photo-33669514.jpeg",
//     rating: 4.6,
//     categories: ["Serum", "Vitamin C"],
//     date: "07/17/2025",
//     description: "Started using a new Vitamin C serum. My skin tone already looks more even and radiant after just a few uses. No tingling sensation, which is a plus."
//   },
//   {
//     imgUrl: "https://images.pexels.com/photos/33669515/pexels-photo-33669515.jpeg",
//     rating: 3.9,
//     categories: ["Eye Cream", "Depuffing"],
//     date: "07/18/2025",
//     description: "This eye cream helps with puffiness, but I haven't seen much change in my dark circles yet. It's lightweight and feels nice, though."
//   },
//   {
//     imgUrl: "https://images.pexels.com/photos/33669516/pexels-photo-33669516.jpeg",
//     rating: 5.0,
//     categories: ["Primer", "Makeup"],
//     date: "07/19/2025",
//     description: "The best primer I've ever used. My makeup stays flawless all day, and my pores look minimized. It has a silky, smooth texture."
//   },
//   {
//     imgUrl: "https://images.pexels.com/photos/33669517/pexels-photo-33669517.jpeg",
//     rating: 4.1,
//     categories: ["Toner", "Balancing"],
//     date: "07/20/2025",
//     description: "A solid balancing toner. It preps my skin well for the next steps in my routine. A little goes a long way."
//   },
//   {
//     imgUrl: "https://images.pexels.com/photos/33669518/pexels-photo-33669518.jpeg",
//     rating: 4.3,
//     categories: ["Spot Treatment", "Acne"],
//     date: "07/21/2025",
//     description: "This spot treatment works overnight on small blemishes. It can be a little drying, so I only use it where I need it. Very effective."
//   },
//   {
//     imgUrl: "https://images.pexels.com/photos/33669519/pexels-photo-33669519.jpeg",
//     rating: 4.4,
//     categories: ["Hair Oil", "Frizz Control"],
//     date: "07/22/2025",
//     description: "This hair oil tames frizz instantly and adds a beautiful shine without making my hair greasy. A small amount is all you need."
//   },
//   {
//     imgUrl: "https://images.pexels.com/photos/33669520/pexels-photo-33669520.jpeg",
//     rating: 3.8,
//     categories: ["Hand Cream", "Shea Butter"],
//     date: "07/23/2025",
//     description: "The hand cream is super rich and moisturizing, perfect for dry hands. It's a bit too heavy for summer, but will be great in the winter."
//   },
//   {
//     imgUrl: "https://images.pexels.com/photos/33669521/pexels-photo-33669521.jpeg",
//     rating: 4.9,
//     categories: ["Body Wash", "Sulfate-Free"],
//     date: "07/24/2025",
//     description: "Love this body wash! It lathers well and leaves my skin feeling clean and soft. The natural scent is an added bonus."
//   },
//   {
//     imgUrl: "https://images.pexels.com/photos/33669522/pexels-photo-33669522.jpeg",
//     rating: 4.5,
//     categories: ["Night Cream", "Retinol"],
//     date: "07/25/2025",
//     description: "Starting to incorporate a retinol night cream. My skin feels smoother, and I haven't experienced any irritation. Slowly but surely seeing results."
//   },
//   {
//     imgUrl: "https://images.pexels.com/photos/33669523/pexels-photo-33669523.jpeg",
//     rating: 4.2,
//     categories: ["Face Mist", "Soothing"],
//     date: "07/26/2025",
//     description: "This face mist is so refreshing. I use it throughout the day to calm my skin and add a little boost of hydration. The mist is fine and even."
//   },
//   {
//     imgUrl: "https://images.pexels.com/photos/33669524/pexels-photo-33669524.jpeg",
//     rating: 4.6,
//     categories: ["Shampoo", "Volumizing"],
//     date: "07/27/2025",
//     description: "This shampoo gives my fine hair so much volume without drying it out. The results last for days. I'm very impressed with this product."
//   },
//   {
//     imgUrl: "https://images.pexels.com/photos/33669525/pexels-photo-33669525.jpeg",
//     rating: 4.0,
//     categories: ["Conditioner", "Deep Moisture"],
//     date: "07/28/2025",
//     description: "A good deep conditioning treatment. It leaves my hair soft and manageable. I just wish the bottle was bigger for the price."
//   },
//   {
//     imgUrl: "https://images.pexels.com/photos/33669526/pexels-photo-33669526.jpeg",
//     rating: 5.0,
//     categories: ["Lip Scrub", "Sugar"],
//     date: "07/29/2025",
//     description: "My lips have never been smoother! This sugar scrub exfoliates gently and tastes great. It's a must-have, especially before applying lipstick."
//   },
//   {
//     imgUrl: "https://images.pexels.com/photos/33669527/pexels-photo-33669527.jpeg",
//     rating: 4.3,
//     categories: ["Foot Cream", "Peppermint"],
//     date: "07/30/2025",
//     description: "The cooling peppermint sensation is so relaxing. This foot cream is thick and provides deep hydration, but can feel a bit greasy."
//   },
//   {
//     imgUrl: "https://images.pexels.com/photos/33669528/pexels-photo-33669528.jpeg",
//     rating: 4.7,
//     categories: ["Self Tanner", "Lotion"],
//     date: "07/31/2025",
//     description: "This self-tanning lotion gives a very natural-looking glow. No streaks or orange tint. The scent is minimal, which is a huge plus."
//   },
//   {
//     imgUrl: "https://images.pexels.com/photos/33669529/pexels-photo-33669529.jpeg",
//     rating: 4.8,
//     categories: ["Sheet Mask", "Collagen"],
//     date: "08/01/2025",
//     description: "A super hydrating and plumping sheet mask. My skin felt firm and smooth after use. It's a perfect treat for a spa night in."
//   },
//   {
//     imgUrl: "https://images.pexels.com/photos/33669530/pexels-photo-33669530.jpeg",
//     rating: 4.1,
//     categories: ["Deodorant", "Natural"],
//     date: "08/02/2025",
//     description: "This natural deodorant holds up pretty well. It keeps me fresh for most of the day, but needs a reapplication on very hot days."
//   },
//   {
//     imgUrl: "https://images.pexels.com/photos/33669531/pexels-photo-33669531.jpeg",
//     rating: 4.5,
//     categories: ["Cleansing Balm", "Double Cleanse"],
//     date: "08/03/2025",
//     description: "This cleansing balm melts away makeup and sunscreen instantly. It's my new favorite first step in my double-cleansing routine. Rinses clean."
//   },
//   {
//     imgUrl: "https://images.pexels.com/photos/33669532/pexels-photo-33669532.jpeg",
//     rating: 4.6,
//     categories: ["Hair Serum", "Split Ends"],
//     date: "08/04/2025",
//     description: "This serum makes my hair look healthier by smoothing down split ends. It's lightweight and doesn't weigh my hair down. A must-have."
//   },
//   {
//     imgUrl: "https://images.pexels.com/photos/33669533/pexels-photo-33669533.jpeg",
//     rating: 3.7,
//     categories: ["Nail Polish", "Quick Dry"],
//     date: "08/05/2025",
//     description: "The quick-dry nail polish chipped after just one day. The color is pretty, but the staying power isn't great. Disappointing."
//   },
//   {
//     imgUrl: "https://images.pexels.com/photos/33669534/pexels-photo-33669534.jpeg",
//     rating: 4.9,
//     categories: ["Body Scrub", "Coffee"],
//     date: "08/06/2025",
//     description: "The coffee body scrub is energizing and exfoliating. My skin feels incredibly soft and smooth after using it. The scent is amazing."
//   },
//   {
//     imgUrl: "https://images.pexels.com/photos/33669535/pexels-photo-33669535.jpeg",
//     rating: 4.4,
//     categories: ["Facial Oil", "Rosehip"],
//     date: "08/07/2025",
//     description: "This rosehip oil is a lifesaver for my dry patches. I use it at night, and my skin feels calm and nourished by morning."
//   },
//   {
//     imgUrl: "https://images.pexels.com/photos/33669536/pexels-photo-33669536.jpeg",
//     rating: 4.2,
//     categories: ["Hair Spray", "Flexible Hold"],
//     date: "08/08/2025",
//     description: "The hair spray gives a flexible hold without making my hair feel crunchy. It's perfect for a natural look. The scent isn't too overpowering."
//   },
//   {
//     imgUrl: "https://images.pexels.com/photos/33669537/pexels-photo-33669537.jpeg",
//     rating: 5.0,
//     categories: ["Lipstick", "Matte"],
//     date: "08/09/2025",
//     description: "This matte lipstick is long-lasting and doesn't dry out my lips. The color is highly pigmented and true to its shade. It's a new staple in my bag."
//   },
//   {
//     imgUrl: "https://images.pexels.com/photos/33669538/pexels-photo-33669538.jpeg",
//     rating: 3.9,
//     categories: ["Eye Drops", "Redness Relief"],
//     date: "08/10/2025",
//     description: "The eye drops work for redness, but they sting a little upon application. The effect lasts for a few hours. I'll probably look for a gentler alternative."
//   },
//   {
//     imgUrl: "https://images.pexels.com/photos/33669539/pexels-photo-33669539.jpeg",
//     rating: 4.7,
//     categories: ["Setting Spray", "Matte Finish"],
//     date: "08/11/2025",
//     description: "My makeup stayed put through a long, hot day thanks to this setting spray. It gives a nice matte finish without looking cakey. Absolutely love it!"
//   },
//   {
//     imgUrl: "https://images.pexels.com/photos/33669540/pexels-photo-33669540.jpeg",
//     rating: 4.3,
//     categories: ["Dry Shampoo", "Volume"],
//     date: "08/12/2025",
//     description: "This dry shampoo adds great volume and absorbs oil well. It can leave a slight white residue if you don't brush it through properly."
//   },
//   {
//     imgUrl: "https://images.pexels.com/photos/33669541/pexels-photo-33669541.jpeg",
//     rating: 4.8,
//     categories: ["Face Wash", "Foaming"],
//     date: "08/13/2025",
//     description: "A gentle foaming face wash that leaves my skin feeling incredibly clean and refreshed without being overly dry. It's a great product for daily use."
//   },
//   {
//     imgUrl: "https://images.pexels.com/photos/33669542/pexels-photo-33669542.jpeg",
//     rating: 4.5,
//     categories: ["Clay Mask", "Detox"],
//     date: "08/14/2025",
//     description: "This clay mask is amazing for a deep clean. It draws out impurities and minimizes my pores. My skin feels purified and tightened after each use."
//   },
//   {
//     imgUrl: "https://images.pexels.com/photos/33669543/pexels-photo-33669543.jpeg",
//     rating: 4.6,
//     categories: ["Eyebrow Gel", "Clear"],
//     date: "08/15/2025",
//     description: "The clear eyebrow gel holds my brows in place all day without feeling stiff. It's perfect for a natural, groomed look. Love the precision brush."
//   },
//   {
//     imgUrl: "https://images.pexels.com/photos/33669544/pexels-photo-33669544.jpeg",
//     rating: 4.1,
//     categories: ["Body Oil", "Hydrating"],
//     date: "08/16/2025",
//     description: "This body oil is very hydrating, especially after a shower. It has a lovely, subtle scent. I just need to be careful not to use too much."
//   },
//   {
//     imgUrl: "https://images.pexels.com/photos/33669545/pexels-photo-33669545.jpeg",
//     rating: 4.9,
//     categories: ["Leave-in Conditioner", "Curl Enhancing"],
//     date: "08/17/2025",
//     description: "This leave-in conditioner defines my curls beautifully and reduces frizz. My hair feels so soft and looks healthy. It's a new holy grail."
//   },
//   {
//     imgUrl: "https://images.pexels.com/photos/33669546/pexels-photo-33669546.jpeg",
//     rating: 3.5,
//     categories: ["Hair Dye", "Semi-Permanent"],
//     date: "08/18/2025",
//     description: "The semi-permanent hair dye faded much faster than expected. The color was vibrant initially, but it didn't last. A bit disappointed."
//   },
//   {
//     imgUrl: "https://images.pexels.com/photos/33669547/pexels-photo-33669547.jpeg",
//     rating: 4.7,
//     categories: ["Perfume", "Floral"],
//     date: "08/19/2025",
//     description: "The floral perfume has a beautiful, long-lasting scent. I get so many compliments whenever I wear it. It's not too overpowering, just right."
//   },
//   {
//     imgUrl: "https://images.pexels.com/photos/33669548/pexels-photo-33669548.jpeg",
//     rating: 4.4,
//     categories: ["Face Scrub", "Gentle"],
//     date: "08/20/2025",
//     description: "This face scrub is gentle enough for daily use. It exfoliates without being harsh and leaves my skin feeling incredibly smooth. No irritation whatsoever."
//   },
//   {
//     imgUrl: "https://images.pexels.com/photos/33669549/pexels-photo-33669549.jpeg",
//     rating: 4.6,
//     categories: ["Hydrating Mask", "Overnight"],
//     date: "08/21/2025",
//     description: "I wake up with the softest, most hydrated skin after using this overnight mask. It's a lifesaver for when my skin is feeling a bit tired or dry."
//   },
//   {
//     imgUrl: "https://images.pexels.com/photos/33669550/pexels-photo-33669550.jpeg",
//     rating: 4.2,
//     categories: ["Lip Plumper", "Gloss"],
//     date: "08/22/2025",
//     description: "The lip plumper gives a noticeable tingle and makes my lips look fuller. The gloss is shiny and not too sticky. It's a fun product to use."
//   },
//   {
//     imgUrl: "https://images.pexels.com/photos/33669551/pexels-photo-33669551.jpeg",
//     rating: 4.8,
//     categories: ["Hand Sanitizer", "Scented"],
//     date: "08/23/2025",
//     description: "This hand sanitizer doesn't dry out my hands and smells fantastic. It's a great alternative to the harsh alcohol-smelling ones. Convenient for on-the-go."
//   },
//   {
//     imgUrl: "https://images.pexels.com/photos/33669552/pexels-photo-33669552.jpeg",
//     rating: 4.0,
//     categories: ["Conditioner", "Color Safe"],
//     date: "08/24/2025",
//     description: "The conditioner is great for preserving my hair color and leaves it feeling soft. I just wish it provided a little more slip for detangling."
//   },
//   {
//     imgUrl: "https://images.pexels.com/photos/33669553/pexels-photo-33669553.jpeg",
//     rating: 4.9,
//     categories: ["Body Butter", "Intensive"],
//     date: "08/25/2025",
//     description: "This body butter is super rich and luxurious. Perfect for my extremely dry skin. It takes a little while to absorb, but the results are worth it."
//   },
//   {
//     imgUrl: "https://images.pexels.com/photos/33669554/pexels-photo-33669554.jpeg",
//     rating: 3.8,
//     categories: ["Face Primer", "Pore Minimizing"],
//     date: "08/26/2025",
//     description: "The primer works okay, but I didn't see a significant difference in my pore size. It does make my foundation apply a bit smoother, though."
//   },
//   {
//     imgUrl: "https://images.pexels.com/photos/33669555/pexels-photo-33669555.jpeg",
//     rating: 4.5,
//     categories: ["Facial Cleanser", "Charcoal"],
//     date: "08/27/2025",
//     description: "The charcoal cleanser feels like a deep clean. It helps with my oily T-zone and leaves my skin feeling fresh, but it can be a bit drying."
//   },
//   {
//     imgUrl: "https://images.pexels.com/photos/33669556/pexels-photo-33669556.jpeg",
//     rating: 4.7,
//     categories: ["SPF Lip Balm", "Moisturizing"],
//     date: "08/28/2025",
//     description: "This lip balm is perfect for sun protection and keeps my lips soft and moisturized. I love that it's not waxy and doesn't have a strong scent."
//   },
//   {
//     imgUrl: "https://images.pexels.com/photos/33669557/pexels-photo-33669557.jpeg",
//     rating: 4.6,
//     categories: ["Hair Mask", "Repairing"],
//     date: "08/29/2025",
//     description: "This repairing hair mask has made a huge difference in my damaged hair. It feels stronger, looks shinier, and is much less frizzy. A great weekly treatment."
//   },
//   {
//     imgUrl: "https://images.pexels.com/photos/33669558/pexels-photo-33669558.jpeg",
//     rating: 4.1,
//     categories: ["Body Mist", "Light Scent"],
//     date: "08/30/2025",
//     description: "A nice, light body mist for a quick refresh. The scent doesn't last very long, but it's perfect for a subtle fragrance. Very convenient."
//   },
//   {
//     imgUrl: "https://images.pexels.com/photos/33669559/pexels-photo-33669559.jpeg",
//     rating: 4.3,
//     categories: ["Foot Mask", "Exfoliating"],
//     date: "08/31/2025",
//     description: "The exfoliating foot mask worked wonders! My feet are so soft now. The process is a bit messy and takes a few days, but the results are incredible."
//   },
//   {
//     imgUrl: "https://images.pexels.com/photos/33669560/pexels-photo-33669560.jpeg",
//     rating: 4.9,
//     categories: ["Serum", "Hyaluronic Acid"],
//     date: "09/01/2025",
//     description: "This hyaluronic acid serum has become a cornerstone of my routine. My skin is noticeably more plump and hydrated. I use it both morning and night."
//   },
//   {
//     imgUrl: "https://images.pexels.com/photos/33669561/pexels-photo-33669561.jpeg",
//     rating: 3.9,
//     categories: ["Sunscreen", "Face"],
//     date: "09/02/2025",
//     description: "The facial sunscreen is effective, but it pills a little under my makeup. It's a great product for no-makeup days, but I'll need to find a different one for daily wear."
//   },
//   {
//     imgUrl: "https://images.pexels.com/photos/33669562/pexels-photo-33669562.jpeg",
//     rating: 4.5,
//     categories: ["Eye Serum", "Brightening"],
//     date: "09/03/2025",
//     description: "This eye serum has helped to brighten my under-eye area. It's lightweight and absorbs quickly. I feel like I look a little more awake."
//   },
//   {
//     imgUrl: "https://images.pexels.com/photos/33669563/pexels-photo-33669563.jpeg",
//     rating: 4.6,
//     categories: ["Foundation", "Dewy Finish"],
//     date: "09/04/2025",
//     description: "I'm loving this dewy foundation. It makes my skin look radiant and healthy without being greasy. It has good medium coverage and lasts all day."
//   },
//   {
//     imgUrl: "https://images.pexels.com/photos/33669564/pexels-photo-33669564.jpeg",
//     rating: 4.2,
//     categories: ["Mascara", "Volumizing"],
//     date: "09/05/2025",
//     description: "This mascara gives my lashes great volume and length. It doesn't clump, but it can smudge a little in humid weather. Overall, a good product."
//   },
//   {
//     imgUrl: "https://images.pexels.com/photos/33669565/pexels-photo-33669565.jpeg",
//     rating: 4.8,
//     categories: ["Lip Gloss", "Non-Sticky"],
//     date: "09/06/2025",
//     description: "This lip gloss is a winner! It's super shiny and, most importantly, not sticky at all. The shade is beautiful and it makes my lips feel hydrated."
//   },
//   {
//     imgUrl: "https://images.pexels.com/photos/33669566/pexels-photo-33669566.jpeg",
//     rating: 4.0,
//     categories: ["Shave Cream", "Soothing"],
//     date: "09/07/2025",
//     description: "The shave cream provides a smooth glide and prevents irritation. It's great, but I wish the scent was a bit stronger. It's very subtle."
//   },
//   {
//     imgUrl: "https://images.pexels.com/photos/33669567/pexels-photo-33669567.jpeg",
//     rating: 5.0,
//     categories: ["Acne Patch", "Hydrocolloid"],
//     date: "09/08/2025",
//     description: "These acne patches are magic! They shrink pimples overnight and protect the area from picking. A must-have for anyone dealing with breakouts."
//   },
//   {
//     imgUrl: "https://images.pexels.com/photos/33669568/pexels-photo-33669568.jpeg",
//     rating: 4.7,
//     categories: ["Hair Oil", "Heat Protectant"],
//     date: "09/09/2025",
//     description: "This hair oil doubles as a heat protectant. It makes my hair so soft and shiny after blow-drying. It doesn't feel heavy or greasy, which is a big plus."
//   },
//   {
//     imgUrl: "https://images.pexels.com/photos/33669569/pexels-photo-33669569.jpeg",
//     rating: 4.4,
//     categories: ["Toner", "Rose Water"],
//     date: "09/10/2025",
//     description: "The rose water toner is so soothing and refreshing. It has a beautiful, natural scent and preps my skin perfectly for the next step. A great, simple product."
//   },
//   {
//     imgUrl: "https://images.pexels.com/photos/33669570/pexels-photo-33669570.jpeg",
//     rating: 4.9,
//     categories: ["Body Wash", "Exfoliating"],
//     date: "09/11/2025",
//     description: "This body wash with exfoliating beads is fantastic. It leaves my skin feeling incredibly smooth and clean. The scent is invigorating."
//   },
//   {
//     imgUrl: "https://images.pexels.com/photos/33669571/pexels-photo-33669571.jpeg",
//     rating: 3.6,
//     categories: ["Hair Gel", "Strong Hold"],
//     date: "09/12/2025",
//     description: "The hair gel provides a very strong hold, but it leaves my hair feeling a bit crunchy. It's good for certain styles but not for everyday use."
//   },
//   {
//     imgUrl: "https://images.pexels.com/photos/33669572/pexels-photo-33669572.jpeg",
//     rating: 4.5,
//     categories: ["Face Mask", "Brightening"],
//     date: "09/13/2025",
//     description: "This brightening mask has given me a noticeable glow. It feels so luxurious and makes my skin look more radiant and even-toned. I use it once a week."
//   },
//   {
//     imgUrl: "https://images.pexels.com/photos/33669573/pexels-photo-33669573.jpeg",
//     rating: 4.8,
//     categories: ["Body Lotion", "Shea Butter"],
//     date: "09/14/2025",
//     description: "The body lotion is extremely moisturizing. My skin feels soft and supple all day long. It has a subtle, pleasant scent and absorbs well."
//   },
//   {
//     imgUrl: "https://images.pexels.com/photos/33669574/pexels-photo-33669574.jpeg",
//     rating: 4.2,
//     categories: ["Cleanser", "Creamy"],
//     date: "09/15/2025",
//     description: "This creamy cleanser is perfect for my dry, sensitive skin. It cleanses effectively without stripping moisture. My skin feels comforted and clean."
//   },
//   {
//     imgUrl: "https://images.pexels.com/photos/33669575/pexels-photo-33669575.jpeg",
//     rating: 4.9,
//     categories: ["Serum", "Retinol"],
//     date: "09/16/2025",
//     description: "This retinol serum has visibly improved the texture of my skin. My pores look smaller and my complexion is smoother. I've had no irritation so far."
//   },
//   {
//     imgUrl: "https://images.pexels.com/photos/33669576/pexels-photo-33669576.jpeg",
//     rating: 3.7,
//     categories: ["Hand Soap", "Foaming"],
//     date: "09/17/2025",
//     description: "The foaming hand soap is nice, but it feels a bit drying after multiple uses. The scent is lovely, but I might switch to a more moisturizing option."
//   },
//   {
//     imgUrl: "https://images.pexels.com/photos/33669577/pexels-photo-33669577.jpeg",
//     rating: 4.6,
//     categories: ["Dry Shampoo", "Dark Hair"],
//     date: "09/18/2025",
//     description: "Finally, a dry shampoo that doesn't leave a white cast on my dark hair! It adds volume and refreshes my hair on non-wash days. A great product."
//   },
//   {
//     imgUrl: "https://images.pexels.com/photos/33669578/pexels-photo-33669578.jpeg",
//     rating: 4.4,
//     categories: ["Eye Cream", "Hydrating"],
//     date: "09/19/2025",
//     description: "This hydrating eye cream has made my under-eyes feel much less dry. It sits well under concealer and provides a smooth base. I'm happy with it."
//   },
//   {
//     imgUrl: "https://images.pexels.com/photos/33669579/pexels-photo-33669579.jpeg",
//     rating: 4.8,
//     categories: ["Lip Mask", "Overnight"],
//     date: "09/20/2025",
//     description: "I wake up with the softest, most plump lips after using this overnight lip mask. It's a miracle product for chapped lips. The scent is delicious."
//   },
//   {
//     imgUrl: "https://images.pexels.com/photos/33669580/pexels-photo-33669580.jpeg",
//     rating: 4.0,
//     categories: ["Sunscreen", "Body Spray"],
//     date: "09/21/2025",
//     description: "The body sunscreen spray is so convenient to apply. It provides good protection, but I have to be careful to rub it in thoroughly to avoid streaks."
//   },
//   {
//     imgUrl: "https://images.pexels.com/photos/33669581/pexels-photo-33669581.jpeg",
//     rating: 4.7,
//     categories: ["Eyeliner", "Liquid"],
//     date: "09/22/2025",
//     description: "This liquid eyeliner is so precise and long-lasting. It doesn't smudge and the black is very pigmented. The fine tip makes it easy to create a wing."
//   },
//   {
//     imgUrl: "https://images.pexels.com/photos/33669582/pexels-photo-33669582.jpeg",
//     rating: 4.9,
//     categories: ["Setting Powder", "Translucent"],
//     date: "09/23/2025",
//     description: "This translucent setting powder is incredible. It locks my makeup in place, blurs pores, and doesn't look cakey. My face looks airbrushed."
//   },
//   {
//     imgUrl: "https://images.pexels.com/photos/33669583/pexels-photo-33669583.jpeg",
//     rating: 4.3,
//     categories: ["Hair Mousse", "Volumizing"],
//     date: "09/24/2025",
//     description: "The hair mousse gives my hair a lot of volume, but it can make it a little crunchy if I use too much. A little goes a long way with this product."
//   },
//   {
//     imgUrl: "https://images.pexels.com/photos/33669584/pexels-photo-33669584.jpeg",
//     rating: 4.5,
//     categories: ["Body Oil", "Glow"],
//     date: "09/25/2025",
//     description: "This body oil provides a beautiful, subtle glow. It's hydrating and smells amazing. I love using it on my legs for a radiant look."
//   },
//   {
//     imgUrl: "https://images.pexels.com/photos/33669585/pexels-photo-33669585.jpeg",
//     rating: 4.6,
//     categories: ["Shampoo", "Sulfate-Free"],
//     date: "09/26/2025",
//     description: "A great sulfate-free shampoo. It cleanses my hair gently and doesn't strip the color. My hair feels healthy and looks shiny. I'm happy with it."
//   },
//   {
//     imgUrl: "https://images.pexels.com/photos/33669586/pexels-photo-33669586.jpeg",
//     rating: 4.1,
//     categories: ["Conditioner", "Lightweight"],
//     date: "09/27/2025",
//     description: "The lightweight conditioner is good, but it's not as moisturizing as I'd like. It's perfect for a quick rinse and for hair that doesn't need much hydration."
//   },
//   {
//     imgUrl: "https://images.pexels.com/photos/33669587/pexels-photo-33669587.jpeg",
//     rating: 5.0,
//     categories: ["Lip Crayon", "Matte"],
//     date: "09/28/2025",
//     description: "This lip crayon is so easy to apply. The matte finish is beautiful and long-lasting. It feels comfortable on the lips and the color is gorgeous."
//   },
//   {
//     imgUrl: "https://images.pexels.com/photos/33669588/pexels-photo-33669588.jpeg",
//     rating: 4.2,
//     categories: ["Body Scrub", "Sugar"],
//     date: "09/29/2025",
//     description: "The sugar body scrub is a little too gentle for my liking. It smells great and leaves my skin soft, but I prefer something with a stronger exfoliation."
//   },
//   {
//     imgUrl: "https://images.pexels.com/photos/33669589/pexels-photo-33669589.jpeg",
//     rating: 4.7,
//     categories: ["Night Cream", "Firming"],
//     date: "09/30/2025",
//     description: "This firming night cream is amazing. My skin feels so plump and firm in the morning. It's rich and luxurious without feeling heavy on my skin."
//   },
//   {
//     imgUrl: "https://images.pexels.com/photos/33669590/pexels-photo-33669590.jpeg",
//     rating: 4.5,
//     categories: ["Deodorant", "Antiperspirant"],
//     date: "10/01/2025",
//     description: "This antiperspirant works great for keeping me dry and fresh all day. It doesn't leave any white marks on my clothes, which is a big bonus."
//   },
//   {
//     imgUrl: "https://images.pexels.com/photos/33669591/pexels-photo-33669591.jpeg",
//     rating: 4.4,
//     categories: ["Face Mist", "Makeup Setting"],
//     date: "10/02/2025",
//     description: "The makeup setting mist is perfect for a natural finish. It helps to melt all the layers of makeup together and gives a lovely glow. It's a nice product to finish with."
//   },
//   {
//     imgUrl: "https://images.pexels.com/photos/33669592/pexels-photo-33669592.jpeg",
//     rating: 4.8,
//     categories: ["Lip Balm", "Medicated"],
//     date: "10/03/2025",
//     description: "This medicated lip balm is a lifesaver for chapped lips. It soothes and heals them very quickly. It has a slight cooling sensation that feels great."
//   },
//   {
//     imgUrl: "https://images.pexels.com/photos/33669593/pexels-photo-33669593.jpeg",
//     rating: 4.0,
//     categories: ["Face Serum", "Oil-Free"],
//     date: "10/04/2025",
//     description: "The oil-free serum is great for my oily skin. It hydrates without making me feel greasy. It's a solid, simple product for daily use."
//   },
//   {
//     imgUrl: "https://images.pexels.com/photos/33669594/pexels-photo-33669594.jpeg",
//     rating: 4.9,
//     categories: ["Hair Cream", "Smoothing"],
//     date: "10/05/2025",
//     description: "This hair cream tames frizz and adds a beautiful, healthy shine. My hair feels so smooth and soft. A little goes a long way for great results."
//   },
//   {
//     imgUrl: "https://images.pexels.com/photos/33669595/pexels-photo-33669595.jpeg",
//     rating: 3.8,
//     categories: ["Hand Cream", "Coconut"],
//     date: "10/06/2025",
//     description: "The coconut hand cream smells amazing, but it's a bit too light for my very dry hands. It's good for a quick moisture boost but not for intensive care."
//   },
//   {
//     imgUrl: "https://images.pexels.com/photos/33669596/pexels-photo-33669596.jpeg",
//     rating: 4.7,
//     categories: ["Shampoo", "Clarifying"],
//     date: "10/07/2025",
//     description: "This clarifying shampoo is fantastic for a deep clean. It removes all product buildup and leaves my scalp feeling so fresh. I use it once a week."
//   },
//   {
//     imgUrl: "https://images.pexels.com/photos/33669597/pexels-photo-33669597.jpeg",
//     rating: 4.6,
//     categories: ["Body Wash", "Moisturizing"],
//     date: "10/08/2025",
//     description: "This moisturizing body wash leaves my skin feeling soft and clean. It has a lovely scent and a rich lather. A great product for everyday use."
//   },
//   {
//     imgUrl: "https://images.pexels.com/photos/33669598/pexels-photo-33669598.jpeg",
//     rating: 4.2,
//     categories: ["Face Scrub", "Coffee"],
//     date: "10/09/2025",
//     description: "The coffee face scrub is a bit too abrasive for my sensitive skin, but it smells wonderful. I'll stick to using it on my body instead."
//   },
//   {
//     imgUrl: "https://images.pexels.com/photos/33669599/pexels-photo-33669599.jpeg",
//     rating: 4.8,
//     categories: ["Lip Tint", "Stain"],
//     date: "10/10/2025",
//     description: "This lip tint is amazing! It gives a natural-looking flush of color that lasts for hours. It feels weightless on the lips and doesn't smudge."
//   },
//   {
//     imgUrl: "https://images.pexels.com/photos/33669600/pexels-photo-33669600.jpeg",
//     rating: 4.1,
//     categories: ["Body Lotion", "Firming"],
//     date: "10/11/2025",
//     description: "The firming body lotion provides decent hydration. I'm not sure if it's actually firming my skin yet, but it feels nice and absorbs quickly."
//   },
//   {
//     imgUrl: "https://images.pexels.com/photos/33669601/pexels-photo-33669601.jpeg",
//     rating: 5.0,
//     categories: ["Hair Serum", "Shine"],
//     date: "10/12/2025",
//     description: "This hair serum gives me the most incredible shine. It's the perfect finishing touch and makes my hair look so healthy. I can't live without it."
//   },
//   {
//     imgUrl: "https://images.pexels.com/photos/33669602/pexels-photo-33669602.jpeg",
//     rating: 3.9,
//     categories: ["Face Primer", "Hydrating"],
//     date: "10/13/2025",
//     description: "The hydrating primer is okay, but I feel like I need to use a lot of it for it to make a difference. It does make my makeup last a bit longer, though."
//   },
//   {
//     imgUrl: "https://images.pexels.com/photos/33669603/pexels-photo-33669603.jpeg",
//     rating: 4.7,
//     categories: ["Face Mask", "Peel-Off"],
//     date: "10/14/2025",
//     description: "This peel-off mask is very satisfying to use. It pulls out impurities and leaves my skin feeling incredibly smooth. It can be a little painful to peel off."
//   },
//   {
//     imgUrl: "https://images.pexels.com/photos/33669604/pexels-photo-33669604.jpeg",
//     rating: 4.4,
//     categories: ["Body Butter", "Mango"],
//     date: "10/15/2025",
//     description: "The mango body butter smells absolutely heavenly. It's rich and creamy, perfect for dry patches. It absorbs well and leaves my skin feeling great."
//   },
//   {
//     imgUrl: "https://images.pexels.com/photos/33669605/pexels-photo-33669605.jpeg",
//     rating: 4.6,
//     categories: ["Cleanser", "Micellar Water"],
//     date: "10/16/2025",
//     description: "This micellar water is my go-to for removing makeup. It's gentle, effective, and doesn't require rinsing. Perfect for lazy nights."
//   },
//   {
//     imgUrl: "https://images.pexels.com/photos/33669606/pexels-photo-33669606.jpeg",
//     rating: 4.2,
//     categories: ["Shampoo", "Dandruff"],
//     date: "10/17/2025",
//     description: "The anti-dandruff shampoo has helped a lot with my itchy scalp. It has a slight medicinal scent, but it works well and leaves my hair feeling clean."
//   },
//   {
//     imgUrl: "https://images.pexels.com/photos/33669607/pexels-photo-33669607.jpeg",
//     rating: 4.8,
//     categories: ["Lip Scrub", "Balm"],
//     date: "10/18/2025",
//     description: "This lip scrub and balm duo is fantastic. The scrub is gentle and the balm is super hydrating. My lips have never been this smooth and soft."
//   },
//   {
//     imgUrl: "https://images.pexels.com/photos/33669608/pexels-photo-33669608.jpeg",
//     rating: 4.0,
//     categories: ["Body Mist", "Citrus"],
//     date: "10/19/2025",
//     description: "The citrus body mist is so refreshing, especially in the morning. The scent is a bit too subtle and doesn't last very long. It's a nice, quick spritz."
//   },
//   {
//     imgUrl: "https://images.pexels.com/photos/33669609/pexels-photo-33669609.jpeg",
//     rating: 4.9,
//     categories: ["Moisturizer", "SPF"],
//     date: "10/20/2025",
//     description: "This moisturizer with SPF is a dream come true. It's lightweight, non-greasy, and provides excellent sun protection. My new daily essential."
//   },
//   {
//     imgUrl: "https://images.pexels.com/photos/33669610/pexels-photo-33669610.jpeg",
//     rating: 3.5,
//     categories: ["Hair Spray", "Extra Hold"],
//     date: "10/21/2025",
//     description: "The extra-hold hair spray is a bit too stiff for my liking. It holds my style, but makes my hair feel like a helmet. Not a fan of the crunchy feeling."
//   },
//   {
//     imgUrl: "https://images.pexels.com/photos/33669611/pexels-photo-33669611.jpeg",
//     rating: 4.7,
//     categories: ["Foot Cream", "Urea"],
//     date: "10/22/2025",
//     description: "This foot cream with urea is a powerhouse for cracked heels. It has made my feet incredibly soft and smooth. The results are visible after just a few uses."
//   },
//   {
//     imgUrl: "https://images.pexels.com/photos/33669612/pexels-photo-33669612.jpeg",
//     rating: 4.5,
//     categories: ["Serum", "Niacinamide"],
//     date: "10/23/2025",
//     description: "The niacinamide serum has helped to reduce the appearance of my pores and even out my skin tone. It's lightweight and works well under other products."
//   },
//   {
//     imgUrl: "https://images.pexels.com/photos/33669613/pexels-photo-33669613.jpeg",
//     rating: 4.6,
//     categories: ["Hair Mask", "Keratin"],
//     date: "10/24/2025",
//     description: "This keratin hair mask has made my hair so much stronger and less prone to breakage. It's a fantastic treatment for damaged hair. Highly recommend it."
//   },
//   {
//     imgUrl: "https://images.pexels.com/photos/33669614/pexels-photo-33669614.jpeg",
//     rating: 4.3,
//     categories: ["Eyebrow Pencil", "Waterproof"],
//     date: "10/25/2025",
//     description: "The waterproof eyebrow pencil is great for shaping and filling. It stays put all day, even in humid weather. The color is a perfect match."
//   },
//   {
//     imgUrl: "https://images.pexels.com/photos/33669615/pexels-photo-33669615.jpeg",
//     rating: 4.8,
//     categories: ["Body Scrub", "Himalayan Salt"],
//     date: "10/26/2025",
//     description: "This salt body scrub is so invigorating. It exfoliates my skin beautifully and leaves it feeling incredibly soft and polished. The scent is wonderful."
//   },
//   {
//     imgUrl: "https://images.pexels.com/photos/33669616/pexels-photo-33669616.jpeg",
//     rating: 4.0,
//     categories: ["Setting Spray", "Dewy Finish"],
//     date: "10/27/2025",
//     description: "The dewy setting spray is a bit too shiny for my liking. It gives a nice glow, but can make me look greasy by the end of the day. Better for dry skin types."
//   },
//   {
//     imgUrl: "https://images.pexels.com/photos/33669617/pexels-photo-33669617.jpeg",
//     rating: 4.9,
//     categories: ["Hair Oil", "Argan"],
//     date: "10/28/2025",
//     description: "This argan hair oil is fantastic. It adds so much shine and helps to control frizz. I use it on damp hair before styling for the best results."
//   },
//   {
//     imgUrl: "https://images.pexels.com/photos/33669618/pexels-photo-33669618.jpeg",
//     rating: 4.5,
//     categories: ["Face Wash", "Hydrating"],
//     date: "10/29/2025",
//     description: "This hydrating face wash is perfect for my dry skin. It cleanses gently without stripping any moisture. My skin feels soft and comfortable after washing."
//   },
//   {
//     imgUrl: "https://images.pexels.com/photos/33669619/pexels-photo-33669619.jpeg",
//     rating: 4.6,
//     categories: ["Lip Plumper", "Serum"],
//     date: "10/30/2025",
//     description: "The lip plumping serum gives a nice, subtle plump and makes my lips feel hydrated. The tingling is not too intense, which I appreciate."
//   },
//   {
//     imgUrl: "https://images.pexels.com/photos/33669620/pexels-photo-33669620.jpeg",
//     rating: 4.7,
//     categories: ["Body Lotion", "Fragrance-Free"],
//     date: "10/31/2025",
//     description: "This fragrance-free body lotion is perfect for my sensitive skin. It's very moisturizing and doesn't cause any irritation. A simple, effective product."
//   },
//   {
//     imgUrl: "https://images.pexels.com/photos/33669621/pexels-photo-33669621.jpeg",
//     rating: 4.1,
//     categories: ["Shampoo", "Volumizing"],
//     date: "11/01/2025",
//     description: "The volumizing shampoo gives my fine hair a noticeable lift, but I feel like it can be a bit drying if I use it too often. I use it once or twice a week."
//   },
//   {
//     imgUrl: "https://images.pexels.com/photos/33669622/pexels-photo-33669622.jpeg",
//     rating: 4.8,
//     categories: ["Hand Cream", "SPF"],
//     date: "11/02/2025",
//     description: "I love this hand cream with SPF. It's so important to protect your hands from the sun, and this product makes it so easy. It's moisturizing and non-greasy."
//   },
//   {
//     imgUrl: "https://images.pexels.com/photos/33669623/pexels-photo-33669623.jpeg",
//     rating: 4.3,
//     categories: ["Night Cream", "Hydrating"],
//     date: "11/03/2025",
//     description: "This hydrating night cream is a good, basic moisturizer. My skin feels soft and nourished in the morning, but I haven't seen any dramatic changes yet."
//   },
//   {
//     imgUrl: "https://images.pexels.com/photos/33669624/pexels-photo-33669624.jpeg",
//     rating: 4.9,
//     categories: ["Lip Balm", "Tinted"],
//     date: "11/04/2025",
//     description: "This tinted lip balm is a new favorite. The color is beautiful and it keeps my lips hydrated. It's a great product for a subtle, natural look."
//   },
//   {
//     imgUrl: "https://images.pexels.com/photos/33669625/pexels-photo-33669625.jpeg",
//     rating: 4.5,
//     categories: ["Body Wash", "Exfoliating"],
//     date: "11/05/2025",
//     description: "This exfoliating body wash with fruit seeds is amazing. It leaves my skin feeling so smooth and revitalized. The scent is very refreshing."
//   },
//   {
//     imgUrl: "https://images.pexels.com/photos/33669626/pexels-photo-33669626.jpeg",
//     rating: 4.7,
//     categories: ["Face Mask", "Charcoal"],
//     date: "11/06/2025",
//     description: "This charcoal mask is great for a deep cleanse. It feels so satisfying to use and my pores look noticeably smaller afterward. A must-have for oily skin."
//   },
//   {
//     imgUrl: "https://images.pexels.com/photos/33669627/pexels-photo-33669627.jpeg",
//     rating: 4.0,
//     categories: ["Dry Shampoo", "Scented"],
//     date: "11/07/2025",
//     description: "The scented dry shampoo is good for refreshing my hair, but the scent is a bit too strong for me. It does add volume and absorb oil well."
//   },
//   {
//     imgUrl: "https://images.pexels.com/photos/33669628/pexels-photo-33669628.jpeg",
//     rating: 4.6,
//     categories: ["Body Oil", "Calming"],
//     date: "11/08/2025",
//     description: "This calming body oil is so relaxing to use after a shower. It feels luxurious, and the lavender scent is perfect for winding down before bed."
//   },
//   {
//     imgUrl: "https://images.pexels.com/photos/33669629/pexels-photo-33669629.jpeg",
//     rating: 4.9,
//     categories: ["Serum", "Vitamin C"],
//     date: "11/09/2025",
//     description: "This vitamin C serum has brightened my complexion so much. My skin looks more even and radiant. I've been using it for a few weeks and the results are amazing."
//   },
//   {
//     imgUrl: "https://images.pexels.com/photos/33669630/pexels-photo-33669630.jpeg",
//     rating: 4.2,
//     categories: ["Hand Soap", "Moisturizing"],
//     date: "11/10/2025",
//     description: "This moisturizing hand soap doesn't dry out my hands, even with frequent washing. The scent is nice and it lathers well. A great product."
//   },
//   {
//     imgUrl: "https://images.pexels.com/photos/33669631/pexels-photo-33669631.jpeg",
//     rating: 4.5,
//     categories: ["Hair Spray", "Flexible Hold"],
//     date: "11/11/2025",
//     description: "This flexible-hold hair spray is perfect for my everyday hairstyles. It holds my hair in place without making it feel stiff or crunchy. It brushes out easily."
//   }
// ];