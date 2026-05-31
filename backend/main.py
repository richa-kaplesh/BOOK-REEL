from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from models import user, book, reel, board, likes, genre_follows
from routers import auth, users, books, reels, feed, search

Base.metadata.create_all(bind=engine)

app = FastAPI(title="BookReel", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(books.router)
app.include_router(reels.router)
app.include_router(feed.router)
app.include_router(search.router)


@app.get("/")
def root():
    return {"message": "BookReel API is running"}