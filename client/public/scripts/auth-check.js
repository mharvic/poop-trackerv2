const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "/login";
} else {
  try {
   
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentPath = window.location.pathname;

    if (currentPath === "/admin-dashboard" && payload.role !== "admin") {
      alert("Access Denied: You must be an admin to view this page.");
      window.location.href = "/dashboard"; 
    }

    if (currentPath === "/dashboard" && payload.role === "admin") {
    
      window.location.href = "/admin-dashboard"; 
    }

  } catch (error) {
   
    localStorage.removeItem("token");
    window.location.href = "/login";
  }
}