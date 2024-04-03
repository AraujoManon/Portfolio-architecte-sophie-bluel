async function fetchData() {
  const response = await fetch("http://localhost:5678/api/works");
  const data = await response.json();
  return data;
}
fetchData();
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

  async function recoveryCategorys() {
    const response = await fetch("http://localhost:5678/api/categories");
    const data = await response.json();

    return data;
  }
  recoveryCategorys();

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
      });
      const loged = window.sessionStorage.loged;
      const logout = document.getElementById("logintext");
      const editionAdmin = document.querySelector(".edition");
      const h1Admin = document.querySelector(".edition h1");
      const projetsAdmin = document.querySelector(".projets");
      const pAdmin = document.querySelector(".projets p");
      const svgAdmin = document.querySelector(".projets svg");
      const containerModals = document.querySelector(".containerModals");
      const seeGallery = document.querySelector(".seeGallery");
      const croix = document.querySelector(".croix");

      if (loged == "true") {
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
      pAdmin.addEventListener("click", () => {
        seeGallery.style.display = "flex";
        containerModals.style.display = "flex";
        console.log(pAdmin);
      });

      croix.addEventListener("click", () => {
        containerModals.style.display = "none";
      });
    });
  }

  let loginButton = document.getElementById("logintext");
  loginButton.addEventListener("click", function () {
    window.location.href = "log.html";
  });

  filter();
});
