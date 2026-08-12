document.addEventListener("DOMContentLoaded", () => {

    setTimeout(() => {

        const currentPage = window.location.pathname.split("/").pop();

        const navLinks = document.querySelectorAll(".nav-link");

        navLinks.forEach(link => {

            const href = link.getAttribute("href");

            if (href === currentPage) {
                link.classList.add("active");
            } else {
                link.classList.remove("active");
            }

        });

    }, 100);

});