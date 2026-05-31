# Guide — Ajouter une nouvelle page CRUD (React)

Exemple : page pour gérer les catégories (`/categories`).

---

## 1. Service API

`src/services/categorieService.js` :

```js
import axios from "axios";
import { API_URL } from "./authService";

export const getCategories = async (token) => {
  const response = await axios.get(`${API_URL}categories`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const createCategorie = async (data, token) => {
  const response = await axios.post(`${API_URL}categories`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const updateCategorie = async (id, data, token) => {
  const response = await axios.put(`${API_URL}categories/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const deleteCategorie = async (id, token) => {
  const response = await axios.delete(`${API_URL}categories/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
```

---

## 2. Page principale

`src/pages/Categories.jsx` :

```jsx
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getCategories, createCategorie, updateCategorie, deleteCategorie } from "../services/categorieService";

function Categories() {
  const { token } = useAuth();
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ lib_categorie: "" });
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const data = await getCategories(token);
      setCategories(data);
    } catch {
      setError("Erreur chargement.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await updateCategorie(editId, form, token);
      } else {
        await createCategorie(form, token);
      }
      setForm({ lib_categorie: "" });
      setEditId(null);
      load();
    } catch {
      setError("Erreur sauvegarde.");
    }
  };

  const handleEdit = (cat) => {
    setEditId(cat.id_categorie);
    setForm({ lib_categorie: cat.lib_categorie });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer ?")) return;
    try {
      await deleteCategorie(id, token);
      load();
    } catch {
      setError("Erreur suppression.");
    }
  };

  return (
    <div>
      <h1>Catégories</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={form.lib_categorie}
          onChange={(e) => setForm({ lib_categorie: e.target.value })}
          placeholder="Nom de la catégorie"
          required
        />
        <button type="submit">{editId ? "Modifier" : "Ajouter"}</button>
        {editId && (
          <button type="button" onClick={() => { setEditId(null); setForm({ lib_categorie: "" }); }}>
            Annuler
          </button>
        )}
      </form>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nom</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat) => (
            <tr key={cat.id_categorie}>
              <td>{cat.id_categorie}</td>
              <td>{cat.lib_categorie}</td>
              <td>
                <button onClick={() => handleEdit(cat)}>Modifier</button>
                <button onClick={() => handleDelete(cat.id_categorie)}>Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Categories;
```

---

## 3. Ajouter la route dans App.jsx

```jsx
import Categories from "../pages/Categories.jsx";

// Dans <Routes> :
<Route
  path="/categories"
  element={
    <PrivateRoute>
      <Categories />
    </PrivateRoute>
  }
/>
```

---

## 4. Ajouter le lien dans Navbar.jsx

```jsx
<Link to="/categories" className="navbar-link">
  Catégories
</Link>
```

---

## Récapitulatif fichiers créés/modifiés

| Fichier | Action |
|---------|--------|
| `src/services/categorieService.js` | Créer |
| `src/pages/Categories.jsx` | Créer |
| `src/component/App.jsx` | Ajouter import + route |
| `src/component/Navbar.jsx` | Ajouter lien |
