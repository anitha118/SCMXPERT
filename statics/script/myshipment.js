document.addEventListener("DOMContentLoaded", function () {
    const toggleButton = document.querySelector(".sidebar-toggler");
    const sidebar = document.querySelector(".sidebar");
    const mainContent = document.querySelector(".main-content");
    const navLabels = document.querySelectorAll(".nav-label");
    const navLinks = document.querySelectorAll(".nav-link");

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
document.addEventListener("DOMContentLoaded", function() {
    let shipmentLink = document.querySelector('a[href="/myshipment"]');
    if (shipmentLink) {
        shipmentLink.classList.add("active"); // Highlight only the Shipment link
    }
});

