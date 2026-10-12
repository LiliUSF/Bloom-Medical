/* Shared navigation and fictional demo data for the Bloom Medical pages. */
(function () {
  "use strict";

  const STORAGE_KEY = "bloom-medical-demo-appointments";
  const SEED_APPOINTMENTS = [
    { id: "demo-001", patientName: "Jordan Lee", date: "2026-06-12", time: "09:00", department: "Primary Care", visitType: "In person", status: "Completed" },
    { id: "demo-002", patientName: "Casey Morgan", date: "2026-07-14", time: "10:30", department: "Women's Health", visitType: "Follow-up", status: "Completed" },
    { id: "demo-003", patientName: "Avery Brooks", date: "2026-08-02", time: "13:00", department: "Wellness", visitType: "Telehealth", status: "Completed" },
    { id: "demo-004", patientName: "Taylor Rivera", date: "2026-09-18", time: "11:15", department: "Preventive Care", visitType: "In person", status: "Completed" },
    { id: "demo-005", patientName: "Riley Chen", date: "2026-10-14", time: "08:45", department: "Primary Care", visitType: "In person", status: "Scheduled" },
    { id: "demo-006", patientName: "Quinn Patel", date: "2026-10-20", time: "14:00", department: "Women's Health", visitType: "Follow-up", status: "Checked in" },
    { id: "demo-007", patientName: "Jamie Ellis", date: "2026-11-03", time: "09:30", department: "Wellness", visitType: "Telehealth", status: "Scheduled" },
    { id: "demo-008", patientName: "Alex Parker", date: "2026-11-18", time: "15:00", department: "Preventive Care", visitType: "In person", status: "Cancelled" }
  ];
  const DEPARTMENTS = ["Primary Care", "Preventive Care", "Women's Health", "Wellness"];
  const STATUSES = ["Scheduled", "Checked in", "Completed", "Cancelled"];

  function today() {
    const date = new Date();
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  }

  // Load saved examples or initialize this browser with the clearly fictional seed set.
  function readAppointments() {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === null) {
      writeAppointments(SEED_APPOINTMENTS);
      return SEED_APPOINTMENTS.map((appointment) => ({ ...appointment }));
    }

    const appointments = JSON.parse(saved);
    if (!Array.isArray(appointments) || appointments.some((appointment) =>
      !appointment || typeof appointment.id !== "string" ||
      typeof appointment.patientName !== "string" ||
      typeof appointment.date !== "string" ||
      typeof appointment.time !== "string" ||
      !DEPARTMENTS.includes(appointment.department) ||
      typeof appointment.visitType !== "string" ||
      !STATUSES.includes(appointment.status)
    )) {
      throw new Error("Saved demo data is not in the expected format. Reset the demo data to continue.");
    }
    return appointments;
  }

  function writeAppointments(appointments) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(appointments));
  }

  function resetAppointments() {
    const freshExamples = SEED_APPOINTMENTS.map((appointment) => ({ ...appointment }));
    writeAppointments(freshExamples);
    return freshExamples;
  }

  window.BloomMedical = {
    readAppointments,
    writeAppointments,
    resetAppointments,
    today,
    storageKey: STORAGE_KEY
  };

  document.querySelectorAll("[data-current-year]").forEach((element) => {
    element.textContent = String(new Date().getFullYear());
  });

  const menuButton = document.querySelector(".menu-toggle");
  const navigation = document.querySelector(".nav-links");
  if (menuButton && navigation) {
    menuButton.addEventListener("click", () => {
      const isExpanded = menuButton.getAttribute("aria-expanded") === "true";
      menuButton.setAttribute("aria-expanded", String(!isExpanded));
      menuButton.setAttribute("aria-label", isExpanded ? "Open navigation" : "Close navigation");
      navigation.classList.toggle("is-open", !isExpanded);
    });
  }
})();
