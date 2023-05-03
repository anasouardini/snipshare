# SnipShare - code snippets sharing project

## The General Idea

I started this project just to learn `OAuth2.0`, and I ended up learning more than that, because the idea have changed in the process of making it and then I liked it and wanted to spend more time building it.

## Features

- Users can create a snippet that is used often
- The snippet can be categorized by language and purpose
- Other users may search for a snippet by name or category. 
- Other users can be allowed to have access to your account or a specific snippet

The back-end is separate from the front-end so it can be used with any client like an IDE as an example.

## Tools Used/Learned In This Project

### Common
- Vite (build tool)
- NeoVim (code editor/IDE)

I also learned how to save a bit of performance using techniques like `debouncing` and `memoization`, and started using `Git` and `Github` in a better way.

### Front-End

- react-query
- React-Router
- react-icons
- Tailwind
- Monaco Editor (code editor library)

### Back-End

- Express.js
- Passportjs (turns out it only makes things harder)
- JWT manually
- google OAuth2.0 manually
- notification system with SSE
- ZOD (input validation)
- Mysql2 (mysql client, prisma is too much for medium projects)
