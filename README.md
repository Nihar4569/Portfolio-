# Nihar Ranjan Sahu's Portfolio

A React and Vite portfolio showcasing my projects, skills, and experience as a software engineer.

## Features

- Searchable project archive with deep-linked case studies.
- Four interactive crew guides with portfolio answers, sources, and project comparisons.
- A portfolio terminal with commands such as `ls projects`, `open course search`, and `ask How does AI automation work?`.
- AI automation walkthrough that shows routing, tool selection, and engineer review.
- Light and dark themes, reduced-motion support, photo albums, and contact.

## Technologies Used

- React and Vite
- Styled Components
- React Router
- Framer Motion
- React Icons
- Gemini (optional server-side enhancement)

## Getting Started

### Prerequisites

- Node.js 20.19 or later and npm

### Installation

1. Clone the repository
   ```
   git clone https://github.com/Nihar4569/Portfolio-.git
   cd Portfolio-
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Run the development server
   ```
   npm run dev
   ```

4. Open the local URL printed by Vite.

`npm test` checks Scout's retrieval, follow-up behavior, and API.

## Project Structure

```
nihar-portfolio/
├── public/                 # Public assets
│   ├── images/             # Image assets
│   │   ├── projects/       # Project images
│   │   └── albums/         # Album photos
├── src/                    # Source code
│   ├── components/         # React components
│   │   ├── common/         # Common components (Navbar, Footer, etc.)
│   │   ├── home/           # Homepage components
│   │   ├── projects/       # Project-related components
│   │   ├── albums/         # Album-related components
│   │   └── contact/        # Contact components
│   ├── context/            # React context
│   ├── data/               # Data files (projects, skills, etc.)
│   ├── pages/              # Page components
│   ├── styles/             # Global styles
│   └── utils/              # Utility functions
```

## Customization Guide

### Adding New Projects

1. Open `src/data/projects.js`
2. Add a new project object to the array with the following structure:
   ```javascript
   {
     id: 6, // Increment from the last ID
     title: "Project Title",
     description: "Project description",
     features: [
       "Feature 1",
       "Feature 2",
       "Feature 3"
     ],
     techStack: ["React", "Node.js", "MongoDB"],
     links: {
       github: "https://github.com/yourusername/project",
       live: "https://project-demo.com"
     },
     image: "/images/projects/project-image.jpg",
     featured: false
   }
   ```
3. Add the project image to `public/images/projects/`

### Adding New Albums

1. Open `src/data/albums.js`
2. Add a new album with its cover, directory, and photo count.
   ```javascript
   {
     id: "album-id",
     title: "Album Title",
     description: "Album description",
     coverImage: "/images/albums/album-id/cover.avif",
     photoDirectory: "/images/albums/album-id",
     photoCount: 1,
     lock: false
   }
   ```
3. Add sequential `photo1.jpg`, `photo2.jpg`, and so on to the album directory in `public/images/albums/`. Place a small AVIF for each photo in `thumbnails/` with the matching filename, such as `thumbnails/photo1.avif`.

### Changing Theme Colors

To customize the theme colors, edit the color variables in `src/styles/theme.js`:

```javascript
// Light theme colors
primary: '#005e85',
secondary: '#266785',
// ...

// Dark theme colors
primary: '#3addfa',
secondary: '#71bbf5',
// ...
```

## Deployment

The Vercel configuration uses the Vite preset and builds to `dist/client` with `npm run build`. Vercel serves `api/crew.js` as a Node function. Locally, `npm run preview` serves the same build with the API available.

The frontend calls `/api/crew` on the same domain for every chat question, including greetings. Each crew member answers in their own specialty, with the last three exchanges and public facts from `src/data/projects.js` and `src/data/profile.js`. The server resolves source IDs to portfolio links. If Gemini is unavailable, the chat uses curated answers marked **Portfolio notes**. The function applies request limits and short-lived caching within each running instance.

Set the server-only `GEMINI_KEY` in the Vercel environments that serve the crew and in an ignored local `.env.local` for development. Existing `GEMINI_API_KEY` settings also work. The default primary is `gemini-3.5-flash-lite`. Set `GEMINI_MODEL=gemini-3.1-flash-lite` to try that model first. The other Flash-Lite model can answer with the same conversation when the primary reaches a limit or fails. Each has its own short cooldown and the function honors Google’s retry delay. Use a key from a Free Tier project for free-tier pricing. [Google AI Studio billing](https://aistudio.google.com/docs/billing)

Project previews use `vercel.json` to select Vite and build to `dist/client`. The static pages and the crew function live in the same Vercel project.

## License

This project is open source and available under the [MIT License](LICENSE).

## Contact

Nihar Ranjan Sahu - nihar4569@gmail.com

GitHub: [github.com/Nihar4569](https://github.com/Nihar4569)
LinkedIn: [linkedin.com/in/nihar4569](https://linkedin.com/in/nihar4569)
