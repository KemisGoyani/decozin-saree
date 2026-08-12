const form = document.getElementById("forgotPasswordForm");
const email = document.getElementById("email");
const emailError = document.getElementById("emailError");
const sendBtn = document.getElementById("sendOtpBtn");
let resetEmail = "";

// Email Validation
function validateEmail(emailValue) {

    const regex =
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/;

    return regex.test(emailValue);

}

// Live Validation
email.addEventListener("input", () => {

    if (email.value.trim() === "") {

        emailError.innerHTML = "Email is required.";
        email.style.borderColor = "#dc3545";
        return;

    }

    if (!validateEmail(email.value)) {

        emailError.innerHTML = "Enter a valid email address.";
        email.style.borderColor = "#dc3545";
        return;

    }

    emailError.innerHTML = "";
    email.style.borderColor = "#198754";

});

// Submit Form
form.addEventListener("submit", async (e) => {

    e.preventDefault();

    if (!validateEmail(email.value)) {

        email.focus();
        return;

    }

    sendBtn.disabled = true;

    sendBtn.innerHTML =
        '<i class="fa-solid fa-spinner fa-spin"></i> Sending OTP...';

    try {

        const response = await fetch(`${API_URL}/auth/forgot-password`, {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify({

                email: email.value.trim()

            })

        });

        const data = await response.json();

        if (!response.ok) {

            showToast(data.message, "error");

            return;

        }

        sessionStorage.setItem("resetEmail", email.value.trim());

        resetEmail = email.value.trim();

        showToast(
            "OTP sent successfully to your email.",
            "success"
        );

        document.getElementById("emailStep").style.display = "none";

        document.getElementById("otpStep").style.display = "block";

        otpInputs.forEach(input => input.value = "");

        otpInputs[0].focus();

        document.getElementById("otpEmail").innerHTML =
            email.value.trim();

        startTimer();

    }

    catch (err) {

        showToast(err.message, "error");

    }

    finally {

        sendBtn.disabled = false;

        sendBtn.innerHTML = "Send OTP";

    }

});

function showToast(message, type = "success") {

    const toast = document.getElementById("liveToast");

    const toastMessage =
        document.getElementById("toastMessage");

    toastMessage.innerHTML = message;

    toast.classList.remove(
        "text-bg-success",
        "text-bg-danger"
    );

    toast.classList.add(
        type === "success"
            ? "text-bg-success"
            : "text-bg-danger"
    );

    bootstrap.Toast
        .getOrCreateInstance(toast)
        .show();

}

document
    .getElementById("verifyOtpBtn")
    .addEventListener("click", verifyResetOtp);

async function verifyResetOtp() {

    const otp = [...document.querySelectorAll(".otp-digit")]
        .map(input => input.value)
        .join("");

    if (otp.length !== 6) {

        showToast(
            "Please enter the complete 6-digit OTP.",
            "error"
        );

        return;

    }

    const email =
        sessionStorage.getItem("resetEmail");

    const btn =
        document.getElementById("verifyOtpBtn");

    btn.disabled = true;

    btn.innerHTML =
        '<i class="fa-solid fa-spinner fa-spin"></i> Verifying...';

    try {

        const response = await fetch(
            `${API_URL}/auth/verify-reset-otp`,
            {

                method: "POST",

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify({

                    email,

                    otp

                })

            });

        const data = await response.json();

        if (!response.ok) {

            showToast(data.message, "error");

            return;

        }

        showToast(
            "OTP verified successfully.",
            "success"
        );

        document.getElementById("otpStep").style.display =
            "none";

        document.getElementById("passwordStep").style.display =
            "block";

    }

    catch (err) {

        showToast(err.message, "error");

    }

    finally {

        btn.disabled = false;

        btn.innerHTML = "Verify OTP";

    }

}

function validatePassword(password) {

    if (password.trim() === "") {

        return {
            valid: false,
            message: "Password is required."
        };

    }

    if (password.length < 8) {

        return {
            valid: false,
            message: "Password must be at least 8 characters."
        };

    }

    if (!/[A-Z]/.test(password)) {

        return {
            valid: false,
            message: "Password must contain one uppercase letter."
        };

    }

    if (!/[a-z]/.test(password)) {

        return {
            valid: false,
            message: "Password must contain one lowercase letter."
        };

    }

    if (!/[0-9]/.test(password)) {

        return {
            valid: false,
            message: "Password must contain one number."
        };

    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {

        return {
            valid: false,
            message: "Password must contain one special character."
        };

    }

    return {

        valid: true,
        message: ""

    };

}

document
    .getElementById("resetBtn")
    .addEventListener("click", resetPassword);

async function resetPassword() {

    const password = newPasswordInput.value.trim();

    const confirmPassword = confirmPasswordInput.value.trim();

    const newPasswordError =
        document.getElementById("newPasswordError");

    const confirmPasswordError =
        document.getElementById("confirmPasswordError");

    newPasswordError.innerHTML = "";
    confirmPasswordError.innerHTML = "";

    const result = validatePassword(password);

    if (!result.valid) {

        newPasswordError.innerHTML = result.message;

        newPasswordInput.focus();

        return;

    }

    if (confirmPassword === "") {

        confirmPasswordError.innerHTML =
            "Confirm Password is required.";

        confirmPasswordInput.focus();

        return;

    }

    if (password !== confirmPassword) {

        confirmPasswordError.innerHTML =
            "Passwords do not match.";

        confirmPasswordInput.focus();

        return;

    }

    const btn = document.getElementById("resetBtn");

    btn.disabled = true;

    btn.innerHTML =
        '<i class="fa-solid fa-spinner fa-spin"></i> Resetting...';

    try {

        const response = await fetch(
            `${API_URL}/auth/reset-password`,
            {

                method: "POST",

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify({

                    email: resetEmail,

                    password

                })

            }
        );

        const data = await response.json();

        if (!response.ok) {

            throw new Error(data.message);

        }

        showToast(
            "🎉 Password changed successfully.",
            "success"
        );

        setTimeout(() => {

            sessionStorage.removeItem("resetEmail");

            window.location.href = "login.html";

        }, 2000);

    }

    catch (err) {

        showToast(
            err.message,
            "error"
        );

    }

    finally {

        btn.disabled = false;

        btn.innerHTML = "Reset Password";

    }

}

function setupPasswordToggle(buttonId, inputId) {

    const button = document.getElementById(buttonId);

    const input = document.getElementById(inputId);

    if (!button || !input) return;

    button.addEventListener("click", () => {

        input.type =
            input.type === "password"
                ? "text"
                : "password";

        button.innerHTML =
            input.type === "password"
                ? '<i class="fa-solid fa-eye"></i>'
                : '<i class="fa-solid fa-eye-slash"></i>';

    });

}

setupPasswordToggle(
    "toggleNewPassword",
    "newPassword"
);

setupPasswordToggle(
    "toggleConfirmPassword",
    "confirmPassword"
);

const newPasswordInput =
    document.getElementById("newPassword");

const confirmPasswordInput =
    document.getElementById("confirmPassword");

newPasswordInput.addEventListener("input", () => {

    const result = validatePassword(newPasswordInput.value);

    const error =
        document.getElementById("newPasswordError");

    if (!result.valid) {

        error.innerHTML = result.message;

        newPasswordInput.style.borderColor = "#dc3545";

    }

    else {

        error.innerHTML = "";

        newPasswordInput.style.borderColor = "#198754";

    }

    if (confirmPasswordInput.value !== "") {

        if (confirmPasswordInput.value !== newPasswordInput.value) {

            document.getElementById(
                "confirmPasswordError"
            ).innerHTML = "Passwords do not match.";

            confirmPasswordInput.style.borderColor = "#dc3545";

        }

        else {

            document.getElementById(
                "confirmPasswordError"
            ).innerHTML = "";

            confirmPasswordInput.style.borderColor = "#198754";

        }

    }

});

confirmPasswordInput.addEventListener("input", () => {

    const error =
        document.getElementById("confirmPasswordError");

    if (confirmPasswordInput.value === "") {

        error.innerHTML = "";

        confirmPasswordInput.style.borderColor = "";

        return;

    }

    if (confirmPasswordInput.value !== newPasswordInput.value) {

        error.innerHTML = "Passwords do not match.";

        confirmPasswordInput.style.borderColor = "#dc3545";

    }

    else {

        error.innerHTML = "";

        confirmPasswordInput.style.borderColor = "#198754";

    }

});

let timerInterval;

let timeLeft = 120;

const timer = document.getElementById("otpTimer");

const resendBtn = document.getElementById("resendOtp");

// ===============================
// OTP Input Boxes
// ===============================

const otpInputs = document.querySelectorAll(".otp-digit");

otpInputs.forEach((input, index) => {

    input.addEventListener("input", (e) => {

        // Allow only numbers
        e.target.value = e.target.value.replace(/\D/g, "");

        // Move to next box
        if (e.target.value && index < otpInputs.length - 1) {

            otpInputs[index + 1].focus();

        }

    });

    input.addEventListener("keydown", (e) => {

        // Backspace -> previous box
        if (
            e.key === "Backspace" &&
            input.value === "" &&
            index > 0
        ) {

            otpInputs[index - 1].focus();

        }

    });

});

otpInputs[0].addEventListener("paste", (e) => {

    e.preventDefault();

    const otp = e.clipboardData
        .getData("text")
        .replace(/\D/g, "");

    if (otp.length !== 6) return;

    otp.split("").forEach((num, index) => {

        otpInputs[index].value = num;

    });

    otpInputs[5].focus();

});

resendBtn.addEventListener("click", resendOtp);

function startTimer() {

    clearInterval(timerInterval);

    timeLeft = 120;

    resendBtn.style.pointerEvents = "none";

    resendBtn.style.opacity = "0.5";

    timerInterval = setInterval(() => {

        const min = Math.floor(timeLeft / 60);

        const sec = timeLeft % 60;

        timer.innerHTML =
            `OTP expires in ${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;

        timeLeft--;

        if (timeLeft < 0) {

            clearInterval(timerInterval);

            timer.innerHTML = "OTP Expired";

            resendBtn.style.pointerEvents = "auto";

            resendBtn.style.opacity = "1";

        }

    }, 1000);

}

async function resendOtp(e) {

    e.preventDefault();

    resendBtn.style.pointerEvents = "none";

    resendBtn.style.opacity = "0.5";

    try {

        const response = await fetch(
            `${API_URL}/auth/forgot-password`,
            {

                method: "POST",

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify({

                    email: resetEmail

                })

            }
        );

        const data = await response.json();

        if (!response.ok) {

            throw new Error(data.message);

        }

        showToast(
            "OTP sent successfully.",
            "success"
        );

        startTimer();

    }

    catch (err) {

        showToast(
            err.message,
            "error"
        );

        resendBtn.style.pointerEvents = "auto";

        resendBtn.style.opacity = "1";

    }

}