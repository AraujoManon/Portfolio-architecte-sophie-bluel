document.addEventListener("DOMContentLoaded", function () {
  //  récupération des balises
  const email = document.querySelector("form #email");
  const password = document.querySelector("form #password");
  const form = document.querySelector("form");
  const messageError = document.querySelector("section#login p");
  //

  // récupération des données de connection et des donnée backend
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
      //

      // gestion des résultats
      if (response.ok) {
        const responseData = await response.json();
        const token = responseData.token;
        console.log(responseData.token);
        window.sessionStorage.setItem("authToken", token); // Stocke le token d'authentification
        window.sessionStorage.setItem("loged", true); // Marque l'utilisateur comme connecté
        window.location.href = "../index.html";
      } else {
        messageError.textContent =
          "Votre mot de passe ou votre email est incorrect.";
      }
    });
  }
  //

  // gestion du bouton
  const loginButton = document.querySelector("button");
  loginButton.addEventListener("click", function (event) {
    event.preventDefault();
    form.dispatchEvent(new Event("submit"));
  });
  //
  loginUser();
});
