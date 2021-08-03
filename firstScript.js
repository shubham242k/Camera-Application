let videoPlayer = document.querySelector("video");
let body = document.querySelector("body");
let captureButton = document.querySelector("#capture-button");
let recordButton = document.querySelector("#record-button");
let galleryButton = document.querySelector("#gallery-button");
let zoomIn = document.querySelector(".zoom-in");
let zoomOut = document.querySelector(".zoom-out");
let zoomdisplay = document.querySelector(".zoom-display");
let mediaRecorder;
let chunks = [];
let isRecording = false;

//website <-----> browser Object Module <---------> Computer system
//hume user permission leni padegi for mic, camera access
//BOM ne hume kaafi object,function provide kr rkhe h
//navigator is object used to get permision from user through BOM
let promiseToUseMedia = navigator.mediaDevices.getUserMedia({
    video:true,
    audio:true
});
//getUserMedia will return promise 
promiseToUseMedia
    .then(screenDisplay)
    .catch(function(){
        console.log("user has denied access");
    });

function screenDisplay(mediaStream){
    videoPlayer.srcObject = mediaStream;

    //media
    mediaRecorder = new MediaRecorder(mediaStream);

    mediaRecorder.addEventListener("dataavailable",function(e){
        chunks.push(e.data);
    })

    mediaRecorder.addEventListener("stop",function(e){
        let blob = new Blob(chunks,{type : "video/mp4"});
        chunks = [];
        saveMedia(blob);
    })
}

//for video 
recordButton.addEventListener("click",function(e){
    
    if(mediaRecorder == undefined) return;
    curZoom = 1;
    videoPlayer.style.transform = `scale(${curZoom})`;
    let span = recordButton.querySelector("span");
    let prevFilter = document.querySelector(".filter-div");
    filter = "";
    if(prevFilter) prevFilter.remove();
    if(isRecording){
        span.classList.remove("record-animation");
        mediaRecorder.stop();
        // recordButton.innerText = "Record";
        isRecording = false;
    }else{
        mediaRecorder.start();
        span.classList.add("record-animation");
        // recordButton.innerText = "Stop";
        isRecording = true;
    }
});

//drawing image(any frame of video) to canvas and then downloading it
captureButton.addEventListener("click",function(){
    let canvas = document.createElement("canvas");
    //canvas size to media size
    captureButton.classList.add("capture-animation");

    setTimeout(function(){
        captureButton.classList.remove("capture-animation");
    },1000);
    canvas.width = videoPlayer.videoWidth;
    canvas.height = videoPlayer.videoHeight;
    let tool = canvas.getContext("2d");
    tool.translate(canvas.width / 2,canvas.height / 2);
    tool.scale(curZoom,curZoom);
    tool.translate(-canvas.width / 2,-canvas.height / 2);
    tool.drawImage(videoPlayer,0,0);

    if(filter!=""){
        tool.fillStyle = filter;
        tool.fillRect(0,0,canvas.width,canvas.height);
    }
    
    // body.append(canvas);
    let link = canvas.toDataURL();
    saveMedia(link);

})


let allFilters = body.querySelectorAll(".filter");
let filter = "";
for(let i = 0;i<allFilters.length;i++){
    allFilters[i].addEventListener("click",function(e){
        let prevFilter = document.querySelector(".filter-div");
        if(prevFilter) prevFilter.remove();

        let color = e.currentTarget.style.backgroundColor;
        filter = color;
        let div = document.createElement("div");
        div.classList.add("filter-div");
        div.style.backgroundColor = color;
        body.append(div);
    })
}

let curZoom = 1;

zoomIn.addEventListener("click",function(e){
    curZoom += 0.1;

    if(curZoom > 3) curZoom = 3;
    videoPlayer.style.transform = `scale(${curZoom})`;
})

zoomOut.addEventListener("click",function(e){
    curZoom -= 0.1;

    if(curZoom < 1) curZoom = 1;
    videoPlayer.style.transform = `scale(${curZoom})`;
})

galleryButton.addEventListener("click",function(e){
    location.assign("gallery.html");
    // viewMedia();
})