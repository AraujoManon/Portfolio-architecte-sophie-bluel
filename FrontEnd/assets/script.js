// Récupération des travaux
async function fetchData() {
  const response = await fetch("http://localhost:5678/api/works");
  const data = await response.json();
  return data;
}
fetchData();
//

//////////////////////////////////////////
//////////GESTION DE LA GALLERIE//////////
//////////////////////////////////////////

// Affichage gallerie
async function displayData() {
  const fetchedData = await fetchData();
  const gallery = document.querySelector(".gallery");

  fetchedData.forEach((item) => {
    let figure = document.createElement("figure");
    gallery.appendChild(figure);

    let img = document.createElement("img");
    img.src = item.imageUrl;
    figure.appendChild(img);

    let figcaption = document.createElement("figcaption");
    figcaption.textContent = item.title;
    figure.appendChild(figcaption);
  });
}

document.addEventListener("DOMContentLoaded", function () {
  displayData();
  //

  //////////////////////////////////////////
  ///////////GESTION DES BOUTONS////////////
  //////////////////////////////////////////

  // Récupération des catégories des photos
  async function recoveryCategorys() {
    const response = await fetch("http://localhost:5678/api/categories");
    const data = await response.json();

    return data;
  }
  recoveryCategorys();
  //

  // Création du boutons "tous"
  const h2 = document.querySelector(".projets h2");
  const containerButtons = document.createElement("div");
  const buttonTous = document.createElement("button");
  buttonTous.textContent = "Tous";
  h2.appendChild(containerButtons);
  containerButtons.appendChild(buttonTous);
  containerButtons.classList.add("buttons");
  buttonTous.id = 0;
  let buttons = [];
  buttons.push(buttonTous);
  //

  // Création des autres boutons
  async function displayCategorys() {
    const categorys = await recoveryCategorys();
    categorys.forEach((category) => {
      const button = document.createElement("button");
      button.textContent = category.name;
      button.id = category.id;
      button.classList.add("button");
      containerButtons.appendChild(button);
      buttons.push(button);
    });
  }
  displayCategorys();
  //

  //
  // Gestion des filtres des boutons
  let activeButtonIds = [];
  async function filter() {
    const allPhotos = await fetchData();
    const allButtons = document.querySelectorAll("button");
    allButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        const buttonId = Number(e.target.id);
        const gallery = document.querySelector(".gallery");
        gallery.innerHTML = "";
        button.classList.toggle("activationButton");

        // Suppression de la classe "activationButton" de tous les boutons sauf celui qui a été cliqué
        allButtons.forEach((btn) => {
          if (btn !== button) {
            btn.classList.remove("activationButton");
          }
        });

        if (activeButtonIds.includes(buttonId)) {
          activeButtonIds = activeButtonIds.filter((id) => id !== buttonId);
        } else {
          activeButtonIds.push(buttonId);
        }

        // Filtrage des photos en fonction des identifiants des boutons activés
        const filteredPhotos = allPhotos.filter((photo) => {
          return activeButtonIds.includes(photo.categoryId);
        });

        // Affichage des photos correspondantes
        filteredPhotos.forEach((photo) => {
          let figure = document.createElement("figure");
          gallery.appendChild(figure);

          let img = document.createElement("img");
          img.src = photo.imageUrl;
          figure.appendChild(img);

          let figcaption = document.createElement("figcaption");
          figcaption.textContent = photo.title;
          figure.appendChild(figcaption);
        });
      });

      //
      const loged = window.sessionStorage.loged;
      const logout = document.getElementById("logintext");
      const editionAdmin = document.querySelector(".edition");
      const h1Admin = document.querySelector(".edition h1");
      const projetsAdmin = document.querySelector(".projets");
      const pAdmin = document.querySelector(".projets p");
      const svgAdmin = document.querySelector(".projets svg");
      const token = window.sessionStorage.authToken;

      if (loged == "true" && "token") {
        logout.textContent = "logout";
        editionAdmin.classList.add("editionAdmin");
        h1Admin.classList.add("h1Admin");
        pAdmin.classList.add("pAdmin");
        svgAdmin.classList.add("svgAdmin");
        projetsAdmin.classList.add("projetsAdmin");

        buttons.forEach((button) => {
          button.classList.add("buttonAdmin");
        });

        logout.addEventListener("click", () => {
          window.sessionStorage.loged = false;
        });
      }
    });
  }
  // création de la modal
  // récupération des balises et classes
  const pAdmin = document.querySelector(".projets p");
  const containerModals = document.querySelector(".containerModals");
  const seeGallery = document.querySelector(".seeGallery");
  const firstWindowcroix = document.querySelector(".seeGallery .croix");
  const addPicture = document.querySelector(".addPicture");

  //

  // gestion au clique de "modifier"
  pAdmin.addEventListener("click", () => {
    containerModals.style.display = "flex";
    seeGallery.style.display = "flex";
    uploadPicture.style.display = "none";
  });
  //

  // gestion du clique autre que sur la modal
  containerModals.addEventListener("click", (e) => {
    if (e.target.className == "containerModals") {
      containerModals.style.display = "none";
    }
  });
  //

  // gestion de la 1er fenêtre :
  // croix
  firstWindowcroix.addEventListener("click", () => {
    containerModals.style.display = "none";
  });
  //
  // bouton
  addPicture.addEventListener("click", () => {
    seeGallery.style.display = "none";
    uploadPicture.style.display = "flex";
  });
  //

  // gestion de la gallerie
  async function photos() {
    const dataPhotos = await fetchData();
    const tinyPicture = document.querySelector(".tinyPicture");
    tinyPicture.innerHTML = "";
    tinyPicture.classList.add("format");
    //
    // création photo et poubelle
    dataPhotos.forEach((photo) => {
      const figure = document.createElement("figure");
      figure.classList.add("tinyImg");
      const buttonTrash = document.createElement("button");
      buttonTrash.classList.add("containerTrash");
      const img = document.createElement("img");
      img.src = photo.imageUrl;
      img.classList.add("tinyImg");
      const trash = document.createElement("i");
      trash.classList.add("fa-solid", "fa-trash-can");
      trash.id = photo.id;
      buttonTrash.appendChild(trash);
      figure.appendChild(buttonTrash);
      figure.appendChild(img);
      tinyPicture.appendChild(figure);
    });
    deletePicture();
  }

  photos();

  // création du delete
  function deletePicture() {
    const allTrash = document.querySelectorAll(".fa-trash-can");
    const token = window.sessionStorage.authToken;
    allTrash.forEach((trash) => {
      trash.addEventListener("click", (e) => {
        tinyPicture.innerHTML = "";
        const id = trash.id;
        const deletePhoto = {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        };
        fetch("http://localhost:5678/api/works/" + id, deletePhoto)
          .then((response) => {
            if (!response.ok) {
              console.error("Une erreur s'est produite :", response);
            }
            return response.json();
          })
          .then((data) => {
            console.log("La suppression est OK, data :", data);
            // Rafraîchir la galerie et la modal après la suppression
            photos();
            displayData();
          });
      });
    });
  }

  //

  //

  // gestion de la 2ème fenêtre
  // récupération des balises:
  const secondtWindowcroix = document.querySelector(".svgUploadPicture .croix");
  const uploadPicture = document.querySelector(".uploadPicture");
  const returnArrow = document.querySelector(".arrow");

  // croix
  secondtWindowcroix.addEventListener("click", () => {
    containerModals.style.display = "none";
  });
  // flèche
  returnArrow.addEventListener("click", () => {
    seeGallery.style.display = "flex";
    uploadPicture.style.display = "none";
  });
  //

  //bouton de login
  let loginButton = document.getElementById("logintext");
  loginButton.addEventListener("click", function () {
    window.location.href = "log.html";
  });
  //
  // gestion de la prévisualisation de l'image
  // récupération des balises

  const imgPreview = document.querySelector(".containerFile img");
  const addFile = document.getElementById("addFile");
  const pPreview = document.querySelector(".containerFile p");
  const svgPreview = document.querySelector(".choicePhoto svg");
  const buttonPicture = document.querySelector(".buttonPicture");
  //

  addFile.addEventListener("change", () => {
    const file = addFile.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        imgPreview.src = e.target.result;
        imgPreview.style.display = "flex";
        buttonPicture.style.display = "none";
        pPreview.style.display = "none";
        svgPreview.style.display = "none";
      };
      reader.readAsDataURL(file);
    }
    categoryModal();
    // création de catégories dans l'input
    async function categoryModal() {
      const select = document.querySelector("select");
      const categorys = await recoveryCategorys();
      categorys.forEach((category) => {
        const option = document.createElement("option");
        option.value = category.id;
        option.textContent = category.name;
        select.appendChild(option);
      });
    }

    // post pour poster une photo
    const form = document.querySelector(".choicePhoto form");
    const containerFile = document.querySelector(".containerFile");
    const choicePhoto = document.querySelector(".choicePhoto");
    const titleForm = document.getElementById("title");
    const categoryForm = document.getElementById("category");
    const token = window.sessionStorage.authToken;

    // Ajouter un projet
    async function addWork(event) {
      event.preventDefault();

      const title = document.getElementById("title").value;
      const categoryId = document.getElementById("category").id.value;
      const image = imgPreview.files[0];

      if (title === "" || categoryId === "" || image === undefined) {
        alert("Merci de remplir tous les champs");
        return;
      } else {
        try {
          const formData = new FormData();
          formData.append("title", title);
          formData.append("category", categoryId);
          formData.append("image", image);

          const response = await fetch("http://localhost:5678/api/works", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: multipart / form - data,
          });

          if (response.status === 201) {
            alert("Projet ajouté avec succès :)");
            displayData();
            recoveryCategorys();
            filter();
          } else if (response.status === 400) {
            alert("Merci de remplir tous les champs");
          } else if (response.status === 500) {
            alert("Erreur serveur");
          } else if (response.status === 401) {
            alert("Vous n'êtes pas autorisé à ajouter un projet");
            window.location.href = "../log.html";
          }
        } catch (error) {
          console.log(error);
        }
      }
    }
  });

  filter();
});
