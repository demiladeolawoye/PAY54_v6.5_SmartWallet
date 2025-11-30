// PAY54 v6.5 — Signup Handler

document.getElementById("signupForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("fullName").value.trim();
    const id = document.getElementById("identifier").value.trim();
    const pin1 = document.getElementById("pin").value.trim();
    const pin2 = document.getElementById("pin2").value.trim();

    if (pin1.length !== 4 || pin2.length !== 4) {
        alert("PIN must be exactly 4 digits.");
        return;
    }

    if (pin1 !== pin2) {
        alert("PINs do not match.");
        return;
    }

    const user = {
        name: name,
        id: id,
        pin: pin1
    };

    localStorage.setItem("pay54_user", JSON.stringify(user));

    alert("Account created successfully! Please sign in.");
    window.location.href = "index.html";
});
