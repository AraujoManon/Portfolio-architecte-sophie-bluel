document.addEventListener("DOMContentLoaded", function () {
  const email = document.querySelector("form #email");
  const password = document.querySelector("form #password");
  const form = document.querySelector("form");
  const messageError = document.querySelector("section#login p");

  async function loginUser() {
    form.addEventListener("submit", async function (event) {
      event.preventDefault();
      const login = {
        email: email.value,
        password: password.value,
      };
      const chargeUtile = JSON.stringify(login);

      const response = await fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: chargeUtile,
      });

      if (response.ok) {
        window.sessionStorage.setItem("loggedIn", true);
        window.location.href = "../index.html";
      } else {
        messageError.textContent =
          "Votre mot de passe ou votre email est incorrect.";
      }
    });
  }

  const loginButton = document.querySelector("button");
  loginButton.addEventListener("click", function (event) {
    event.preventDefault();
    form.dispatchEvent(new Event("submit"));
  });

  loginUser();
});
