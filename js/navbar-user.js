function renderUserMenu() {

    const userMenu = document.getElementById("userMenu");

    if (!userMenu) return;

    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    if (!token || !user) {

        userMenu.innerHTML = `
            <a href="register.html" class="login-button me-2">
                Register
            </a>

            <a href="login.html" class="login-button">
                Login
            </a>
        `;

        return;
    }

    userMenu.innerHTML = `
<div class="dropdown">

    <button
        class="btn login-button dropdown-toggle"
        data-bs-toggle="dropdown">

        <i class="fa-solid fa-user"></i>
        ${user.name}

    </button>

    <ul class="dropdown-menu dropdown-menu-end shadow">

        <li>
            <a class="dropdown-item" href="profile.html">
                <i class="fa-solid fa-user me-2"></i>
                My Profile
            </a>
        </li>

        <li>
            <a class="dropdown-item" href="orders.html">
                <i class="fa-solid fa-box me-2"></i>
                My Orders
            </a>
        </li>

        <li>
            <a class="dropdown-item" href="wishlist.html">
                <i class="fa-regular fa-heart me-2"></i>
                Wishlist
            </a>
        </li>

        <li>
            <a class="dropdown-item" href="address.html">
                <i class="fa-solid fa-location-dot me-2"></i>
                My Addresses
            </a>

        </li>

        <li>

            <a class="dropdown-item" href="support.html">
                <i class="fa-solid fa-headset me-2"></i>
                Help & Support
            </a>

        </li>

        <li>
            <a class="dropdown-item" href="terms-conditions.html">
                <i class="fa-solid fa-file-contract me-2"></i>
                Terms & Conditions
            </a>
        </li>

        <li>
            <a class="dropdown-item" href="privacy-policy.html">
                <i class="fa-solid fa-shield-halved me-2"></i>
                Privacy Policy
            </a>
        </li>

        <li><hr class="dropdown-divider"></li>

        <li>
            <button id="logoutBtn"
                class="dropdown-item text-danger">

                <i class="fa-solid fa-right-from-bracket me-2"></i>
                Logout

            </button>
        </li>

    </ul>   

</div>
`;

    document.getElementById("logoutBtn").addEventListener("click", () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        window.location.href = "index.html";

    });

}