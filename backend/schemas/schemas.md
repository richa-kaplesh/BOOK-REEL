**schemas/ — what they do first**

Schemas are Pydantic models. They define what data comes IN to your API (request bodies) and what data goes OUT (responses). They are completely separate from SQLAlchemy models.

SQLAlchemy models = database structure
Pydantic schemas = API input/output shape

For every resource you typically have:
- A `Create` schema — what the user sends when creating something
- A `Response` schema — what your API sends back

---

**schemas/user.py — full detail**

`UserCreate` (for registration):
- `username` — str
- `email` — str
- `password` — str (plain, you hash it in the service)

`UserResponse` (what API returns):
- `id` — int
- `username` — str
- `email` — str
- `created_at` — datetime

`UserLogin` (for login):
- `email` — str
- `password` — str

`TokenResponse` (what login returns):
- `access_token` — str
- `token_type` — str (always "bearer")

---
**schemas/reel.py — full detail**

`ReelResponse` (what API returns for a single reel):
- `id` — int
- `book_id` — int
- `type` — str (technique, quote, concept)
- `content` — str
- `order_index` — int
- `created_at` — datetime
- `is_liked` — bool (whether current user liked this reel)

`VoiceReelResponse` (what API returns for voice status):
- `id` — int
- `reel_id` — int
- `audio_url` — str, optional (null until ready)
- `status` — str (pending, processing, ready, failed)
- `created_at` — datetime

`ReelWithVoice` (reel with its voice status attached):
- everything in `ReelResponse`
- `voice` — VoiceReelResponse, optional

Imports needed:
- `BaseModel` from pydantic
- `Optional` from typing
- `datetime` from standard library

---

Shall I continue with `schemas/board.py`?