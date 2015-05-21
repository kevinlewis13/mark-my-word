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

### Finiding All Events

`GET /events`

Returns an array of JSON objects representing all events in the database that have a start time between now and 24 hours out.

### Finding a Specific Event

`GET /events/:eventId`

Returns an array with one event object included.

### Creating Events

Adds new event to the database.

`POST /create_events`

requires object as follows:

```
{
  "home": "Home Team Name",
  "away": "Away Team Name",
  "eventTime": "event's start time in format of 01 Jan 1970 00:00:00 UTC"
}
```

Returns the new event object.

### Adding Questions to Events

Adds any amount of questions to a specific event.

`PUT /events/:eventId`

```
{
  "question": "Will the home team win?"
}
```

Each question to be added requires its own PUT request.
