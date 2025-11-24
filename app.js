// --- Global Helpers & State ---
const steps = ['step-0', 'step-1', 'step-2', 'step-3', 'step-4'];
let userData = {
    firstName: '', lastName: '', email: '', phone: '', advisorName: '', advisorCalendlyLink: '', path: ''
};
let advisors = []; // Will be loaded from advisors.json
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
                    'rel': 0,
                    'modestbranding': 1
                },
                events: {
                    'onStateChange': (event) => {
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
    const calLink = document.getElementById('calendly-link');
    if (calLink) {
        calLink.href = userData.advisorCalendlyLink || config.calendlyUrl;
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
            // alert("Configuration Error: config.js not loaded.");
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

        // Update buttons text (using span inside button now)
        const optA = document.querySelector('#opt-a-btn span');
        if (optA) optA.textContent = c.texts.optionA;
        const optB = document.querySelector('#opt-b-btn span');
        if (optB) optB.textContent = c.texts.optionB;

        const calLink = document.getElementById('calendly-link');
        if (calLink) calLink.href = c.calendlyUrl;

        // --- Load Advisors ---
        async function loadAdvisors() {
            try {
                const response = await fetch('./data/advisors.json');
                advisors = await response.json();

                const advisorSelect = document.getElementById('advisor-name');
                if (advisorSelect) {
                    // Clear existing options except the first one
                    advisorSelect.innerHTML = '<option value="">Select an advisor...</option>';

                    // Populate dropdown with advisors
                    advisors.forEach(advisor => {
                        const option = document.createElement('option');
                        option.value = advisor.name;
                        option.textContent = advisor.name;
                        option.dataset.calendlyLink = advisor.calendlyLink;
                        advisorSelect.appendChild(option);
                    });
                }
            } catch (error) {
                console.error('Failed to load advisors:', error);
            }
        }

        // Load advisors on page load
        loadAdvisors();

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

                // Get advisor name and Calendly link
                const advisorSelect = document.getElementById('advisor-name');
                userData.advisorName = advisorSelect.value;
                const selectedOption = advisorSelect.options[advisorSelect.selectedIndex];
                userData.advisorCalendlyLink = selectedOption.dataset.calendlyLink || c.calendlyUrl;

                // Send to Sheet
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
                // Optionally replay the intro video
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
                const videoId = userData.path === 'recruit' ? c.videos.recruit : c.videos.sales;
                playVideo('video-final-player', videoId, () => {
                    console.log("Final Video Ended");
                    showStep('step-4');
                    setupFinalScreen(c);
                });
            });
        }

        // Step 2: Choose Path
        window.handleChoice = function (type) {
            userData.path = type;

            if (c.googleSheetId && c.googleSheetId.trim() !== "") {
                fetch('/.netlify/functions/sheet-worker', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: userData.email,
                        ...userData,
                        timestamp: new Date().toISOString(),
                        note: "Path Selected",
                        sheetId: c.googleSheetId
                    })
                }).catch(err => console.error("Sheet update failed", err));
            }

            showStep('step-3');
            const videoId = type === 'recruit' ? c.videos.recruit : c.videos.sales;

            playVideo('video-final-player', videoId, () => {
                console.log("Final Video Ended");
                showStep('step-4');
                setupFinalScreen(c);
            });

            // Fallback
            setTimeout(() => {
                if (!document.getElementById('step-3-btn')) {
                    const btn = document.createElement('button');
                    btn.id = 'step-3-btn';
                    btn.className = 'btn-primary w-full py-4 rounded-xl font-bold text-lg text-white mt-6 fade-in shadow-lg shadow-blue-500/30';
                    btn.textContent = "Continue to Booking";
                    btn.onclick = () => {
                        stopVideo('video-final-player');
                        showStep('step-4');
                        setupFinalScreen(c);
                    };
                    const s3 = document.querySelector('#step-3');
                    if (s3) s3.appendChild(btn);
                }
            }, 10000);
        };

        const optABtn = document.getElementById('opt-a-btn');
        if (optABtn) optABtn.addEventListener('click', () => window.handleChoice('recruit'));

        const optBBtn = document.getElementById('opt-b-btn');
        if (optBBtn) optBBtn.addEventListener('click', () => window.handleChoice('sales'));

        // Restart
        const restartBtn = document.getElementById('restart-btn');
        if (restartBtn) restartBtn.addEventListener('click', () => {
            location.reload();
        });

        // Init
        showStep('step-0');
    });
}
