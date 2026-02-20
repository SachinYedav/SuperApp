# Skill Arcade 🎮

Welcome to the **Skill Arcade**—your personal digital gymnasium. Designed to sharpen your cognitive abilities, muscle memory, and focus, the Skill Arcade offers a suite of high-performance mini-games. Whether you are warming up before an intense coding session, practicing your aim for a competitive game, or just taking a productive break, this is your training ground.

> **Pro Tip:** For the most accurate results in timing-based tests (like Reaction Time and Aim Trainer), we recommend using a wired mouse and a high-refresh-rate monitor to reduce hardware latency.

## 🧭 Workspace Navigation

The Skill Arcade features a distraction-free, immersive UI to keep you in the zone:
* **Desktop Users:** Quickly switch between different training modules using the vertical sidebar on the left.
* **Mobile Users:** Navigate via the pill-shaped tabs at the top of your screen. **Don't forget to swipe left or right** on the tab bar to reveal all available games!

---

## 🕹️ The Training Modules

### 1. Reaction Time
Test your pure visual reflexes.
* **How it works:** The screen will turn red. Wait for it to turn green, then click as fast as humanly possible.
* **Metric:** Measured in milliseconds (ms). The average human reaction time is around 250ms—can you beat it?

### 2. Aim Trainer
Sharpen your mouse precision and hand-eye coordination.
* **How it works:** Targets will appear randomly across the canvas. Click them as quickly and accurately as possible before the time runs out.
* **Metric:** Measures your average time per target and overall hit accuracy.

### 3. Speed Typer
Improve your keyboard fluency and typing speed.
* **How it works:** Type the displayed text as fast as you can. The tool instantly highlights errors and tracks your keystrokes.
* **Metric:** Calculated in WPM (Words Per Minute) with an accuracy percentage. 

### 4. Memory Matrix
Train your spatial memory and pattern recognition.
* **How it works:** A grid of tiles will flash a specific pattern for a few seconds. Once hidden, you must recreate the exact pattern by clicking the correct tiles.
* **Progression:** The grid gets larger and the patterns get more complex with each successful round.

### 5. Mental Math
Keep your brain sharp under pressure.
* **How it works:** Solve basic to advanced arithmetic problems (addition, subtraction, multiplication, division) before the timer expires.

### 6. Number Memory
Test your short-term numeric retention.
* **How it works:** A number will flash on the screen. Type it out from memory. With every correct answer, the number grows by one digit. 

### 7. Hall of Fame 🏆
Your personal leaderboard.
* All your high scores are securely synced to your Appwrite Cloud profile. Track your improvement over time and see how you stack up against your past self!

---

## 🔒 Under the Hood: Precision Timing

In web-based games, standard JavaScript timers (like `setTimeout` or `Date.now()`) are notoriously inaccurate. They depend on the browser's main thread, meaning a slight background lag could add 15–50ms to your reaction time, ruining your score.

To guarantee e-sports level accuracy, SuperApp's Skill Arcade bypasses standard dates and uses the browser's **High Resolution Time API**.

**How we calculate exact reaction times (Internal Engine Snippet):**
```javascript
// High-Precision Timing Logic
let startTime;

export function startStimulus() {
    // performance.now() is accurate to 5 microseconds (0.005ms)
    // and is not affected by system clock adjustments.
    startTime = performance.now(); 
    renderGreenScreen();
}

export function handleUserClick() {
    if (!startTime) return; // Prevent early clicks
    
    const endTime = performance.now();
    const reactionTimeMs = Math.round(endTime - startTime);
    
    console.log(`Reacted in: ${reactionTimeMs}ms`);
    return reactionTimeMs;
}

```

> 🔗 **Open Source Trust:** Check out the precise logic powering these tests on our GitHub.
> **[View the Skill Arcade source code on our GitHub Repository ↗](https://github.com/SachinYedav/SuperApp/tree/main/src/features/arcade)**

