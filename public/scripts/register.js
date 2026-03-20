const form = document.getElementById("registerForm");

const errorText = document.getElementById("errorText"); 

form.addEventListener("submit", async (e) => {
  e.preventDefault(); 
  
  errorText.innerText = ""; 

  try {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: e.target.username.value,
        password: e.target.password.value,
      }),
    });

    // Translating server's response into JSON to read the error
    const data = await res.json(); 

    if (res.ok) {
      console.log("User Registered!");
      window.location.href = "/login"; 
    } else {
      // If the backend sends back that E11000 MongoDB duplicate error:
      if (data.error && data.error.includes("E11000")) {
        errorText.innerText = "This username is already taken.";
      } else {
        
        errorText.innerText = data.error || "Registration failed. Please try again.";
      }
    }
  } catch (error) {
    errorText.innerText = "Could not connect to the server.";
  }
});