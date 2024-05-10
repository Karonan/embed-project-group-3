const BACKEND_URL = "http://localhost:3222";

export async function getStatus(){
    const response = await fetch(`${BACKEND_URL}/status`)
    if (response.ok) {
        const data = await response.json();
        // console.log(data);
        return data;
    } else {
        alert("Error fetching status");
    }
}

export async function togglePump(){
    await fetch(`${BACKEND_URL}/toggle`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }
      })
}

export async function setMode(){
    await fetch(`${BACKEND_URL}/setMode`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        }
    })
}