# SnipShare - code snippets sharing project

## The General Idea

I started this project just to learn `OAuth2.0`, and I ended up learning
more than that, because the idea have changed in the process of making
it and then I liked it and wanted to spend more time building it.

## Features

- Users can create a snippet that is used often
- The snippet can be categorized by language and purpose
- Other users may search for a snippet by name or category. 
- Other users can be allowed to have access to your account or a specific snippet

The back-end is separate from the front-end so it can be used with any
client like an IDE as an example.

## Tools Used/Learned In This Project

### Common
1. Vite (build tool)
3. NeoVim (code editor/IDE)
4. Learned how to save a bit of performance using techniques
  like `debouncing` and `memoization`, and started using
  `Git` and `Github` in a better way.
6. Learned how to implement notification system from scratch.

### Front-End

1. Eeact-query
3. React-Router
4. Eeact-icons
5. React-auto-animate
6. Tailwind
7. Monaco Editor (code editor library)

### Back-End

1. Express.js
2. Axios
3. Bcrypt (for storing encrypted passwords)
4. Multer (for file upload)
5. Passportjs (turns out it only makes things harder)
6. JWT manually
7. google OAuth2.0 manually
8. Notification system with SSE
9. ZOD (input validation)
10. Mysql2 (mysql client, prisma is too much for medium projects)
