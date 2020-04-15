var buttonsarray = []

function populateMacroButtons() {

  $("#macros").empty();
  for (i = 0; i < buttonsarray.length; i++) {
    // Handle old created buttons that didnt have a tooltip
    if (!buttonsarray[i].tooltip) {
      buttonsarray[i].tooltip = ""
    };
    if (buttonsarray[i].macrokeyboardshortcut && buttonsarray[i].macrokeyboardshortcut.length) {
      var keyboardAssignment = buttonsarray[i].macrokeyboardshortcut
    } else {
      var keyboardAssignment = "none"
    }
    var button = `
    <button class="macrobtn m-1 command-button drop-shadow outline ` + buttonsarray[i].class + `" title="` + buttonsarray[i].tooltip + `" onclick="sendGcode('` + buttonsarray[i].gcode.replace(/(\r\n|\n|\r)/gm, "\\n") + `');">
      <span class="` + buttonsarray[i].icon + ` icon"></span>
      <span class="caption mt-2">
        ` + buttonsarray[i].title + `
        <small><i class="far fa-fw fa-keyboard"></i>: [` + keyboardAssignment + `]</small>
      </span>
      <span title="Edit Macro" onclick="edit(` + i + `, event);" id="edit` + i + `" class="fas fa-cogs macroedit"></span>
    </button>

    `
    $("#macros").append(button);
  }
  // append add button
  var button = `
  <button class="m-1 command-button drop-shadow outline rounded" onclick="edit(` + (buttonsarray.length + 1) + `, event)">
      <span class="fas fa-plus icon"></span>
      <span class="caption mt-2">
          Add
          <small>Macro</small>
      </span>
  </button>

  `
  $("#macros").append(button);
  localStorage.setItem('macroButtons', JSON.stringify(buttonsarray));
}

function edit(i, evt) {
  evt.preventDefault();
  evt.stopPropagation();
  console.log("Editing " + i)

  if (buttonsarray[i]) {
    var icon = buttonsarray[i].icon;
    var title = buttonsarray[i].title;
    var gcode = buttonsarray[i].gcode;
    var cls = buttonsarray[i].class;
    var tooltip = buttonsarray[i].tooltip;
    if (buttonsarray[i].macrokeyboardshortcut && buttonsarray[i].macrokeyboardshortcut.length > 0) {
      var macrokeyboardshortcut = buttonsarray[i].macrokeyboardshortcut;
    } else {
      var macrokeyboardshortcut = "";
    }

  } else {
    var icon = "far fa-question-circle";
    var title = "";
    var gcode = "";
    var cls = "";
    var tooltip = "";
    var macrokeyboardshortcut = "";
  }

  var macroTemplate = `<form id="macroEditForm">
      <div class="row mb-2">
          <label class="cell-sm-2">Icon</label>
          <div class="cell-sm-10">
              <input id="macroicon" type="text" value="` + icon + `" data-editable="true">
          </div>
      </div>
      <div class="row mb-2">
          <label class="cell-sm-2">Label</label>
          <div class="cell-sm-10">
              <input id="macrotitle" type="text" value="` + title + `" data-editable="true">
          </div>
      </div>
      <div class="row mb-2">
          <label class="cell-sm-2">Tooltip</label>
          <div class="cell-sm-10">
              <input id="macrotooltip" type="text" value="` + tooltip + `" data-editable="true">
          </div>
      </div>
      <div class="row mb-2">
          <label class="cell-sm-2">GCODE</label>
          <div class="cell-sm-10" >
              <textarea id="macrogcode" type="text" value="` + gcode + `" style="overflow-y: auto; max-height: 100px; resize: none;" rows="4"  data-editable="true"></textarea>
          </div>
      </div>
      <div class="row mb-2">
          <label class="cell-sm-2">Color</label>
          <div class="cell-sm-10">
            <select data-role="select" id="macrocls"  data-editable="true">
              <option value="" selected>Default</option>
              <option value="primary">Blue</option>
              <option value="info">Light Blue</option>
              <option value="secondary">Blue-Gray</option>
              <option value="success">Green</option>
              <option value="alert">Red</option>
              <option value="warning">Orange</option>
              <option value="yellow">Yellow</option>
              <option value="dark">Dark</option>
              <option value="light">Light</option>
            </select>
          </div>
      </div>
      <div class="row mb-2">
          <span class="text-small">Click below to assign a new Keyboard Shortcut / combination to a function. Ctrl, Alt and Shift can be added to create combinations.</span>
          <label class="cell-sm-2">Keyboard Shortcut</label>
          <div class="cell-sm-10" >
            <input id="macrokeyboardshortcut" class="macrokeyboardshortcutinput" type="text" value="` + macrokeyboardshortcut + `" data-editable="true" onclick="$('.macrokeyboardshortcutinput').removeClass('newMacroKeyAssignment'); $('#macrokeyboardshortcut').addClass('newMacroKeyAssignment')">
          </div>
      </div>
      <input type="hidden" id="macroseq" value="` + i + `" />
  </form>`

  Metro.dialog.create({
    title: "Edit Macro",
    content: macroTemplate,
    actions: [{
        caption: "Cancel",
        cls: "js-dialog-close",
        onclick: function() {
          //
        }
      },
      {
        caption: "Delete Macro",
        cls: "js-dialog-close alert",
        onclick: function() {
          buttonsarray.splice(i, 1);
          populateMacroButtons();
        }
      },
      {
        caption: "Apply",
        cls: "js-dialog-close success",
        onclick: function() {
          var seq = $('#macroseq').val();
          if (buttonsarray[seq]) {
            buttonsarray[seq].icon = $('#macroicon').val();
            buttonsarray[seq].title = $('#macrotitle').val();
            buttonsarray[seq].gcode = $('#macrogcode').val();
            buttonsarray[seq].class = $('#macrocls').val();
            buttonsarray[seq].tooltip = $('#macrotooltip').val();
            buttonsarray[seq].macrokeyboardshortcut = $('#macrokeyboardshortcut').val();
            populateMacroButtons();
            bindKeys()
          } else {
            buttonsarray.push({
              title: $('#macrotitle').val(),
              icon: $('#macroicon').val(),
              gcode: $('#macrogcode').val(),
              class: $('#macrocls').val(),
              tooltip: $('#macrotooltip').val(),
              macrokeyboardshortcut: $('#macrokeyboardshortcut').val(),
            })
            populateMacroButtons();
            bindKeys()
          }
        }
      }
    ]
  });

  $('#macrokeyboardshortcut').bind('keydown', null, function(e) {
    e.preventDefault();
    console.log(e)
    var newVal = "";
    if (e.altKey) {
      newVal += 'alt+'
    }
    if (e.ctrlKey) {
      newVal += 'ctrl+'
    }
    if (e.shiftKey) {
      newVal += 'shift+'
    }

    if (e.key.toLowerCase() != 'alt' && e.key.toLowerCase() != 'control' && e.key.toLowerCase() != 'shift') {
      // Handle MetroUI naming non-standards of some keys
      if (e.keyCode == 32) {
        newVal += 'space';
      } else if (e.key.toLowerCase() == 'escape') {
        newVal += 'esc';
      } else if (e.key.toLowerCase() == 'arrowleft') {
        newVal += 'left';
      } else if (e.key.toLowerCase() == 'arrowright') {
        newVal += 'right';
      } else if (e.key.toLowerCase() == 'arrowup') {
        newVal += 'up';
      } else if (e.key.toLowerCase() == 'arrowdown') {
        newVal += 'down';
      } else {
        newVal += e.key.toLowerCase();
      }
      $('.newMacroKeyAssignment').val(newVal)
    }

  });

  var options = {
    placement: 'bottom',
    collision: 'none',
    animation: true,
    hideOnSelect: true,
  };

  // fa iconpicker https://github.com/farbelous/fontawesome-iconpicker
  $('#macroicon').iconpicker(options);
  $("#macrocls").val(cls).trigger("change");
  $('#macrogcode').val(gcode);


}

function run(i, evt) {
  evt.preventDefault();
  evt.stopPropagation();
  console.log("Run " + i)
}


// run it to begin
if (localStorage.getItem('macroButtons')) {
  buttonsarray = JSON.parse(localStorage.getItem('macroButtons'));
}

$(document).ready(function() {
  populateMacroButtons()
  bindKeys()
});

function searchMacro(prop, nameKey, myArray) {
  console.log(nameKey, prop, myArray)
  for (var i = 0; i < myArray.length; i++) {
    if (myArray[i][prop] === nameKey) {
      return myArray[i];
    }
  }
}