document.addEventListener("DOMContentLoaded", function () {
    const toggleButton = document.querySelector(".sidebar-toggler");
    const sidebar = document.querySelector(".sidebar");
    const mainContent = document.querySelector(".unauthorized-container");
    const navLabels = document.querySelectorAll(".nav-label");

    function toggleSidebar() {
        sidebar.classList.toggle("collapsed");
        const isCollapsed = sidebar.classList.contains("collapsed");

        sidebar.style.width = isCollapsed ? "80px" : "250px";
        mainContent.style.marginLeft = isCollapsed ? "90px" : "260px";

        navLabels.forEach(label => {
            label.style.display = isCollapsed ? "none" : "inline-block";
        });

        localStorage.setItem("sidebarCollapsed", isCollapsed);
    }

    function loadSidebarState() {
        const isCollapsed = localStorage.getItem("sidebarCollapsed") === "true";
        if (isCollapsed) {
            sidebar.classList.add("collapsed");
            sidebar.style.width = "80px";
            mainContent.style.marginLeft = "90px";
            navLabels.forEach(label => label.style.display = "none");
        }
    }

    if (toggleButton) {
        toggleButton.addEventListener("click", toggleSidebar);
    }

    loadSidebarState();
});
