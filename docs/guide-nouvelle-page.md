# Guide — Ajouter une page React avec données Laravel API

Exemple concret : page `/dosages` qui liste, ajoute et supprime des dosages.

---

## Vue d'ensemble — 4 étapes

```
1. Service API     →  src/services/dosageService.js
2. Page React      →  src/pages/Dosages.jsx
3. Route           →  src/component/App.jsx
4. Lien navbar     →  src/component/Navbar.jsx  (optionnel)
```

---

## Étape 1 — Service API

**`src/services/dosageService.js`**

Chaque fonction appelle un endpoint Laravel (`/api/...`) avec le token Bearer.

```js
import axios from "axios";
import { API_URL } from "./authService";

// API_URL = "http://127.0.0.1:8000/api/"

export const getDosages = async (token) => {
  const response = await axios.get(`${API_URL}dosages`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const createDosage = async (data, token) => {
  const response = await axios.post(`${API_URL}dosages`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const deleteDosage = async (id, token) => {
  const response = await axios.delete(`${API_URL}dosages/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
```

> Le token vient de `useAuth()` dans la page (voir étape 2).  
> `API_URL` est défini dans `src/services/authService.js`.

---

## Étape 2 — Page React

**`src/pages/Dosages.jsx`**

Pattern standard du projet : `token` via `useAuth`, `loading` + `error` + `success` en state, Bootstrap pour le rendu.

```jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getDosages, createDosage, deleteDosage } from "../../services/dosageService";

function Dosages() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [dosages, setDosages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Chargement initial
  useEffect(() => {
    if (!token) return;
    getDosages(token)
      .then((data) => setDosages(data || []))
      .catch(() => setError("Erreur lors du chargement."))
      .finally(() => setLoading(false));
  }, [token]);

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer ce dosage ?")) return;
    try {
      await deleteDosage(id, token);
      setDosages((prev) => prev.filter((d) => d.id_dosage !== id));
      setSuccess("Dosage supprimé.");
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de la suppression.");
    }
  };

  if (loading) return <div className="container mt-4"><b>Chargement...</b></div>;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Dosages</h2>
        <button className="btn btn-outline-secondary" onClick={() => navigate(-1)}>Retour</button>
      </div>

      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card">
        <div className="card-body p-0">
          {dosages.length === 0 ? (
            <p className="p-3 mb-0 text-muted">Aucun dosage.</p>
          ) : (
            <table className="table table-bordered table-striped table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th>Quantité</th>
                  <th>Unité</th>
                  <th>Supprimer</th>
                </tr>
              </thead>
              <tbody>
                {dosages.map((d) => (
                  <tr key={d.id_dosage}>
                    <td>{d.qte_dosage}</td>
                    <td>{d.unite_dosage}</td>
                    <td>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(d.id_dosage)}
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dosages;
```

---

## Étape 3 — Route dans App.jsx

**`src/component/App.jsx`** — ajouter l'import et la route :

```jsx
// 1. Import en haut du fichier
import Dosages from "../pages/Dosages.jsx";

// 2. Dans <Routes>, ajouter :
<Route
  path="/dosages"
  element={
    <PrivateRoute>
      <Dosages />
    </PrivateRoute>
  }
/>
```

> `PrivateRoute` redirige vers `/login` si l'utilisateur n'est pas connecté.

---

## Étape 4 — Lien dans la Navbar (optionnel)

**`src/component/Navbar.jsx`** — dans la `<ul className="navbar-nav me-auto">` :

```jsx
<li className="nav-item">
  <Link className="nav-link" to="/dosages">Dosages</Link>
</li>
```

---

## Patterns clés du projet

### Récupérer le token
```jsx
const { token } = useAuth();
```

### Appel API au chargement
```jsx
useEffect(() => {
  if (!token) return;
  monService(token)
    .then((data) => setData(data || []))
    .catch(() => setError("Erreur."))
    .finally(() => setLoading(false));
}, [token]);
```

### Afficher les erreurs Laravel
```jsx
setError(err.response?.data?.message || "Erreur générique.");
```

### Boutons standards
| Action | Classe Bootstrap |
|--------|-----------------|
| Modifier | `btn btn-warning btn-sm` |
| Supprimer | `btn btn-danger btn-sm` |
| Ajouter | `btn btn-success` |
| Retour | `btn btn-outline-secondary` |
| Valider formulaire | `btn btn-primary` |

### Structure HTML standard
```jsx
<div className="container mt-4">
  <div className="d-flex justify-content-between align-items-center mb-3">
    <h2>Titre</h2>
    <button className="btn btn-outline-secondary" onClick={() => navigate(-1)}>Retour</button>
  </div>

  {success && <div className="alert alert-success">{success}</div>}
  {error && <div className="alert alert-danger">{error}</div>}

  <div className="card">
    <div className="card-body p-0">
      <table className="table table-bordered table-striped table-hover mb-0">
        ...
      </table>
    </div>
  </div>
</div>
```

---

## Récapitulatif fichiers

| Fichier | Action |
|---------|--------|
| `src/services/dosageService.js` | Créer |
| `src/pages/Dosages.jsx` | Créer |
| `src/component/App.jsx` | Ajouter import + `<Route>` |
| `src/component/Navbar.jsx` | Ajouter `<Link>` (si lien navbar voulu) |

---

## Endpoints Laravel disponibles

| Méthode | URL | Description |
|---------|-----|-------------|
| GET | `/api/familles` | Liste des familles |
| GET | `/api/dosages` | Liste des dosages |
| GET | `/api/types-individu` | Liste des types individu |
| GET | `/api/medicaments` | Tous les médicaments |
| GET | `/api/medicaments/recherche?nom_commercial=X&id_famille=Y` | Recherche médicaments |
| GET | `/api/medicaments/{id}` | Un médicament |
| GET | `/api/prescriptions/toutes` | Toutes les prescriptions |
| GET | `/api/prescriptions/{id_medicament}` | Prescriptions d'un médicament |
| GET | `/api/prescriptions/stats/top?id_medicament={id}` | Top dosage |
| POST | `/api/prescriptions` | Créer prescription |
| PUT | `/api/prescriptions` | Modifier prescription |
| DELETE | `/api/prescriptions` | Supprimer prescription |

Tous les endpoints (sauf auth) requièrent le header : `Authorization: Bearer {token}`
