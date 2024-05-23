/*
height
autoButton
autoStatus
pumpButton
pumpStatus
*/


var payload = {pumpMode:-1,waterHeight:0,pumpStatus:-1};
const BACKEND_URL = "http://35.187.230.199:3222/api"

async function getStatus(){
    const response = await fetch(`${BACKEND_URL}/status`)
    if (response.ok) {
        const data = await response.json();
        payload = data;
    } else {
        alert("Error fetching status");
    }
}

async function togglePump(){
    await fetch(`${BACKEND_URL}/toggle`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }
      })
}

async function toggleMode(){
    await fetch(`${BACKEND_URL}/setMode`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }
    })
}

const pumpButton =  document.getElementById("pumpButton")
const autoStatus = document.getElementById("autoStatus")

function setHeight(input){
    document.getElementById("height").innerHTML = input
}


async function setAutoStatus(input){
    if (input == -1){
        autoStatus.innerHTML = "On"
        autoStatus.style.color = "green"
        pumpButton.disabled = true;
        pumpButton.addEventListener('mouseenter', function() {
            pumpButton.style.backgroundColor = '#ffffff';
            pumpButton.style.cursor = "default"
        })
    }
    else {
        autoStatus.innerHTML = "Off"
        autoStatus.style.color = "red"
        pumpButton.disabled = false;
        pumpButton.addEventListener('mouseenter', function() {
            pumpButton.style.backgroundColor = '#ababab';
            pumpButton.style.cursor = "pointer"
        })
        pumpButton.addEventListener('mouseleave', function() {
            pumpButton.style.backgroundColor = '#ffffff';
            pumpButton.style.cursor = "default"
        })
    }
    // payload.pumpMode *= -1;
    //
}

async function setPumpStatus(input){
    const pumpStatus = document.getElementById("pumpStatus")
    if (input == 1){
        pumpStatus.innerHTML = "On"
        pumpStatus.style.color = "green"
    }
    else {
        pumpStatus.innerHTML = "Off"
        pumpStatus.style.color = "red"
    }
    // payload.pumpStatus *= -1;
    //await togglePump()
}

document.getElementById("autoButton").addEventListener("click", async function(){
    var status =  payload.pumpMode
    if (status == 1){
        setAutoStatus(-1)
    }
    else {
        setAutoStatus(1)
        
    }
    await toggleMode()
});
document.getElementById("pumpButton").addEventListener("click", async function(){
    var status = payload.pumpStatus
    if (status == 1){
        setPumpStatus(-1)
    }
    else {
        setPumpStatus(1)
    }
    await togglePump()
});


async function initPage(){
    await updatePage();
    setAutoStatus(payload.pumpMode)
}

async function updatePage(){
    await getStatus();
    setHeight(payload.waterHeight)
    setPumpStatus(payload.pumpStatus)
    setAutoStatus(payload.pumpMode)
}

//Program Setup
//setHeight(0)
initPage()
//Program Loop

setInterval(updatePage, 500)