# Live portfolio

- This checkout is for the existing portfolio at https://itsnihar.vercel.app/. Work on `v2` and preserve `main` and the `ai_portfolio` snapshot. Use the personal Git identity `nihar4569 <nihar4569@gmail.com>`. Push or publish only on request.
- Use the approved cinematic portrait and four crew members in the existing portfolio. Keep the title `Software Engineer`, the portrait in its own layout space, and the existing Work, Albums, and Contact routes.
- Use short, reduced-motion-aware animations. Scout guides the portfolio, Pip explains AI workflows, Atlas explains architecture, and Byte explains backend performance.
- Use near-black and electric blue from the approved blue reference across this checkout. Light mode uses cool blue-gray surfaces. Keep the portrait and crew, including their blue lighting.
- Match the wider 110% desktop reference at default browser zoom. The hero fills the first desktop viewport below the header so About starts on scroll. Keep the compact layout for short laptops and a stacked layout on phones.
- Preserve the original coding loader and its route-specific messages. Each full page navigation eases the outgoing page away, shows the loader, and reveals the ready page. Respect reduced motion and keep same-page interactions immediate.
- Keep opt-in interaction sounds and the functional portfolio terminal. Show project, technology, and hackathon counts on Projects.
- Keep project facts in `src/data/projects.js` and profile facts in `src/data/profile.js`. Ground each crew member's Gemini answers in those sources. Use a Gemini Free Tier project, keep its key server-side, and fall back to curated answers on errors or quota limits.
- Send conversational questions, including greetings, to Gemini with the selected guide and a short turn history. Keep source links tied to published portfolio data. Keep all routes, navigation, and overlays usable at phone, tablet, and desktop sizes, including short landscape viewports.
- The Vercel preset is Vite with output in `dist/client`. Build and preview locally before handing off changes.
