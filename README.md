# mark-my-word
--------------
All API access is over `https:` and is available from `mark-my-word.herokuapp.com`

## Authentication

Routes that require authentication require a valid token sent in the request headers `request.headers.token` or the request body `request.body.token`.

## User routes

### Login

User authentication login requires email and password information and will return a token that will allow access to `[AUTH_REQUIRED]` routes. tokens will invalidate after 7 days or if the server is restarted.

`GET /login`

#### Parameters

| name     | type   | description                                         |
|----------|--------|-----------------------------------------------------|
| email    | string | a valid email address for a registered user account |
| password | string | user password                                       |

#### Response

```
{
"token": "0beFEM3V1r9jM4RZ76o/qbG9Hs12codVsoKJ7Q8ibhi3871whxYc+/UBwCCYGq4b3mbL/ucZ02w0a0QsE6xRZIVVH+hqtgc="
}
```
### Create User

Create a new user account. Account creation requires a unique username, a unique, valid email address and the users password.

`POST /create_user`

#### Parameters

| name     | type   | description                      |
|----------|--------|----------------------------------|
| username | string | A unique username                |
| email    | string | A unique and valid email address |
| password | string | user password                    |

#### Response

```
{
"token": "0beFEM3V1r9jM4RZ76o/qbG9Hs12codVsoKJ7Q8ibhi3871whxYc+/UBwCCYGq4b3mbL/ucZ02w0a0QsE6xRZIVVH+hqtgc="
}
```

### User

Reads a summary of the current users account

`GET /user [AUTH_REQUIRED]`

#### Response

User Object

## Event Routes

### Creating Votes

Adds vote documents to the Votes collection in the database.

`POST /events`

URL request formatted as

`/events?eventId=eventId&questionIds=questionId;questionId;questionId&predicitions=prediction;prediction;prediction`

the token will be written in the REQUEST head.
>>>>>>> 797bc2134beaf2b3e1daec0d63d0516809f98a75
