
async function verify() {
    const token = '...'; // Replace with a real token generation mechanism
    try {
        const response = await fetch('/api/auth', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ token })
        });
        const data = await response.json();
        if (data.success) {
            localStorage.setItem('visited', 'true');
            document.getElementById('challenge-container').style.display = 'none';
            document.getElementById('content').style.display = 'block';
        } else {
            alert('Verification failed. Please try again.');
        }
    } catch (error) {
        console.error('Error during verification:', error);
        alert('An error occurred during verification. Please try again.');
    }
}
