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
  buttonTous.textContent = "Tous".toUpperCase();
  h2.appendChild(containerButtons);
  containerButtons.appendChild(buttonTous);
  buttonTous.classList.toggle("activationButton");
  containerButtons.classList.add("buttons");
  buttonTous.id = 0;

  async function displayCategorys() {
    const categorys = await recoveryCategorys();
    categorys.forEach((category) => {
      const button = document.createElement("button");
      button.textContent = category.name.toUpperCase();
      button.id = category.id;
      button.classList.toggle("activationButton");
      containerButtons.appendChild(button);
    });
  }
  displayCategorys();
  async function filter() {
    const allPhotos = await fetchData();
    const allButtons = document.querySelectorAll("button");
    allButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        const buttonId = e.target.id;
        const gallery = document.querySelector(".gallery");
        gallery.innerHTML = "";

        if (buttonId !== "0") {
          const filterCategory = allPhotos.filter((photos) => {
            return photos.categoryId === buttonId;
          });

          filterCategory.forEach((photos) => {
            displayData(photos);
          });
          console.log(filterCategory);
        }
      });
    });
  }

  filter();
});
