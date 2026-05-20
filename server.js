const express = require("express");
const fs = require("fs").promises;
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const DB_PATH = path.join(__dirname, "books.json");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

async function readBooks() {
  try {
    const data = await fs.readFile(DB_PATH, "utf8");
    return JSON.parse(data);
  } catch (error) {
    if (error.code === "ENOENT") return [];
    throw error;
  }
}

async function writeBooks(books) {
  await fs.writeFile(DB_PATH, JSON.stringify(books, null, 2));
}

app.get("/books", async (req, res) => {
  try {
    const books = await readBooks();
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la lecture des données" });
  }
});

app.get("/books/:id", async (req, res) => {
  try {
    const books = await readBooks();
    const id = parseInt(req.params.id, 10);
    const book = books.find((b) => b.id === id);

    if (!book) {
      return res.status(404).json({ error: "Livre non trouvé" });
    }
    res.json(book);
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

app.post("/books", async (req, res) => {
  try {
    const { title, author, description = "" } = req.body;

    if (!title || !author) {
      return res.status(400).json({ error: "title et author sont requis" });
    }

    const books = await readBooks();
    const nextId = books.length > 0 ? Math.max(...books.map((b) => b.id)) + 1 : 1;

    const newBook = {
      id: nextId,
      title,
      author,
      description,
    };

    books.push(newBook);
    await writeBooks(books);
    res.status(201).json(newBook);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la création du livre" });
  }
});

app.put("/books/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const { title, author, description = "" } = req.body;

    if (!title || !author) {
      return res
        .status(400)
        .json({ error: "title et author sont requis pour un remplacement complet (PUT)" });
    }

    const books = await readBooks();
    const index = books.findIndex((b) => b.id === id);

    if (index === -1) {
      return res.status(404).json({ error: "Livre non trouvé" });
    }

    const updatedBook = {
      id,
      title,
      author,
      description,
    };

    books[index] = updatedBook;
    await writeBooks(books);
    res.json(updatedBook);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la modification" });
  }
});

app.patch("/books/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const books = await readBooks();
    const index = books.findIndex((b) => b.id === id);

    if (index === -1) {
      return res.status(404).json({ error: "Livre non trouvé" });
    }

    const current = books[index];
    const updatedBook = {
      ...current,
      ...req.body,
      id,
    };

    books[index] = updatedBook;
    await writeBooks(books);
    res.json(updatedBook);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la modification partielle" });
  }
});

app.delete("/books/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    const books = await readBooks();
    const newBooks = books.filter((b) => b.id !== id);

    if (newBooks.length === books.length) {
      return res.status(404).json({ error: "Livre non trouvé" });
    }

    await writeBooks(newBooks);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de la suppression" });
  }
});

app.get("/", (req, res) => {
  res.redirect(301, "/books");
});

app.use((req, res) => {
  res.status(404).json({
    error: "Route non trouvée",
    message: "Consultez /books pour accéder aux données.",
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
