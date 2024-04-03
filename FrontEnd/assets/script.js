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

  async function displayCategorys() {
    const categorys = await recoveryCategorys();
    categorys.forEach((category) => {
      const button = document.createElement("button");
      button.textContent = category.name;
      button.id = category.id;

      containerButtons.appendChild(button);
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
    });
  }
  let loginButton = document.getElementById("logintext");
  loginButton.addEventListener("click", function () {
    window.location.href = "log.html";
  });
  filter();
});
