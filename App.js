const searchInput = document.getElementById('searchInput');
const recipeList = document.getElementById('recipeList');

//We'll use the "Meal DB" API to fetch recipe data.

function searchRecipes() {
    const searchTerm = searchInput.value;

    if (searchTerm.trim() === '') {
        alert('Please enter a search term.');
        return;
    }

    const apiUrl = `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            displayRecipes(data.meals);
        })
        .catch(error => {
            console.error('Error fetching recipe data:', error);
            alert('Error fetching recipe data. Please try again.');
        });
}

function displayRecipes(meals) {
    recipeList.innerHTML = '';

    if (meals === null) {
        recipeList.innerHTML = '<p>No recipes found. Please try a different search term.</p>';
        return;
    }

    meals.forEach(meal => {
        const recipeCard = document.createElement('div');
        recipeCard.classList.add('recipe-card');

        recipeCard.innerHTML = `
            <h2>${meal.strMeal}</h2>
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
            <p>${meal.strInstructions.substring(0, 100)}...</p>
            <button onclick="showIngredients('${meal.idMeal}')">View Ingredients</button>
        `;

        recipeList.appendChild(recipeCard);
    });
}

function showIngredients(mealId) {
    const apiUrl = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            const ingredients = getIngredientsList(data.meals[0]);
            alert(`Ingredients:\n${ingredients}`);
        })
        .catch(error => {
            console.error('Error fetching ingredient data:', error);
            alert('Error fetching ingredient data. Please try again.');
        });
}

function getIngredientsList(meal) {
    let ingredientsList = '';

    for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];

        if (ingredient && measure) {
            ingredientsList += `${ingredient}: ${measure}\n`;
        } else {
            break;
        }
    }

    return ingredientsList;
}