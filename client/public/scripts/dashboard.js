window.onload = async function () {
  const token = localStorage.getItem("token");

  try {
    const response = await fetch("/api/auth/me", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}` 
      }
    });

    const userData = await response.json();

    if (response.ok) {
      document.getElementById("welcomeName").textContent = userData.username;
      document.getElementById("updateName").value = userData.username;
      
      if (userData.email) {
          document.getElementById("updateEmail").value = userData.email;
      }
      
      if (userData.bio) {
          document.getElementById("updateBio").value = userData.bio;
      }
    } else {
      console.error("Failed to load user data");
    }
  } catch (error) {
    console.error("Error fetching profile:", error);
  }
};


const profileForm = document.getElementById("profileForm");

profileForm.addEventListener("submit", async (e) => {
  e.preventDefault(); // Stop the page from reloading

  const token = localStorage.getItem("token");

  const updatedData = {
    username: document.getElementById("updateName").value,
    email: document.getElementById("updateEmail").value,
    bio: document.getElementById("updateBio").value
  };

  try {

    const res = await fetch("/api/auth/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(updatedData)
    });

    const data = await res.json();

    if (res.ok) {
      alert("Profile securely updated!");
     
      document.getElementById("welcomeName").textContent = updatedData.username;
    } else {
      
      alert("Error: " + (data.message || (data.errors && data.errors[0].msg) || "Update failed"));
    }
  } catch (error) {
    console.error("Update failed:", error);
    alert("Could not connect to the server.");
  }
});