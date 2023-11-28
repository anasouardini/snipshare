# SnipShare - code snippets sharing app | <a href="https://snipshare.anasouardini.online" target="_blank">Check It Live</a>

## The General Idea

I started this project with the intention of learning OAuth 2.0, but it turned out that I ended up learning much more than just that. The idea evolved during the process of building it, and I found myself liking the new direction it took. As a result, I decided to invest more time into its development.

https://user-images.githubusercontent.com/114059811/236328949-a0542a2d-51e8-46c7-904f-cad3a6b3adeb.mp4

## Features

- Users can create frequently used code snippets.
- Snippets can be categorized by language and purpose.
- Other users can search for snippets by name, language, or category.
- Users can grant access to their account or specific snippets to other users.

## Tools Used/Learned

### Common

1. Vite (build tool)
2. NeoVim (code editor/IDE)
3. Learned how to save a bit of performance using techniques
   like `debouncing` and `memoization`.
4. Started using `Git` and `Github` in a better way.
5. Learned how to implement notification system from scratch.

### Front-End

1. React-query
2. React-Router
3. React-icons and Lucide-react
4. Framer-motion and React-auto-animate
5. Redux-toolkit
6. formik
7. Monaco Editor (code editor library)
8. Tailwind

### Back-End

1. Express.js
2. Axios
3. Bcrypt (for storing encrypted passwords)
4. Multer (for file upload)
5. Passportjs (turns out it only makes things harder nowadays)
6. JWT (manually)
7. Google OAuth2.0 manually
8. Notification system with SSE
9. ZOD (input validation)
10. Mysql2 (mysql client, prisma is too much for medium projects)