window.onload = () => {
  main("all");
};

const main = async (category) => {
  const loadingElement = document.getElementById("loading");
  const resultElement = document.getElementById("result");

  loadingElement.style.display = "block";
  resultElement.style.display = "none";

  resultElement.innerHTML = "";

  try {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const characters = await fetchKimetsuApi(category);
    console.log(characters);
    createView(characters);
  } catch (error) {
    console.error(`エラーが発生しました (${error})`);
  }

  loadingElement.style.display = "none";
  resultElement.style.display = "flex";
}

const fetchKimetsuApi = async (category) => {
  const baseUrl = "https://ihatov08.github.io/kimetsu_api/api";
  const url = `${baseUrl}/${category}.json`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }
  return await response.json();
}

const createView = (characters) => {
  const resultElement = document.getElementById("result");
  const charactersByCategory = characters.reduce((acc, character) => {
    if (!acc[character.category]) {
      acc[character.category] = [];
    }
    acc[character.category].push(character);
    return acc;
  }, {});

  Object.entries(charactersByCategory).forEach(([category, characters]) => {
    const categoryElement = document.createElement("div");
    categoryElement.classList.add("category");

    const categoryTitle = document.createElement("h2");
    categoryTitle.textContent = category;
    categoryElement.appendChild(categoryTitle);

    characters.forEach((character) => {
      const characterElement = document.createElement("div");
      characterElement.classList.add("character");

      const nameElement = document.createElement("h3");
      nameElement.textContent = character.name;

      const imageElement = new Image();
      imageElement.src = `https://ihatov08.github.io${character.image}`;
      imageElement.classList.add("character-image");

      characterElement.appendChild(nameElement);
      characterElement.appendChild(imageElement);

      categoryElement.appendChild(characterElement);
    });

    resultElement.appendChild(categoryElement);
  });
}
