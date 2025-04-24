document.addEventListener("DOMContentLoaded", function () {
    const sidebarLinks = document.querySelectorAll(".nav-link");
    const signOutBtn = document.querySelector(".signout-btn");

    // Highlight active page
    function highlightActiveLink() {
        const currentPage = window.location.pathname.split("/").pop();
        sidebarLinks.forEach(link => {
            if (link.getAttribute("href") === currentPage) {
                link.classList.add("active");
            } else {
                link.classList.remove("active");
            }
        });
    }
 
