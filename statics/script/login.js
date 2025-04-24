document.addEventListener("DOMContentLoaded", function () {
    generateCaptcha(); // Generate captcha on page load

    document.querySelector(".captcha-refresh").addEventListener("click", generateCaptcha);
});

function generateCaptcha() {
    let captchaText = "";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    
    for (let i = 0; i < 6; i++) {
        captchaText += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    document.querySelector(".preview").innerText = captchaText;
    document.querySelector("#captcha-form").value = ""; // Clear input field
}

function validateCaptcha() {
    const enteredCaptcha = document.querySelector("#captcha-form").value;
    const generatedCaptcha = document.querySelector(".preview").innerText;

    if (enteredCaptcha === generatedCaptcha) {
        alert("CAPTCHA validation successful!");
        return true;
    } else {
        alert("Incorrect CAPTCHA. Please try again.");
        generateCaptcha(); // Regenerate captcha on failure
        return false;
    }
}

function validateLogin() {
    let email = document.getElementById("login-email").value;
    let password = document.getElementById("login-password").value;
    let isValid = true;

    document.getElementById("login-email-error").innerText = "";
    document.getElementById("login-password-error").innerText = "";

    // Email validation
    if (!email.includes("@") || !email.includes(".")) {
        document.getElementById("login-email-error").innerText = "Invalid email format";
        isValid = false;
    }

    // Password validation
    if (password.length < 6) {
        document.getElementById("login-password-error").innerText = "Password must be at least 6 characters";
        isValid = false;
    }

    // If all validations pass
    if (isValid) {
        alert("Login successful!");
        window.location.href = "dashboard.html";  // Redirect to Welcome page
    }
}
