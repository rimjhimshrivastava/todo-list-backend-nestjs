# todo-list-backend-nestjs
- Backend for todo list web app, developed using nestjs

###### Working APIs
1. User Signup: /auth/signup
- Creates new account
- Body: username, password

2. User Login: /auth/login
- Authentication of existing user
- Body: username, password

3. Get all Tasks: /todo
- Checks authorization and returns list of all tasks of the user

4. Create new task: /todo
- Creates a new task for the user
- Body: title

5. Toggle Task Completion: /todo/:id
- Toggles completion status of task with id

6. Delete Task: /todo/:id
- Deleted the task with id1