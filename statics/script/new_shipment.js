let existingShipmentNumbers = [];

document.addEventListener("DOMContentLoaded", async function () {
    const toggleButton = document.querySelector(".sidebar-toggler");
    const sidebar = document.querySelector(".sidebar");
    const mainContent = document.querySelector(".main-content");
    const navLabels = document.querySelectorAll(".nav-label");

    if (toggleButton) {
        toggleButton.addEventListener("click", () => {
            sidebar.classList.toggle("collapsed");
            const isCollapsed = sidebar.classList.contains("collapsed");
            sidebar.style.width = isCollapsed ? "80px" : "250px";
            mainContent.style.marginLeft = isCollapsed ? "90px" : "260px";
            navLabels.forEach(label => {
                label.style.display = isCollapsed ? "none" : "inline-block";
            });
            localStorage.setItem("sidebarCollapsed", isCollapsed);
        });
    }

    const savedCollapse = localStorage.getItem("sidebarCollapsed") === "true";
    if (savedCollapse) {
        sidebar.classList.add("collapsed");
        sidebar.style.width = "80px";
        mainContent.style.marginLeft = "90px";
        navLabels.forEach(label => label.style.display = "none");
    }

    const dateInput = document.getElementById("delivery-date");
    if (dateInput) {
        const today = new Date().toISOString().split("T")[0];
        dateInput.setAttribute("min", today);
    }

});

document.getElementById("shipment-form").addEventListener("submit", async function (event) {
    event.preventDefault();

    const shipmentNumber = document.getElementById("shipment-number").value.trim();
    const poNumber = document.getElementById("po-number").value.trim();
    const ndcNumber = document.getElementById("ndc-number").value.trim();
    const serialNumber = document.getElementById("serial-number").value.trim();
    const containerNumber = document.getElementById("container-number").value.trim();
    const deliveryNumber = document.getElementById("delivery-number").value.trim();
    const batchId = document.getElementById("batch-id").value.trim();

    const containerPattern = /^[A-Z]{4}\d{7}$/;
    const deliveryPattern = /^[A-Za-z0-9]{6,12}$/;
    const batchIdPattern = /^[A-Z]{3,5}\d{4,6}$/;

    if (!/^\d{7}$/.test(shipmentNumber)) {
        alert("Shipment Number must be exactly 7 digits.");
        return;
    }

    if (!/^\d{10}$/.test(poNumber)) {
        alert("PO Number must be exactly 10 digits.");
        return;
    }

    if (!/^\d+$/.test(ndcNumber)) {
        alert("NDC Number must contain only digits.");
        return;
    }

    if (!/^\d+$/.test(serialNumber)) {
        alert("Serial Number must contain only digits.");
        return;
    }

    if (!containerPattern.test(containerNumber)) {
        alert("Container Number must be 4 uppercase letters + 7 digits.");
        return;
    }

    if (!deliveryPattern.test(deliveryNumber)) {
        alert("Delivery Number must be alphanumeric, 6–12 characters.");
        return;
    }

    if (!batchIdPattern.test(batchId)) {
        alert("Batch ID must be 3–5 uppercase letters + 4–6 digits.");
        return;
    }

    const formData = new FormData(this);
    try {
        const res = await fetch("/new_shipment", {
            method: "POST",
            body: formData
        });

        if (res.ok) {
            alert("Shipment created successfully!");
            window.location.href = "/myshipment";
        } else {
            const errorData = await res.json();
            alert("Server Error: " + (errorData.detail || "Unknown error"));
        }
    } catch (error) {
        console.error("Submission failed:", error);
        alert("Something went wrong. Please try again.");
    }
});

document.getElementById("device-data").addEventListener("click", () => {
    alert("Fetching Device Data...");
});
