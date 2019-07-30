const video = document.getElementById("video");
var value;
var w = window.innerWidth;
let canvas="";
isDraw=true;
var starCount=0;
function calls() {
  Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri("/face-detection/lib/face-api/models"),
    faceapi.nets.faceLandmark68Net.loadFromUri("/face-detection/lib/face-api/models"),
    faceapi.nets.faceRecognitionNet.loadFromUri("/face-detection/lib/face-api/models"),
    faceapi.nets.faceExpressionNet.loadFromUri("/face-detection/lib/face-api/models")
  ]).then(startVideo());
}

function startVideo() {
  navigator.getUserMedia(
    { video: {} },
    stream => (
      (video.srcObject = stream), setTimeout(() => this.createCanvas(), 1000)
    ),
    err => console.error(err)
  );
}

function createCanvas() {
    canvas = faceapi.createCanvasFromMedia(video);
  const displaySize = { width: video.width, height: video.height };
  document.body.append(canvas);
  
  faceapi.matchDimensions(canvas, displaySize);
  setInterval(async () => {
    const detections = await faceapi
      .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceExpressions();
    const resizedDetections = faceapi.resizeResults(detections, displaySize);
    canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
    faceapi.draw.drawDetections(canvas, resizedDetections);
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
    faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
    isDraw=true;
    if(detections[0]) {
      value = detections[0].expressions;

      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.executeScript(
          tabs[0].id,
          {code: `boxcount=document.querySelectorAll('[data-type=control_rating]')[0]
          .querySelector('div')
          .querySelector('div')
          .querySelectorAll('div').length-1;
           boxcount
          `
          }, function (results) {
             starCount = results[0];
            const score = this.getScoreForEmotion(detections[0].expressions, results[0]);
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
              chrome.tabs.executeScript(
                tabs[0].id,
                {code: `document.querySelectorAll('[data-type=control_rating]')[0]
                        .querySelector('div')
                        .querySelector('div')
                        .querySelectorAll('div')
                        .forEach(function(item,index){
                          var str = JSON.stringify(item.style.backgroundImage).slice(36)                 
                            str = str.substring(0,str.length-4)
                          if(index < ${score} && index <${starCount} ){      
                            item.classList.add("rated");
                            item.setAttribute("style", "height: 16px; width: 16px; margin: 0.5px; float: left; background-image: url('https://cdn.jotfor.ms/images/"+str+"'); background-position: -32px 0px;");
                          } else if(index >= ${score} && index <${starCount}){
                            item.classList.remove("rated");
                            item.setAttribute("style", "height: 16px; width: 16px; margin: 0.5px; float: left; background-image: url('https://cdn.jotfor.ms/images/"+str+"'); background-position: 0px 0px;");
                          }
                          else if (index === ${starCount}){
                            item.setAttribute("class","");
                            item.setAttribute("style","height: 16px; width: 16px; margin: 0.5px; float: left; color: rgb(153, 153, 153); font-size: 12px; text-align: center; background-position: 0px 0px;")
                          }
                        });
                        `
                });
            });
            });
      });
      console.log(starCount)
      this.drawBar(
        this.getScoreForEmotion(detections[0].expressions, starCount)
        
      );
    }
  }, 1000);
  
}

document.getElementById("buttonstart").addEventListener("click", () => {
  this.calls();
});

$(document).ready(function() {
  $(".loader").fadeOut(1500, function() {
    $("#buttonstart").show(1000);
    $("#loading").hide();
  });
});

$(document).ready(function() {
  $("#buttonstart").click(function() {
    $("#buttonstart").fadeOut("slowly");
    $("#dvideo").show(1000);
    $("#output").show(1000);
    $("#buttonhide").fadeIn(2000);
  });
});

function stopStreamedVideo(videoElem) {
  let stream = videoElem.srcObject;
  let tracks = stream.getTracks();

  tracks.forEach(function(track) {
    track.stop();
  });

  videoElem.srcObject = null;
}

$("#buttonhide").click(function() {
  isDraw=false;
  $("#buttonstart").show();
  stopStreamedVideo(video);
  $("#buttonhide").hide();
  $("#output").hide();
  if(!isDraw)
  {
    const context = canvas.getContext('2d');

context.clearRect(0, 0, canvas.width, canvas.height);
  }
});


drawBar = score => {
  var test = score / starCount;
console.log(test)
    if (test >= 0 && test <= 0.124) {
    
      $("#output").text("Too bad " + value[this.getCurrentEmotion(value)].toFixed(2));
    } else if (test >= 0.125 && test <= 0.300) {
     
      $("#output").text("Bad " + value[this.getCurrentEmotion(value)].toFixed(2));
    } else if (test >= 0.301 && test <= 0.624) {
     
      $("#output").text("Neutral ");
    } else if (test >= 0.625 && test <= 0.874) {
     
      $("#output").text("Happy " + value[this.getCurrentEmotion(value)].toFixed(2));
    } else {
      
      $("#output").text("Very Happy " + value[this.getCurrentEmotion(value)].toFixed(2));
    }
  
};
