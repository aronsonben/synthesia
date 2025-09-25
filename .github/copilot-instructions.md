# Copilot Instructions for Synthesia

## Overview
Synthesia is a platform for crowdsourced color palettes tailored to music. This project is built using Next.js with TypeScript and integrates Tailwind CSS for styling. It features a modular architecture with distinct directories for actions, components, pages, and utilities.

## Key Directories and Files
- **`app/`**: Contains the Next.js app directory structure, including layouts, pages, and route-specific components.
  - Example: `app/[artistName]/[trackId]/page.tsx` handles dynamic routing for artist and track pages.
- **`components/`**: Houses reusable UI components, organized by feature or domain.
  - Example: `components/synthesia/` includes components like `add-track.tsx` and `track-page.tsx`.
- **`actions/`**: Contains logic for handling specific actions, grouped by feature.
  - Example: `actions/notes/actions.tsx` manages note-related actions.
- **`utils/`**: Utility functions and helpers.
  - Example: `utils/supabase/` includes Supabase client setup and database interaction utilities.
- **`lib/`**: Shared interfaces and core utilities.

## Development Workflow
1. **Start the Development Server**:
   ```bash
   npm run dev
   ```
2. **Build the Project**:
   ```bash
   npm run build
   ```
3. **Lint and Format Code**:
   ```bash
   npm run lint
   ```

## Project-Specific Conventions
- **Dynamic Routing**: The `app/` directory uses dynamic route segments (e.g., `[artistName]`, `[trackId]`) to handle user-specific and track-specific pages.
- **Component Organization**: Components are grouped by feature or domain, ensuring modularity and reusability.
- **Styling**: Tailwind CSS is used for styling. Refer to `tailwind.config.ts` for customizations.
- **State Management**: Actions are centralized in the `actions/` directory, promoting a clear separation of concerns.

## External Integrations
- **Supabase**: Used for database interactions and authentication. Configuration files are in `utils/supabase/`.
- **PostCSS**: Configured via `postcss.config.js` for CSS processing.

## Examples of Patterns
- **Adding a New Note**:
  - Update `components/notes/add-note.tsx` to include the UI for adding a note.
  - Implement the logic in `actions/notes/actions.tsx`.
- **Dynamic Page for Tracks**:
  - Modify `app/[artistName]/[trackId]/page.tsx` to customize the track page.

## Testing and Debugging
- **Error Pages**: Custom error pages are located in `app/[artistName]/error.tsx` and similar directories.
- **Debugging Utilities**: Use `utils/` for reusable debugging helpers.

## Notes
- Ensure all new components follow the established directory structure and naming conventions.
- Document any new patterns or workflows in this file to assist future contributors.