//borrar lista de pokemon y renderizar una pagina de pokemon
//navegar a la siguiente pagina
//navegar a la pagina anterior
//buscador pokemon
//search
//get pokemon
// let currentPage = 1;
// let pages= null;
//localStorage? :(

const searchButton = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");
const resetButton = document.getElementById("resetBtn");
const containerApp = document.getElementById("app");
const prevPageButton = document.getElementById("prevBtn");
const nextPageButton = document.getElementById("nextBtn");
const baseUrl = "https://pokeapi.co/api/v2/pokemon";

let currentPage = 1;
const limit = 10;

//api pokemon/await/lista pokemon
const getPokemon = async (page) => {
  const offset = (page - 1) * limit;
  try {
    const url = baseUrl + "?limit=" + limit + "&offset=" + offset;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("ha surgido un error", response.status);
    }
    const data = await response.json();
    //Promise.all(iterable)
    const pokemonDetails = await Promise.all(
      data.results.map((pokemon) => getPokemonInfo(pokemon.url))
    );
    renderPokemon(pokemonDetails);
  } catch (error) {
    console.log("error al obtener los datos", error);
  }
};
//detalles pokemon, no encuentro info, url no aparece//
const getPokemonInfo = async (url) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("error detail pokemon");
    }
    const detalles = await response.json();
    return detalles;
  } catch (error) {
    console.log("error", error);
  }
};

//rederizar pokemon y mostrar en DOM
const renderPokemon = (pokemonList) => {
  containerApp.innerHTML = "";
  pokemonList.forEach((pokemon) => {
    containerApp.innerHTML += `
        <article class='card'>
        <img class= 'card_image' src='${pokemon.sprites.front_default}' alt='${pokemon.name}' />
        <h4>${pokemon.name}</h4>
        </article>
        
        `;
  });
};
//button para paginacion
prevPageButton.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    getPokemon(currentPage);
  }
});

nextPageButton.addEventListener("click", () => {
  currentPage++;
  getPokemon(currentPage);
});

getPokemon(currentPage);

//type="text" id="searchInput"//buscar x nombre
const searchPokemon = async (name) => {
  try {
    const url = `${baseUrl}/${name.toLowerCase()}`;
    const detalles = await getPokemonInfo(url);
    renderPokemon([detalles]);
  } catch (error) {
    console.log("error", error);
    containerApp.innerHTML = "<p>pokemon no encontrado</p>";
  }
};

//añadir evento boton search
//const searchInput = document.getElementById("searchInput");

searchButton.addEventListener("click", () => {
  const pokemon = searchInput.value;
  if (pokemon) {
    searchPokemon(pokemon);
  }
});

//boton reset funcion
const reseteado = () => {
  containerApp.innerHTML = "";
  currentPage = 1;
  getPokemon(currentPage);
};

//evento boton de reset
//const resetButton = document.getElementById("resetBtn");
resetButton.addEventListener("click", reseteado);
