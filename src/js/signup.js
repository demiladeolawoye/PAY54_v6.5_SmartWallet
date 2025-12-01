// PAY54 v6.5 — SIGNUP HANDLER

document.getElementById("signupForm").addEventListener("submit", function(e){
    e.preventDefault();

    const name = document.getElementById("signupName").value.trim();
    const id = document.getElementById("signupIdentifier").value.trim();
    const pin = document.getElementById("signupPin").value.trim();
    const pin2 = document.getElementById("signupPin2").value.trim();

    // Basic validation
    if(pin.length !== 4){
        alert("PIN must be exactly 4 digits.");
        return;
    }

    if(pin !== pin2){
        alert("PINs do not match.");
        return;
    }

    // Save user
    const user = {
        name,
        id,
        pin,
        createdAt: new Date().toISOString()
    };

    localStorage.setItem("pay54_user", JSON.stringify(user));

    alert("Account created successfully!");

    // Redirect to login
    window.location.href = "index.html";
});
