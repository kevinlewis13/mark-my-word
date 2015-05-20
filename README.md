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
