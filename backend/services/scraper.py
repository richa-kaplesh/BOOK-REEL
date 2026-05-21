import httpx
from config import settings


async def fetch_book_metadata(title: str) -> dict:
    url = "https://www.googleapis.com/books/v1/volumes"
    params = {
        "q": title,
        "maxResults": 1,
        "key": settings.GOOGLE_BOOKS_API_KEY
    }

    async with httpx.AsyncClient() as client:
        response = await client.get(url, params=params)
        response.raise_for_status()
        data = response.json()

    if not data.get("items"):
        raise ValueError(f"No book found for: {title}")

    item = data["items"][0]
    info = item["volumeInfo"]

    return {
        "title": info.get("title", title),
        "author": ", ".join(info.get("authors", ["Unknown"])),
        "genre": info.get("categories", ["General"])[0],
        "cover_image_url": info.get("imageLinks", {}).get("thumbnail", None),
        "source_url": info.get("infoLink", None)
    }