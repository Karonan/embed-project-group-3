/*
height
autoButton
autoStatus
pumpButton
pumpStatus
*/


var payload = {pumpMode:-1,waterHeight:0,pumpStatus:-1,waterThreshold:0};
const BACKEND_URL = "http://35.187.230.199:3222/api"

async function getStatus(){
    const response = await fetch(`${BACKEND_URL}/status`)
    if (response.ok) {
        const data = await response.json();
        console.log(data)
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

async function setThreshold(threshold){
    const waterLevel = {
        level: parseInt(threshold)
    }
    await fetch(`${BACKEND_URL}/postLevel`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(waterLevel),
      })
}

const pumpButton =  document.getElementById("pumpButton")
const autoStatus = document.getElementById("autoStatus")
const thresholdButton = document.getElementById("thresholdButton")
const thresholdInput = document.querySelector("#thresholdInput")

function setHeight(input){
    let n = parseFloat(8.5 - input/10)
    n = n.toPrecision(2)
    document.getElementById("height").innerHTML = n
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

function floatToString(input){
    let n = parseFloat(input)/10
    n = n.toPrecision(2)
    return n.toString()
}

// thresholdButton.addEventListener("click", async function(){
//     var input = parseFloat(thresholdInput.value)
//     input = input.toPrecision(2)
//     input *= 10
//     input = 85 - input
//     if(input < 0) input = 0
//     await setThreshold(input)
//     thresholdInput.value = ''
// })

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

var slider = document.getElementById("myRange");
var output = document.getElementById("stText");

// Update the current slider value (each time you drag the slider handle)
slider.oninput = function() {
    output.innerHTML = "Set water height threshold : "+floatToString(this.value)+" cm";
}


var isDragging = false;

slider.addEventListener('mousedown', function(event) {
    isDragging = true;
});

slider.addEventListener('mouseup', function(event) {
    if (isDragging) {
        isDragging = false;
        var input = parseFloat(slider.value)/10
        input = input.toPrecision(2)
        input *= 10
        input = 85 - input
        // if(input < 0) input = 0
        setThreshold(input)
    }
});


async function initPage(){
    await updatePage();
    let n = parseFloat(8.5 - payload.waterThreshold/10)
    n = n.toPrecision(2)
    output.innerHTML = "Set water height threshold : "+n.toString()+" cm";
    slider.value = (85-payload.waterThreshold).toString()
}

async function updatePage(){
    await getStatus();
    // console.log(payload)
    setHeight(payload.waterHeight)
    setPumpStatus(payload.pumpStatus)
    setAutoStatus(payload.pumpMode)
}

//Program Setup
//setHeight(0)
initPage()
//Program Loop

setInterval(updatePage, 500)