# mark-my-word
--------------
All API access is over `https:` and is available from `mark-my-word.herokuapp.com`

## Authentication

Routes that require authentication require a valid token sent in the request headers `request.headers.token` or the request body `request.body.token`.

## User routes

### Login

`GET /login`

#### Request

```
{
  "email": String,
  "password": String
}
```
#### Response

```
{
"token": "0beFEM3V1r9jM4RZ76o/qbG9Hs12codVsoKJ7Q8ibhi3871whxYc+/UBwCCYGq4b3mbL/ucZ02w0a0QsE6xRZIVVH+hqtgc="
}
```
