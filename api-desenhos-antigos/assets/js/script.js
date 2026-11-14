let offset = 0;
const container = document.getElementById('pokemon-container');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const pageIndicator = document.getElementById('page-indicator');

async function fetchPokemons() {
    try {
        const url = `${API_CONFIG.BASE_URL}?limit=${API_CONFIG.LIMIT}&offset=${offset}`;
        container.innerHTML = '<p style="text-align: center; width: 100%; color: #7f8c8d; font-size: 1.2rem;">Carregando Pokémon...</p>';
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Erro ao acessar os dados da PokéAPI');
        }
        const data = await response.json();
        container.innerHTML = '';
        const pokemonPromises = data.results.map(async (pokemon) => {
            const res = await fetch(pokemon.url);
            return res.json();
        });
        const pokemonsData = await Promise.all(pokemonPromises);
        pokemonsData.forEach(createPokemonCard);
        updatePaginationControls();

    } catch (error) {
        console.error('Erro na requisição:', error);
        container.innerHTML = '<p style="color: red; text-align: center; width: 100%;">Erro ao carregar os dados da API.</p>';
    }
}

function createPokemonCard(pokemon) {
    const card = document.createElement('div');
    card.classList.add('pokemon-card');
    const img = document.createElement('img');
    img.src = pokemon.sprites.front_default || '';
    img.alt = pokemon.name;
    const name = document.createElement('h3');
    name.textContent = pokemon.name;
    const type = document.createElement('p');
    const englishType = pokemon.types[0].type.name;
    const translatedType = TYPES_PT_BR[englishType] || englishType;
    type.textContent = `Tipo: ${translatedType}`;
    card.appendChild(img);
    card.appendChild(name);
    card.appendChild(type);
    container.appendChild(card);
}

function updatePaginationControls() {
    const currentPage = Math.floor(offset / API_CONFIG.LIMIT) + 1;
    const maxPages = Math.ceil(API_CONFIG.MAX_POKEMON / API_CONFIG.LIMIT);
    pageIndicator.textContent = `Página ${currentPage} de ${maxPages}`;
    prevBtn.disabled = offset === 0;
    nextBtn.disabled = offset + API_CONFIG.LIMIT >= API_CONFIG.MAX_POKEMON;
}
prevBtn.addEventListener('click', () => {
    if (offset >= API_CONFIG.LIMIT) {
        offset -= API_CONFIG.LIMIT;
        fetchPokemons();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
});
nextBtn.addEventListener('click', () => {
    if (offset + API_CONFIG.LIMIT < API_CONFIG.MAX_POKEMON) {
        offset += API_CONFIG.LIMIT;
        fetchPokemons();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
});
fetchPokemons();
