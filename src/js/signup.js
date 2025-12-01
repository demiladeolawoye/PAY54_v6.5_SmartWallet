// PAY54 v6.5 — SIGNUP HANDLER
// ------------------------------------------

document.getElementById("signupForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const name     = document.getElementById("signupName").value.trim();
    const id       = document.getElementById("signupId").value.trim();
    const pin1     = document.getElementById("signupPin").value.trim();
    const pin2     = document.getElementById("signupPin2").value.trim();

    // Validate PIN
    if (pin1 !== pin2) {
        alert("PINs do not match.");
        return;
    }

    if (pin1.length !== 4) {
        alert("PIN must be 4 digits.");
        return;
    }

    // Simulate OTP
    const otp = Math.floor(100000 + Math.random() * 900000);
    localStorage.setItem("pay54_otp", otp);

    alert("Your PAY54 verification code is: " + otp);

    const user = {
        name: name,
        identifier: id,
        pin: pin1
    };

    // Store user
    localStorage.setItem("pay54_user", JSON.stringify(user));

    // Redirect to OTP page
    window.location.href = "verify.html";
});
