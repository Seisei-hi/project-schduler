
const fs = require('fs');
const path = require('path');
const {ipcRenderer} = require('electron');

function changeHTML(dir){
    ipcRenderer.send("change-loaded-HTML",dir);
}
