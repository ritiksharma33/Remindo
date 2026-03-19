# 🧠 Remindo: The Mental External Hard Drive

"Your brain is for having ideas, not holding them. Remindo does the holding." 

**Remindo** is a high-performance "Brain Dump" application. It doesn't just store notes; it manages your cognitive load by tracking memory decay, visualizing time, and gamifying your goals.

---

## 📺 See Remindo in Action
[Drop your Demo GIF or Screen Recording here! Just drag the file into this spot on GitHub]

---

## 🌟 Why Remindo? (The Problem)
Standard note apps are "graveyards" where ideas go to be forgotten. I built Remindo to solve:
* **The Forgetting Curve:** Most ideas vanish in 24 hours. Remindo tracks this curve to keep your best thoughts alive.
* **Time Blindness:** We overestimate how much year is left. Remindo shows you the ticking clock.
* **Cognitive Overload:** Integrated **Clerk Auth** for instant, secure access so you can dump thoughts and get back to work.

---

## 🛠️ The Tech Stack
| Category | Tool | Why? |
| :--- | :--- | :--- |
| **Framework** | Next.js / React | Lightning-fast routing and SSR. |
| **Auth** | **Clerk** | Secure, managed sessions and social login. |
| **Styling** | Tailwind CSS | Rapid UI development with a clean aesthetic. |
| **Database** | Prisma / MongoDB | Structured storage for unstructured thoughts. |

---

## ✨ Key Features (v1.0)
* 🔐 **Clerk-Powered Security:** Enterprise-grade authentication. Your brain dump is for your eyes only.
* 📉 **Memory Decay Tracker:** Built-in logic based on the **Ebbinghaus Forgetting Curve** to remind you of entries before they slip away.
* ⏳ **Life Dashboard:** Real-time visualizers showing % of the day passed and % of the year remaining. 
* 🎯 **Goal Timelines:** Set goals (e.g., "Summer Internship in 60 Days") and see a high-stakes countdown that keeps you moving.
* 🔍 **Time-Travel Search:** Search through your "Memories" by specific dates or keywords to see what you were thinking a week, month, or year ago.

---

## 🛡️ Security & Privacy
By using **Clerk**, Remindo ensures:
1. **JWT Validation:** Every request is verified.
2. **Data Isolation:** Your notes are tied strictly to your unique Clerk UserID.
3. **MFA Ready:** Option to enable Multi-Factor Auth for your most sensitive data.

---

## 🚀 Roadmap: What's coming in v2.0
- [ ] **AI Summarization:** Automatically turn a messy dump into a clean bulleted list.
- [ ] **Dark Mode:** For those 3 AM "Eureka!" moments.
- [ ] **Voice-to-Text:** Dump your brain while on the move.

---

## 💻 Local Setup
1. **Clone:** `git clone https://github.com/yourusername/remindo.git`
2. **Install:** `npm install`
3. **Env Setup:** Create a `.env` file and add your `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`.
4. **Run:** `npm run dev`

Built with ❤️ to keep the mind clear. Check out my other projects on [GitHub](https://github.com/ritiksharma33).