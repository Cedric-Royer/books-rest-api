# Books REST API

API REST construite avec Node.js et Express permettant de gérer une collection de livres et de manipuler les méthodes HTTP principales (GET, POST, PUT, PATCH, DELETE).

## Routes disponibles

| Méthode | URL          | Description                    | Statut (Succès) |
| ------- | ------------ | ------------------------------ | --------------- |
| GET     | `/books`     | Récupère tous les livres       | 200 OK          |
| GET     | `/books/:id` | Récupère un livre par son id   | 200 OK          |
| POST    | `/books`     | Ajoute un nouveau livre        | 201 Created     |
| PUT     | `/books/:id` | Remplace complètement un livre | 200 OK          |
| PATCH   | `/books/:id` | Modifie partiellement un livre | 200 OK          |
| DELETE  | `/books/:id` | Supprime un livre              | 204 No Content  |

## Installer les dépendances

## Lancer le serveur

```bash
npm install
```

```bash
npm run start
```

Le serveur tourne sur http://localhost:3000.

## Exemple de corps pour POST /books

```json
{
  "title": "Titre",
  "author": "Auteur",
  "description": "Optionnel"
}
```

## Fichiers

- server.js : Serveur Express et logique des routes (opérations asynchrones)
- books.json : Stockage persistant des données au format JSON
