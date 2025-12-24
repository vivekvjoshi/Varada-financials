// --- Global Helpers & State ---
const steps = ['step-0', 'step-1', 'step-2', 'step-3', 'step-4', 'step-5'];
let userData = {
    firstName: '', lastName: '', email: '', phone: '', advisorName: '', advisorCalendlyLink: '', path: '', feedback: '', followupDate: ''
};
let players = { intro: null, final: null };
let apiReady = false;

// --- YouTube API Setup ---
if (typeof document !== 'undefined') {
    var tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    if (firstScriptTag) {
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }
}

if (typeof window !== 'undefined') {
    window.onYouTubeIframeAPIReady = function () {
        apiReady = true;
        console.log("YouTube API Ready");
    };
}

function extractVideoId(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : url;
}

function playVideo(playerId, videoUrl, onEndedCallback) {
    const videoId = extractVideoId(videoUrl);

    if (!apiReady) {
        console.warn("API not ready, retrying in 500ms");
        setTimeout(() => playVideo(playerId, videoUrl, onEndedCallback), 500);
        return;
    }

    const key = playerId === 'video-intro-player' ? 'intro' : 'final';

    if (players[key]) {
        players[key].loadVideoById(videoId);
    } else {
        if (typeof YT !== 'undefined') {
            players[key] = new YT.Player(playerId, {
                height: '100%',
                width: '100%',
                videoId: videoId,
                host: 'https://www.youtube-nocookie.com',
                playerVars: {
                    'playsinline': 1,
                    'autoplay': 1,
                    'mute': 1,
                    'rel': 0,
                    'modestbranding': 1
                },
                events: {
                    'onStateChange': (event) => {
                        if (event.data === YT.PlayerState.PLAYING) {
                            // Attempt to unmute when playing starts
                            // (Browser might block if no interaction, but we have a click prior)
                            // event.target.unMute(); 
                            // Actually, let's keep it muted or let user unmute? 
                            // "Auto start" usually implies visual start.
                            // I will UNMUTE it.
                            event.target.unMute();
                        }
                        if (event.data === YT.PlayerState.ENDED) {
                            if (onEndedCallback) onEndedCallback();
                        }
                    }
                }
            });
        }
    }
}

function stopVideo(playerId) {
    const key = playerId === 'video-intro-player' ? 'intro' : 'final';
    if (players[key] && typeof players[key].stopVideo === 'function') {
        players[key].stopVideo();
    }
}

function showStep(stepId) {
    steps.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            if (id === stepId) {
                el.classList.remove('hidden');
                el.classList.add('slide-up');
            } else {
                el.classList.add('hidden');
                el.classList.remove('slide-up');
            }
        }
    });
}

function setupFinalScreen(config) {
    const title = config.texts.finalScreenTitle.replace('{firstName}', userData.firstName);
    const el = document.getElementById('final-screen-title');
    if (el) el.textContent = title;

    // Use advisor's Calendly link if available, otherwise use default
    // Since Advisor Name is now a text box, we don't have a specific link per advisor.
    // We use the default one from config.
    const calLink = document.getElementById('calendly-link');
    if (calLink) {
        calLink.href = config.calendlyUrl;
    }
}

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        extractVideoId,
        userData,
        showStep,
        setupFinalScreen
    };
}

// --- Main Logic ---
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const c = window.APP_CONFIG;
        if (!c) {
            console.error("Config not loaded!");
            return;
        }

        // --- Apply Config ---
        document.documentElement.style.setProperty('--brand-color', c.brandColor);

        // Branding
        if (c.companyName) {
            const el = document.getElementById('app-name');
            if (el) el.textContent = c.companyName;
        }
        if (c.logoPath) {
            const el = document.getElementById('app-logo');
            if (el) el.src = c.logoPath;
        }
        document.title = c.companyName || "Video Advisor";

        // Contact Button
        const contactBtn = document.getElementById('contact-btn');
        if (contactBtn) {
            if (c.contactEmail) {
                contactBtn.href = `mailto:${c.contactEmail}`;
            } else {
                contactBtn.style.display = 'none';
            }
        }

        // Texts
        const setTxt = (id, txt) => { const el = document.getElementById(id); if (el) el.textContent = txt; };
        setTxt('form-title', c.texts.formTitle);
        setTxt('form-subtitle', c.texts.formSubtitle);
        setTxt('submit-btn', c.texts.submitButton);
        setTxt('intro-title', c.texts.introTitle);
        setTxt('watched-btn', c.texts.watchedButton);
        setTxt('question-title', c.texts.questionTitle);
        setTxt('final-video-title', c.texts.finalTitle);
        setTxt('final-screen-subtitle', c.texts.finalScreenSubtitle);
        setTxt('calendly-link', c.texts.calendlyButton);
        setTxt('restart-btn', c.texts.restartButton);

        const setPlaceholder = (id, txt) => { const el = document.getElementById(id); if (el) el.placeholder = txt; };
        setPlaceholder('fname', c.placeholders.firstName);
        setPlaceholder('lname', c.placeholders.lastName);
        setPlaceholder('email', c.placeholders.email);
        setPlaceholder('phone', c.placeholders.phone);
        setPlaceholder('advisor-name', c.placeholders.advisorName);

        // Update buttons text
        const optA = document.querySelector('#opt-a-btn span');
        if (optA) optA.textContent = c.texts.optionA;
        const optB = document.querySelector('#opt-b-btn span');
        if (optB) optB.textContent = c.texts.optionB;
        const optC = document.querySelector('#opt-c-btn span');
        if (optC) optC.textContent = c.texts.optionC;

        const calLink = document.getElementById('calendly-link');
        if (calLink) calLink.href = c.calendlyUrl;

        // --- Helper to Send to Sheet ---
        async function sendToSheet() {
            if (c.googleSheetId && c.googleSheetId.trim() !== "") {
                try {
                    await fetch('/.netlify/functions/sheet-worker', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            ...userData,
                            timestamp: new Date().toISOString(),
                            sheetId: c.googleSheetId
                        })
                    });
                } catch (err) {
                    console.error("Sheet save failed", err);
                }
            }
        }

        // --- Event Listeners ---

        // Step 0: Submit Form
        const leadForm = document.getElementById('lead-form');
        if (leadForm) {
            leadForm.addEventListener('submit', async (e) => {
                e.preventDefault();

                const btn = document.getElementById('submit-btn');
                const originalText = btn.textContent;
                btn.textContent = "Processing...";
                btn.disabled = true;

                userData.firstName = document.getElementById('fname').value;
                userData.lastName = document.getElementById('lname').value;
                userData.email = document.getElementById('email').value;
                userData.phone = document.getElementById('phone').value;
                userData.advisorName = document.getElementById('advisor-name').value;
                userData.path = "Started";

                // Send Lead Data
                await sendToSheet();

                btn.textContent = originalText;
                btn.disabled = false;

                // Move to Step 1
                showStep('step-1');
                playVideo('video-intro-player', c.videos.intro, () => {
                    console.log("Intro Video Ended");
                    showStep('step-2');
                });
                // Fallback
                setTimeout(() => {
                    const wb = document.getElementById('watched-btn');
                    if (wb) wb.classList.remove('hidden');
                }, 5000);
            });
        }

        // Step 1: Manual Watched
        const watchedBtn = document.getElementById('watched-btn');
        if (watchedBtn) {
            watchedBtn.addEventListener('click', () => {
                stopVideo('video-intro-player');
                showStep('step-2');
            });
        }

        // Step 1: Back to Form
        const backToFormBtn = document.getElementById('back-to-form-btn');
        if (backToFormBtn) {
            backToFormBtn.addEventListener('click', () => {
                stopVideo('video-intro-player');
                showStep('step-0');
            });
        }

        // Step 2: Back to Video
        const backToVideoBtn = document.getElementById('back-to-video-btn');
        if (backToVideoBtn) {
            backToVideoBtn.addEventListener('click', () => {
                showStep('step-1');
                playVideo('video-intro-player', c.videos.intro, () => {
                    console.log("Intro Video Ended");
                    showStep('step-2');
                });
            });
        }

        // Step 3: Back to Question
        const backToQuestionBtn = document.getElementById('back-to-question-btn');
        if (backToQuestionBtn) {
            backToQuestionBtn.addEventListener('click', () => {
                stopVideo('video-final-player');
                showStep('step-2');
            });
        }

        // Step 4: Back to Final Video
        const backToFinalVideoBtn = document.getElementById('back-to-final-video-btn');
        if (backToFinalVideoBtn) {
            backToFinalVideoBtn.addEventListener('click', () => {
                showStep('step-3');
                // Replay the final video
                const videoId = (userData.path === 'education') ? c.videos.recruit : c.videos.sales;
                playVideo('video-final-player', videoId, () => {
                    console.log("Final Video Ended");
                    showStep('step-4');
                });
            });
        }

        // Step 2: Choose Path
        window.handleChoice = function (type) {
            userData.path = type; // "education", "income", or "both"

            showStep('step-3');

            // Logic: Option 1 (education) -> Video 2 (recruit)
            // Option 2 (income) & 3 (both) -> Video 3 (sales)
            const videoId = (type === 'education') ? c.videos.recruit : c.videos.sales;

            playVideo('video-final-player', videoId, () => {
                console.log("Final Video Ended");
                showStep('step-4'); // Go to Feedback Form
            });

            // Fallback
            setTimeout(() => {
                if (!document.getElementById('step-3-btn')) {
                    const btn = document.createElement('button');
                    btn.id = 'step-3-btn';
                    btn.className = 'btn-primary w-full py-4 rounded-xl font-bold text-lg text-white mt-6 fade-in shadow-lg shadow-blue-500/30';
                    btn.textContent = "Continue";
                    btn.onclick = () => {
                        stopVideo('video-final-player');
                        showStep('step-4');
                    };
                    const s3 = document.querySelector('#step-3');
                    if (s3) s3.appendChild(btn);
                }
            }, 10000);
        };

        const optABtn = document.getElementById('opt-a-btn');
        if (optABtn) optABtn.addEventListener('click', () => window.handleChoice('education'));

        const optBBtn = document.getElementById('opt-b-btn');
        if (optBBtn) optBBtn.addEventListener('click', () => window.handleChoice('income'));

        const optCBtn = document.getElementById('opt-c-btn');
        if (optCBtn) optCBtn.addEventListener('click', () => window.handleChoice('both'));

        // Step 4: Feedback Form Submit
        const feedbackForm = document.getElementById('feedback-form');
        if (feedbackForm) {
            feedbackForm.addEventListener('submit', async (e) => {
                e.preventDefault();

                const btn = document.getElementById('feedback-submit-btn');
                const originalText = btn.textContent;
                btn.textContent = "Sending...";
                btn.disabled = true;

                userData.feedback = document.getElementById('feedback-text').value;
                userData.followupDate = document.getElementById('followup-date').value;

                // Send Final Data
                await sendToSheet();

                btn.textContent = originalText;
                btn.disabled = false;

                showStep('step-5');
                setupFinalScreen(c);
            });
        }

        // Restart
        const restartBtn = document.getElementById('restart-btn');
        if (restartBtn) restartBtn.addEventListener('click', () => {
            location.reload();
        });

        // Init
        showStep('step-0');
    });
}
