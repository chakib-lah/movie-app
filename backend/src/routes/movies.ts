import { Router } from "express";
import { Movie } from "../models/movie.model";

const router = Router();

// const movies = [
//   { id: 1, title: "Inception", director: "Christopher Nolan", year: 2010 },
//   { id: 2, title: "Interstellar", director: "Christopher Nolan", year: 2014 },
//   { id: 3, title: "The Matrix", director: "Wachowskis", year: 1999 },
// ];

// GET /api/movies -> List all movies
router.get("/", async (req, res) => {
  const movies = await Movie.find();
  res.json(movies);
});

// GET /api/movies/:id -> Get one movie by ID
router.get("/:movieId", async (req, res) => {
  const movieId = req.params.movieId;
  //   const movie = movies.find((m) => m.id === movieId);
  const movie = await Movie.findById(movieId);
  if (!movie) return res.status(404).json({ message: "Movie not found" });
  res.json(movie);
});

// POST /api/movies -> Add a new movie
router.post("/", async (req, res) => {
  const { title, director, year } = req.body;
  const newMovie = new Movie({ title, director, year });
  await newMovie.save();
  //   movies.push(newMovie);
  res.status(201).json(newMovie);
});

// PUT /api/movies/:id -> Update a movie
router.put("/:movieId", async (req, res) => {
  const movieId = req.params.movieId;
  //   const index = movies.findIndex((m) => m.id === movieId);
  const updated = await Movie.findByIdAndUpdate(movieId, req.body, {
    new: true,
  });
  if (!updated) return res.status(404).json({ message: "Movie not found" });
  res.json(updated);

  //   if (index === -1) return res.status(404).json({ message: "Movie not found" });
  //   const { title, director, year } = req.body;
  //   movies[index] = { ...movies[index], title, director, year };
  //   res.json(movies[index]);
});

// DELETE /api/movies/:id -> Delete a movie
router.delete("/:movieId", async (req, res) => {
  const movieId = req.params.movieId;
  const deleted = await Movie.findByIdAndDelete(movieId);
  if (!deleted) return res.status(404).json({ message: "Movie not found" });
  res.json(deleted);

  //   const index = movies.findIndex((m) => m.id === movieId);
  //   if (index === -1) return res.status(404).json({ message: "Movie not found" });
  //   const deleted = movies.splice(index, 1);
  //   res.json(deleted[0]);
});

export default router;
