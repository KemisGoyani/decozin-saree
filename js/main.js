window.addEventListener("scroll", function () {

    const navbar = document.querySelector(".custom-navbar");

    if (window.scrollY > 50) {

        navbar.style.padding = "10px 0";

    }

    else {

        navbar.style.padding = "18px 0";

    }

});

function startAnnouncement() {

    const items = document.querySelectorAll(".announcement-item");

    let index = 0;

    setInterval(() => {

        items[index].classList.remove("active");

        index++;

        if (index >= items.length) {

            index = 0;

        }

        items[index].classList.add("active");

    }, 3000);

}