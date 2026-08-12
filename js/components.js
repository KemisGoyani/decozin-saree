async function loadComponent(id, file) {

    const element = document.getElementById(id);

    // Skip if the container doesn't exist on this page
    if (!element) return;

    try {

        const response = await fetch(file);

        if (!response.ok) {
            throw new Error(`Cannot load ${file}`);
        }

        const html = await response.text();

        element.innerHTML = html;

    } catch (error) {

        console.error(error);

    }

}

window.addEventListener("DOMContentLoaded", async () => {

    // Common Components
    await loadComponent("topbar", "components/topbar.html");
    await loadComponent("navbar", "components/navbar.html");

     if (typeof renderUserMenu === "function") {
        renderUserMenu();
    }

    // Home Page Components
    await loadComponent("hero", "components/hero.html");
    await loadComponent("featured", "components/featured.html");
    await loadComponent("why", "components/why-choose.html");
    await loadComponent("promo", "components/promo-banner.html");
    await loadComponent("testimonials", "components/testimonials.html");

    // Common Bottom Components
    await loadComponent("newsletter", "components/newsletter.html");
    await loadComponent("footer", "components/footer.html");

    if (typeof startAnnouncement === "function") {
        startAnnouncement();
    }

});