let req = indexedDB.open("media",1);
let database;
let totalMedia = 0;
let galleryContainer = document.querySelector(".gallery-container");
req.addEventListener("success",function(e){
    database = req.result;
    console.log(database);
})

req.addEventListener("upgradeneeded",function(e){
    let db = req.result;
    db.createObjectStore("galleryMedia",{keyPath:"mId"});
})

req.addEventListener("error",function(e){
    
})

function saveMedia(media){
    if(!database)return;

    data = {
        mId : Date.now(),
        mediaData : media
    }

    let tsc  = database.transaction("galleryMedia","readwrite");

    let objectStore = tsc.objectStore("galleryMedia");
    objectStore.add(data);
}

function viewMedia(){
    if(!database) return;

    let tsc  = database.transaction("galleryMedia","readonly");

    let objectStore = tsc.objectStore("galleryMedia");

    let request = objectStore.openCursor();
//    console.log(request);
    request.addEventListener("success",function(){
        let cursor = request.result;
        
        if(cursor){
            
            totalMedia++;
            let mediaCard = document.createElement("div");

            mediaCard.classList.add("media-card");

            mediaCard.innerHTML = `<div class="main-container"></div>
            <div class="media-buttons">
                <button class="downloader">Download</button>
                <button mid = "${cursor.value.mId}" class="delete">Delete</button>
            </div>`;

            let data = cursor.value.mediaData;
            let type = typeof data;
            let container = mediaCard.querySelector(".main-container");
            let downloader = mediaCard.querySelector(".downloader");
            let deleteButton = mediaCard.querySelector(".delete");

            deleteButton.addEventListener("click",function(e){
                deleteMedia(Number(e.currentTarget.getAttribute("mid")));
                deleteButton.parentElement.parentElement.remove();
            })
            if(type == "string"){
                let image = document.createElement("img");
                image.src = data;
                downloader.addEventListener("click",function(){
                    downloadMedia(data,"image.png")
                })
                container.append(image);
            }else if(type == "object"){
                let video = document.createElement("video");
                
                video.src = URL.createObjectURL(data);
                container.append(video);
                video.autoplay = true
                video.loop = true
                video.muted = true

                downloader.addEventListener("click",function(){
                    downloadMedia(URL.createObjectURL(data),"video.mp4");
                })
            }
            galleryContainer.append(mediaCard);
            cursor.continue();
        }else{
            if(totalMedia == 0){
                galleryContainer.innerText = "NO MEDIA PRESENT";
            }
        }
    })
}

function downloadMedia(url,type){
    let anch = document.createElement("a");

    anch.href = url;
    anch.download = type;
    anch.click();
}

function deleteMedia(mid){
    let tsc  = database.transaction("galleryMedia","readwrite");
    let objectStore = tsc.objectStore("galleryMedia");
    objectStore.delete(mid);

}