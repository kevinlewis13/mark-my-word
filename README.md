# mark-my-word
--------------
All API access is over `HTTPS:` and is available from `mark-my-word.herokuapp.com`

## Authentication

Routes that require authentication require a valid token sent in the request headers `request.headers.token` or the request body `request.body.token`.

## User routes

### Login

`GET` `/login` authenticate via `email:password`

response is a JSON object

```{
  token: tokenData
}```
