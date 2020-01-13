import { elements } from './base';

export const getInput = () => elements.searchInput.value;

export const clearInput = () => {
    elements.searchInput.value = '';
};

export const clearResults = () => {
    elements.searchResultList.innerHTML = '';
    elements.searchResPages.innerHTML = '';
}

export const highlightSelected = id => {
    const resultsArr = Array.from(document.querySelectorAll('.results__link'));
    resultsArr.forEach(el => el.classList.remove('results__link--active'));
    document.querySelector(`a[href="#${id}"]`).classList.add('results__link--active');
}





//'Cheeseburger with tomatoes and onion'
/*
['Cheeseburger', 'with', 'tomatoes', 'and', 'onion'] (title.split(' '))
accumulator: 0 => acc + cur.length = 0 + 12 = 12 / newTitle = ['Cheeseburger']
accumulator: 12 => acc + cur.length = 12 + 4 = 16 / newTitle = ['Cheeseburger', 'with']
accumulator: 16 => acc + cur.length = 16 + 8 = 24 > 17 ==> STOP / newTitle = ['Cheeseburger', 'with']
newTitle.join(' ') ==> Cheesburger with...
*/

const limitRecipeTitle = (title, limit = 17) => {
    const newTitle = [];
    if(title.length > limit) {
        title.split(' ').reduce((accumulator, current) => {
            if(accumulator + current.length <= limit) {
                newTitle.push(current);
            }
            return accumulator + current.length;
        }, 0);
        return `${newTitle.join(' ')}...`
    } 
    return title;
} 

const renderRecipe = recipe => {
    const markup = 
`
    <li>
        <a class="results__link" href="#${recipe.recipe_id}">
            <figure class="results__fig">
                <img src="${recipe.image_url}" alt="${recipe.title}">
            </figure>
            <div class="results__data">
                <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                <p class="results__author">${recipe.publisher}</p>
            </div>
        </a>
    </li>
`;
    elements.searchResultList.insertAdjacentHTML('beforeend', markup);
}


const createButton = (page, type) => `
    <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page - 1 : page + 1}>
        <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
        </svg>
    </button> 

`

const renderButtons = (page, numResults, resPerPage) => {
    const pages = Math.ceil(numResults / resPerPage);
    let button;
    if(page === 1 && pages > 1) {
        // Only button to go to next page
        button = createButton(page, 'next');
    } else if(page < pages) {
        //Both buttons
        button = `
            ${createButton(page, 'next')}
            ${createButton(page, 'prev')}
        `;
    }
     else if (page === pages && pages > 1) {
        // Only button to go to prev page
        button = createButton(page, 'prev');
    }
    elements.searchResPages.insertAdjacentHTML('afterbegin', button);
};

export const renderResults = (recipes, page = 1, resPerPage = 10) => {
    const start = (page - 1) * resPerPage;
    const end = page * resPerPage;
    recipes.slice(start, end).forEach(renderRecipe);
   // Render pagination buttons
    renderButtons(page, recipes.length, resPerPage);
}