// Toolbar with USB port/connect/disconnect
function setConnectBar(val, status) {
  if (val == 0) { // Not Connected Yet
    // Status Badge
    $('#connectStatus').html("Port: Not Connected");
    // Connect/Disconnect Button
    $("#disconnectBtn").hide();
    $("#connectBtn").show();
    if ($('#portUSB').val() != "") {
      $("#connectBtn").attr('disabled', false);
    } else {
      $("#connectBtn").attr('disabled', true);
    }
    // Port Dropdown
    if ($('#portUSB').val() != "") {
      $('#portUSB').parent(".select").removeClass('disabled')
    } else {
      $('#portUSB').parent(".select").addClass('disabled')
    }
    $('#portUSB').parent(".select").addClass('success')
    $('#portUSB').parent(".select").removeClass('alert')
    // Set Port Dropdown to Current Value
    // Not applicable to Status 0 as its set by populatePortsMenu();

  } else if (val == 1 || val == 2) { // Connected, but not Playing yet
    // Status Badge
    $('#connectStatus').html("Port: Connected");
    // Connect/Disconnect Button
    $("#connectBtn").hide();
    $("#connectBtn").attr('disabled', false);
    $("#disconnectBtn").show();
    // Port Dropdown
    $('#portUSB').parent(".select").addClass('disabled')
    $('#portUSB').parent(".select").removeClass('success')
    $('#portUSB').parent(".select").addClass('alert')
    // Set Port Dropdown to Current Value
    $("#portUSB").val(status.comms.interfaces.activePort);

  } else if (val == 3) { // Busy Streaming GCODE
    // Status Badge
    $('#connectStatus').html("Port: Connected");
    // Connect/Disconnect Button
    $("#connectBtn").hide();
    $("#connectBtn").attr('disabled', false);
    $("#disconnectBtn").show();
    // Port Dropdown
    $('#portUSB').parent(".select").addClass('disabled')
    $('#portUSB').parent(".select").removeClass('success')
    $('#portUSB').parent(".select").addClass('alert')
    // Set Port Dropdown to Current Value
    $("#portUSB").val(status.comms.interfaces.activePort);

  } else if (val == 4) { // Paused
    // Status Badge
    $('#connectStatus').html("Port: Connected");
    // Connect/Disconnect Button
    $("#connectBtn").hide();
    $("#connectBtn").attr('disabled', false);
    $("#disconnectBtn").show();
    // Port Dropdown
    $('#portUSB').parent(".select").addClass('disabled')
    $('#portUSB').parent(".select").removeClass('success')
    $('#portUSB').parent(".select").addClass('alert')
    // Set Port Dropdown to Current Value
    $("#portUSB").val(status.comms.interfaces.activePort);

  } else if (val == 5) { // Alarm State
    // Status Badge
    $('#connectStatus').html("Port: Connected");
    // Connect/Disconnect Button
    $("#connectBtn").hide();
    $("#connectBtn").attr('disabled', false);
    $("#disconnectBtn").show();
    // Port Dropdown
    $('#portUSB').parent(".select").addClass('disabled')
    $('#portUSB').parent(".select").removeClass('success')
    $('#portUSB').parent(".select").addClass('alert')
    // Set Port Dropdown to Current Value
    $("#portUSB").val(status.comms.interfaces.activePort);

  }
}

// Toolbar with play/pause/stop
function setControlBar(val, status) {
  if (val == 0) { // Not Connected Yet
    $('#runBtn').hide().attr('disabled', true);
    $('#resumeBtn').hide().attr('disabled', true);
    $('#pauseBtn').hide().attr('disabled', true);
    $('#stopBtn').hide().attr('disabled', true);
    $('#toolBtn').hide().attr('disabled', true);
    $('#homeBtn').hide().attr('disabled', true);
  } else if (val == 0 || val == 2) { // Connected, but not Playing yet
    $('#runBtn').show().attr('disabled', editor.session.getLength() < 2);
    $('#resumeBtn').hide().attr('disabled', true);
    $('#pauseBtn').hide().attr('disabled', true);
    $('#stopBtn').show().attr('disabled', true);
    $('#toolBtn').show().attr('disabled', false);
    $('#homeBtn').show().attr('disabled', false);
  } else if (val == 3) { // Busy Streaming GCODE
    $('#runBtn').hide().attr('disabled', true);
    $('#resumeBtn').hide().attr('disabled', true);
    $('#pauseBtn').show().attr('disabled', false);
    $('#stopBtn').show().attr('disabled', false);
    $('#toolBtn').show().attr('disabled', false);
    $('#homeBtn').show().attr('disabled', true);
  } else if (val == 4) { // Paused
    $('#runBtn').hide().attr('disabled', true);
    $('#resumeBtn').show().attr('disabled', false);
    $('#pauseBtn').hide().attr('disabled', true);
    $('#stopBtn').show().attr('disabled', false);
    $('#toolBtn').show().attr('disabled', false);
    $('#homeBtn').show().attr('disabled', true);
  } else if (val == 5) { // Alarm State
    $('#runBtn').show().attr('disabled', true);
    $('#resumeBtn').hide().attr('disabled', true);
    $('#pauseBtn').hide().attr('disabled', true);
    $('#stopBtn').show().attr('disabled', false);
    $('#toolBtn').show().attr('disabled', true);
    $('#homeBtn').show().attr('disabled', true);
  }
}

function setJogPanel(val, status) {
  if (val == 0) { // Not Connected Yet
    // Show panel and resize editor
    $("#jogcontrols").slideUp("fast");
    $("#editor").css('height', 'calc(' + 100 + 'vh - ' + 210 + 'px)');
    editor.resize()
    $('.jogbtn').attr('disabled', true);
  } else if (val == 0 || val == 2) { // Connected, but not Playing yet
    // Show panel and resize editor
    $("#jogcontrols").slideDown("fast");
    $("#editor").css('height', 'calc(' + 100 + 'vh - ' + 405 + 'px)');
    editor.resize()
    $('.jogbtn').attr('disabled', false);
  } else if (val == 3) { // Busy Streaming GCODE
    // Show panel and resize editor
    $("#editor").css('height', 'calc(' + 100 + 'vh - ' + 405 + 'px)');
    editor.resize()
    $("#jogcontrols").slideDown("fast");
    $('.jogbtn').attr('disabled', true);
  } else if (val == 4) { // Paused
    // Show panel and resize editor
    $("#jogcontrols").slideDown("fast");
    $("#editor").css('height', 'calc(' + 100 + 'vh - ' + 405 + 'px)');
    editor.resize()
    $('.jogbtn').attr('disabled', true);
  } else if (val == 5) { // Alarm State
    // Show panel and resize editor
    $("#jogcontrols").slideUp("fast");
    $("#editor").css('height', 'calc(' + 100 + 'vh - ' + 210 + 'px)');
    editor.resize()
    $('.jogbtn').attr('disabled', true);
  }
}

function setConsole(val, status) {
  if (val == 0) { // Not Connected Yet
    if (!$('#command').attr('disabled')) {
      $('#command').attr('disabled', true);
    }
    $("#sendCommand").prop('disabled', true);
  } else if (val == 0 || val == 2) { // Connected, but not Playing yet
    $("#command").attr('disabled', false);
    $("#sendCommand").prop('disabled', false);
  } else if (val == 3) { // Busy Streaming GCODE
    $("#command").attr('disabled', true);
    $("#sendCommand").prop('disabled', true);
  } else if (val == 4) { // Paused
    $("#command").attr('disabled', true);
    $("#sendCommand").prop('disabled', false);
  } else if (val == 5) { // Alarm State
    $("#command").attr('disabled', false);
    $("#sendCommand").prop('disabled', false);
  }
}