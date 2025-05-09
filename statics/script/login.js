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
        return true;
    } else {
        showPopup("error", "Incorrect CAPTCHA. Please try again.");
        generateCaptcha(); // Regenerate captcha on failure
        return false;
    }
}

function showPopup(type, message) {
    const popup = document.getElementById(type === "success" ? "successPopup" : "errorPopup");
    popup.textContent = message;
    popup.classList.add("show");

    setTimeout(() => {
        popup.classList.remove("show");
    }, type === "success" ? 6000 : 3000);
}

async function validateLogin(event) {
    event.preventDefault(); // Stop default form submission

    let email = document.getElementById("login-email").value.trim();
    let password = document.getElementById("login-password").value.trim();
    let isValid = true;

    // Client-side validation
    if (!email.includes("@") || !email.includes(".")) {
        showPopup("error", "Invalid Email format");
        isValid = false;
    }

    if (password.length < 6) {
        showPopup("error", "Password must be at least 6 characters");
        isValid = false;
    }

    if (!validateCaptcha()) {
        return false; // If CAPTCHA fails, stop
    }

    if (!isValid) return false;

    // Prepare form data
    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    try {
        const response = await fetch("/login", {
            method: "POST",
            body: formData,
        });

        if (response.redirected) {
            // Login Success: Redirect directly
            window.location.href = response.url;
        } else {
            // Login failed: Show error
            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, "text/html");
            const errorMessage = doc.querySelector("#errorResponse")?.textContent.trim();

            if (errorMessage) {
                showPopup("error", errorMessage);
            } else {
                showPopup("error", "Unknown error occurred");
            }
        }

    } catch (err) {
        showPopup("error", "Server error. Please try again.");
    }

    return false;
}
