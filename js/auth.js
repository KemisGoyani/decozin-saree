// Password Toggle

const togglePassword = document.getElementById("togglePassword");

const passwordInput = document.getElementById("password");

if (togglePassword) {

    togglePassword.addEventListener("click", () => {

        if (!togglePassword || !passwordInput) return;

        passwordInput.type =
            passwordInput.type === "password"
                ? "text"
                : "password";

        togglePassword.innerHTML =
            passwordInput.type === "password"
                ? '<i class="fa-solid fa-eye"></i>'
                : '<i class="fa-solid fa-eye-slash"></i>';

    });

}


// Login

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", async function (e) {

        e.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();

        const rememberMe =
            document.getElementById("rememberMe").checked;

        const loginBtn =
            loginForm.querySelector("button[type='submit']");

        loginBtn.disabled = true;

        loginBtn.innerHTML =
            '<i class="fa-solid fa-spinner fa-spin"></i> Logging in...';

        try {

            const data = await loginUser(email, password);

            // Save Token
            localStorage.setItem("token", data.token);

            localStorage.setItem(
                "user",
                JSON.stringify(data.user)
            );

            // Remember Email
            if (rememberMe) {

                localStorage.setItem("rememberEmail", email);

            } else {

                localStorage.removeItem("rememberEmail");

            }

            showToast(
                `🎉 Welcome ${data.user.name}! Login Successful.`,
                "success"
            );

            setTimeout(() => {

                window.location.href = "index.html";

            }, 2000);

        } catch (err) {

            showToast(err.message, "error");

        } finally {

            loginBtn.disabled = false;

            loginBtn.innerHTML = "Login";

        }

    });

}

function showToast(message, type = "success") {

    const toastElement = document.getElementById("liveToast");
    const toastMessage = document.getElementById("toastMessage");

    toastMessage.innerHTML = message;

    toastElement.classList.remove(
        "text-bg-success",
        "text-bg-danger"
    );

    toastElement.classList.add(
        type === "success"
            ? "text-bg-success"
            : "text-bg-danger"
    );

    bootstrap.Toast.getOrCreateInstance(toastElement).show();
}

window.addEventListener("DOMContentLoaded", () => {

    const emailInput = document.getElementById("email");
    const rememberCheckbox = document.getElementById("rememberMe");

    const rememberedEmail = localStorage.getItem("rememberEmail");

    if (emailInput && rememberCheckbox && rememberedEmail) {

        emailInput.value = rememberedEmail;
        rememberCheckbox.checked = true;

    }

});