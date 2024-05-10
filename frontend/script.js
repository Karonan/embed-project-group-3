/*
height
autoButton
autoStatus
pumpButton
pumpStatus
*/


var payload = {pumpMode:-1,waterHeight:0,pumpStatus:-1};
const BACKEND_URL = "http://localhost:3222/api"

async function getStatus(){
    const response = await fetch(`${BACKEND_URL}/status`)
    if (response.ok) {
        const data = await response.json();
        console.log(data);
        payload = data;
        console.log(payload)
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

function setHeight(input){
    document.getElementById("height").innerHTML = input
}

async function setAutoStatus(input){
    if (input == -1){
        document.getElementById("autoStatus").innerHTML = "On"
        document.getElementById("pumpButton").disabled = true;
        
    }
    else {
        document.getElementById("autoStatus").innerHTML = "Off"
        document.getElementById("pumpButton").disabled = false;
        
    }
    // payload.pumpMode *= -1;
    //
}

async function setPumpStatus(input){
    if (input == 1){
        document.getElementById("pumpStatus").innerHTML = "On"
        
    }
    else {
        document.getElementById("pumpStatus").innerHTML = "Off"
        
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
    console.log(payload)
}

async function updatePage(){
    await getStatus();
    setHeight(payload.waterHeight)
    setPumpStatus(payload.pumpStatus)
}

//Program Setup
//setHeight(0)
await initPage()
//Program Loop

setInterval(updatePage, 500)
