(function () {
  "use strict";

  const form = document.querySelector("#appointment-form");
  const rows = document.querySelector("#appointment-rows");
  const searchInput = document.querySelector("#appointment-search");
  const statusFilter = document.querySelector("#status-filter");
  const feedback = document.querySelector("#form-feedback");
  const emptyState = document.querySelector("#empty-state");
  const storageError = document.querySelector("#storage-error");
  const submitButton = document.querySelector("#submit-appointment");
  const cancelEditButton = document.querySelector("#cancel-edit");
  const formTitle = document.querySelector("#form-title");
  const dateInput = document.querySelector("#appointment-date");
  let appointments = [];

  dateInput.min = window.BloomMedical.today();

  function showStorageError(error) {
    storageError.hidden = false;
    storageError.textContent = `Demo storage is unavailable. ${error.message}`;
    rows.replaceChildren();
    emptyState.hidden = true;
  }

  function formatDate(date) {
    const [year, month, day] = date.split("-").map(Number);
    return new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric", year: "numeric" }).format(new Date(year, month - 1, day));
  }

  function formatTime(time) {
    const [hour, minute] = time.split(":").map(Number);
    return new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit" }).format(new Date(2000, 0, 1, hour, minute));
  }

  function addCell(row, content, className) {
    const cell = document.createElement("td");
    if (className) cell.className = className;
    cell.textContent = content;
    row.append(cell);
    return cell;
  }

  // Rebuild the visible table from the current search and status filter.
  function renderAppointments() {
    const query = searchInput.value.trim().toLocaleLowerCase();
    const selectedStatus = statusFilter.value;
    const filtered = appointments.filter((appointment) => {
      const matchesQuery = `${appointment.patientName} ${appointment.department}`.toLocaleLowerCase().includes(query);
      return matchesQuery && (!selectedStatus || appointment.status === selectedStatus);
    });
    rows.replaceChildren();

    filtered.forEach((appointment) => {
      const row = document.createElement("tr");
      const patientCell = addCell(row, appointment.patientName, "patient-cell");
      const initials = appointment.patientName.split(/\s+/).map((part) => part[0]).slice(0, 2).join("").toUpperCase();
      const patientName = patientCell.textContent;
      patientCell.textContent = "";
      const avatar = document.createElement("span");
      avatar.className = "patient-avatar";
      avatar.setAttribute("aria-hidden", "true");
      avatar.textContent = initials;
      const name = document.createElement("span");
      name.textContent = patientName;
      patientCell.append(avatar, name);

      const dateCell = addCell(row, "", "date-cell");
      const date = document.createElement("span");
      date.textContent = formatDate(appointment.date);
      const time = document.createElement("small");
      time.textContent = formatTime(appointment.time);
      dateCell.append(date, time);
      addCell(row, appointment.department);
      addCell(row, appointment.visitType);
      const statusCell = addCell(row, appointment.status);
      statusCell.className = `status-cell status-${appointment.status.toLowerCase().replace(/\s+/g, "-")}`;

      const actionsCell = document.createElement("td");
      actionsCell.className = "actions-cell";
      const editButton = document.createElement("button");
      editButton.type = "button";
      editButton.className = "row-action";
      editButton.textContent = "Edit";
      editButton.setAttribute("aria-label", `Edit ${appointment.patientName}'s appointment`);
      editButton.addEventListener("click", () => startEditing(appointment.id));
      const deleteButton = document.createElement("button");
      deleteButton.type = "button";
      deleteButton.className = "row-action row-delete";
      deleteButton.textContent = "Delete";
      deleteButton.setAttribute("aria-label", `Delete ${appointment.patientName}'s appointment`);
      deleteButton.addEventListener("click", () => deleteAppointment(appointment.id));
      actionsCell.append(editButton, deleteButton);
      row.append(actionsCell);
      rows.append(row);
    });

    emptyState.hidden = filtered.length > 0;
    document.querySelector("#result-count").textContent = `Showing ${filtered.length} of ${appointments.length} appointments`;
    document.querySelector("#metric-total").textContent = String(appointments.length);
    document.querySelector("#metric-upcoming").textContent = String(appointments.filter((appointment) => appointment.date >= new Date().toISOString().slice(0, 10) && appointment.status !== "Cancelled").length);
    document.querySelector("#metric-departments").textContent = String(new Set(appointments.map((appointment) => appointment.department)).size);
  }

  function clearEditState() {
    form.reset();
    document.querySelector("#appointment-id").value = "";
    dateInput.min = window.BloomMedical.today();
    document.querySelector("#status").value = "Scheduled";
    formTitle.textContent = "Add an appointment";
    submitButton.innerHTML = 'Add appointment <span aria-hidden="true">+</span>';
    cancelEditButton.hidden = true;
    feedback.textContent = "";
  }

  function startEditing(id) {
    const appointment = appointments.find((item) => item.id === id);
    if (!appointment) return;
    document.querySelector("#appointment-id").value = appointment.id;
    document.querySelector("#patient-name").value = appointment.patientName;
    dateInput.value = appointment.date;
    dateInput.min = appointment.date;
    document.querySelector("#appointment-time").value = appointment.time;
    document.querySelector("#department").value = appointment.department;
    document.querySelector("#visit-type").value = appointment.visitType;
    document.querySelector("#status").value = appointment.status;
    formTitle.textContent = "Edit appointment";
    submitButton.innerHTML = 'Save changes <span aria-hidden="true">✓</span>';
    cancelEditButton.hidden = false;
    feedback.textContent = `Editing the fictional appointment for ${appointment.patientName}.`;
    form.scrollIntoView({ behavior: "smooth", block: "start" });
    document.querySelector("#patient-name").focus({ preventScroll: true });
  }

  // Validate and save either a new record or edits to the selected record.
  function saveAppointment(event) {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const patientName = document.querySelector("#patient-name").value.trim();
    if (!/^[\p{L}][\p{L} .'-]*$/u.test(patientName)) {
      feedback.textContent = "Enter a fictional name using letters, spaces, apostrophes, periods, or hyphens.";
      document.querySelector("#patient-name").focus();
      return;
    }

    const id = document.querySelector("#appointment-id").value;
    if (!dateInput.value || (!id && dateInput.value < window.BloomMedical.today())) {
      feedback.textContent = "Choose today or a future date for a new appointment.";
      dateInput.focus();
      return;
    }

    const appointment = {
      id: id || `demo-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      patientName,
      date: dateInput.value,
      time: document.querySelector("#appointment-time").value,
      department: document.querySelector("#department").value,
      visitType: document.querySelector("#visit-type").value,
      status: document.querySelector("#status").value
    };

    if (id) {
      appointments = appointments.map((item) => item.id === id ? appointment : item);
    } else {
      appointments = [appointment, ...appointments];
    }

    try {
      window.BloomMedical.writeAppointments(appointments);
      storageError.hidden = true;
      clearEditState();
      renderAppointments();
      feedback.textContent = id ? "Appointment changes saved." : "Fictional appointment added.";
    } catch (error) {
      showStorageError(error);
    }
  }

  function deleteAppointment(id) {
    const appointment = appointments.find((item) => item.id === id);
    if (!appointment || !window.confirm(`Delete the fictional appointment for ${appointment.patientName}?`)) return;
    const updated = appointments.filter((item) => item.id !== id);
    try {
      window.BloomMedical.writeAppointments(updated);
      appointments = updated;
      storageError.hidden = true;
      renderAppointments();
    } catch (error) {
      showStorageError(error);
    }
  }

  form.addEventListener("submit", saveAppointment);
  cancelEditButton.addEventListener("click", clearEditState);
  searchInput.addEventListener("input", renderAppointments);
  statusFilter.addEventListener("change", renderAppointments);
  document.querySelector("#reset-demo").addEventListener("click", () => {
    if (!window.confirm("Reset all demo appointments to the original fictional sample data?")) return;
    try {
      appointments = window.BloomMedical.resetAppointments();
      storageError.hidden = true;
      clearEditState();
      searchInput.value = "";
      statusFilter.value = "";
      renderAppointments();
    } catch (error) {
      showStorageError(error);
    }
  });

  try {
    appointments = window.BloomMedical.readAppointments();
    renderAppointments();
  } catch (error) {
    showStorageError(error);
  }
})();
