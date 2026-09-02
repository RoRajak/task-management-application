
# Project Title

Trello-Style Task Management Application

A web-based task management application similar to Trello, specifically designed for desktop use and not optimized for mobile, here are some of the most effective options available:
## Features

1. User Authentication:
    - Implemented signup and login functionality using email and password
    - Ensured secure password storage and user session management like after two hour user will logout automatically
2. Task Board:
    - Upon logging in, users can see their personal task board
    - The board have four columns: "To-Do", "In Progress", “Under Review” and "Completed"
    - If user do not have task so message will be there. please create a task
3. Task Management:
    - Users can create new tasks in any column
    - Each task have
        - A title (mandatory)
        - A description (not mandatory to fill)
        - Status (mandatory)
            - Automatically fill if card created from buttons in specific section
        - Priority (not mandatory)
            - Values for priority - Low, Medium, Urgent
        - Deadline (not mandatory)
    - Users can edit and delete tasks after creation. you need click on the task which you just created
4. Drag and Drop Functionality:
    - Implement drag and drop feature to move tasks between columns
    - The task's status should update automatically when moved to a different column


## Tech Stack

**Client:** Nextjs, Redux, TailwindCSS, axios ,react-beautiful-dnd

**Server:** Node, Express, zod


## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`MONGODB_URL`

`JWT_SECRET`

`PORT`

`JWT_EXPIRES_IN`

`CORE_ORIGIN`



## Run Locally

Clone the project

```bash
  git clone https://github.com/RoRajak/task-management-application.git
```

Go to the project directory for server

```bash
  cd server
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run dev
```


Go to the project directory for client

```bash
  cd frontend
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run dev
```


    
## Demo
please click on below to see recording of the project


[Watch the video on Vimeo](https://player.vimeo.com/video/991755972?h=7cf3858b74")
