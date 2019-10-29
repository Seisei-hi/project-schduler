
var cardContainer = document.getElementById(`card-container`);
var cardPathElement = document.getElementById(`card-dir`);
var thisCardPath = "main";
var sortPaths = [];

var lastSerialNumber = fs.readFileSync(`card_info/count.txt`,`UTF-8`);
function countSerial(){
    lastSerialNumber++;
    fs.writeFileSync(`card_info/count.txt`,lastSerialNumber);
    return lastSerialNumber;
}
function readTime(serialNumber, locale = undefined){
    let timeFile = fs.readFileSync(`card_info/time.txt`,"utf-8");
    let serialIndex = timeFile.indexOf(`[${serialNumber}]`);
    let time="[";
    if(serialIndex == -1){
        return "";
    }
    for (let i = serialIndex+1; i < timeFile.length; i++) {
        if (timeFile[i] == "[") {
            break;
        }
        time += timeFile[i];
    }
    if (locale != undefined) {
        return time.split("]")[1]*1;
    }
    return new Date(time.split("]")[1]*1).toLocaleDateString();
}
function writeTime(date, serialNumber){
    let timeFile = fs.readFileSync(`card_info/time.txt`,"utf-8");
    let serialIndex = timeFile.indexOf(`[${serialNumber}]`);
    if(serialIndex == -1){
        fs.appendFileSync(`card_info/time.txt`,`[${serialNumber}]${date}`)
    }
    else{
        let oldTime="[";
        for (let i = serialIndex+1; i < timeFile.length; i++) {
            if (timeFile[i] == "[") {
                break;
            }
            oldTime += timeFile[i];
        }
    timeFile.replace(oldTime,`[${serialNumber}]${date}`)
    fs.writeFile(`card_info/time.txt`,timeFile);
    }
}
///////////////
///////////////
function addCardLayout(){
    let card = document.createElement(`div`);
    card.className="card box-edge";
    card.style.order = 100;
    card.innerHTML +=`
        <div class="card-label"></div>
        <div class="card-text" contenteditable="true" placeholder="Text here"></div>
        <div class="card-time" contenteditable="true" placeholder="y-m-d"></div>
        <div class="card-detail"></div>
        <div class="card-button">
            <button onclick="addCard(this.parentElement.parentElement);">
                Apply
            </button>
            <button onclick="this.parentElement.parentElement.parentElement.removeChild(this.parentElement.parentElement)">
                Cancle
            </button>
        </div>`;
    cardContainer.appendChild(card);
}
function addCard(oldCard){
    let text = oldCard.children[1].innerText;
    fs.writeFileSync(`${thisCardPath}/${countSerial()}.txt`,text);
    let time = oldCard.children[2].innerText;
    if (time != "") {
        time = time.split("-");
        if(time.length != 3){
            throw "y-m-d";
        }   
        writeTime(new Date(time[0],time[1]-1,time[2]).getTime(), lastSerialNumber);
    }
    
    let newCard = document.createElement(`div`);
    newCard.id = lastSerialNumber;
    newCard.className="card box-edge";
    newCard.innerHTML +=`
        <div class="card-label"></div>
        <div class="card-text">${text}</div>
        <div class="card-time">${readTime(lastSerialNumber)}</div>
        <div class="card-detail"></div>
        <div class="card-button">
            <button onclick="makeCardDetail(thisCardPath+'/'+this.parentElement.parentElement.id)">
                + Deatil
            </button>
        </div>`;
    fs.appendFileSync(thisCardPath+"/order.txt",lastSerialNumber+"-");
    cardContainer.insertBefore(newCard, oldCard);
    cardContainer.removeChild(oldCard);   
    sortOrder(thisCardPath+"/order.txt");
}
function makeCardDetail(cardPath){
    let cardSerial = cardPath.substring(cardPath.lastIndexOf("/")+1,cardPath.length);
    fs.mkdirSync(cardPath);
    fs.renameSync(`${cardPath}.txt`,`${cardPath}/${cardSerial}.txt`);
    fs.writeFileSync(`${cardPath}/order.txt`,cardSerial);
    loadCardDetail(cardPath);
}
function loadCardDetail(cardPath = "main", quit = false){
    thisCardPath = cardPath;
    let cardSerial;
    if (cardPath == "main") {
        cardSerial = "";
    } else {
        cardSerial = cardPath.substring(cardPath.lastIndexOf("/")+1,cardPath.length);
    }
    cardContainer.innerHTML ="";    

    if(cardSerial != "" && !quit){
        let text = fs.readFileSync(cardPath+"/"+cardSerial+".txt","utf-8");
        cardPathElement.innerHTML += `<button> > ${text.length <= 10 ? text : text.substring(0,7)+"..."}</button>`
    }
    console.log(cardPath);
    let filenames;
    filenames = fs.readdirSync(cardPath);
    for (let i = 0; i < filenames.length; i++) {
        if(filenames[i] == "order.txt"){
            sortPaths.push(cardPath +"/order.txt");
        }
        else if(cardSerial+".txt" != filenames[i]){
            cardContainer.appendChild(makeCardElement(cardPath+"/"+filenames[i]));
        }
    }
    for (let i = 0; i < sortPaths.length; i++) {
        sortOrder(sortPaths[i]);
    }
    sortPaths =[];
}
function makeTextCardElement(cardPath){
    let isDir = fs.lstatSync(cardPath).isDirectory();
    let filename = cardPath.split("/");
    filename = filename[filename.length-1];
    let text = fs.readFileSync(`${isDir ? cardPath +"/"+ filename +".txt": cardPath}`,"utf-8");

    let card = document.createElement(`div`);
    card.id = isDir ? filename : filename.substring(0,filename.lastIndexOf("."));
    card.className=`card box-edge`;
        card.innerHTML +=
        `<div class="card-label"></div>
        <div class="card-text">${text}</div>
        <div class="card-time">${readTime(card.id)}</div>`;
    return card;
}
function makeCardElement(cardPath){
    let isDir = fs.lstatSync(cardPath).isDirectory();
    let filename = cardPath.split("/");
    filename = filename[filename.length-1];
    let text = fs.readFileSync(`${isDir ? cardPath +"/"+ filename +".txt": cardPath}`,"utf-8");
    
    let card = document.createElement(`div`);
    card.id = isDir ? filename : filename.substring(0,filename.lastIndexOf("."));
    card.className=`card box-edge moveable`;
        card.innerHTML +=`
        <div class="card-label"></div>
        <div class="card-text ${isDir ? "dir":""}">${text}</div>
        <div class="card-time">${readTime(card.id)}</div>
        <div class="card-detail"></div>
        <div class="card-button">
            <button onclick="${isDir ? "load":"make"}CardDetail(thisCardPath+'/'+this.parentElement.parentElement.id)">
                ${isDir ? "show Detail":"+ Detail"}
            </button>
        </div>`;
    setCardDragAndDrop(card);
    if(isDir){
        let detail = card.children[3];
        let childFilenames = fs.readdirSync(cardPath);
        for (let i = 0; i < childFilenames.length; i++) {
            if(childFilenames[i] == "order.txt"){
                sortPaths.push(cardPath +"/order.txt");
            }
            else if (filename+".txt" != childFilenames[i]) {
                detail.appendChild(makeTextCardElement(cardPath +"/"+childFilenames[i]));
            }
        }
    }
    return card;
}
function quitDetail(){
    if(thisCardPath == "main"){
        //changeHTML("index.html");
    }
    let filename = thisCardPath.split("/");
    filename = filename[filename.length-1];

    let childFiles = fs.readdirSync(thisCardPath);
    if (childFiles.length <= 2) {
        fs.renameSync(`${thisCardPath}/${filename}.txt`,thisCardPath+".txt");
        deleteFolderRecursive(thisCardPath);
    }
    thisCardPath = thisCardPath.substring(0,thisCardPath.lastIndexOf("/"));
    cardPathElement.removeChild(cardPathElement.lastElementChild);
    loadCardDetail(thisCardPath , true);
}
function sortOrder(cardPath){
    let order = fs.readFileSync(cardPath,"utf-8").split("-");
    if (order.length != 1){
        for (let i = 0; i < order.length-1; i++) {
            document.getElementById(order[i]).style.order = i+1;
        }
    }
}

function setCardDragAndDrop(card) {
    var state = false; 
    card.addEventListener("mousedown",(event)=>{
        if ((event.buttons%2 == 1) && !state) {
            state = true; 
        }
    });
    window.addEventListener("mousemove",(event)=>{
        if (state) {
            card.style.left =`${parseFloat(card.style.left)+event.movementX}px`;
            card.style.top =`${parseFloat(card.style.top)+event.movementY}px`;   
        }
    });
    window.addEventListener("mouseup",(event)=>{
        if ((event.buttons%2 == 0) && state) {
            state = false; 
            let cardLeft = Math.round(parseFloat(card.style.left));
            let cardTop = Math.round(parseFloat(card.style.top));
            card.style.left =`${cardLeft}px`;
            card.style.top =`${cardTop}px`;
        }
    });
}

var start = false;
function setAllCardDraggable(){
    if (thisCardPath != "main") {
        let cards = document.getElementsByClassName("moveable");
        start = !start;
        if (start) {
            for (let i = 0; i < cards.length; i++) {
                cards[i].style.left ="0px";
                cards[i].style.top ="0px";
            }
        }
        else
        {
            let xPos2Id = {}
            let xPoses =[];
            for (let i = 0; i < cards.length; i++) {
                xPoses[i] = cards[i].getBoundingClientRect().left;
                xPos2Id[xPoses[i]+""] = cards[i].id;
            }
            xPoses.sort(function(a, b){return a - b});
            let text = "";
            for (let i = 0; i < xPoses.length; i++) {
                text += xPos2Id[xPoses[i]+''];
                text += "-";
            }
            fs.writeFileSync(thisCardPath+"/order.txt",text);
            for (let i = 0; i < cards.length; i++) {
                cards[i].style.left ="";
                cards[i].style.top ="";
            }
            sortOrder(thisCardPath+"/order.txt");
        }
    }
}
function deleteFolderRecursive(dirPath){
  if (fs.existsSync(dirPath)) {
    fs.readdirSync(dirPath).forEach((file, index) => {
      const curPath = path.join(dirPath, file);
      if (fs.lstatSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(dirPath);
  }
};
loadCardDetail();