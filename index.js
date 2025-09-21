document.querySelector(".app").innerHTML = "<div><ul class=films></ul></div>"
fetch("http://localhost:3000/films")
  .then((response) => response.json())
  .then((films) => {
    const filmsList = document.querySelector(".films");
    films.forEach((film) => {
      const listItem = document.createElement("li");
      listItem.textContent = film.title;
      listItem.addEventListener("click", () => displayMovieDetails(film));
      filmsList.appendChild(listItem);
        });
  });

  function displayMovieDetails(movie) {
    const movieDetails = document.getElementById('movie-details');
    movieDetails.innerHTML = `<div class="image"><img src="${movie.poster}" alt="${movie.title} Poster"></div>
      <div class=""><h2>${movie.title}</h2>
      <p>Runtime: ${movie.runtime} minutes</p>     
      <p>${movie.description}</p>      
      <p>Showtime: ${movie.showtime}</p>
      <p>Available Tickets: ${movie.capacity - movie.tickets_sold}</p></div>
    `;
  }
  document.addEventListener('DOMContentLoaded', () => {
    fetch('http://localhost:3000/films/1')
      .then(response => response.json())
      .then(movie => {
        displayMovieDetails(movie);
      });
  });

  document.querySelector(".app").innerHTML += "<div id=movie-details></div>"  
  document.querySelector(".app").innerHTML += "<button id=buy-ticket>Buy Ticket</button>"
  document.getElementById('buy-ticket').addEventListener('click', () => {
    fetch('http://localhost:3000/films/1')
      .then(response => response.json())
      .then(movie => {
        const availableTickets = movie.capacity - movie.tickets_sold;
        if (availableTickets > 0) {
          movie.tickets_sold += 1;
          fetch(`http://localhost:3000/films/1`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ tickets_sold: movie.tickets_sold })
          })
          .then(response => response.json())
          .then(updatedMovie => {
            displayMovieDetails(updatedMovie);
            alert('Ticket purchased successfully!');
          });
        } else {
          alert('Sorry, no tickets available.');
        }
      });
  });