// PAY54 v6.5 — LOGIN HANDLER
// ------------------------------------------

document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const id = document.getElementById("loginIdentifier").value.trim();
    const pin = document.getElementById("loginPin").value.trim();

    // Get stored user
    const user = JSON.parse(localStorage.getItem("pay54_user"));

    if (!user) {
        alert("No PAY54 account found. Please create one.");
        window.location.href = "signup.html";
        return;
    }

    // Validate login
    if (user.identifier === id && user.pin === pin) {

        // Save session
        localStorage.setItem("pay54_session", JSON.stringify({
            loggedIn: true,
            name: user.name,
            identifier: user.identifier
        }));

        window.location.href = "dashboard.html";

    } else {
        alert("Incorrect login details");
    }
});
