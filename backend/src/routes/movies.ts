import { Router } from "express";

const router = Router();

const movies = [
  { id: 1, title: "Inception", director: "Christopher Nolan", year: 2010 },
  { id: 2, title: "Interstellar", director: "Christopher Nolan", year: 2014 },
  { id: 3, title: "The Matrix", director: "Wachowskis", year: 1999 },
];

// GET /api/movies -> List all movies
router.get("/", (req, res) => {
  res.json(movies);
});

// GET /api/movies/:id -> Get one movie by ID
router.get("/:id", (req, res) => {
  const movieId = Number(req.params.id);
  const movie = movies.find((m) => m.id === movieId);
  if (!movie) return res.status(404).json({ message: "Movie not found" });
  res.json(movie);
});

// POST /api/movies -> Add a new movie
router.post("/", (req, res) => {
  const { title, director, year } = req.body;
  const newMovie = {
    id: movies.length + 1,
    title,
    director,
    year,
  };
  movies.push(newMovie);
  console.log(movies);
  console.log(newMovie);
  res.status(201).json(newMovie);
});

// PUT /api/movies/:id -> Update a movie
router.put("/:id", (req, res) => {
  const movieId = Number(req.params.id);
  const index = movies.findIndex((m) => m.id === movieId);
  if (index === -1) return res.status(404).json({ message: "Movie not found" });

  const { title, director, year } = req.body;
  movies[index] = { ...movies[index], title, director, year };
  console.log(movies[index]);
  res.json(movies[index]);
});

// DELETE /api/movies/:id -> Delete a movie
router.delete("/:id", (req, res) => {
  const movieId = Number(req.params.id);
  const index = movies.findIndex((m) => m.id === movieId);
  if (index === -1) return res.status(404).json({ message: "Movie not found" });

  const deleted = movies.splice(index, 1);
  res.json(deleted[0]);
});

export default router;
