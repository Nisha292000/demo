const form = document.getElementById("contact-form");
const responseBox = document.getElementById("response");

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  try {
    const res = await fetch("/.netlify/functions/submit-form", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    responseBox.textContent = result.message;
    form.reset();
  } catch (err) {
    responseBox.textContent = "Something went wrong.";
    console.error(err);
  }
});
