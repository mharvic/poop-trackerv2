// Load user data
window.onload = async function () {
  const token = localStorage.getItem("token");

  try {
    const res = await fetch("/api/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const user = await res.json();

    if (res.ok) {

      // ✅ XSS SAFE (important)
      document.getElementById("welcomeName").textContent = user.username;

      document.getElementById("displayName").textContent = user.username;
      document.getElementById("displayEmail").textContent = user.email || "";
      document.getElementById("displayBio").textContent = user.bio || "";

      // Fill form
      document.getElementById("updateName").value = user.username;
      document.getElementById("updateEmail").value = user.email || "";
      document.getElementById("updateBio").value = user.bio || "";

    } else {
      alert("Not authorized");
    }

  } catch (err) {
    console.error("Error:", err);
  }
};


// Handle update
document.getElementById("profileForm").addEventListener("submit", async (e) => {
  e.preventDefault();

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
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(updatedData)
    });

    const data = await res.json();

    if (res.ok) {
      alert("Profile updated!");

      // Update display instantly
      document.getElementById("displayName").textContent = updatedData.username;
      document.getElementById("displayEmail").textContent = updatedData.email;
      document.getElementById("displayBio").textContent = updatedData.bio;

      document.getElementById("welcomeName").textContent = updatedData.username;

    } else {
      alert(data.message || "Update failed");
    }

  } catch (err) {
    console.error(err);
    alert("Server error");
  }
});