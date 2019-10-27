
function imagePreview(inputFile) {
    var reader = new FileReader();
    reader.readAsDataURL(inputFile.files[0]);
    reader.onload = function (event) {
        document.getElementById('preview-img').src = event.target.result;
    }
}
function limitNumber(comparison, min, max) {
    if (comparison != '') {
        if (comparison > max) { return max; }
        if (comparison < min) { return min; }
    }
    return comparison;
}
function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}
function calcAngle(x = 0, y = 0){
    return Math.atan2( x, y ) * (180/Math.PI);
}
function normalize(x,y) {
    if(x == 0 && y == 0) {
        return {x:0, y:0};
    }    
    let angle = Math.atan2(y,x);
    let nx = Math.cos(angle);
    let ny = Math.sin(angle);
    return {x:nx, y:ny};
}
function sendFormData() {
    var xhr = new XMLHttpRequest();
    var fileReader = new FileReader();
    var post = new Post();
    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            let json = JSON.parse(xhr.response);
            postGrid.innerHTML += 
            `<div class="post-container" style="position: absolute; top: 0rem; left: 0rem;">
                <div class="post flex-container flex-column">
                    <div class="post-content flex-container flex-row" style="flex-wrap: wrap;">
                        <div style="text-align: center;">
                            <div class="post-img-container">
                                <img class="post-img" draggable="false" src="${json.img}">
                            </div>
                        </div>
                        <div class="box-edge" style="background-color: whitesmoke;">
                            <div class="post-title">${json.title}</div>
                            <div class="post-due"></div>
                        </div>
                    </div>
                </div>
            </div>`;
            setPost(postGrid.lastElementChild, json);
        }
    }
    fileReader.onload = function (event) {
        post.img = fileReader.result;
        xhr.send(`${JSON.stringify(post)}`);
    }
    xhr.open("POST", "/post/upload", true);
        
    post.title = document.getElementById(`title-input`).innerText;
    
    let blankPattern = /^\s+|\s+$/g;
    if((post.title == '' || 
    post.title == null || 
    post.title.replace( blankPattern, '' ) == "" )||
    !document.getElementById(`due-input`).innerText){
        throw 0;
    }

    post.due = new Date(document.getElementById(`due-input`).innerText);
    let details = document.getElementsByClassName(`detail-input`);
    for (let i = 0; i < details.length; i++) {
        post.details[i] = new Detail();
        post.details[i].text = details[i].innerText;
        post.details[i].cTime = new Date();
    }

    if (document.getElementById("image-input").files[0]) {
        fileReader.readAsBinaryString(document.getElementById("image-input").files[0]);
    }
    else{
        xhr.send(`${JSON.stringify(post)}`);
    }
}
function writePostJson(){
    let fileReader = new FileReader();
    let post = new Post();
    
    let imgExtension;


    post.title = document.getElementById(`title-input`).innerText;
    post.due = new Date(document.getElementById(`due-input`).innerText);

    if((post.title == '' || 
    post.title == null || 
    post.title.replace(/^\s+|\s+$/g, '' ) == "" )||
    !post.due){throw 0;}

    post.title = document.getElementById(`title-input`).innerText;
    post.due = new Date(document.getElementById(`due-input`).innerText).toLocaleDateString();
    post.details[0] = document.getElementById(`detail-input`).innerText;
    post.cTimes[0] = new Date().toLocaleString();

    fileReader.onload = function (event) {
        post.img = `123.${imgExtension}`;
        fs.writeFileSync(post.img, event.target.result,"binary");
        fs.writeFileSync("123.json",JSON.stringify(post));
        setPostOnGrid(post);
    }
    if (document.getElementById("image-input").files[0]) {
        imgExtension = document.getElementById("image-input").files[0].name.split('.').pop().toLowerCase();
        fileReader.readAsBinaryString(document.getElementById("image-input").files[0]);
    }else{
        fs.writeFileSync("123.json",JSON.stringify(post));
        setPostOnGrid(post);
    }
}
class Post {
    title;
    due;
    img;
    details = [];
    cTimes = [];
}