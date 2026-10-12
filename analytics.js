(function () {
  "use strict";

  const errorMessage = document.querySelector("#analytics-error");
  const palette = ["#6f9280", "#8eb3b1", "#d3a68f", "#d9bd77"];

  function showError(message) {
    errorMessage.hidden = false;
    errorMessage.textContent = message;
  }

  function getLastSixMonths() {
    const months = [];
    const current = new Date();
    for (let offset = 5; offset >= 0; offset -= 1) {
      const date = new Date(current.getFullYear(), current.getMonth() - offset, 1);
      months.push({
        label: new Intl.DateTimeFormat(undefined, { month: "short" }).format(date),
        key: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
      });
    }
    return months;
  }

  function createChart(context, config) {
    return new window.Chart(context, config);
  }

  function renderAnalytics(appointments) {
    const today = window.BloomMedical.today();
    const upcoming = appointments.filter((appointment) => appointment.date >= today && appointment.status !== "Cancelled").length;
    const completed = appointments.filter((appointment) => appointment.status === "Completed").length;
    const departments = ["Primary Care", "Preventive Care", "Women's Health", "Wellness"];
    const statuses = ["Scheduled", "Checked in", "Completed", "Cancelled"];

    document.querySelector("#analytics-total").textContent = String(appointments.length);
    document.querySelector("#analytics-upcoming").textContent = String(upcoming);
    document.querySelector("#analytics-completed").textContent = String(completed);
    document.querySelector("#analytics-departments").textContent = String(new Set(appointments.map((appointment) => appointment.department)).size);

    const monthSeries = getLastSixMonths();
    const monthlyCounts = monthSeries.map(({ key }) =>
      appointments.filter((appointment) => appointment.date.slice(0, 7) === key).length
    );
    const departmentCounts = departments.map((department) =>
      appointments.filter((appointment) => appointment.department === department).length
    );
    const statusCounts = statuses.map((status) =>
      appointments.filter((appointment) => appointment.status === status).length
    );
    const chartDefaults = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { labels: { color: "#53665f", usePointStyle: true, boxWidth: 8, padding: 18, font: { family: "DM Sans", size: 11 } } },
        tooltip: { backgroundColor: "#263d35", padding: 11, titleFont: { family: "DM Sans" }, bodyFont: { family: "DM Sans" } }
      }
    };

    createChart(document.querySelector("#trend-chart"), {
      type: "line",
      data: { labels: monthSeries.map((month) => month.label), datasets: [{ label: "Appointments", data: monthlyCounts, borderColor: "#648a78", backgroundColor: "rgba(100,138,120,.12)", pointBackgroundColor: "#648a78", pointBorderColor: "#fff", pointBorderWidth: 3, pointRadius: 5, pointHoverRadius: 7, borderWidth: 2, fill: true, tension: .35 }] },
      options: { ...chartDefaults, plugins: { ...chartDefaults.plugins, legend: { display: false } }, scales: { x: { grid: { display: false }, border: { display: false }, ticks: { color: "#82918a", font: { family: "DM Sans", size: 11 } } }, y: { beginAtZero: true, ticks: { precision: 0, color: "#82918a", stepSize: 1, font: { family: "DM Sans", size: 11 } }, grid: { color: "#e9ede7" }, border: { display: false } } } }
    });
    createChart(document.querySelector("#department-chart"), {
      type: "doughnut",
      data: { labels: departments, datasets: [{ data: departmentCounts, backgroundColor: palette, borderColor: "#fffefa", borderWidth: 4, hoverOffset: 7 }] },
      options: { ...chartDefaults, cutout: "69%", plugins: { ...chartDefaults.plugins, legend: { position: "bottom", labels: chartDefaults.plugins.legend.labels } } }
    });
    createChart(document.querySelector("#status-chart"), {
      type: "bar",
      data: { labels: statuses, datasets: [{ label: "Appointments", data: statusCounts, backgroundColor: palette, borderRadius: 7, borderSkipped: false, maxBarThickness: 48 }] },
      options: { ...chartDefaults, plugins: { ...chartDefaults.plugins, legend: { display: false } }, scales: { x: { grid: { display: false }, border: { display: false }, ticks: { color: "#82918a", font: { family: "DM Sans", size: 10 }, maxRotation: 0 } }, y: { beginAtZero: true, ticks: { precision: 0, stepSize: 1, color: "#82918a", font: { family: "DM Sans", size: 11 } }, grid: { color: "#e9ede7" }, border: { display: false } } } }
    });

    const total = monthlyCounts.reduce((sum, count) => sum + count, 0);
    const busiestMonthIndex = monthlyCounts.indexOf(Math.max(...monthlyCounts));
    const trendInsight = document.querySelector("#trend-insight");
    trendInsight.textContent = total
      ? `${monthSeries[busiestMonthIndex].label} has the most demo appointments in this six-month view (${monthlyCounts[busiestMonthIndex]}).`
      : "No appointments fall within the last six months yet. Add a fictional record to see activity here.";
  }

  if (typeof window.Chart !== "function") {
    showError("Charts could not load from the Chart.js CDN. Check your internet connection, then reload this page.");
    return;
  }

  try {
    renderAnalytics(window.BloomMedical.readAppointments());
  } catch (error) {
    showError(`Analytics could not read the browser's demo records. ${error.message}`);
  }
})();
