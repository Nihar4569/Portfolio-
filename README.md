# Nihar Ranjan Sahu's Portfolio

A modern, unique portfolio website built with React, showcasing my projects, skills, and experience as a software engineer.

## Features

- **Responsive Design**: Optimized for all devices (desktop, tablet, and mobile)
- **Dark/Light Mode**: Interactive theme toggle with custom animations
- **Project Showcase**: Display all my projects with filtering capabilities
- **Protected Albums**: Password-protected photo galleries
- **Interactive UI**: Modern UI elements with animations and transitions
- **Contact Form**: Easy way for potential employers to get in touch

## Technologies Used

- React.js
- Styled Components
- React Router
- Framer Motion
- React Icons
- React TsParticles
- Typewriter Effect

## Getting Started

### Prerequisites

- Node.js (v14.0.0 or higher)
- npm (v6.0.0 or higher)

### Installation

1. Clone the repository
   ```
   git clone https://github.com/yourusername/portfolio.git
   cd portfolio
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Start the development server
   ```
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) to view the website in your browser

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
2. Add a new album object to the array with the following structure:
   ```javascript
   {
     id: "album-id",
     title: "Album Title",
     description: "Album description",
     coverImage: "/images/albums/album-cover.jpg",
     secretCode: "yourpassword",
     photos: [
       {
         id: 1,
         url: "/images/albums/album-id/photo1.jpg",
         caption: "Photo caption"
       },
       // More photos...
     ]
   }
   ```
3. Add the album cover and photos to the appropriate folders in `public/images/albums/`

### Changing Theme Colors

To customize the theme colors, edit the color variables in `src/styles/theme.js`:

```javascript
// Light theme colors
primary: '#3498db',
secondary: '#2ecc71',
// ...

// Dark theme colors
primary: '#00bcd4',
secondary: '#00e676',
// ...
```

## Deployment

### Build for Production

```
npm run build
```

This creates an optimized production build in the `build` folder that can be deployed to any static hosting service.

### Hosting Suggestions

- Vercel
- Netlify
- GitHub Pages
- Firebase Hosting
- AWS Amplify

## License

This project is open source and available under the [MIT License](LICENSE).

## Contact

Nihar Ranjan Sahu - nihar4569@gmail.com

GitHub: [github.com/Nihar4569](https://github.com/Nihar4569)
LinkedIn: [linkedin.com/in/nihar4569](https://linkedin.com/in/nihar4569)