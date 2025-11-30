// PAY54 v6.5 Login Handler

document.getElementById("loginForm").addEventListener("submit", function(e){
    e.preventDefault();

    const id = document.getElementById("loginIdentifier").value.trim().toLowerCase();
    const pin = document.getElementById("loginPin").value.trim();

    // Retrieve stored PAY54 user
    const user = JSON.parse(localStorage.getItem("pay54_user"));

    // No account created yet
    if(!user){
        alert("No PAY54 account found. Please create one.");
        window.location.href = "signup.html";
        return;
    }

    // Validate email/phone + PIN
    if(user.id === id && user.pin === pin){
        alert("Login successful ✔");
        window.location.href = "dashboard.html";
    } else {
        alert("Incorrect login details ❌");
    }
});
