// const readline = require("readline");
// const { spawn } = require("child_process");

// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout,
// });

// // Pergunta o sistema operacional
// rl.question("Qual o sistema operacional? (Windows/Linux): ", (system) => {
//   system = system.toLowerCase().trim();

//   // Pergunta o nome do arquivo ou pasta a ser buscado
//   rl.question("Qual o nome do arquivo ou pasta? ", (searchName) => {
//     searchName = searchName.trim();
//     let command, args;
//     const results = []; // Array para armazenar os caminhos encontrados

//     if (system === "windows") {
//       command = "cmd";
//       args = ["/c", `dir C:\\ /s /b | findstr /i "${searchName}"`];
//     } else if (system === "linux") {
//       command = "find";
//       args = ["/", "-iname", `*${searchName}*`];
//     } else {
//       console.error(
//         'Sistema operacional inválido. Digite "Windows" ou "Linux".'
//       );
//       rl.close();
//       return;
//     }

//     console.log(`Pesquisando por "${searchName}"...`);

//     // Inicia o processo e armazena os resultados
//     const proc = spawn(command, args, { shell: true });

//     proc.stdout.on("data", (data) => {
//       const paths = data
//         .toString()
//         .split("\n")
//         .map((line) => line.trim())
//         .filter((line) => line);
//       results.push(...paths);
//     });

//     proc.stderr.on("data", (data) => {
//       console.error("Erro:", data.toString());
//     });

//     proc.on("close", (code) => {
//       console.log(`Processo encerrado com código ${code}`);
//       if (results.length > 0) {
//         console.log("Arquivos encontrados:");
//         console.log(results.join("\n"));
//       } else {
//         console.log("Nenhum arquivo ou pasta encontrado.");
//       }
//       rl.close();
//     });
//   });
// });

// const express = require("express");
// const { spawn } = require("child_process");
// const cors = require("cors");

// const app = express();
// const PORT = 3000;

// app.use(cors()); // Permite requisições do frontend
// app.use(express.json()); // Habilita JSON no corpo da requisição

// // Rota para buscar arquivos/pastas
// app.get("/search", (req, res) => {
//   const { system, searchName } = req.query;

//   if (!system || !searchName) {
//     return res
//       .status(400)
//       .json({ error: "Parâmetros 'system' e 'searchName' são obrigatórios!" });
//   }

//   let command, args;
//   const results = [];

//   if (system.toLowerCase() === "windows") {
//     command = "cmd";
//     args = ["/c", `dir C:\\ /s /b | findstr /i "${searchName}"`];
//   } else if (system.toLowerCase() === "linux") {
//     command = "find";
//     args = ["/", "-iname", `*${searchName}*`];
//   } else {
//     return res.status(400).json({
//       error: "Sistema operacional inválido. Use 'Windows' ou 'Linux'.",
//     });
//   }

//   console.log(`Pesquisando por "${searchName}" no ${system}...`);

//   const proc = spawn(command, args, { shell: true });

//   proc.stdout.on("data", (data) => {
//     const paths = data
//       .toString()
//       .split("\n")
//       .map((line) => line.trim())
//       .filter((line) => line);
//     results.push(...paths);
//   });

//   proc.stderr.on("data", (data) => {
//     console.error("Erro:", data.toString());
//   });

//   proc.on("close", (code) => {
//     console.log(`Processo encerrado com código ${code}`);
//     res.json({ paths: results, status: code });
//   });
// });

// // Inicia o servidor
// app.listen(PORT, () => {
//   console.log(`Servidor rodando em http://localhost:${PORT}`);
// });

const express = require("express");
const { spawn } = require("child_process");
const cors = require("cors");
const os = require("os");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Função para detectar o sistema operacional
const getSystemOS = () => {
  const platform = os.platform();
  if (platform === "win32") return "windows";
  if (platform === "linux") return "linux";
  return null;
};

app.get("/search", (req, res) => {
  const { searchName } = req.query;
  if (!searchName) {
    return res
      .status(400)
      .json({ error: "Parâmetro 'searchName' é obrigatório!" });
  }

  const system = getSystemOS();
  if (!system) {
    return res
      .status(500)
      .json({ error: "Sistema operacional não suportado." });
  }

  let command, args;
  const results = [];

  if (system === "windows") {
    command = "cmd";
    args = ["/c", `dir C:\\ /s /b | findstr /i "${searchName}"`];
  } else if (system === "linux") {
    command = "find";
    args = ["/", "-iname", `*${searchName}*`];
  }

  console.log(`Pesquisando por "${searchName}" no ${system}...`);

  const proc = spawn(command, args, { shell: true });

  proc.stdout.on("data", (data) => {
    const paths = data
      .toString()
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line);
    results.push(...paths);
  });

  proc.stderr.on("data", (data) => {
    console.error("Erro:", data.toString());
  });

  proc.on("close", (code) => {
    console.log(`Processo encerrado com código ${code}`);
    res.json({ paths: results, status: code });
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
