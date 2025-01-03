const fileInput = document.getElementById("fileInput");
const fileList = document.getElementById("fileList");
const uploadBtn = document.getElementById("uploadBtn");

window.onload = loadFiles;

// Enviar arquivos para o backend
uploadBtn.addEventListener("click", () => {
  const files = fileInput.files;

  if (!files.length) {
    alert("Nenhum arquivo selecionado.");
    return;
  }

  const formData = new FormData();
  
  // Adicionando arquivos ao FormData
  for (let file of files) {
    formData.append("files", file);
  }

  // Enviar para o servidor
  fetch("http://localhost:3000/upload", {
    method: "POST",
    body: formData,
  })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      loadFiles();  // Recarregar lista de arquivos após upload
    })
    .catch(error => {
      console.error("Erro ao enviar arquivos:", error);
      alert("Erro ao enviar arquivos.");
    });
});

// Carregar arquivos já armazenados
function loadFiles() {
  fileList.innerHTML = "";
  
  fetch("http://localhost:3000/files")
    .then(response => response.json())
    .then(files => {
      files.forEach(file => {
        addFileToList(file.name);
      });
    })
    .catch(error => {
      console.error("Erro ao carregar arquivos:", error);
      alert("Erro ao carregar arquivos.");
    });
}

// Adicionar arquivo à lista
function addFileToList(fileName) {
  const div = document.createElement("div");
  div.className = "file-item";

  div.innerHTML = `
    <span>${fileName}</span>
    <div>
      <button onclick="downloadFile('${fileName}')">Baixar</button>
      <button onclick="deleteFile('${fileName}')">Excluir</button>
    </div>
  `;

  fileList.appendChild(div);
}

// Excluir arquivo
function deleteFile(fileName) {
  fetch(`http://localhost:3000/files/${fileName}`, {
    method: "DELETE",
  })
    .then(response => response.json())
    .then(data => {
      console.log(data);
      loadFiles();
    })
    .catch(error => {
      console.error("Erro ao excluir arquivo:", error);
      alert("Erro ao excluir arquivo.");
    });
}

// Baixar arquivo
function downloadFile(fileName) {
  fetch(`http://localhost:3000/files/${fileName}`)
    .then(response => response.blob())
    .then(blob => {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = fileName;
      a.click();
    })
    .catch(error => {
      console.error("Erro ao baixar arquivo:", error);
      alert("Erro ao baixar arquivo.");
    });
}
