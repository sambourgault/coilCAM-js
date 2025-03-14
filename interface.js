/* eslint no-console:0 consistent-return:0 */
"use strict";

async function getExampleVessel(file){
  try{
    var response = await fetch(file);
    if(response.ok){
      var data = await response.text();
      return data;
    } 
  } catch(error){
    console.error('Error fetching file:', error);
  }
  return null;
}

var viewerType = "tpv"; //control which viewer type is currently on screen

//Call in codemirror to change the toolpath in the threejs toolpath viewer
function updatePath(newPath, referencePath=null){
  var iframe = document.getElementById("toolpathVieweriFrame");
  if(newPath !== null){
      iframe.contentWindow.state.path = newPath;
  }
  if(referencePath !== null){
      iframe.contentWindow.state.referencePath = refPath;
  }
  // return iframe.contentWindow.state.outputPath;
}

//Call in codemirror to initialize path in layerViewer
function updateLayer(radius, nbPointsInLayer, pos=[0, 0, 0]){
  let iframe = document.getElementById("layerVieweriFrame");
  if(iframe && radius != null && nbPointsInLayer != null){
    iframe.contentWindow.state.radius = radius;
    iframe.contentWindow.state.nbPointsInLayer = nbPointsInLayer;
  }
  return iframe.contentWindow.state.values;
}

//Call in codemirror to initialize path in profileViewer
function updateProfile(layerHeight, nbLayers, pos=[0, 0, 0]){
  let iframe = document.getElementById("profileVieweriFrame");
  if(iframe && nbLayers != null && layerHeight != null){
    iframe.contentWindow.state.layerHeight = layerHeight;
    iframe.contentWindow.state.nbLayers = nbLayers;
  }
  return iframe.contentWindow.state.values;
}

function setBedDimensions(printerType){
  let iframe = document.getElementById("toolpathVieweriFrame");
  if (printerType == "baby"){ // 1 3js = 10 mm
    iframe.contentWindow.state.bedDimensions = [280, 265, 305];
  }
  if (printerType == "super"){
    iframe.contentWindow.state.bedDimensions = [415, 405, 500];
  }
}

function getCoilCAMExample(){
  // Check URL parameters for example vessel to load in
  // since there are no buttons in the simple viewer
  // Structure should be (ex: folder=some-folder&example=some-example (ex: folder=tutorial-functions&example=functions_sine)
  const currentUrl = window.location.href;
  const url = new URL (currentUrl);
  const params = url.searchParams;
  var folder = params.get('folder'); //specifies folder
  var vesselName = params.get('example'); //specifies name of file 
  return [folder, vesselName];
}

function setUpCodeMirror(){
  let textArea, textArea2;
  let editorCodeMirror;
  let consoleCodeMirror;

  // code editor: https://www.youtube.com/watch?v=C3fNuqQeUdY&t=1004s
  //code editor
  textArea = document.getElementById("editor");
  textArea.className = 'codemirror_textarea';

  // set default codemirror text content
  var defaultPathToVessel = 'examples/DefaultVessel.js';
  getExampleVessel(defaultPathToVessel) 
  .then(text => {editorCodeMirror.setValue(text)});
  

  var [folder, vesselName] = getCoilCAMExample();
  if(vesselName !== null){
    if(folder == null){ folder = ""; }
    var pathToVessel = "examples/" + folder+'/'+vesselName+'.js'; //from URL parameters
    getExampleVessel(pathToVessel).then(text => {
      if(text !== null){
        editorCodeMirror.setValue(text)
      }
    });
  }

  if (!editorCodeMirror) {
    editorCodeMirror = CodeMirror.fromTextArea(textArea, {
      lineNumbers: true,
      mode: 'javascript',
      lineWrapping: true,
    });
  }  
  window.onload = function() { //shortcut to comment out single line
    editorCodeMirror.setOption("extraKeys", {
      "Cmd-/":function(cm) {
        let cursor = cm.getCursor();
        let lineNumber = cursor.line;
        let currentLine = cm.getLine(lineNumber);
        if(currentLine.startsWith("//")){
          editorCodeMirror.replaceRange(currentLine.slice(2), CodeMirror.Pos(lineNumber, 0), CodeMirror.Pos(lineNumber), 0);
        } else{
          editorCodeMirror.replaceRange("//"+currentLine, CodeMirror.Pos(lineNumber, 0), CodeMirror.Pos(lineNumber), 0);
        }
      }, 
      "Cmd-Enter":function(cm) {
        runCode();
      },
      "Shift-Enter":function(cm) {
        runCode();
      }
    });
  }

  editorCodeMirror.setOption("extraKeys", {"Cmd-Enter":function(cm) {
    console.log("working");
    runCode();
  }});
  
  editorCodeMirror.setSize("100%", "100%");
  
  // code editor console
  textArea2 = document.getElementById("console");
  if(textArea2){
    textArea2.className = 'codemirror_textarea';
    textArea2.style.marginLeft = 20+'px';
    textArea2.style.width = 140+'%';
    textArea2.style.height = 200+'px';
  
    // configs
    consoleCodeMirror = CodeMirror.fromTextArea(textArea2, {
      lineNumbers: true,
      mode: 'javascript',
      lineWrapping: true,
      
      // extraKeys: {"Ctrl-Space":"autocomplete"}
    });
    consoleCodeMirror.setSize("100%", "100%");

    function printErrorToCodeMirror(errorString){
      consoleCodeMirror.replaceRange(`$ `+(errorString)+"\n", CodeMirror.Pos(consoleCodeMirror.lastLine()));
    }
  }
  
  //dropdown menu
  const exampleVessels={ //add examples here
    "example-mug":["examples/web-editor/UnionMug.js"],
    "example-bowl":["examples/web-editor/CheckerboardBowl.js"],
    "example-dish":["examples/web-editor/BooleanUnionDish.js"],
    "example-candleholder":["examples/web-editor/CandleHolder.js"],
    "example-vase":["examples/web-editor/SimpleVase.js"],
  };

  for (let buttonID in exampleVessels){
    (function () {
      const b = document.getElementById(buttonID);
      if(b){
        b.addEventListener("click", function() {
        let newText = getExampleVessel(exampleVessels[buttonID])
          .then(text => {editorCodeMirror.setValue(text)});
        editorCodeMirror.setValue(getExampleVessel(newText));
      },);
      }
    }());
  }
  
  const b_upload = 
  document.getElementById('b_upload');
  if(b_upload){
    b_upload.addEventListener('click', function() {
    document.getElementById('file_input').click(); //won't trigger when page loads
  }, {capture: true});
}
  
  //changes codemirror editor based on uploaded file
  const b_file = document.getElementById('file_input');
  if (b_file){
    b_file.addEventListener('change', function(event) { 
      const file = event.target.files[0];
      if (file) {
        const fileExtension = file.name.split('.').pop();
        if (fileExtension === 'txt') {
          const reader = new FileReader();
          reader.onload = function(e) {
            const contents = e.target.result;
            editorCodeMirror.setValue(contents);
          };
          
          reader.onerror = function(e) {
            console.error('Error reading file:', e);
          };
          
          reader.readAsText(file);
        } else{
          consoleCodeMirror.replaceRange(`$ `+(`${"File name must end with .txt"}`)+"\n", CodeMirror.Pos(consoleCodeMirror.lastLine()));
        }
      }
    });
  }

  var webEditorButton = document.getElementById("b_editor");
  if(webEditorButton){
    webEditorButton.addEventListener("click", function(){
      var [folder, vesselName] = getCoilCAMExample(); 
      if(vesselName !== null || folder !== null){
        window.location.href = "https://sambourgault.github.io/coilCAM-js/?folder="+folder+"&example="+vesselName;
      } else{
        window.location.href = "https://sambourgault.github.io/coilCAM-js";
      }
    });
  }

  document.getElementById("b_run").addEventListener("click", runCode);
  function runCode() {
    const codeToRun = editorCodeMirror.getValue();
    consoleCodeMirror.setValue("");

    console.log = function (...args) { //redirect console.log to codemirror console
        const logMessage = args.map(arg => String(arg)).join(" ");
        consoleCodeMirror?.replaceRange(`${logMessage}\n`, CodeMirror.Pos(consoleCodeMirror.lastLine()));
    };

    try {
      let result = eval(codeToRun);
      if (result){
        consoleCodeMirror?.replaceRange(result+"\n", CodeMirror.Pos(consoleCodeMirror.lastLine()));
      }
    }
    catch(err){
      consoleCodeMirror?.replaceRange(err+"\n", CodeMirror.Pos(consoleCodeMirror.lastLine()));
    }
  }

  const saveButton = document.getElementById("b_save")
  if (saveButton){
    saveButton.addEventListener("click", saveCode, {capture: true});
  }
  function saveCode(){
    let textInEditor = editorCodeMirror.getValue();
    var blob = new Blob([textInEditor], {type: "text/plain"});
    var anchor = document.createElement("a");
    anchor.href = URL.createObjectURL(blob);
    anchor.download = "coilCAM-js.txt";
    anchor.click();
  }
  
  document.getElementById("baby_pb")?.addEventListener("click", function(){setBedDimensions("baby")});
  document.getElementById("super_pb")?.addEventListener("click", function(){setBedDimensions("super")});

  

  //Upload data
  document.getElementById('b_upload_files')?.addEventListener('click', function(){
    document.getElementById('upload_data').click();
  }, {capture: true});
  document.getElementById('upload_data')?.addEventListener('change', handleFiles);

  function addFileAsButton(filename, contents){ //add file to lefthand toolbar
    //add new button to dropbox area
    const newButton = document.createElement('uploaded_file_button');
    newButton.textContent = filename;
    newButton.classList.add('dynamic-button');

    //TOFIX: event listener to display file in new window on click
    newButton.addEventListener('click', function() {
      const dataBlob = new Blob([contents], { type: 'text/plain' });
      var dataFile = new File([dataBlob], filename, {type: "text/plain"});
      const dataUrl = URL.createObjectURL(dataFile);
      window.open(dataUrl);
    });
    
    
    //add trash button to new button to throw out unnecessary files
    const trashButton = document.createElement('trashButton');
    trashButton.textContent = '\u{2612}';
    trashButton.classList.add('trash-button');

    
    //event listener to remove file from localstorage
    let divName = 'uploaded-file-div_'+filename.split('.')[0]+filename.split('.')[1];
    trashButton.addEventListener('click', function() {
      localStorage.removeItem(filename);
      parent = document.getElementById(divName);
      while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
      }
      document.getElementById('dropbox').removeChild(parent);
    });

    let parentElement = document.createElement('div');
    parentElement.id = divName;
    parentElement.className = 'uploaded-file-div';
    parentElement.classList.add('div');
    document.getElementById('dropbox').appendChild(parentElement);
    
    document.getElementById(divName).appendChild(trashButton);
    document.getElementById(divName).appendChild(newButton);
  }

  function handleFiles(event){ //adds file to sidebar
    const file = event.target.files[0];
    if (file) {
      var fileExtension = file.name.split('.').pop();
      if(localStorage.getItem(file.name) === null){ //file has unique name
        let validExtensions = ['txt', 'wav', 'json', 'csv', 'mp3', 'mid']; //arbitrary, can be expanded
        if (validExtensions.includes(fileExtension)) { 
          var contents;
          const reader = new FileReader();
          reader.onload = function(e) {
            contents = e.target.result;
          };
          
          reader.onerror = function(e) {
            console.error('Error reading file:', e);
          };

          if(fileExtension == 'txt' || fileExtension == 'csv' || fileExtension == 'json' ){
            reader.readAsText(file); //keep original contents
          } else if(fileExtension == 'wav' || fileExtension == 'mp3'|| fileExtension == 'mid'){ //store as base64
            reader.readAsDataURL(file);
          }
          reader.onload = function () {
              contents = (reader.result);
            try{
              localStorage.setItem(file.name, contents);
              addFileAsButton(file.name, contents);
            }catch(err){
              if(err.name === "QuotaExceededError"){
                printErrorToCodeMirror("File exceeds size limits.");
              }
            }
          };
        }
        else{
          printErrorToCodeMirror("File name must end with: "+validExtensions.join(" "));
        }
      }
      else{
        printErrorToCodeMirror("The file "+file.name+" already exists in localStorage.");
      }
    } else{
      printErrorToCodeMirror("Error uploading file."); 
    }
    
  }
  

  //drag + drop functionality
  let dropbox = document.getElementById("dropbox");
  dropbox?.addEventListener('dragover', function(e) {
    e.preventDefault();
    e.stopPropagation();
    dropbox.classList.add('dragging');
  });
  dropbox?.addEventListener('dragleave', function(e) {
    e.preventDefault();
    e.stopPropagation();
    dropbox.classList.remove('dragging');
  });
  dropbox?.addEventListener("dragenter", function(e){
    e.stopPropagation();
    e.preventDefault();
  });
  dropbox?.addEventListener("drop", function(e) {
    e.stopPropagation();
    e.preventDefault();
    const dt = e.dataTransfer;
    const files = dt.files;
    dropbox.classList.remove('dragging');
    handleFiles({ target: { files: files } });
  });

  //load all files from localstorage on page load
  document.addEventListener('DOMContentLoaded', function(e){
    for(let i = 0; i < localStorage.length; i++) {
      addFileAsButton(localStorage.key(i), localStorage.getItem(localStorage.key(i)));
    }
  })
  
  window.addEventListener('DOMContentLoaded', function () {
    window.addEventListener('message', function (event) {
        if (event.data.message === 'run-codemirror') {
          runCode();
        }
    });
  });
}

setUpCodeMirror();
