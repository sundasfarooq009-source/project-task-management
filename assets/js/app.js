document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault(); // Form ko submit hokar page refresh hone se rokna
    
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const errorMsg = document.getElementById('errorMessage');

    // Basic Validation Requirements
    if (email === "" || password === "") {
        errorMsg.textContent = "Please fill in all fields.";
        errorMsg.style.display = "block";
        return;
    }

    if (password.length < 6) {
        errorMsg.textContent = "Password must be at least 6 characters long.";
        errorMsg.style.display = "block";
        return;
    }

    // Agar verification pass ho jaye
    errorMsg.style.display = "none";
    alert("Login Successful! Moving to Dashboard...");
    
    // Yahan se hum agle step me dashboard page par navigate karwayenge
});