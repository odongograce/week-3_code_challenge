document.querySelector("#app").innerHTML = "<div><ul class=films></ul></div>"
fetch("http://localhost:3000/films")
  .then((response) => response.json())
  .then((films) => {
    const filmsList = document.querySelector(".films");
    films.forEach((film) => {
      const listItem = document.createElement("li");
      listItem.textContent = film.title;
      filmsList.appendChild(listItem);
    });
  });   
