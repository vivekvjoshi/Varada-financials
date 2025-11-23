const { extractVideoId, userData, showStep, setupFinalScreen } = require('../app');

// Mock DOM
document.body.innerHTML = `
  <div id="step-0" class="hidden"></div>
  <div id="step-1" class="hidden"></div>
  <div id="step-2" class="hidden"></div>
  <div id="step-3" class="hidden"></div>
  <div id="step-4" class="hidden"></div>
  <h2 id="final-screen-title"></h2>
`;

describe('App Logic', () => {
    test('extractVideoId should return ID from various YouTube URL formats', () => {
        expect(extractVideoId('https://www.youtube.com/watch?v=dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
        expect(extractVideoId('https://youtu.be/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
        expect(extractVideoId('https://www.youtube.com/embed/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
    });

    test('showStep should toggle classes correctly', () => {
        showStep('step-1');
        expect(document.getElementById('step-1').classList.contains('hidden')).toBe(false);
        expect(document.getElementById('step-1').classList.contains('slide-up')).toBe(true);
        expect(document.getElementById('step-0').classList.contains('hidden')).toBe(true);
    });

    test('setupFinalScreen should update title with user name', () => {
        userData.firstName = 'TestUser';
        const config = { texts: { finalScreenTitle: 'Hello, {firstName}!' } };
        setupFinalScreen(config);
        expect(document.getElementById('final-screen-title').textContent).toBe('Hello, TestUser!');
    });
});
