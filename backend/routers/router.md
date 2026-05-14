**routers/ — what they do first**

Routers are FastAPI files that define your API endpoints. Each router handles one resource. They receive requests, call services, return responses.

They don't contain business logic — that lives in services. Routers just orchestrate: validate input → call service → return output.

---

**routers/auth.py — full detail**

Three endpoints:

`POST /auth/register`
- Takes `UserCreate` schema
- Calls auth service to hash password and create user
- Returns `UserResponse`

`POST /auth/login`
- Takes `UserLogin` schema
- Calls auth service to verify password and generate JWT
- Returns `TokenResponse`

`POST /auth/logout`
- Takes current user from JWT
- Client side just deletes token (stateless JWT, no server action needed)
- Returns success message

Dependencies needed:
- `db` session from `get_db`
- Current user from JWT (FastAPI dependency)

Imports needed:
- `APIRouter, Depends, HTTPException` from fastapi
- `Session` from sqlalchemy.orm
- Schemas from schemas/user.py
- Auth service functions
- `get_db` from database.py

---

**routers/books.py — full detail**

Three endpoints:

`GET /books/search?q=atomic+habits`
- Takes query string parameter `q`
- Checks if book already exists in database
- If yes, return it immediately
- If no, call scraper service to fetch summary, then extractor service to generate reels, store everything, return book
- Returns `BookWithReels`

`GET /books/{book_id}`
- Takes book_id as path parameter
- Fetches book from database
- Returns `BookResponse`
- Raises 404 if book not found

`GET /books/{book_id}/reels`
- Takes book_id as path parameter
- Fetches all reels for that book ordered by order_index
- Returns list of `ReelResponse`
- Raises 404 if book not found

Dependencies needed:
- `db` session from `get_db`
- Current user from JWT (to attach is_liked to each reel)

Imports needed:
- `APIRouter, Depends, HTTPException` from fastapi
- `Session` from sqlalchemy.orm
- Schemas from schemas/book.py, schemas/reel.py
- Book service functions
- `get_db` from database.py

---

**routers/reels.py — full detail**

Six endpoints:

`GET /reels/{reel_id}`
- Takes reel_id as path parameter
- Fetches single reel from database
- Returns `ReelWithVoice`
- Raises 404 if not found

`GET /reels/{reel_id}/voice`
- Takes reel_id as path parameter
- Checks if voice reel exists for this reel
- Returns `VoiceReelResponse` with current status
- Raises 404 if no voice reel exists yet

`POST /reels/{reel_id}/voice`
- Takes reel_id as path parameter
- Creates a voice reel entry with status pending
- Triggers TTS service to generate audio
- Returns `VoiceReelResponse`

`POST /reels/{reel_id}/like`
- Takes reel_id as path parameter
- Takes current user from JWT
- Creates like entry in database
- Returns `LikeResponse`
- Raises 400 if already liked

`DELETE /reels/{reel_id}/like`
- Takes reel_id as path parameter
- Takes current user from JWT
- Deletes like entry from database
- Returns success message
- Raises 404 if like doesn't exist

Dependencies needed:
- `db` session from `get_db`
- Current user from JWT

Imports needed:
- `APIRouter, Depends, HTTPException` from fastapi
- `Session` from sqlalchemy.orm
- Schemas from schemas/reel.py, schemas/board.py
- Reel service functions
- `get_db` from database.py

---

**routers/feed.py — full detail**

One endpoint:

`GET /feed`
- Takes current user from JWT
- Takes optional query parameters: `page` (default 1), `limit` (default 10)
- Calls feed service to get personalized reels based on user's followed genres
- Returns list of `ReelResponse` with book info attached

How feed works internally:
- Fetch all genres user follows
- Fetch reels from books in those genres
- Order by created_at descending (newest first for v1)
- Paginate results using page and limit
- Return reels with is_liked attached for current user

Dependencies needed:
- `db` session from `get_db`
- Current user from JWT

Imports needed:
- `APIRouter, Depends` from fastapi
- `Session` from sqlalchemy.orm
- Schemas from schemas/reel.py
- Feed service functions
- `get_db` from database.py

---
**routers/genres.py — full detail**

Three endpoints:

`GET /genres`
- No auth needed
- Returns hardcoded list of available genres
- Genres: productivity, mental health, philosophy, finance, relationships, self improvement, psychology, biology, history, science
- Returns list of strings

`POST /genres/follow`
- Takes `GenreFollowRequest` schema (just genre name)
- Takes current user from JWT
- Creates UserGenreFollow entry in database
- Raises 400 if already following
- Returns `GenreFollowResponse`

`DELETE /genres/unfollow`
- Takes `GenreFollowRequest` schema
- Takes current user from JWT
- Deletes UserGenreFollow entry from database
- Raises 404 if not following
- Returns success message

Dependencies needed:
- `db` session from `get_db`
- Current user from JWT (except GET /genres)

Imports needed:
- `APIRouter, Depends, HTTPException` from fastapi
- `Session` from sqlalchemy.orm
- Schemas from schemas/board.py
- `get_db` from database.py

---

Building BookReel — Instagram-style book summary reels.

Stack: FastAPI, PostgreSQL, SQLAlchemy, Pydantic v2.

Completed: config.py, database.py, all models/, all schemas/

Now writing routers/. Routers define API endpoints.
They validate input, call services, return responses.
No business logic in routers.

Today writing routers/auth.py

Endpoints:
POST /auth/register — takes UserCreate, returns UserResponse
POST /auth/login — takes UserLogin, returns TokenResponse  
POST /auth/logout — returns success message

Dependencies: get_db, current user from JWT
Imports: APIRouter, Depends, HTTPException from fastapi,
Session from sqlalchemy.orm, schemas, get_db

Guide me to write this. I write code myself.
