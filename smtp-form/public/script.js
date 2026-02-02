document.getElementById("signupForm").addEventListener("submit", async e => {
  e.preventDefault();

  const formData = new FormData(e.target);

  try {
    const response = await fetch("../server/send.php", {
      method: "POST",
      body: formData
    });

    const text = await response.text();
    alert(text);
  } catch (err) {
    alert("Error sending form: " + err);
  }
});
