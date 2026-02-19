const QUOTES = [
    "The quick brown fox jumps over the lazy dog.",
    "Programming is the art of telling another human what one wants the computer to do.",
    "Simplicity is the soul of efficiency.",
    "Code is like humor. When you have to explain it, it is bad.",
    "Fix the cause, not the symptom.",
    "Optimism is an occupational hazard of programming: feedback is the treatment.",
    "Before software can be reusable it first has to be usable."
];

export const getRandomQuote = () => {
    return QUOTES[Math.floor(Math.random() * QUOTES.length)];
};