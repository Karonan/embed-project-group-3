(async function() {
    var payload = {pumpMode:-1, waterHeight:0, pumpStatus:-1};
    const BACKEND_URL = "http://34.87.92.87:3222/api";

    async function getStatus(){
        const response = await fetch(`${BACKEND_URL}/status`);
        if (response.ok) {
            const data = await response.json();
            payload = data;
            updatePage();
        } else {
            console.error("Error fetching status");
        }
    }

    async function togglePump(){
        await fetch(`${BACKEND_URL}/toggle`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        });
    }

    async function toggleMode(){
        await fetch(`${BACKEND_URL}/setMode`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        });
    }

    function setHeight(input){
        document.getElementById("height").innerHTML = input;
    }

    function setAutoStatus(input){
        document.getElementById("autoStatus").innerHTML = (input == -1) ? "On" : "Off";
        document.getElementById("pumpButton").disabled = (input == -1);
    }

    function setPumpStatus(input){
        document.getElementById("pumpStatus").innerHTML = (input == 1) ? "On" : "Off";
    }

    document.getElementById("autoButton").addEventListener("click", async function(){
        var status =  payload.pumpMode;
        setAutoStatus(status * -1);
        await toggleMode();
    });

    document.getElementById("pumpButton").addEventListener("click", async function(){
        var status = payload.pumpStatus;
        setPumpStatus(status * -1);
        await togglePump();
    });

    async function initPage(){
        await getStatus();
        setAutoStatus(payload.pumpMode);
        console.log(payload);
    }

    function updatePage(){
        setHeight(payload.waterHeight);
        setPumpStatus(payload.pumpStatus);
    }

    await initPage();
    setInterval(updatePage, 500);
})();
