var postGrid = document.getElementById(`postgrid`);
var zoomValue = 8;
var zoomMinValue = 2, zoomMaxValue = 8;
var gridScale = 1;
function setPostDragAndDrop(postContainerElement) {
    var state = false; 
    postContainerElement.addEventListener("mousedown",(event)=>{
        state = true;
    });
    window.addEventListener("mousemove",(event)=>{
        if (event.buttons==1 && state) {
            postContainerElement.style.left =`${parseFloat(postContainerElement.style.left)+event.movementX*10/zoomValue}px`;
            postContainerElement.style.top =`${parseFloat(postContainerElement.style.top)+event.movementY*10/zoomValue}px`;
        }
    });
    window.addEventListener("mouseup",()=>{
        state = false; 
        let postLeft = Math.round(parseFloat(postContainerElement.style.left));
        let postTop = Math.round(parseFloat(postContainerElement.style.top));
        postContainerElement.style.left =`${postLeft}px`;
        postContainerElement.style.top =`${postTop}px`;
    });
}
function setPostViewDetail(postContainerElement, post) {
    let dim = document.createElement(`div`);
    let dimContainer = document.createElement(`div`);
    let imgElement;
    if(post.img != undefined){
        imgElement = 
    `<div style="text-align: center;">
        <div class="post-img-container">
            <img class="post-img" src="${post.img}" draggable="false">
        </div>
    </div>`
    }else{
        imgElement = "";
    }
    dimContainer.appendChild(dim);
    dim.innerHTML = `<div onclick="this.parentElement.parentElement.remove();"></div>`
    dim.children[0].classList.add("dim");
    dimContainer.innerHTML += `
    <div class="flex-container flex-row" style="position: absolute; width: 52rem; justify-content: space-around; top: 3rem; left: 50%; transform: translate(-50%,0);">
        <div style="position: relative;">
            <div class="post flex-container flex-column box-edge" style="background-color: whitesmoke;">
                <div class="post-content flex-container flex-row" style="flex-wrap: wrap;">
                    ${imgElement}
                    <div>
                        <div class="post-title">${post.title}</div>
                        <div style="font-size: 0.8rem; padding: 2%;">
                            Deadline : <span class="post-due">${post.due}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div style="width: 30rem;">
            <button onclick="">REVISE</button>
            <div class="post-detail-container">
                <div>
                    <div class="post-detail box-edge">
                        <div style="font-weight: bold; font-size: 1.2rem;">
                            Detail
                        </div>
                        <div style="min-height: 4rem;">${post.details[0]}</div>
                        <div style="font-size: 0.8rem; padding: 2%;">${post.cTimes[0]};</div>
                    </div>
                </div>
            </div>
        </div>
    </div>`
    postContainerElement.addEventListener(`click`,()=>{
        document.body.appendChild(dimContainer);
    });
}
function setPostOnGrid(post) {
    let postContainerElement = document.createElement("div");
    postContainerElement.style.position = "absolute";
    postContainerElement.style.top = "0px";
    postContainerElement.style.left = "0px";
    let imgElement;
    if(post.img != undefined){
        imgElement = 
    `<div style="text-align: center;">
        <div class="post-img-container">
            <img class="post-img" src="${post.img}" draggable="false">
        </div>
    </div>`
    }else{
        imgElement = "";
    }
    postContainerElement.innerHTML =`
    <div class="post flex-container flex-column box-edge" style="background-color: whitesmoke;">
        <div class="post-content flex-container flex-row" style="flex-wrap: wrap;">
            ${imgElement}
            <div>
                <div class="post-title">${post.title}</div>
                <div style="font-size: 0.8rem; padding: 2%;">
                    Deadline : <span class="post-due">${post.due}</span>
                </div>
            </div>
        </div>
    </div>`
    setPostDragAndDrop(postContainerElement);
    setPostViewDetail(postContainerElement, post);
    postGrid.appendChild(postContainerElement);
}

postGrid.parentElement.addEventListener("mousemove",(event)=>{
    if(event.buttons == 4){
        postGrid.style.left =`${parseFloat(postGrid.style.left)+event.movementX}px`;
        postGrid.style.top =`${parseFloat(postGrid.style.top)+event.movementY}px`;
    }
});

var hideDeatil = false;
var isMinMaxEnter = false;
postGrid.parentElement.addEventListener("wheel",(event)=>{
    zoomValue += event.deltaY > 0 ? -1:1;
    if (zoomValue > zoomMaxValue) { zoomValue = zoomMaxValue; }
    else if (zoomValue < zoomMinValue) { zoomValue = zoomMinValue; }

    if ((zoomMinValue < zoomValue && zoomValue < zoomMaxValue ) || isMinMaxEnter) {

        postGrid.style.transform = `scale(${zoomValue/10})`;  

        let zoomInOut = event.deltaY > 0 ? -1:1;
        let centerRect = postGrid. parentElement.getBoundingClientRect();

        let offsetX = (parseFloat(postGrid.style.left) - centerRect.width/2 )/(zoomValue-zoomInOut);
        let offsetY = (parseFloat(postGrid.style.top)  - centerRect.height/2 )/(zoomValue-zoomInOut);

        postGrid.style.left = `${parseFloat(postGrid.style.left) +offsetX*zoomInOut}px`;
        postGrid.style.top = `${parseFloat(postGrid.style.top) +offsetY*zoomInOut}px`;
    }
    
    if (zoomMinValue < zoomValue && zoomValue < zoomMaxValue ) {
        isMinMaxEnter= true;
    }else{
        isMinMaxEnter= false;
    }
});


postGrid.style.transform = `scale(${zoomValue/10})`; 