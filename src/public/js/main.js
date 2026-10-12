/* global Chart, coreui */

/**
 * --------------------------------------------------------------------------
 * CoreUI Boostrap Admin Template main.js
 * Licensed under MIT (https://github.com/coreui/coreui-free-bootstrap-admin-template/blob/main/LICENSE)
 * --------------------------------------------------------------------------
 */

/**
 * Dashboard Charts
 *
 * This module initializes and manages all charts on the main Dashboard page (index.html).
 * It includes:
 * - Card charts (small charts in statistic cards)
 * - Main chart (large chart showing traffic/metrics over time)
 * - Custom tooltip configuration using CoreUI's ChartJS utilities
 * - Theme-aware chart updates (responds to dark/light mode changes)
 *
 * All charts use Chart.js with CoreUI's custom styling and color variables.
 */

// Configure Chart.js defaults for custom tooltips
Chart.defaults.pointHitDetectionRadius = 1;
Chart.defaults.plugins.tooltip.enabled = false;
Chart.defaults.plugins.tooltip.mode = 'index';
Chart.defaults.plugins.tooltip.position = 'nearest';
Chart.defaults.plugins.tooltip.external = coreui.ChartJS.customTooltips;
Chart.defaults.defaultFontColor = coreui.Utils.getStyle('--cui-body-color');
document.documentElement.addEventListener('ColorSchemeChange', () => {
  cardChart1.data.datasets[0].pointBackgroundColor = coreui.Utils.getStyle('--cui-primary');
  cardChart2.data.datasets[0].pointBackgroundColor = coreui.Utils.getStyle('--cui-info');
  mainChart.options.scales.x.grid.color = coreui.Utils.getStyle('--cui-border-color-translucent');
  mainChart.options.scales.x.ticks.color = coreui.Utils.getStyle('--cui-body-color');
  mainChart.options.scales.y.border.color = coreui.Utils.getStyle('--cui-border-color-translucent');
  mainChart.options.scales.y.grid.color = coreui.Utils.getStyle('--cui-border-color-translucent');
  mainChart.options.scales.y.ticks.color = coreui.Utils.getStyle('--cui-body-color');
  cardChart1.update();
  cardChart2.update();
  mainChart.update();
});

/**
 * Generates a random integer between min and max (inclusive)
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Random integer between min and max
 */
const random = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
const cardChart1 = new Chart(document.getElementById('card-chart1'), {
  type: 'line',
  data: {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [{
      label: 'My First dataset',
      backgroundColor: 'transparent',
      borderColor: 'rgba(255,255,255,.55)',
      pointBackgroundColor: coreui.Utils.getStyle('--cui-primary'),
      data: [65, 59, 84, 84, 51, 55, 40]
    }]
  },
  options: {
    plugins: {
      legend: {
        display: false
      }
    },
    maintainAspectRatio: false,
    scales: {
      x: {
        border: {
          display: false
        },
        grid: {
          display: false,
          drawBorder: false
        },
        ticks: {
          display: false
        }
      },
      y: {
        min: 30,
        max: 89,
        display: false,
        grid: {
          display: false
        },
        ticks: {
          display: false
        }
      }
    },
    elements: {
      line: {
        borderWidth: 1,
        tension: 0.4
      },
      point: {
        radius: 4,
        hitRadius: 10,
        hoverRadius: 4
      }
    }
  }
});



    function toggleFolder(event, folderName) {

        event.stopPropagation();

        const rows = document.querySelectorAll("." + folderName);

        const button = event.currentTarget;

        const icon = button.querySelector("i");

        const isOpen = icon.classList.contains("bi-chevron-down");

        document.querySelectorAll('.work').forEach(el => el.style.display = 'none');




        rows.forEach(row => {

            if (isOpen) {

                row.classList.remove("show");

                row.style.display = "none";

            } else {

                row.classList.add("show");

                row.style.display = "table-row";

            }

        });

        icon.classList.toggle("bi-chevron-right", isOpen);

        icon.classList.toggle("bi-chevron-down", !isOpen);

    }

    function downloadFile(fileName) {

        alert("Download requested: " + fileName);

    }

    function addFolder() {

        const name = prompt("Enter folder name:");

        if (name) {

            alert("Folder created: " + name);

        }

    }

    function addFile() {

        const name = prompt("Enter file name:");

        if (name) {

            alert("File created: " + name);

        }

    }



  (function () {
    var dropZone = document.getElementById('fileDropZone');
    var input = document.getElementById('documentInput');
    var preview = document.getElementById('filePreview');
    var thumb = document.getElementById('filePreviewThumb');
    var nameEl = document.getElementById('filePreviewName');
    var metaEl = document.getElementById('filePreviewMeta');
    var removeBtn = document.getElementById('filePreviewRemove');

    if (!dropZone || !input) return;

    var currentObjectUrl = null;

    var ICONS = {
      pdf: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>',
      doc: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="8" y1="13" x2="16" y2="13"></line><line x1="8" y1="17" x2="16" y2="17"></line></svg>',
      xls: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><path d="M9 13l6 6M15 13l-6 6"></path></svg>',
      generic: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>'
    };

    function formatSize(bytes) {
      if (bytes < 1024) return bytes + ' B';
      if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
      return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    }

    function iconFor(extension) {
      if (extension === 'pdf') return ICONS.pdf;
      if (extension === 'doc' || extension === 'docx') return ICONS.doc;
      if (extension === 'xls' || extension === 'xlsx') return ICONS.xls;
      return ICONS.generic;
    }

    function clearThumb() {
      if (currentObjectUrl) {
        URL.revokeObjectURL(currentObjectUrl);
        currentObjectUrl = null;
      }
      thumb.innerHTML = '';
    }

    function renderPreview(file) {
      var extension = file.name.split('.').pop().toLowerCase();
      clearThumb();

      if (file.type.indexOf('image/') === 0) {
        currentObjectUrl = URL.createObjectURL(file);
        var img = document.createElement('img');
        img.src = currentObjectUrl;
        img.alt = file.name;
        thumb.appendChild(img);
      } else if (extension === 'pdf') {
        currentObjectUrl = URL.createObjectURL(file);
        var embed = document.createElement('embed');
        embed.src = currentObjectUrl + '#toolbar=0&view=FitH';
        embed.type = 'application/pdf';
        thumb.appendChild(embed);
        embed.onerror = function () {
          thumb.innerHTML = iconFor(extension);
        };
      } else {
        thumb.innerHTML = iconFor(extension);
      }

      nameEl.textContent = file.name;
      metaEl.textContent = formatSize(file.size) + ' \u00B7 ' + extension.toUpperCase();
      dropZone.classList.add('has-preview');
    }

    function resetPreview() {
      clearThumb();
      nameEl.textContent = '';
      metaEl.textContent = '';
      dropZone.classList.remove('has-preview');
    }

    input.addEventListener('change', function () {
      if (input.files && input.files.length) {
        renderPreview(input.files[0]);
      } else {
        resetPreview();
      }
    });

    removeBtn.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      input.value = '';
      resetPreview();
    });

    ['dragenter', 'dragover'].forEach(function (evt) {
      dropZone.addEventListener(evt, function (e) {
        e.preventDefault();
        dropZone.style.borderColor = '#6366f1';
      });
    });

    ['dragleave', 'drop'].forEach(function (evt) {
      dropZone.addEventListener(evt, function (e) {
        e.preventDefault();
        dropZone.style.borderColor = '';
      });
    });

    dropZone.addEventListener('drop', function (e) {
      if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length) {
        input.files = e.dataTransfer.files;
        renderPreview(e.dataTransfer.files[0]);
      }
    });
  })();
