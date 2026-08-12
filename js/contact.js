const API = "http://localhost:5000/api/contact";

const form = document.getElementById("contactForm");

function setValidation(inputId, errorId, message, valid) {

    const input = document.getElementById(inputId);
    const error = document.getElementById(errorId);

    if (valid) {

        input.classList.remove("is-invalid");
        input.classList.add("is-valid");

        error.innerHTML = "";

    } else {

        input.classList.remove("is-valid");
        input.classList.add("is-invalid");

        error.innerHTML = message;

    }

}

function validateForm() {

    let valid = true;

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const subject = document.getElementById("subject").value.trim();
    const message = document.getElementById("message").value.trim();

    // Name

    if (name === "") {

        setValidation("name", "nameError", "Name is required", false);

        valid = false;

    } else if (!/^[A-Za-z ]{3,50}$/.test(name)) {

        setValidation("name", "nameError", "Enter a valid name", false);

        valid = false;

    } else {

        setValidation("name", "nameError", "", true);

    }

    // Email

    if (email === "") {

        setValidation("email", "emailError", "Email is required", false);

        valid = false;

    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {

        setValidation("email", "emailError", "Enter a valid email", false);

        valid = false;

    } else {

        setValidation("email", "emailError", "", true);

    }

    // Phone

    if (phone === "") {

        setValidation("phone", "phoneError", "Phone number is required", false);

        valid = false;

    } else if (!/^[6-9]\d{9}$/.test(phone)) {

        setValidation("phone", "phoneError", "Enter a valid mobile number", false);

        valid = false;

    } else {

        setValidation("phone", "phoneError", "", true);

    }

    // Subject

    if (subject === "") {

        setValidation("subject", "subjectError", "Subject is required", false);

        valid = false;

    } else {

        setValidation("subject", "subjectError", "", true);

    }

    // Message

    if (message === "") {

        setValidation("message", "messageError", "Message is required", false);

        valid = false;

    } else if (message.length < 10) {

        setValidation("message", "messageError", "Minimum 10 characters required", false);

        valid = false;

    } else {

        setValidation("message", "messageError", "", true);

    }

    return valid;

}

document.getElementById("name").addEventListener("input", validateForm);

document.getElementById("email").addEventListener("input", validateForm);

document.getElementById("subject").addEventListener("input", validateForm);

document.getElementById("message").addEventListener("input", validateForm);

const phoneInput = document.getElementById("phone");

phoneInput.addEventListener("input", function () {

    this.value = this.value.replace(/\D/g, "");

    if (this.value.length > 10) {

        this.value = this.value.slice(0, 10);

    }

    validateForm();

});

phoneInput.addEventListener("keypress", function (e) {

    if (!/[0-9]/.test(e.key)) {

        e.preventDefault();

    }

});

form.addEventListener("submit", async function (e) {

    e.preventDefault();

    if (!validateForm()) {

        Swal.fire({

            icon: "error",

            title: "Validation Error",

            text: "Please correct the highlighted fields."

        });

        return;

    }

    const body = {

        name: document.getElementById("name").value,

        email: document.getElementById("email").value,

        phone: document.getElementById("phone").value,

        subject: document.getElementById("subject").value,

        message: document.getElementById("message").value

    };

    const response = await fetch(API, {

        method: "POST",

        headers: {

            "Content-Type": "application/json"

        },

        body: JSON.stringify(body)

    });

    const data = await response.json();

    if (data.success) {

        Swal.fire({

            icon: "success",

            title: "Message Sent Successfully!",

            html: `
        <strong>Thank you for contacting Decozin.</strong><br><br>
        We have received your message.<br>
        Our customer support team will review your inquiry and contact you as soon as possible.
    `,

            confirmButtonText: "OK",

            confirmButtonColor: "#C2185B"

        });

        form.reset();

        document.querySelectorAll(".form-control").forEach(input => {

            input.classList.remove("is-valid");

        });

    } else {

        Swal.fire({

            icon: "error",

            title: "Oops!",

            text: data.message

        });

    }

});

