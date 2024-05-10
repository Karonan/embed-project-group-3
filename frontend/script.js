/*
height
autoButton
autoStatus
pumpButton
pumpStatus
*/

//document.getElementById("height").innerHTML = 9;

document.getElementById("autoButton").addEventListener("click", function(){
    var status = document.getElementById("autoStatus").innerHTML
    if (status === "On"){
        document.getElementById("autoStatus").innerHTML = "Off"
    }
    else {
        document.getElementById("autoStatus").innerHTML = "On"
    }
});
document.getElementById("pumpButton").addEventListener("click", function(){
    var status = document.getElementById("pumpStatus").innerHTML
    if (status === "On"){
        document.getElementById("pumpStatus").innerHTML = "Off"
    }
    else {
        document.getElementById("pumpStatus").innerHTML = "On"
    }
});

function initWebsite(){
    //Get JSON
    //document.getElementById("height").innerHTML = !
    //document.getElementById("autoStatus").innerHTML = !
    //document.getElementById("pumpStatus").innerHTML = !
    
}
//SetUP the current status
