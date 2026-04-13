// Get token
const token = localStorage.getItem("token");

async function loadAdmin() {
  try {
    const res = await fetch("/api/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const user = await res.json();

    if (!res.ok) {
      alert("Not authorized");
      return;
    }

    // Admin check
    if (user.role !== "admin") {
      alert("Access denied");
      window.location.href = "/dashboard.html";
      return;
    }

    document.getElementById("welcomeName").textContent = user.username;
    document.getElementById("displayName").textContent = user.username;
    document.getElementById("displayEmail").textContent = user.email || "";
    document.getElementById("displayRole").textContent = user.role;

    document.getElementById("updateName").value = user.username;
    document.getElementById("updateEmail").value = user.email || "";

  } catch (err) {
    console.error("Error:", err);
  }
}

loadAdmin();


// Handle update
document.getElementById("profileForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const updatedData = {
    username: document.getElementById("updateName").value,
    email: document.getElementById("updateEmail").value
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

    if (!res.ok) {
      alert(data.message || "Update failed");
      return;
    }

    alert("Profile updated!");

    // Update UI instantly
    document.getElementById("displayName").textContent = updatedData.username;
    document.getElementById("displayEmail").textContent = updatedData.email;
    document.getElementById("welcomeName").textContent = updatedData.username;

  } catch (err) {
    console.error(err);
    alert("Server error");
  }
});