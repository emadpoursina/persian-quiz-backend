import { exampleQuizzes, exampleResults } from "./ExampleData";

// Storage keys
const QUIZZES_KEY = "adminQuizzes";
const RESULTS_KEY = "adminResults";
const INITIALIZED_KEY = "systemInitialized";

// Initialize system with example data if not already done
function initializeSystem() {
  if (typeof window === "undefined") return;

  const isInitialized = localStorage.getItem(INITIALIZED_KEY);

  if (!isInitialized) {
    // Set example data as the initial system data
    localStorage.setItem(QUIZZES_KEY, JSON.stringify(exampleQuizzes));
    localStorage.setItem(RESULTS_KEY, JSON.stringify(exampleResults));
    localStorage.setItem(INITIALIZED_KEY, "true");
  }
}

// Get quizzes from storage
export function getQuizzes() {
  if (typeof window === "undefined") return [];

  initializeSystem();

  const saved = localStorage.getItem(QUIZZES_KEY);
  return saved ? JSON.parse(saved) : [];
}

// Save quizzes to storage
export function saveQuizzes(quizzes) {
  if (typeof window === "undefined") return;
  localStorage.setItem(QUIZZES_KEY, JSON.stringify(quizzes));
}

// Get results from storage
export function getResults() {
  if (typeof window === "undefined") return [];

  initializeSystem();

  const saved = localStorage.getItem(RESULTS_KEY);
  return saved ? JSON.parse(saved) : [];
}

// Save results to storage
export function saveResults(results) {
  if (typeof window === "undefined") return;
  localStorage.setItem(RESULTS_KEY, JSON.stringify(results));
}

// Add a new result
export function addResult(result) {
  const results = getResults();
  results.push(result);
  saveResults(results);
}

// Get quiz by ID
export function getQuizById(id) {
  const quizzes = getQuizzes();
  return quizzes.find((q) => q.id === id) || null;
}

// Get quiz by slug
export function getQuizBySlug(slug) {
  const quizzes = getQuizzes();
  return quizzes.find((q) => q.slug === slug) || null;
}

// Update quiz
export function updateQuiz(updatedQuiz) {
  const quizzes = getQuizzes();
  const index = quizzes.findIndex((q) => q.id === updatedQuiz.id);
  if (index !== -1) {
    quizzes[index] = updatedQuiz;
    saveQuizzes(quizzes);
  }
}

// Add new quiz
export function addQuiz(quiz) {
  const quizzes = getQuizzes();
  quizzes.push(quiz);
  saveQuizzes(quizzes);
}

// Delete quiz
export function deleteQuiz(quizId) {
  const quizzes = getQuizzes();
  const results = getResults();

  // Remove quiz
  const updatedQuizzes = quizzes.filter((q) => q.id !== quizId);
  saveQuizzes(updatedQuizzes);

  // Remove related results
  const updatedResults = results.filter((r) => r.quizId !== quizId);
  saveResults(updatedResults);
}

// Get results for a specific quiz
export function getQuizResults(quizId) {
  const results = getResults();
  return results.filter((r) => r.quizId === quizId);
}
