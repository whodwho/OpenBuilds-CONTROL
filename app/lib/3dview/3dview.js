var object;
var simIdx, draw, line, timefactor = 1,
  object, simRunning = false,
  simSingleLine = -1;

var loader = new THREE.ObjectLoader();



function convertParsedDataToObject(jsonData) {

  try {
    parsedData = JSON.parse(jsonData)
  } catch (e) {
    console.log(e, jsonData); // error in the above string (in this case, yes)!
    return;
  }


  var geometry = new THREE.BufferGeometry();

  var material = new THREE.LineBasicMaterial({
    vertexColors: THREE.VertexColors,
    transparent: true,
    opacity: 0.8,
  });
  var positions = [];
  var colors = [];

  for (i = 0; i < parsedData.linePoints.length; i++) {
    // if (!parsedData.linePoint[i].args.isFake) {
    var x = parsedData.linePoints[i].x;
    var y = parsedData.linePoints[i].y;
    var z = parsedData.linePoints[i].z;
    positions.push(x, y, z);

    if (parsedData.linePoints[i].g == 0) {
      colors.push(0);
      colors.push(200);
      colors.push(0);
    } else if (parsedData.linePoints[i].g == 1) {
      colors.push(200);
      colors.push(0);
      colors.push(0);
    } else if (parsedData.linePoints[i].g == 2) {
      colors.push(0);
      colors.push(0);
      colors.push(200);
    } else {
      colors.push(200);
      colors.push(0);
      colors.push(200);
    }

    // }
  }

  // for (i = 0; i < parsedData.lines.length; i++) {
  //   if (!parsedData.lines[i].args.isFake) {
  //     var x = parsedData.lines[i].p2.x;
  //     var y = parsedData.lines[i].p2.y;
  //     var z = parsedData.lines[i].p2.z;
  //     positions.push(x, y, z);
  //
  //     if (parsedData.lines[i].p2.g0) {
  //       colors.push(0);
  //       colors.push(200);
  //       colors.push(0);
  //     } else if (parsedData.lines[i].p2.g1) {
  //       colors.push(200);
  //       colors.push(0);
  //       colors.push(0);
  //     } else if (parsedData.lines[i].p2.g2) {
  //       colors.push(0);
  //       colors.push(0);
  //       colors.push(200);
  //     } else {
  //       colors.push(200);
  //       colors.push(0);
  //       colors.push(200);
  //     }
  //
  //   }
  // }

  geometry.addAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.addAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

  geometry.computeBoundingSphere();

  var line = new THREE.Line(geometry, material);
  line.geometry.computeBoundingBox();
  var box = line.geometry.boundingBox.clone();
  // line.userData.lines = parsedData.lines
  line.userData.linePoints = parsedData.linePoints;
  line.userData.bbbox2 = box;
  line.userData.inch = parsedData.inch;
  line.userData.totalTime = parsedData.totalTime;
  line.name = 'gcodeobject'
  return line;
}


function parseGcodeInWebWorker(gcode) {
  if (webgl) {
    if (!disable3Dgcodepreview) {
      simstop()
      scene.remove(object)
      object = false;

      // var worker = new Worker('lib/3dview/workers/gcodeparser.js');
      var worker = new Worker('lib/3dview/workers/more-litegcodeviewer.js');
      worker.addEventListener('message', function(e) {
        // console.log('webworker message', e)
        if (e.data.progress != undefined) {
          $('#3dviewlabel').html(' 3D View (rendering, please wait... ' + e.data.progress + '% )')
        } else {
          if (scene.getObjectByName('gcodeobject')) {
            scene.remove(scene.getObjectByName('gcodeobject'))
            object = false;
          }
          object = convertParsedDataToObject(e.data);
          console.log(object)
          if (object && object.userData.linePoints.length > 1) {
            worker.terminate();
            scene.add(object);
            if (object.userData.inch) {
              // console.log(scaling)
              object.scale.x = 25.4
              object.scale.y = 25.4
              object.scale.z = 25.4
            }
            redrawGrid(Math.floor(object.userData.bbbox2.min.x), Math.ceil(object.userData.bbbox2.max.x), Math.floor(object.userData.bbbox2.min.y), Math.ceil(object.userData.bbbox2.max.y), object.userData.inch)
            // animate();
            setTimeout(function() {
              if (webgl) {
                $('#gcodeviewertab').click();
              }
              clearSceneFlag = true;
              resetView();
              // animate();
              var timeremain = object.userData.totalTime;

              if (!isNaN(timeremain)) {
                var mins_num = parseFloat(timeremain, 10); // don't forget the second param
                var hours = Math.floor(mins_num / 60);
                var minutes = Math.floor((mins_num - ((hours * 3600)) / 60));
                var seconds = Math.floor((mins_num * 60) - (hours * 3600) - (minutes * 60));

                // Appends 0 when unit is less than 10
                if (hours < 10) {
                  hours = "0" + hours;
                }
                if (minutes < 10) {
                  minutes = "0" + minutes;
                }
                if (seconds < 10) {
                  seconds = "0" + seconds;
                }
                var formattedTime = hours + ':' + minutes + ':' + seconds;
                // console.log('Remaining time: ', formattedTime)
                // output formattedTime to UI here
                $('#timeRemaining').html(" / " + formattedTime);
                printLog("<span class='fg-red'>[ GCODE Parser ]</span><span class='fg-darkGreen'> GCODE Preview Rendered Succesfully: Total lines: <b>" + object.userData.linePoints.length + "</b> / Estimated GCODE Run Time: <b>" + formattedTime + "</b>")
              }
            }, 200);
            $('#3dviewicon').removeClass('fa-pulse');
            $('#3dviewlabel').html(' 3D View')
          } else {
            // Didn't get an Object
            $('#3dviewicon').removeClass('fa-pulse');
            $('#3dviewlabel').html(' 3D View')
          }
        }

      }, false);

      worker.postMessage({
        'data': gcode
      });

      $('#3dviewicon').addClass('fa-pulse');
      $('#3dviewlabel').html(' 3D View (rendering, please wait...)')

      // populateToolChanges(gcode)
    }
  }
};

function simSpeed() {
  timefactor = timefactor * 10;
  if (timefactor > 1024) timefactor = 0.1;
  $('#simspeedval').text(timefactor);
}

function runSimFrom(startindex, singleLineOnly) {
  if (singleLineOnly) {
    simSingleLine = startindex;
  }
  $('#gcodeviewertab').click()
  if (startindex) {
    for (i = 0; i < object.userData.lines.length; i++)
      if (object.userData.lines[i].args.indx == startindex) {
        simIdx = i + 1;
        sim();
      }
  } else {
    sim();
  }
}

function sim() {
  if (typeof(object) == 'undefined' || !scene.getObjectByName('gcodeobject')) {
    // console.log('No Gcode in Preview yet')
    var message = `No Gcode in Preview yet: Please load GCODE from the Open GCODE button first before running simulation`
    Metro.toast.create(message, null, 10000, 'bg-red');
    simstop()
  } else {
    if (!disable3Drealtimepos) {
      $("#conetext").show();
      cone.visible = true
      if (simIdx == 0) {
        var posx = object.userData.linePoints[0].x; //- (sizexmax/2);
        var posy = object.userData.linePoints[0].y; //- (sizeymax/2);
        var posz = object.userData.linePoints[0].z + 20;
      } else {
        var posx = object.userData.linePoints[simIdx - 1].x; //- (sizexmax/2);
        var posy = object.userData.linePoints[simIdx - 1].y; //- (sizeymax/2);
        var posz = object.userData.linePoints[simIdx - 1].z + 20;
      }

      cone.position.x = posx;
      cone.position.y = posy;
      cone.position.z = posz;
      cone.material = new THREE.MeshPhongMaterial({
        color: 0x28a745,
        specular: 0x0000ff,
        shininess: 100,
        opacity: 0.9,
        transparent: true
      })
    }
    lastLine = {
      x: posx,
      y: posy,
      z: posz,
      e: 0,
      f: 0,
      feedrate: 10000,
      extruding: false
    };


    $('#runSimBtn').hide()
    $('#stopSimBtn').show()
    clearSceneFlag = true;
    simRunning = true;
    // timefactor = 1;
    $('#simspeedval').text(timefactor);
    $('#simstartbtn').attr('disabled', true);
    $('#simstopbtn').attr('disabled', false);
    $('#editorContextMenu').hide() // sometimes we launch sim(linenum) from the context menu... close it once running
    runSim(); //kick it off
  }
}

function runSim() {

  if (object.userData.inch) {
    var posx = object.userData.linePoints[simIdx].x * 25.4; //- (sizexmax/2);
    var posy = object.userData.linePoints[simIdx].y * 25.4; //- (sizeymax/2);
    var posz = object.userData.linePoints[simIdx].z * 25.4;

  } else {
    var posx = object.userData.linePoints[simIdx].x; //- (sizexmax/2);
    var posy = object.userData.linePoints[simIdx].y; //- (sizeymax/2);
    var posz = object.userData.linePoints[simIdx].z;

  }

  var simTime = object.userData.linePoints[simIdx].timeMins / timefactor;
  $('#gcodesent').html("Sim Line: " + parseInt(simIdx) - 1);

  var simTimeInSec = simTime * 60;

  if (!disable3Drealtimepos) {
    if (!object.userData.linePoints[simIdx].fake) {
      TweenMax.to(cone.position, simTimeInSec, {
        ease: Linear.easeNone,
        x: posx,
        y: posy,
        z: posz + 20,
        onComplete: function() {
          if (simRunning == false) {
            //return
            simstop();
          } else {
            simIdx++;
            if (simSingleLine > 0 && simIdx > simSingleLine + 1) {
              simstop();
            } else if (simIdx < object.userData.linePoints.length) {
              runSim();
            } else {
              simstop();
            }
          }
        }
      })
    } else {
      if (simRunning == false) {
        //return
        simstop();
      } else {
        simIdx++;
        if (simSingleLine > 0 && simIdx > simSingleLine + 1) {
          simstop();
        } else if (simIdx < object.userData.linePoints.length) {
          runSim();
        } else {
          simstop();
        }
      }
    }

  }






};


function simstop() {
  simIdx = 0;
  simRunning = false;
  simSingleLine = -1;
  $('#runSimBtn').show()
  $('#stopSimBtn').hide()
  // timefactor = 1;
  $('#simspeedval').text(timefactor);
  editor.gotoLine(0)
  if (!disable3Drealtimepos) {
    cone.visible = false;
  }
  $("#conetext").hide();
  clearSceneFlag = true;
}

function simAnimate() {
  if (simRunning) {
    if (cone) {
      // 160widthx200height offset?
      if (cone.position) {
        var conepos = toScreenPosition(cone, camera)
        var offset = $("#renderArea").offset()
        var farside = $("#renderArea").offset().left + $("#renderArea").outerWidth()
        var bottomside = $("#renderArea").outerHeight()
        // console.log(conepos)
        // console.log(offset)
        if (conepos.y < 25) {
          conepos.y = 25;
        }
        if (conepos.y > bottomside - 40) {
          conepos.y = bottomside - 40;
        }
        if (conepos.x < 0) {
          conepos.x = 0;
        }

        if (conepos.x > farside - $("#conetext").outerWidth()) {
          conepos.x = farside - $("#conetext").outerWidth();
        }

        $("#conetext").css('left', conepos.x + "px").css('top', conepos.y - 20 + "px");
      }
    }
  }
}

function toScreenPosition(obj, camera) {
  var vector = new THREE.Vector3(obj.position.x, obj.position.y + 10, obj.position.z + 30);
  var widthHalf = 0.5 * renderer.getContext().canvas.width;
  var heightHalf = 0.5 * renderer.getContext().canvas.height;
  vector.project(camera);
  vector.x = (vector.x * widthHalf) + widthHalf;
  vector.y = -(vector.y * heightHalf) + heightHalf;
  return {
    x: vector.x,
    y: vector.y
  };

};