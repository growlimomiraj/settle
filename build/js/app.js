/* ============================================================
   Settle – Luxury Limo Service  |  Main Application Script
   Vanilla JS · No Dependencies · Production-Ready
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* --------------------------------------------------------
     1. MOBILE NAV TOGGLE
     -------------------------------------------------------- */
  var nav       = document.getElementById('ablNav');
  var navToggle = document.getElementById('ablNavToggle');

  if (navToggle && nav) {
    navToggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', open);
    });
  }

  // Dropdown parents – first tap opens submenu, second follows link
  document.querySelectorAll('.has-dropdown > a').forEach(function (link) {
    link.addEventListener('click', function (e) {
      if (window.innerWidth <= 900) {
        var parent = link.parentElement;
        if (!parent.classList.contains('is-expanded')) {
          e.preventDefault();
          // collapse siblings
          document.querySelectorAll('.has-dropdown.is-expanded').forEach(function (el) {
            if (el !== parent) el.classList.remove('is-expanded');
          });
          parent.classList.add('is-expanded');
        }
        // second click falls through normally
      }
    });
  });

  /* --------------------------------------------------------
     2. TRUST MARQUEE DUPLICATION
     -------------------------------------------------------- */
  document.querySelectorAll('.xmarquee-track').forEach(function (track) {
    var original = track.querySelector('.xmarquee-set');
    if (!original) return;
    for (var i = 0; i < 5; i++) {
      track.appendChild(original.cloneNode(true));
    }
  });

  /* --------------------------------------------------------
     3. SERVICES CAROUSEL
     -------------------------------------------------------- */
  var srvTotal   = 6;
  var srvCurrent = 0;
  var srvCards   = [];
  var srvInterval;

  for (var s = 0; s < srvTotal; s++) {
    var card = document.getElementById('srv-' + s);
    if (card) srvCards.push(card);
  }

  var dotsContainer = document.getElementById('srv-dots-container');

  function buildSrvDots() {
    if (!dotsContainer) return;
    dotsContainer.innerHTML = '';
    for (var d = 0; d < srvCards.length; d++) {
      var dot = document.createElement('button');
      dot.className = 'srv-dot' + (d === 0 ? ' active' : '');
      dot.setAttribute('aria-label', 'Service ' + (d + 1));
      dot.dataset.index = d;
      dot.addEventListener('click', function () {
        goToSrv(parseInt(this.dataset.index, 10));
        resetSrvInterval();
      });
      dotsContainer.appendChild(dot);
    }
  }

  function updateSrvDots() {
    if (!dotsContainer) return;
    dotsContainer.querySelectorAll('.srv-dot').forEach(function (dot, i) {
      dot.classList.toggle('active', i === srvCurrent);
    });
  }

  function goToSrv(index) {
    if (!srvCards.length) return;
    var prev = srvCards[srvCurrent];
    var next = srvCards[index];
    if (prev === next) return;

    prev.style.transition = 'opacity .3s ease';
    prev.style.opacity = '0';

    setTimeout(function () {
      prev.style.display = 'none';
      prev.style.opacity = '';
      prev.style.transition = '';

      next.style.display = 'block';
      next.style.opacity = '0';
      next.style.transition = 'opacity .3s ease';

      // force reflow
      void next.offsetWidth;
      next.style.opacity = '1';

      srvCurrent = index;
      updateSrvDots();

      setTimeout(function () {
        next.style.transition = '';
      }, 300);
    }, 300);
  }

  function nextSrv() {
    if (!srvCards.length) return;
    var next = (srvCurrent + 1) % srvCards.length;
    goToSrv(next);
  }

  function resetSrvInterval() {
    clearInterval(srvInterval);
    srvInterval = setInterval(nextSrv, 5000);
  }

  if (srvCards.length) {
    // Ensure only the first card is visible initially
    srvCards.forEach(function (c, i) {
      c.style.display = i === 0 ? 'block' : 'none';
    });
    buildSrvDots();
    resetSrvInterval();
  }

  /* --------------------------------------------------------
     4. BOOKING WIDGET – TAB SWITCHING
     -------------------------------------------------------- */
  window.setTab = function (btn, mode) {
    document.querySelectorAll('.tab-btn').forEach(function (b) {
      b.classList.remove('active');
    });
    if (btn) btn.classList.add('active');

    var secBooking   = document.getElementById('sec-booking');
    var secMulticity = document.getElementById('sec-multicity');
    var secHourly    = document.getElementById('sec-hourly');
    var secCallus    = document.getElementById('sec-callus');

    var sections = [secBooking, secMulticity, secHourly, secCallus];
    sections.forEach(function (sec) {
      if (sec) sec.style.display = 'none';
    });

    var slot4      = document.getElementById('slot4');
    var slot4Label = slot4 ? slot4.querySelector('.fd-label') : null;
    var slot4Icon  = slot4 ? slot4.querySelector('.fd-icon, .fd i, .fd svg') : null;
    var calReturn  = document.getElementById('cal-return');

    function restoreSlot4() {
      if (slot4Label) slot4Label.textContent = 'Time';
      if (slot4Icon) {
        slot4Icon.className = slot4Icon.className.replace(/fa-calendar[^\s]*/g, 'fa-clock');
      }
      if (calReturn) calReturn.style.display = 'none';
      if (slot4) {
        slot4.setAttribute('data-mode', 'time');
        slot4.onclick = function (e) { openTimePicker(e); };
      }
    }

    switch (mode) {
      case 'oneway':
        if (secBooking) secBooking.style.display = 'flex';
        restoreSlot4();
        break;

      case 'roundtrip':
        if (secBooking) secBooking.style.display = 'flex';
        if (slot4Label) slot4Label.textContent = 'Return';
        if (slot4Icon) {
          slot4Icon.className = slot4Icon.className.replace(/fa-clock[^\s]*/g, 'fa-calendar');
        }
        if (calReturn) calReturn.style.display = '';
        if (slot4) {
          slot4.setAttribute('data-mode', 'date');
          slot4.onclick = function (e) { openCal('cal-return', e); };
        }
        break;

      case 'multicity':
        if (secMulticity) secMulticity.style.display = 'flex';
        break;

      case 'hourly':
        if (secHourly) secHourly.style.display = 'flex';
        break;

      case 'callus':
        if (secCallus) secCallus.style.display = 'flex';
        break;

      default:
        if (secBooking) secBooking.style.display = 'flex';
        restoreSlot4();
    }
  };

  /* --------------------------------------------------------
     5. BOOKING WIDGET – ADDRESS DROPDOWNS
     -------------------------------------------------------- */
  function closeAllDropdowns() {
    document.querySelectorAll('.dropdown, .picker-panel').forEach(function (d) {
      d.style.display = '';
    });
  }

  window.openAddr = function (ddId, inputId, event) {
    if (event) event.stopPropagation();
    closeAllDropdowns();

    var dd    = document.getElementById(ddId);
    var input = document.getElementById(inputId);
    if (!dd) return;

    dd.style.display = 'block';
    if (input) {
      input.value = '';
      input.focus();
    }

    // show all items
    dd.querySelectorAll('.dropdown-item').forEach(function (item) {
      item.classList.remove('hide');
    });
  };

  window.filterAddr = function (input, ddId) {
    var dd = document.getElementById(ddId);
    if (!dd) return;
    var query = (input.value || '').toLowerCase();

    dd.querySelectorAll('.dropdown-item').forEach(function (item) {
      var text = (item.textContent || '').toLowerCase();
      item.classList.toggle('hide', query.length > 0 && text.indexOf(query) === -1);
    });
  };

  window.addrKey = function (event) {
    if (event.key === 'Enter') {
      var dd = event.target.closest('.dropdown');
      if (!dd) {
        // find the sibling dropdown
        var parent = event.target.closest('.fd');
        dd = parent ? parent.querySelector('.dropdown') : null;
      }
      if (dd) {
        var firstVisible = dd.querySelector('.dropdown-item:not(.hide)');
        if (firstVisible) firstVisible.click();
      }
    }
  };

  window.setVal = function (spanId, text) {
    var el = document.getElementById(spanId);
    if (!el) return;

    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
      el.value = text;
    } else {
      el.textContent = text;
    }

    // close parent dropdown
    var fd = el.closest('.fd');
    if (fd) {
      fd.classList.remove('err');
      var dd = fd.querySelector('.dropdown');
      if (dd) dd.style.display = '';
    }

    closeAllDropdowns();
  };

  /* --------------------------------------------------------
     6. BOOKING WIDGET – CALENDAR
     -------------------------------------------------------- */
  var calDate      = new Date();
  var calDate2     = new Date();
  var calDateH     = new Date();
  var selectedDate = null;
  var selectedDate2 = null;
  var selectedDateH = null;

  var dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  var monthNames = [
    'January','February','March','April','May','June',
    'July','August','September','October','November','December'
  ];

  function renderCal(grid, title, viewDate, selDate, onSelect) {
    if (!grid || !title) return;

    var year  = viewDate.getFullYear();
    var month = viewDate.getMonth();
    title.textContent = monthNames[month] + ' ' + year;

    grid.innerHTML = '';

    // Day headers
    dayNames.forEach(function (dn) {
      var hdr = document.createElement('div');
      hdr.className = 'cal-day-header';
      hdr.textContent = dn;
      grid.appendChild(hdr);
    });

    var firstDay   = new Date(year, month, 1).getDay();
    var daysInMonth = new Date(year, month + 1, 0).getDate();
    var today       = new Date();
    today.setHours(0, 0, 0, 0);

    // Blank cells before first day
    for (var b = 0; b < firstDay; b++) {
      var blank = document.createElement('div');
      blank.className = 'cal-day blank';
      grid.appendChild(blank);
    }

    for (var d = 1; d <= daysInMonth; d++) {
      var cell = document.createElement('div');
      cell.className = 'cal-day';
      cell.textContent = d;

      var cellDate = new Date(year, month, d);
      cellDate.setHours(0, 0, 0, 0);

      if (cellDate < today) {
        cell.classList.add('disabled');
        cell.style.opacity = '.3';
        cell.style.pointerEvents = 'none';
      } else {
        cell.dataset.date = cellDate.toISOString();

        if (selDate && cellDate.getTime() === selDate.getTime()) {
          cell.classList.add('selected');
        }

        cell.addEventListener('click', (function (cd) {
          return function () { onSelect(cd); };
        })(cellDate));
      }

      grid.appendChild(cell);
    }
  }

  function formatDate(d) {
    var mShort = monthNames[d.getMonth()].substring(0, 3);
    return mShort + ' ' + d.getDate() + ', ' + d.getFullYear();
  }

  // Main calendar navigation
  window.moveCal = function (dir) {
    calDate.setMonth(calDate.getMonth() + dir);
    var grid  = document.querySelector('#cal-main .cal-grid');
    var title = document.querySelector('#cal-main .cal-title');
    renderCal(grid, title, calDate, selectedDate, function (d) {
      selectedDate = d;
      renderCal(grid, title, calDate, selectedDate, arguments.callee);
    });
  };

  // Return calendar navigation
  window.moveCal2 = function (dir) {
    calDate2.setMonth(calDate2.getMonth() + dir);
    var grid  = document.querySelector('#cal-return .cal-grid');
    var title = document.querySelector('#cal-return .cal-title');
    renderCal(grid, title, calDate2, selectedDate2, function (d) {
      selectedDate2 = d;
      renderCal(grid, title, calDate2, selectedDate2, arguments.callee);
    });
  };

  // Hourly calendar navigation
  window.moveCalH = function (dir) {
    calDateH.setMonth(calDateH.getMonth() + dir);
    var grid  = document.querySelector('#cal-hourly .cal-grid');
    var title = document.querySelector('#cal-hourly .cal-title');
    renderCal(grid, title, calDateH, selectedDateH, function (d) {
      selectedDateH = d;
      renderCal(grid, title, calDateH, selectedDateH, arguments.callee);
    });
  };

  window.openCal = function (panelId, event) {
    if (event) event.stopPropagation();
    closeAllDropdowns();

    var panel = document.getElementById(panelId);
    if (!panel) return;
    panel.style.display = 'block';

    var grid  = panel.querySelector('.cal-grid');
    var title = panel.querySelector('.cal-title');

    if (panelId === 'cal-main') {
      renderCal(grid, title, calDate, selectedDate, function selectMain(d) {
        selectedDate = d;
        renderCal(grid, title, calDate, selectedDate, selectMain);
      });
    } else if (panelId === 'cal-return') {
      renderCal(grid, title, calDate2, selectedDate2, function selectReturn(d) {
        selectedDate2 = d;
        renderCal(grid, title, calDate2, selectedDate2, selectReturn);
      });
    } else if (panelId === 'cal-hourly') {
      renderCal(grid, title, calDateH, selectedDateH, function selectHourly(d) {
        selectedDateH = d;
        renderCal(grid, title, calDateH, selectedDateH, selectHourly);
      });
    }
  };

  window.closePicker = function (panelId) {
    var panel = document.getElementById(panelId);
    if (panel) panel.style.display = '';

    // Update the display span
    if (panelId === 'cal-main' && selectedDate) {
      var span = document.getElementById('date-display') || document.getElementById('pickup-date');
      if (span) {
        if (span.tagName === 'INPUT') span.value = formatDate(selectedDate);
        else span.textContent = formatDate(selectedDate);
      }
      var fd = span ? span.closest('.fd') : null;
      if (fd) fd.classList.remove('err');
    }
    if (panelId === 'cal-return' && selectedDate2) {
      var span2 = document.getElementById('return-date-display') || document.getElementById('return-date');
      if (span2) {
        if (span2.tagName === 'INPUT') span2.value = formatDate(selectedDate2);
        else span2.textContent = formatDate(selectedDate2);
      }
      var fd2 = span2 ? span2.closest('.fd') : null;
      if (fd2) fd2.classList.remove('err');
    }
    if (panelId === 'cal-hourly' && selectedDateH) {
      var spanH = document.getElementById('hourly-date-display') || document.getElementById('hourly-date');
      if (spanH) {
        if (spanH.tagName === 'INPUT') spanH.value = formatDate(selectedDateH);
        else spanH.textContent = formatDate(selectedDateH);
      }
      var fdH = spanH ? spanH.closest('.fd') : null;
      if (fdH) fdH.classList.remove('err');
    }
  };

  /* --------------------------------------------------------
     7. BOOKING WIDGET – TIME PICKER
     -------------------------------------------------------- */
  var tHour = 12, tMin = 0, tAmpm = 'AM';
  var thHour = 12, thMin = 0, thAmpm = 'AM';

  function padZero(n) { return n < 10 ? '0' + n : '' + n; }

  function updateTimeDisplay() {
    var hEl  = document.getElementById('tp-hour');
    var mEl  = document.getElementById('tp-min');
    var apEl = document.getElementById('tp-ampm');
    if (hEl) hEl.textContent = padZero(tHour);
    if (mEl) mEl.textContent = padZero(tMin);
    if (apEl) apEl.textContent = tAmpm;
  }

  function updateHourlyTimeDisplay() {
    var hEl  = document.getElementById('th-hour');
    var mEl  = document.getElementById('th-min');
    var apEl = document.getElementById('th-ampm');
    if (hEl) hEl.textContent = padZero(thHour);
    if (mEl) mEl.textContent = padZero(thMin);
    if (apEl) apEl.textContent = thAmpm;
  }

  window.adjHour = function (dir) {
    tHour += dir;
    if (tHour > 12) tHour = 1;
    if (tHour < 1) tHour = 12;
    updateTimeDisplay();
  };

  window.adjMin = function (dir) {
    tMin += dir * 5;
    if (tMin > 55) tMin = 0;
    if (tMin < 0) tMin = 55;
    updateTimeDisplay();
  };

  window.toggleAMPM = function () {
    tAmpm = tAmpm === 'AM' ? 'PM' : 'AM';
    updateTimeDisplay();
  };

  window.adjHourH = function (dir) {
    thHour += dir;
    if (thHour > 12) thHour = 1;
    if (thHour < 1) thHour = 12;
    updateHourlyTimeDisplay();
  };

  window.adjMinH = function (dir) {
    thMin += dir * 5;
    if (thMin > 55) thMin = 0;
    if (thMin < 0) thMin = 55;
    updateHourlyTimeDisplay();
  };

  window.toggleAMPMH = function () {
    thAmpm = thAmpm === 'AM' ? 'PM' : 'AM';
    updateHourlyTimeDisplay();
  };

  window.openTimePicker = function (event) {
    if (event) event.stopPropagation();
    closeAllDropdowns();

    var panel = document.getElementById('time-panel');
    if (panel) {
      panel.style.display = 'block';
      updateTimeDisplay();
    }
  };

  window.openTimePickerH = function (event) {
    if (event) event.stopPropagation();
    closeAllDropdowns();

    var panel = document.getElementById('time-panel-hourly');
    if (panel) {
      panel.style.display = 'block';
      updateHourlyTimeDisplay();
    }
  };

  window.confirmTime = function () {
    var text = padZero(tHour) + ':' + padZero(tMin) + ' ' + tAmpm;
    var span = document.getElementById('time-display') || document.getElementById('pickup-time');
    if (span) {
      if (span.tagName === 'INPUT') span.value = text;
      else span.textContent = text;
    }
    var fd = span ? span.closest('.fd') : null;
    if (fd) fd.classList.remove('err');

    var panel = document.getElementById('time-panel');
    if (panel) panel.style.display = '';
  };

  window.confirmTimeH = function () {
    var text = padZero(thHour) + ':' + padZero(thMin) + ' ' + thAmpm;
    var span = document.getElementById('hourly-time-display') || document.getElementById('hourly-time');
    if (span) {
      if (span.tagName === 'INPUT') span.value = text;
      else span.textContent = text;
    }
    var fd = span ? span.closest('.fd') : null;
    if (fd) fd.classList.remove('err');

    var panel = document.getElementById('time-panel-hourly');
    if (panel) panel.style.display = '';
  };

  /* --------------------------------------------------------
     8. GENERAL DROPDOWN TOGGLE
     -------------------------------------------------------- */
  window.toggleDropdown = function (ddId, event) {
    if (event) event.stopPropagation();

    var dd = document.getElementById(ddId);
    if (!dd) return;

    var isOpen = dd.style.display === 'block';
    closeAllDropdowns();
    if (!isOpen) dd.style.display = 'block';
  };

  /* --------------------------------------------------------
     9. BOOKING WIDGET – BUTTON ANIMATION / SUBMIT
     -------------------------------------------------------- */
  window.animateBtn = function (btn) {
    // Validate required fields
    var requiredIds = [
      { id: 'pickup-display',   fd: null },
      { id: 'dropoff-display',  fd: null },
      { id: 'date-display',     fd: null },
      { id: 'time-display',     fd: null },
      { id: 'pickup-date',      fd: null },
      { id: 'pickup-time',      fd: null }
    ];

    var hasError = false;

    requiredIds.forEach(function (item) {
      var el = document.getElementById(item.id);
      if (!el) return;

      var fd = el.closest('.fd');
      var value = el.tagName === 'INPUT' ? el.value : el.textContent;
      var isEmpty = !value || value.trim() === '' ||
                    value.trim() === 'Pick-up location' ||
                    value.trim() === 'Drop-off location' ||
                    value.trim() === 'Select date' ||
                    value.trim() === 'Select time' ||
                    value.trim() === 'Date' ||
                    value.trim() === 'Time';

      if (isEmpty && fd) {
        fd.classList.add('err');
        hasError = true;
      }
    });

    if (hasError) return;

    // Fill-bar animation
    var fillBar = btn ? btn.querySelector('.fill-bar') : null;
    if (fillBar) {
      fillBar.style.transition = 'none';
      fillBar.style.width = '0';
      fillBar.style.background = '#c5a047';
      void fillBar.offsetWidth;
      fillBar.style.transition = 'width .6s ease';
      fillBar.style.width = '100%';
    }

    setTimeout(function () {
      // Gather data
      var pickup  = getFieldValue('pickup-display')  || getFieldValue('pickup-val')  || '';
      var dropoff = getFieldValue('dropoff-display') || getFieldValue('dropoff-val') || '';
      var date    = getFieldValue('date-display')    || getFieldValue('pickup-date')  || '';
      var time    = getFieldValue('time-display')    || getFieldValue('pickup-time')  || '';

      var params = new URLSearchParams({
        pickup:  pickup,
        dropoff: dropoff,
        date:    date,
        time:    time
      });

      window.location.href = 'booking.html?' + params.toString();
    }, 650);
  };

  function getFieldValue(id) {
    var el = document.getElementById(id);
    if (!el) return '';
    return el.tagName === 'INPUT' ? el.value : el.textContent;
  }

  /* --------------------------------------------------------
     10. MULTI-CITY FORM
     -------------------------------------------------------- */
  var mcStopCount = 0;

  window.addMCStop = function () {
    if (mcStopCount >= 5) return;

    var container = document.getElementById('mc-stops');
    if (!container) return;

    mcStopCount++;
    var stopId = 'mc-stop-' + mcStopCount;

    var row = document.createElement('div');
    row.className = 'mc-stop-row';
    row.id = stopId;
    row.innerHTML =
      '<div class="fd mc-fd" onclick="openAddr(\'mc-dd-' + mcStopCount + '\', \'mc-input-' + mcStopCount + '\', event)">' +
        '<div class="fd-icon"><i class="fa-solid fa-location-dot"></i></div>' +
        '<div class="fd-body">' +
          '<span class="fd-label">Stop ' + mcStopCount + '</span>' +
          '<span class="fd-value" id="mc-val-' + mcStopCount + '">Enter location</span>' +
          '<input type="text" class="dd-search" id="mc-input-' + mcStopCount + '" placeholder="Search..." ' +
            'oninput="filterAddr(this,\'mc-dd-' + mcStopCount + '\')" onkeydown="addrKey(event)" />' +
        '</div>' +
        '<div class="dropdown" id="mc-dd-' + mcStopCount + '">' +
          '<div class="dropdown-item" onclick="setVal(\'mc-val-' + mcStopCount + '\',\'Airport – JFK\')">Airport – JFK</div>' +
          '<div class="dropdown-item" onclick="setVal(\'mc-val-' + mcStopCount + '\',\'Airport – LGA\')">Airport – LGA</div>' +
          '<div class="dropdown-item" onclick="setVal(\'mc-val-' + mcStopCount + '\',\'Airport – EWR\')">Airport – EWR</div>' +
          '<div class="dropdown-item" onclick="setVal(\'mc-val-' + mcStopCount + '\',\'Manhattan\')">Manhattan</div>' +
          '<div class="dropdown-item" onclick="setVal(\'mc-val-' + mcStopCount + '\',\'Brooklyn\')">Brooklyn</div>' +
          '<div class="dropdown-item" onclick="setVal(\'mc-val-' + mcStopCount + '\',\'Queens\')">Queens</div>' +
        '</div>' +
      '</div>' +
      '<div class="fd mc-fd mc-date" onclick="openMcCal(' + mcStopCount + ', event)">' +
        '<div class="fd-icon"><i class="fa-solid fa-calendar"></i></div>' +
        '<div class="fd-body">' +
          '<span class="fd-label">Date</span>' +
          '<span class="fd-value" id="mc-date-' + mcStopCount + '">Select date</span>' +
        '</div>' +
        '<div class="picker-panel mc-cal" id="mc-cal-' + mcStopCount + '">' +
          '<div class="cal-nav">' +
            '<button type="button" onclick="moveMcCal(' + mcStopCount + ',-1)">&#8249;</button>' +
            '<span class="cal-title">Month YYYY</span>' +
            '<button type="button" onclick="moveMcCal(' + mcStopCount + ',1)">&#8250;</button>' +
          '</div>' +
          '<div class="cal-grid"></div>' +
          '<button type="button" class="cal-confirm" onclick="closeMcPicker(' + mcStopCount + ')">Confirm</button>' +
        '</div>' +
      '</div>' +
      '<div class="fd mc-fd mc-time" onclick="openMcTime(' + mcStopCount + ', event)">' +
        '<div class="fd-icon"><i class="fa-solid fa-clock"></i></div>' +
        '<div class="fd-body">' +
          '<span class="fd-label">Time</span>' +
          '<span class="fd-value" id="mc-time-' + mcStopCount + '">Select time</span>' +
        '</div>' +
        '<div class="picker-panel mc-timepanel" id="mc-timepanel-' + mcStopCount + '">' +
          '<div class="tp-row">' +
            '<div class="tp-col">' +
              '<button type="button" onclick="adjMcHour(' + mcStopCount + ',1)">&#9650;</button>' +
              '<span id="mc-tp-hour-' + mcStopCount + '">12</span>' +
              '<button type="button" onclick="adjMcHour(' + mcStopCount + ',-1)">&#9660;</button>' +
            '</div>' +
            '<span class="tp-sep">:</span>' +
            '<div class="tp-col">' +
              '<button type="button" onclick="adjMcMin(' + mcStopCount + ',1)">&#9650;</button>' +
              '<span id="mc-tp-min-' + mcStopCount + '">00</span>' +
              '<button type="button" onclick="adjMcMin(' + mcStopCount + ',-1)">&#9660;</button>' +
            '</div>' +
            '<div class="tp-col">' +
              '<button type="button" onclick="toggleMcAmpm(' + mcStopCount + ')">&#8645;</button>' +
              '<span id="mc-tp-ampm-' + mcStopCount + '">AM</span>' +
            '</div>' +
          '</div>' +
          '<button type="button" class="cal-confirm" onclick="confirmMcTime(' + mcStopCount + ')">Confirm</button>' +
        '</div>' +
      '</div>' +
      '<button type="button" class="mc-remove" onclick="removeMCStop(\'' + stopId + '\')" aria-label="Remove stop">' +
        '<i class="fa-solid fa-xmark"></i>' +
      '</button>';

    container.appendChild(row);
  };

  // MC calendar/time state (per stop)
  var mcCalDates     = {};
  var mcSelectedDates = {};
  var mcTimeState    = {};

  window.openMcCal = function (idx, event) {
    if (event) event.stopPropagation();
    closeAllDropdowns();

    if (!mcCalDates[idx]) mcCalDates[idx] = new Date();

    var panel = document.getElementById('mc-cal-' + idx);
    if (!panel) return;
    panel.style.display = 'block';

    var grid  = panel.querySelector('.cal-grid');
    var title = panel.querySelector('.cal-title');

    renderCal(grid, title, mcCalDates[idx], mcSelectedDates[idx] || null, function sel(d) {
      mcSelectedDates[idx] = d;
      renderCal(grid, title, mcCalDates[idx], d, sel);
    });
  };

  window.moveMcCal = function (idx, dir) {
    if (!mcCalDates[idx]) mcCalDates[idx] = new Date();
    mcCalDates[idx].setMonth(mcCalDates[idx].getMonth() + dir);

    var panel = document.getElementById('mc-cal-' + idx);
    if (!panel) return;
    var grid  = panel.querySelector('.cal-grid');
    var title = panel.querySelector('.cal-title');

    renderCal(grid, title, mcCalDates[idx], mcSelectedDates[idx] || null, function sel(d) {
      mcSelectedDates[idx] = d;
      renderCal(grid, title, mcCalDates[idx], d, sel);
    });
  };

  window.closeMcPicker = function (idx) {
    var panel = document.getElementById('mc-cal-' + idx);
    if (panel) panel.style.display = '';

    if (mcSelectedDates[idx]) {
      var span = document.getElementById('mc-date-' + idx);
      if (span) span.textContent = formatDate(mcSelectedDates[idx]);
    }
  };

  window.openMcTime = function (idx, event) {
    if (event) event.stopPropagation();
    closeAllDropdowns();

    if (!mcTimeState[idx]) mcTimeState[idx] = { h: 12, m: 0, ap: 'AM' };

    var panel = document.getElementById('mc-timepanel-' + idx);
    if (panel) panel.style.display = 'block';

    updateMcTimePanelDisplay(idx);
  };

  function updateMcTimePanelDisplay(idx) {
    var st = mcTimeState[idx];
    if (!st) return;
    var hEl  = document.getElementById('mc-tp-hour-' + idx);
    var mEl  = document.getElementById('mc-tp-min-' + idx);
    var apEl = document.getElementById('mc-tp-ampm-' + idx);
    if (hEl)  hEl.textContent  = padZero(st.h);
    if (mEl)  mEl.textContent  = padZero(st.m);
    if (apEl) apEl.textContent = st.ap;
  }

  window.adjMcHour = function (idx, dir) {
    if (!mcTimeState[idx]) mcTimeState[idx] = { h: 12, m: 0, ap: 'AM' };
    mcTimeState[idx].h += dir;
    if (mcTimeState[idx].h > 12) mcTimeState[idx].h = 1;
    if (mcTimeState[idx].h < 1)  mcTimeState[idx].h = 12;
    updateMcTimePanelDisplay(idx);
  };

  window.adjMcMin = function (idx, dir) {
    if (!mcTimeState[idx]) mcTimeState[idx] = { h: 12, m: 0, ap: 'AM' };
    mcTimeState[idx].m += dir * 5;
    if (mcTimeState[idx].m > 55) mcTimeState[idx].m = 0;
    if (mcTimeState[idx].m < 0)  mcTimeState[idx].m = 55;
    updateMcTimePanelDisplay(idx);
  };

  window.toggleMcAmpm = function (idx) {
    if (!mcTimeState[idx]) mcTimeState[idx] = { h: 12, m: 0, ap: 'AM' };
    mcTimeState[idx].ap = mcTimeState[idx].ap === 'AM' ? 'PM' : 'AM';
    updateMcTimePanelDisplay(idx);
  };

  window.confirmMcTime = function (idx) {
    var st = mcTimeState[idx];
    if (!st) return;
    var text = padZero(st.h) + ':' + padZero(st.m) + ' ' + st.ap;
    var span = document.getElementById('mc-time-' + idx);
    if (span) span.textContent = text;

    var panel = document.getElementById('mc-timepanel-' + idx);
    if (panel) panel.style.display = '';
  };

  window.removeMCStop = function (id) {
    var row = document.getElementById(id);
    if (row) {
      row.remove();
      mcStopCount--;
      if (mcStopCount < 0) mcStopCount = 0;
    }
  };

  /* --------------------------------------------------------
     11. HOURLY FORM HELPERS
     -------------------------------------------------------- */
  window.setValH = function (id, text) {
    var el = document.getElementById(id);
    if (!el) return;

    if (el.tagName === 'INPUT') el.value = text;
    else el.textContent = text;

    var fd = el.closest('.fd');
    if (fd) fd.classList.remove('err');

    closeAllDropdowns();
  };

  /* --------------------------------------------------------
     12. PRICING FLEET TABS
     -------------------------------------------------------- */
  window.showTab = function (i) {
    document.querySelectorAll('.panel').forEach(function (p, idx) {
      p.classList.toggle('active', idx === i);
    });
    document.querySelectorAll('.pricing-tabs .tab, .fleet-tabs .tab, .pricing-tabs .tab-btn, .fleet-tabs .tab-btn').forEach(function (t, idx) {
      t.classList.toggle('active', idx === i);
    });
  };

  /* --------------------------------------------------------
     13. SERVICE AREAS CAROUSEL
     -------------------------------------------------------- */
  var saPos      = 0;
  var saTrack    = document.querySelector('.sa-track');
  var saPrev     = document.getElementById('sa-prev');
  var saNext     = document.getElementById('sa-next');

  function getSaVisible() {
    return window.innerWidth <= 768 ? 2 : 4;
  }

  function getSaItemCount() {
    if (!saTrack) return 0;
    return saTrack.querySelectorAll('.sa-card, .sa-item').length;
  }

  function updateSaTrack() {
    if (!saTrack) return;
    var visible = getSaVisible();
    var pct = 100 / visible;
    saTrack.style.transform = 'translateX(-' + (saPos * pct) + '%)';
  }

  if (saPrev) {
    saPrev.addEventListener('click', function () {
      var visible = getSaVisible();
      var total = getSaItemCount();
      saPos--;
      if (saPos < 0) saPos = Math.max(0, total - visible);
      updateSaTrack();
    });
  }

  if (saNext) {
    saNext.addEventListener('click', function () {
      var visible = getSaVisible();
      var total = getSaItemCount();
      saPos++;
      if (saPos > total - visible) saPos = 0;
      updateSaTrack();
    });
  }

  // Re-calc on resize
  window.addEventListener('resize', function () {
    var visible = getSaVisible();
    var total = getSaItemCount();
    if (saPos > total - visible) saPos = Math.max(0, total - visible);
    updateSaTrack();
  });

  /* --------------------------------------------------------
     14. INTERSECTION OBSERVER FOR ANIMATIONS
     -------------------------------------------------------- */
  if ('IntersectionObserver' in window) {
    var animObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
        } else {
          entry.target.classList.remove('animated');
        }
      });
    }, { threshold: 0.1 });

    var animTargets = document.querySelectorAll(
      'section, .hero, .trust-bar, .services, .booking-section, ' +
      '.pricing, .fleet, .service-areas, .testimonials, .cta, .faq, .footer, ' +
      '[data-animate]'
    );

    animTargets.forEach(function (el) {
      animObserver.observe(el);
    });
  }

  /* --------------------------------------------------------
     15. SMOOTH SCROLL
     -------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (!targetId || targetId === '#') return;

      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });

        // Close mobile nav if open
        if (nav && nav.classList.contains('is-open')) {
          nav.classList.remove('is-open');
          if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
        }
      }
    });
  });

  /* --------------------------------------------------------
     16. CLOSE DROPDOWNS ON OUTSIDE CLICK
     -------------------------------------------------------- */
  document.addEventListener('click', function (e) {
    if (
      !e.target.closest('.fd') &&
      !e.target.closest('.dropdown') &&
      !e.target.closest('.picker-panel') &&
      !e.target.closest('.tab-btn')
    ) {
      closeAllDropdowns();
    }
  });

  /* --------------------------------------------------------
     UTILITY: Escape key closes dropdowns
     -------------------------------------------------------- */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeAllDropdowns();

      if (nav && nav.classList.contains('is-open')) {
        nav.classList.remove('is-open');
        if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
      }
    }
  });

});
