window.APP_CONFIG = {
    // 1. YouTube Video URLs (Full Links)
    videos: {
        intro: "https://www.youtube.com/watch?v=LXb3EKWsInQ",
        recruit: "https://www.youtube.com/watch?v=jNQXAC9IVRw",
        sales: "https://www.youtube.com/watch?v=aqz-KE-bpKQ"
    },

    // 2. Calendly Link
    calendlyUrl: "https://calendly.com/your-link",

    // 2b. Contact Email (for the toolbar)
    contactEmail: "support@example.com",

    // 3. Google Sheet ID (from the URL of your sheet)
    // Leave empty "" to skip saving to sheet
    googleSheetId: "",

    // 4. Branding
    companyName: "DB Financials",
    logoPath: "./favicon.png",
    brandColor: "#3b82f6", // Blue-500

    // 5. Text Content
    texts: {
        formTitle: "Let's Get Started",
        formSubtitle: "Enter your details to begin.",
        submitButton: "Continue to Video",

        introTitle: "Watch this first",
        watchedButton: "I've watched the video",

        questionTitle: "What describes you best?",
        optionA: "I want to recruit agents",
        optionB: "I want to sell more policies",

        finalTitle: "Here is your plan",

        finalScreenTitle: "Perfect, {firstName}!",
        finalScreenSubtitle: "Based on your answers, we think this is the best path for you. Let's chat.",
        calendlyButton: "Book a Strategy Call",
        restartButton: "Start Over"
    },

    // 6. Placeholders
    placeholders: {
        firstName: "First Name",
        lastName: "Last Name",
        email: "Email Address",
        phone: "Phone Number (Optional)",
        advisorName: "Advisor Name (Optional)"
    }
};
