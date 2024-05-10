/*
height
autoButton
autoStatus
pumpButton
pumpStatus
*/

import getStatus from "./api";
var payload = {pumpMode:-1,waterHeight:0,pumpStatus:-1};

function checkInput(input){
    if (input == -1){
        return "Off"
    }
    else return "On"
}

function setHeight(input){
    document.getElementById("height").innerHTML = input
}

function setAutoStatus(input){
    if (input ==="On"){
        document.getElementById("autoStatus").innerHTML = "On"
        document.getElementById("pumpButton").disabled = true;
        payload.pumpMode = 1;
    }
    else {
        document.getElementById("autoStatus").innerHTML = "Off"
        document.getElementById("pumpButton").disabled = false;
        payload.pumpMode = -1;
    }
    //Send data to server
}

function setPumpStatus(input){
    if (input ==="On"){
        document.getElementById("pumpStatus").innerHTML = "On"
        payload.pumpStatus = 1;
    }
    else {
        document.getElementById("pumpStatus").innerHTML = "Off"
        payload.pumpStatus = -1;
    }
    //Send data to server
}

document.getElementById("autoButton").addEventListener("click", function(){
    var status =  checkInput(payload.pumpMode)
    if (status === "On"){
        setAutoStatus("Off")
    }
    else {
        setAutoStatus("On")
        
    }
});
document.getElementById("pumpButton").addEventListener("click", function(){
    var status = checkInput(payload.pumpStatus)
    if (status === "On"){
        setPumpStatus("Off")
    }
    else {
        setPumpStatus("On")
    }
});

async function getJSON(){
    payload = getStatus();
}

function initPage(){
    updatePage();
    setAutoStatus(checkInput(payload.pumpMode))
}

function updatePage(){
    setHeight(payload.waterHeight)
    setPumpStatus(checkInput(payload.pumpStatus))
}

//Program Setup
getJSON();
//setHeight(0)
initPage()
//Program Loop
