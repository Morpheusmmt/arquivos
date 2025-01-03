const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const cors = require("cors");
const app = express();
const port = 3000;

// Usando CORS para permitir requisições de outro domínio
app.use(cors());

// Conectar ao MongoDB (substitua pela sua URL)
mongoose.connect('mongodb+srv://1maidamartins:Maida0501@arquivo.1dc1e.mongodb.net/?retryWrites=true&w=majority&appName=arquivo')
  .then(() => console.log("Conectado ao MongoDB Atlas"))
  .catch((err) => console.error("Erro de conexão ao MongoDB Atlas:", err));

// Definindo o esquema de arquivo
const fileSchema = new mongoose.Schema({
  name: String,
  data: Buffer,
  contentType: String,
});

const File = mongoose.model('File', fileSchema);

// Configuração do Multer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Rota para upload de arquivos
app.post("/upload", upload.array("files"), (req, res) => {
  const files = req.files;
  const filePromises = files.map(file => {
    const newFile = new File({
      name: file.originalname,
      data: file.buffer,
      contentType: file.mimetype,
    });
    return newFile.save();
  });

  Promise.all(filePromises)
    .then(() => res.json({ message: "Arquivos enviados com sucesso!" }))
    .catch(err => res.status(500).json({ error: err.message }));
});

// Rota para listar arquivos
app.get("/files", async (req, res) => {
    try {
      const files = await File.find({});
      res.json(files);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

// Rota para excluir um arquivo
app.delete("/files/:fileName", async (req, res) => {
    try {
      const result = await File.deleteOne({ name: req.params.fileName });
      if (result.deletedCount === 0) {
        return res.status(404).json({ message: "Arquivo não encontrado!" });
      }
      res.json({ message: "Arquivo excluído com sucesso!" });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  

// Rota para baixar um arquivo
app.get("/files/:fileName", async (req, res) => {
    try {
      const file = await File.findOne({ name: req.params.fileName });
      if (!file) {
        return res.status(404).json({ message: "Arquivo não encontrado!" });
      }
  
      res.setHeader("Content-Type", file.contentType);
      res.send(file.data);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});