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

  //bouton de login
  let loginButton = document.getElementById("logintext");
  loginButton.addEventListener("click", function () {
    window.location.href = "log.html";
  });
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

  // création du bouton "tous"
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

  // création des autres boutons
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

  // création de la logique de filtrage
  async function filter() {
    const allPhotos = await fetchData();
    const allButtons = document.querySelectorAll("button");
    allButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        const buttonId = Number(e.target.id);
        const gallery = document.querySelector(".gallery");
        gallery.innerHTML = "";
        button.classList.toggle("activationButton");
        if (buttonId !== "0") {
          const filterCategory = allPhotos.filter((photos) => {
            return photos.categoryId === buttonId;
          });
          filterCategory.forEach((photos) => {
            let figure = document.createElement("figure");
            gallery.appendChild(figure);
            let img = document.createElement("img");
            img.src = photos.imageUrl;
            figure.appendChild(img);
            let figcaption = document.createElement("figcaption");
            figcaption.textContent = photos.title;
            figure.appendChild(figcaption);
          });
        }
        if (buttonId === 0) {
          displayData();
        }
        //
        // ajout de la classe au bouton une fois cliquer
        allButtons.forEach((btn) => {
          if (btn !== button) {
            btn.classList.remove("activationButton");
          }
        });
        //
      });
      //

      //////////////////////////////////////////////////////////////////
      ///////////GESTION DE L AFFICHAGE UNE FOIS L ADMIN LOG////////////
      //////////////////////////////////////////////////////////////////

      //
      // récupération des balise
      const loged = window.sessionStorage.loged;
      const logout = document.getElementById("logintext");
      const editionAdmin = document.querySelector(".edition");
      const h1Admin = document.querySelector(".edition h1");
      const projetsAdmin = document.querySelector(".projets");
      const pAdmin = document.querySelector(".projets p");
      const svgAdmin = document.querySelector(".projets svg");
      const token = window.sessionStorage.authToken;

      // Gestion de l'affichage et du logout
      if (loged === "true" && token) {
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
          window.location.href = "../index.html";
        });
      }
    });
  }
  //

  ///////////////////////////
  ///////////MODAL////////////
  ////////////////////////////

  // récupération des balises
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

  // gestion de la 1er fenêtre de la modal:

  // croix
  firstWindowcroix.addEventListener("click", () => {
    containerModals.style.display = "none";
  });
  //

  // bouton
  addPicture.addEventListener("click", () => {
    seeGallery.style.display = "none";
    uploadPicture.style.display = "flex";
    displayData();
  });
  //

  // gestion des photos miniature
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
      const buttonTrash = document.createElement("i");
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
  //
  photos();

  // Gestion du delete
  function deletePicture() {
    const tinyPicture = document.querySelector(".tinyPicture");
    const allTrash = document.querySelectorAll(".fa-trash-can");
    const token = window.sessionStorage.authToken;

    allTrash.forEach((trash) => {
      trash.addEventListener("click", (e) => {
        tinyPicture.innerHTML = "";
        const id = e.target.id;

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
            return response;
          })
          .then(() => {
            const gallery = document.querySelector(".gallery");
            gallery.innerHTML = "";
            photos();
            displayData();
          });
      });
    });
  }
  //

  // gestion de la 2ème fenêtre de la modal
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

  // gestion du post
  // récupération des balises pour la prévisualista
  const imgPreview = document.querySelector(".containerFile img");
  const addFile = document.getElementById("addFile");
  const pPreview = document.querySelector(".containerFile p");
  const svgPreview = document.querySelector(".choicePhoto svg");
  const buttonPicture = document.querySelector(".buttonPicture");
  //

  // gestion du bouton et de la prévisualisation
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
  });
  categoryModal();
  //

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
  //

  // récupération de balises
  const form = document.querySelector(".uploadPicture form");
  const containerFile = document.querySelector(".containerFile");
  const choicePhoto = document.querySelector(".choicePhoto");
  const titleForm = document.getElementById("title");
  const categoryForm = document.getElementById("category");
  const token = window.sessionStorage.authToken;
  //

  // fonction pour reset les champs
  function resetChoiceDiv() {
    const imgPreview = document.querySelector(".containerFile img");
    const addFile = document.getElementById("addFile");
    const pPreview = document.querySelector(".containerFile p");
    const svgPreview = document.querySelector(".choicePhoto svg");
    const buttonPicture = document.querySelector(".buttonPicture");

    // Réinitialisation l'aperçu de l'image
    imgPreview.src = "";
    imgPreview.style.display = "none";
    pPreview.style.display = "flex";
    svgPreview.style.display = "flex";
    buttonPicture.style.display = "flex";

    // Réinitialisation du champ d'entrée de fichier
    addFile.value = null;
    titleForm.value = null;
    categoryForm.value = null;
  }
  //

  // logique de l'ajout
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(form);

    try {
      const response = await fetch("http://localhost:5678/api/works", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.status === 201) {
        alert("Projet ajouté avec succès");
        const gallery = document.querySelector(".gallery");
        gallery.innerHTML = "";
        displayData();
        recoveryCategorys();
        photos();
        resetChoiceDiv();
      } else if (response.status === 400) {
        alert("Merci de remplir tous les champs");
      } else if (response.status === 500) {
        alert("Erreur serveur");
      } else if (response.status === 401) {
        alert("Vous n'êtes pas autorisé à ajouter un projet");
        window.location.href = "../log.html";
      }
    } catch (error) {}
  });
  //

  // Bouton de validation
  function verificationInput() {
    const validationButton = document.getElementById("validation");
    const form = document.querySelector(".uploadPicture form");

    form.addEventListener("input", () => {
      const titleForm = document.getElementById("title").value;
      const categoryForm = document.getElementById("category").value;
      const addFile = document.getElementById("addFile").value;
      if (titleForm !== "" && categoryForm !== "" && addFile !== "") {
        validationButton.classList.remove("validation");
        validationButton.classList.add("validationActivate");
      } else {
        validationButton.classList.add("validation");
        validationButton.classList.remove("validationActivate");
      }
    });
  }
  verificationInput();
  //

  filter();
});
