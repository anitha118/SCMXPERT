document.addEventListener("DOMContentLoaded", function () {
    // Select elements
    const toggleButton = document.querySelector(".sidebar-toggler");
    const sidebar = document.querySelector(".sidebar");
    const mainContent = document.querySelector(".unauthorized-container");
    const navLabels = document.querySelectorAll(".nav-label");

    // Function to toggle sidebar
    function toggleSidebar() {
        sidebar.classList.toggle("collapsed");
        const isCollapsed = sidebar.classList.contains("collapsed");

        sidebar.style.width = isCollapsed ? "80px" : "250px";
        mainContent.style.marginLeft = isCollapsed ? "90px" : "260px";

        // Hide or show text labels
        navLabels.forEach(label => {
            label.style.display = isCollapsed ? "none" : "inline-block";
        });

        // Store sidebar state in localStorage
        localStorage.setItem("sidebarCollapsed", isCollapsed);
    }

    // Load sidebar state from localStorage
    function loadSidebarState() {
        const isCollapsed = localStorage.getItem("sidebarCollapsed") === "true";
        if (isCollapsed) {
            sidebar.classList.add("collapsed");
            sidebar.style.width = "80px";
            mainContent.style.marginLeft = "90px";
            navLabels.forEach(label => label.style.display = "none");
        }
    }

    // Event Listener for Sidebar Toggle Button
    if (toggleButton) {
        toggleButton.addEventListener("click", toggleSidebar);
    }

    // Initialize
    loadSidebarState();
});
