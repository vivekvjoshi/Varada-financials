window.APP_CONFIG = {
    // 1. YouTube Video URLs (Full Links)
    videos: {
        intro: "https://youtu.be/jP680upz4Dw",
        recruit: "https://youtu.be/47I8fqBZlLM",
        sales: "https://youtu.be/bUmAaZB6D08"
    },

    // 2. Calendly Link
    calendlyUrl: "https://calendly.com/your-link",

    // 2b. Contact Email (for the toolbar)
    contactEmail: "support@example.com",

    // 3. Google Sheet ID (from the URL of your sheet)
    // Leave empty "" to skip saving to sheet
    googleSheetId: "1Oj8bhNSE50Y3cDGww5rfckZ4gL1sXKhxzia4eyD0Mn8",
    sheetTab: "Lead Capture",

    // 4. Branding
    companyName: "DB Financial",
    logoPath: "./favicon.png",
    brandColor: "#3b82f6", // Blue-500

    // 5. Text Content
    texts: {
        formTitle: "Let's Get Started",
        formSubtitle: "Enter your details to begin.",
        submitButton: "Continue to Video",

        introTitle: "Watch this first",
        watchedButton: "I've watched the video",

        questionTitle: "Choices For You",
        optionA: "Education about Financial Concepts & Get Your Financial Health Check",
        optionB: "Interested in Leveraged Income",
        optionC: "Both", // Not used in original code but useful if we genericize

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
        email: "Email Address (Optional)",
        phone: "Phone Number",
        advisorName: "Advisor Name"
    }
};
