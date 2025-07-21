
function onTurnstileSuccess(token) {
    // Hide the Turnstile container
    document.querySelector('.turnstile-container').style.display = 'none';
    // Show the main content
    document.querySelector('.container').style.display = 'block';
    // Set a session cookie to indicate the check has been passed
    document.cookie = "botCheckPassed=true;path=/";
}

function isBotCheckPassed() {
    return document.cookie.split(';').some((item) => item.trim().startsWith('botCheckPassed='));
}

function initBotCheck() {
    if (isBotCheckPassed()) {
        // If the check has been passed, show the content immediately
        document.querySelector('.container').style.display = 'block';
        document.querySelector('.turnstile-container').style.display = 'none';
    } else {
        // Otherwise, show the bot check
        document.querySelector('.container').style.display = 'none';
        document.querySelector('.turnstile-container').style.display = 'flex';
    }
}

// Run the bot check initialization on page load
document.addEventListener('DOMContentLoaded', initBotCheck);
