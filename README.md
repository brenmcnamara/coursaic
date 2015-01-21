# Coursaic

An app to allow users to take practice exams that are constructed from other users.

There are multiple courses in the coursaic app, each having a set of questions that are submitted by the user. The categorization of these questions has not been decided (might be categorized by exams, topics in the course, etc...). A user can add to the pool of questions, and after a certain amount of contribution to the pool, they are then permitted to take practice exams from questions that other users have created. The exams that the user takes are scored for quick feedback.

To address bad questions, users may flag questions that they do not like. Questions with a large number of flags can be removed and deleted from the pool of questions. There will also be an "Owner" for courses. An owner for a particular class has greater authority over the content for the course. The exact permissions given to course "owners" is still being determined, but it may include a view of all flagged questions and ability to delete questions they do not like.

## Contributors

Brendan McNamara
Alex Wan

## Setup

To run coursaic, you must have node installed in your environment. Simply run the commands:

```
npm install
npm start
```

then go to localhost:3000 in your browser.

