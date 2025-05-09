function showPopup(type, message) {
    const popup = document.getElementById(type === "success" ? "successPopup" : "errorPopup");
    popup.textContent = message;
    popup.classList.add("show");

    setTimeout(() => {
        popup.classList.remove("show");
    }, type === "success" ? 6000 : 5000); // 6s for success, 5s for error
}

document.addEventListener("DOMContentLoaded", () => {
    const errorResponse = document.getElementById("errorResponse");
    const successResponse = document.getElementById("successResponse");

    const errorResponseText = errorResponse ? errorResponse.innerText.trim() : "";
    const successResponseText = successResponse ? successResponse.innerText.trim() : "";

    if (errorResponseText) {
        showPopup("error", errorResponseText);
        errorResponse.style.display = "none"; // Hide static error div after popup
    }

    if (successResponseText) {
        showPopup("success", successResponseText);
        successResponse.style.display = "none"; // Hide static success div after popup
    }

    // Disable form inputs if there was an error
    const form = document.querySelector("form");
    const submitButton = form.querySelector("button[type='submit']");
    if (errorResponseText) {
        form.querySelectorAll("input").forEach(input => input.disabled = true);
        submitButton.disabled = true;
        setTimeout(() => {
            form.querySelectorAll("input").forEach(input => input.disabled = false);
            submitButton.disabled = false;
            document.getElementById("email").value = ""; // Clear email field
        }, 5000);
    }
});

function validateSignup(event) {
    event.preventDefault();

    const form = event.target;
    const submitButton = form.querySelector("button[type='submit']");
    submitButton.disabled = true; // Disable button during validation

    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm-password").value;

    let isValid = true;
    let errorMessages = [];

    // Client-side validation
    if (username.length < 3) errorMessages.push("Username must be at least 3 characters.");
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) errorMessages.push("Invalid email format.");
    if (password.length < 8) errorMessages.push("Password must be at least 8 characters.");
    else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) errorMessages.push("Password must include at least one special character.");
    if (password !== confirmPassword) errorMessages.push("Passwords do not match.");

    isValid = errorMessages.length === 0;

    if (!isValid) {
        showPopup("error", errorMessages.join(" "));
        submitButton.disabled = false; // Re-enable button
        return false;
    }

    // If validation passes, submit the form
    form.submit();
    return true;
}
