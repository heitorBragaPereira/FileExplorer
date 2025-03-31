async function searchFiles() {
  const searchName = document.getElementById("search").value.trim();
  const resultsList = document.getElementById("results");
  const resultsListTitle = document.getElementById("resultsTitle");
  const loader = document.getElementById("loader");

  if (!searchName) {
    alert("Digite um nome para buscar!");
    return;
  }

  // Mostrar o loader antes da requisição
  loader.style.display = "inline-block"; // Exibe o loader
  //   resultsList.innerHTML = "Buscando...";

  try {
    const response = await fetch(
      `http://localhost:3000/search?searchName=${searchName}`
    );
    const data = await response.json();

    resultsList.innerHTML = ""; // Limpa os resultados anteriores

    if (data.paths.length > 0) {
      resultsListTitle.innerHTML = "Resultado encontrado";
      data.paths.forEach((path) => {
        const li = document.createElement("li");
        li.textContent = path;
        resultsList.appendChild(li);
      });
    } else {
      resultsList.innerHTML = "<li>Nenhum arquivo encontrado.</li>";
    }
  } catch (error) {
    console.error("Erro na requisição:", error);
    resultsList.innerHTML = "<li>Erro ao buscar arquivos.</li>";
  } finally {
    // Esconder o loader depois da requisição
    loader.style.display = "none"; // Esconde o loader
  }
}
