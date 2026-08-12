// Password Toggle

document.getElementById("togglePassword").onclick = () => {

    const input = document.getElementById("password");

    input.type = input.type === "password" ? "text" : "password";

};

document.getElementById("toggleConfirmPassword").onclick = () => {

    const input = document.getElementById("confirmPassword");

    input.type = input.type === "password" ? "text" : "password";

};

const inputs = document.querySelectorAll(".otp-digit");

inputs.forEach((input, index) => {

    input.addEventListener("input", (e) => {

        e.target.value = e.target.value.replace(/[^0-9]/g, '');

        if (e.target.value && index < 5) {

            inputs[index + 1].focus();

        }

    });

    input.addEventListener("keydown", (e) => {

        if (e.key === "Backspace" && !input.value && index > 0) {

            inputs[index - 1].focus();

        }

    });

});

inputs[0].addEventListener("paste", (e) => {

    e.preventDefault();

    const otp = e.clipboardData.getData("text").trim();

    if (otp.length !== 6) return;

    otp.split("").forEach((num, index) => {

        inputs[index].value = num;

    });

});

const form = document.getElementById("registerForm");
const sendBtn = form.querySelector("button[type='submit']");

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const name = document.getElementById("name").value.trim();

    const email = document.getElementById("email").value.trim();

    const phone = document.getElementById("phone").value.trim();

    const password = document.getElementById("password").value;

    const confirmPassword = document.getElementById("confirmPassword").value;

    // Name
    if (name.length < 3) {
        alert("Full Name must be at least 3 characters.");
        return;
    }

    // Email
    if (!validateEmail(email)) {
        alert("Please enter a valid email address.");
        return;
    }

    // Phone
    if (!validatePhone(phone)) {
        alert("Please enter a valid 10-digit mobile number.");
        return;
    }

    // Password
    const passwordCheck = validatePassword(password);

    if (!passwordCheck.valid) {
        alert(passwordCheck.message);
        return;
    }

    // Confirm Password
    if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return;
    }

    if (!agreeTerms.checked) {
        document.getElementById("termsError").innerHTML =
            '<i class="fa-solid fa-circle-exclamation"></i> Please accept the Terms & Conditions and Privacy Policy.';
        agreeTerms.focus();
        return;
    }

    document.getElementById("termsError").innerHTML = "";

    // Show loading
    sendBtn.disabled = true;
    sendBtn.innerHTML =
        '<i class="fa-solid fa-spinner fa-spin"></i> Sending OTP...';

    try {

        const response = await fetch(`${API_URL}/auth/send-otp`, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                name,

                email,

                phone,

                password

            })

        });

        const data = await response.json();

        console.log("Response:", data);

        if (!response.ok) {
            alert(data.message || "Something went wrong");
            return;
        }

        sessionStorage.setItem("registerData", JSON.stringify({

            name,

            email,

            phone,

            password

        }));

        document.getElementById("otpEmail").textContent = email;

        const otpModal = new bootstrap.Modal(
            document.getElementById("otpModal")
        );

        showToast("OTP sent successfully to your email.", "success");

        otpModal.show();

        startTimer();

        sendBtn.disabled = false;

        sendBtn.innerHTML = "Send OTP";

    }

    catch (err) {

        alert(err.message);

    }

});

document
    .getElementById("verifyOtpBtn")
    .addEventListener("click", verifyOtp);

async function verifyOtp() {

    const otp = [...document.querySelectorAll(".otp-digit")]
        .map(input => input.value)
        .join("");

    if (otp.length !== 6) {
        alert("Please enter the complete 6-digit OTP");
        return;
    }

    const registerData = JSON.parse(
        sessionStorage.getItem("registerData")
    );

    if (!registerData) {
        alert("Registration expired.");
        return;
    }

    const btn = document.getElementById("verifyOtpBtn");

    btn.disabled = true;
    btn.innerHTML =
        '<i class="fa-solid fa-spinner fa-spin"></i> Verifying...';

    try {

        const response = await fetch(`${API_URL}/auth/verify-otp`, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                email: registerData.email,

                otp

            })

        });

        const data = await response.json();

        console.log("Response:", data);

        if (!response.ok) {
            alert(data.message || "Something went wrong");
            return;
        }

        localStorage.setItem("token", data.token);

        localStorage.setItem("user", JSON.stringify(data.user));

        sessionStorage.removeItem("registerData");

        btn.innerHTML =
            '<i class="fa-solid fa-circle-check"></i> Verified';

        btn.style.background = "#28a745";

        const userName = data.user.name;

        showToast(`🎉 Welcome ${userName}! Your account has been created successfully.`, "success");

        btn.innerHTML =
            '<i class="fa-solid fa-circle-check"></i> Verified';

        btn.style.background = "#28a745";

        setTimeout(() => {
            window.location.href = "index.html";
        }, 2500);

    }

    catch (err) {

        alert(err.message);

    }

    finally {

        btn.disabled = false;

        btn.innerHTML = "Verify OTP";

    }

}

let timerInterval;
let timeLeft = 120; // 2 minutes

const timer = document.getElementById("otpTimer");
const resendBtn = document.getElementById("resendOtp");

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

            resendBtn.disabled = false;
            resendBtn.style.pointerEvents = "auto";
            resendBtn.style.opacity = "1";
            resendBtn.innerHTML = "Resend OTP";

        }

    }, 1000);

}

resendBtn.addEventListener("click", resendOtp);

async function resendOtp(e) {

    e.preventDefault();

    // Disable button immediately
    resendBtn.disabled = true;
    resendBtn.style.pointerEvents = "none";
    resendBtn.style.opacity = "0.5";
    resendBtn.innerHTML =
        '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';

    const registerData = JSON.parse(
        sessionStorage.getItem("registerData")
    );

    if (!registerData) {

        showToast("Registration session expired.", "error");

        resendBtn.disabled = false;
        resendBtn.style.pointerEvents = "auto";
        resendBtn.style.opacity = "1";
        resendBtn.innerHTML = "Resend OTP";

        return;
    }

    try {

        const response = await fetch(`${API_URL}/auth/send-otp`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(registerData)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Something went wrong");
        }

        showToast("OTP resent successfully to your email.", "success");

        startTimer();

        // Text after successful resend
        resendBtn.innerHTML = "Resend OTP";

    } catch (err) {

        showToast(err.message, "error");

        // Enable button again if request failed
        resendBtn.disabled = false;
        resendBtn.style.pointerEvents = "auto";
        resendBtn.style.opacity = "1";
        resendBtn.innerHTML = "Resend OTP";

    }

}

// =========================
// VALIDATION FUNCTIONS
// =========================

// Email Validation
function validateEmail(email) {
    const emailRegex =
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/;

    return emailRegex.test(email);
}

// Phone Validation (Only 10 digits)
function validatePhone(phone) {
    const phoneRegex = /^[6-9]\d{9}$/;
    return phoneRegex.test(phone);
}

// Password Validation
function validatePassword(password) {

    // No spaces allowed
    if (/\s/.test(password)) {
        return {
            valid: false,
            message: "Password must not contain spaces."
        };
    }

    // Minimum 8 characters
    if (password.length < 8) {
        return {
            valid: false,
            message: "Password must be at least 8 characters."
        };
    }

    // Password Rule
    const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#()_\-+=])[A-Za-z\d@$!%*?&^#()_\-+=]{8,}$/;

    if (!passwordRegex.test(password)) {
        return {
            valid: false,
            message: "Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character."
        };
    }

    return {
        valid: true
    };
}

const phoneInput = document.getElementById("phone");

phoneInput.addEventListener("input", function () {

    // Only numbers
    this.value = this.value.replace(/\D/g, "");

    // Maximum 10 digits
    if (this.value.length > 10) {
        this.value = this.value.slice(0, 10);
    }

});

const passwordInput = document.getElementById("password");

passwordInput.addEventListener("input", () => {

    const result = validatePassword(passwordInput.value);

    if (result.valid) {

        setSuccess(
            "password",
            "passwordError",
            "Strong password."
        );

    } else {

        setError(
            "password",
            "passwordError",
            result.message
        );

    }

    if (confirmPasswordInput.value !== "") {

        if (passwordInput.value !== confirmPasswordInput.value) {

            setError(
                "confirmPassword",
                "confirmPasswordError",
                "Passwords do not match."
            );

        } else {

            setSuccess(
                "confirmPassword",
                "confirmPasswordError",
                "Passwords matched."
            );

        }
    }

});

const confirmPasswordInput = document.getElementById("confirmPassword");

confirmPasswordInput.addEventListener("input", function () {

    const password = passwordInput.value.trim();
    const confirmPassword = this.value.trim();

    if (confirmPassword === "") {

        setError(
            "confirmPassword",
            "confirmPasswordError",
            "Please confirm your password."
        );

        return;
    }

    if (password !== confirmPassword) {

        setError(
            "confirmPassword",
            "confirmPasswordError",
            "Passwords do not match."
        );

        return;
    }

    setSuccess(
        "confirmPassword",
        "confirmPasswordError",
        "Passwords matched."
    );

});

const emailInput = document.getElementById("email");

emailInput.addEventListener("input", () => {

    if (emailInput.value === "") {

        setError(
            "email",
            "emailError",
            "Email is required."
        );

    }
    else if (!validateEmail(emailInput.value)) {

        setError(
            "email",
            "emailError",
            "Enter a valid email address."
        );

    } else {

        setSuccess(
            "email",
            "emailError",
            "Valid email."
        );
    }

});

phoneInput.addEventListener("input", () => {

    phoneInput.value = phoneInput.value.replace(/\D/g, "");

    if (phoneInput.value.length > 10) {

        phoneInput.value = phoneInput.value.slice(0, 10);

    }

    if (phoneInput.value.length === 0) {

        setError(
            "phone",
            "phoneError",
            "Phone number is required."
        );

    }
    else if (phoneInput.value.length < 10) {

        setError(
            "phone",
            "phoneError",
            "Enter exactly 10 digits."
        );

    }
    else {

        setSuccess(
            "phone",
            "phoneError",
            "Valid phone number."
        );

    }

});

const nameInput = document.getElementById("name");

nameInput.addEventListener("input", () => {

    const value = nameInput.value.trim();

    if (value.length < 3) {

        setError(
            "name",
            "nameError",
            "Name must contain at least 3 characters."
        );

    } else {

        setSuccess(
            "name",
            "nameError",
            "Looks good."
        );
    }

});

function setError(inputId, errorId, message) {

    const input = document.getElementById(inputId);
    const error = document.getElementById(errorId);

    input.classList.remove("success");
    input.classList.add("error");

    error.className = "input-error";
    error.innerText = message;
}

function setSuccess(inputId, errorId, message = "") {

    const input = document.getElementById(inputId);
    const error = document.getElementById(errorId);

    input.classList.remove("error");
    input.classList.add("success");

    error.className = "input-error input-success";
    error.innerText = message;
}

function showToast(message, type = "success") {

    const toastElement = document.getElementById("liveToast");
    const toastMessage = document.getElementById("toastMessage");

    // Change message
    toastMessage.textContent = message;

    // Change color
    toastElement.classList.remove(
        "text-bg-success",
        "text-bg-danger",
        "text-bg-warning",
        "text-bg-info"
    );

    switch (type) {
        case "success":
            toastElement.classList.add("text-bg-success");
            break;

        case "error":
            toastElement.classList.add("text-bg-danger");
            break;

        case "warning":
            toastElement.classList.add("text-bg-warning");
            break;

        case "info":
            toastElement.classList.add("text-bg-info");
            break;
    }

    const toast = bootstrap.Toast.getOrCreateInstance(toastElement);

    toast.show();
}

const newPassword =
    document.getElementById("newPassword");

const confirmPassword =
    document.getElementById("confirmPassword");

newPassword.addEventListener("input", () => {

    const result =
        validatePassword(newPassword.value);

    const error =
        document.getElementById("newPasswordError");

    if (result.valid) {

        error.innerHTML = "";

        newPassword.style.borderColor = "#198754";

    }

    else {

        error.innerHTML = result.message;

        newPassword.style.borderColor = "#dc3545";

    }

});

confirmPassword.addEventListener("input", () => {

    const error =
        document.getElementById("confirmPasswordError");

    if (
        confirmPassword.value === ""
    ) {

        error.innerHTML = "";

        return;

    }

    if (
        newPassword.value !== confirmPassword.value
    ) {

        error.innerHTML =
            "Passwords do not match.";

        confirmPassword.style.borderColor =
            "#dc3545";

    }

    else {

        error.innerHTML = "";

        confirmPassword.style.borderColor =
            "#198754";

    }

});