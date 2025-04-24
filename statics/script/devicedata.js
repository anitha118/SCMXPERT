document.addEventListener("DOMContentLoaded", function () {
    const toggleButton = document.querySelector(".sidebar-toggler");
    const sidebar = document.querySelector(".sidebar");
    const mainContent = document.querySelector(".main-content");
    const navLabels = document.querySelectorAll(".nav-label");
    const deviceDataLink = document.querySelector('a[href="/devicedata"]');

    // Toggle Sidebar
    function toggleSidebar() {
        sidebar.classList.toggle("collapsed");
        const isCollapsed = sidebar.classList.contains("collapsed");

        sidebar.style.width = isCollapsed ? "80px" : "250px";
        if (mainContent) {
            mainContent.style.marginLeft = isCollapsed ? "90px" : "260px";
        }

        navLabels.forEach(label => {
            label.style.display = isCollapsed ? "none" : "inline-block";
        });

        localStorage.setItem("sidebarCollapsed", isCollapsed);
    }

    // Load Sidebar State
    function loadSidebarState() {
        const isCollapsed = localStorage.getItem("sidebarCollapsed") === "true";
        if (isCollapsed) {
            sidebar.classList.add("collapsed");
            sidebar.style.width = "80px";
            if (mainContent) {
                mainContent.style.marginLeft = "90px";
            }
            navLabels.forEach(label => label.style.display = "none");
        }
    }

    // Highlight Active Menu Item
    function highlightActiveMenu() {
        const currentPath = window.location.pathname;
        if (deviceDataLink && currentPath.includes("devicedata")) {
            deviceDataLink.classList.add("active");
        }
    }

    // Initialize
    loadSidebarState();
    highlightActiveMenu();
    if (toggleButton) {
        toggleButton.addEventListener("click", toggleSidebar);
    }
});