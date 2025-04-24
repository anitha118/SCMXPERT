function showPopup(type, message) {
    const popup = document.getElementById(type === "success" ? "successPopup" : "errorPopup");
    popup.textContent = message;
    popup.classList.add("show");

    setTimeout(() => {
        popup.classList.remove("show");
    }, type === "success" ? 6000 : 3000);
}

function validateSignup(event) {
    event.preventDefault();

    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm-password").value;

    let isValid = true;
    let errorMessages = [];

    if (username.length < 3) errorMessages.push("Username must be at least 3 characters.");
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) errorMessages.push("Invalid email format.");
    if (password.length < 8) errorMessages.push("Password must be at least 8 characters.");
    else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) errorMessages.push("Password must include at least one special character.");
    if (password !== confirmPassword) errorMessages.push("Passwords do not match.");

    isValid = errorMessages.length === 0;
    if (document.getElementById('errorResponse').innerText) {
        showPopup("error", document.getElementById('errorResponse').innerText);
        setTimeout(() => event.target.submit(), 2000);
        return true;
    }
    if (!isValid) {
        showPopup("error", errorMessages.join(" "));
        return false;
    } else {
        showPopup("success", "Signup successful!");
        setTimeout(() => event.target.submit(), 1000);
        return true;
    }
}
