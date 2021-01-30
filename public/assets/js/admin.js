const { response } = require("express")
const { report } = require("process")

document.addEventListener('DOMContentLoaded', function () {
  fetch(host + '/movies')
  .then(response => response.json())
  .then(data => console.log(data))
  loadTable([])
})

function loadTable(data) {
  const table = document.querySelector('table tbody')
  if (data.lenght === 0) {
    table.innerHTML = '<tr><td class="no-data" colspan="6">Sem dados</td></tr>'
  }
}

$(document).ready(function () {
  // Activate tooltip
  $('[data-toggle="tooltip"]').tooltip();
  let movies = null;

  function checkLocalStorage() {
    movies = JSON.parse(localStorage.getItem("movies"));
    if (!movies) {
      localStorage.setItem(
        "movies",
        JSON.stringify([
          {
            titulo: "Matrix",
            realizador: "The Wachowski Brothers",
            elenco: "Keanu Reeves, Carrie-Anne Moss",
            genero: "Acção",
            cinema: "Alvalade",
          },
          {
            titulo: "Ford v Ferrari",
            realizador: "James Mangold",
            elenco: "Matt Damon, Christian Bale",
            genero: "Acção",
            cinema: "Oeiras",
          },
          {
            titulo: "The Social Dilemma",
            realizador: "James Mangold",
            elenco: "Matt Damon",
            genero: "Acção",
            cinema: "Oeiras",
          },
          {
            titulo: "Ford v Ferrari",
            realizador: "James Mangold",
            elenco: "Matt Damon",
            genero: "Acção",
            cinema: "Oeiras",
          },
        ])
      );
      movies = JSON.parse(localStorage.getItem("movies"));
    }
    getMovies();
  }

  checkLocalStorage();

function getMovies() {
  movies.forEach((movie) => {
    let table = document.querySelector("#movieTable");
    table.innerHTML += `                        <tr>
        <td>
            <span class="custom-checkbox">
                <input type="checkbox" id="checkbox1" name="options[]" value="1">
                <label for="checkbox1"></label>
            </span>
        </td>
        <td>${movie.titulo}</td>
        <td>${movie.realizador}</td>
        <td>${movie.elenco}</td>
        <td>${movie.genero}</td>
        <td>${movie.cinema}</td>
        <td>
            <a href="#editarFilmeModal" class="edit" data-toggle="modal"><i class="material-icons" data-toggle="tooltip" title="Editar">&#xE254;</i></a>
            <a href="#apagarFilmeModal" class="delete" data-toggle="modal"><i class="material-icons" data-toggle="tooltip" title="Apagar">&#xE872;</i></a>
        </td>
    </tr>`;
  });
}
