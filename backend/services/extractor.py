import json
from groq import Groq
from config import settings

client = Groq(api_key=settings.GROQ_API_KEY)

async def extract_reelss(title: str, author: str) -> list[dict]:
    prompt = f"""
  You are a book knowledge extractor for an app called BookReel.

  Given the book "{title}" by {author}, generate exactly 10 reels.
  
  Each reel must be one of these types:
  - technique: a practical method or strategy from the book
  - quote: powerful quote or key idea from the book
  - concept: a core concept or insight from the book

  Return ONLY a valid JSON array, no explanaton , no markdown , nothing else. 

  Format:
  [
   {{
     "type":"technique",
     "content":"...",
     "order_index":1
   }},
   ...
   ]


Rules:
- content should be 2-4 sentences max, punchy and useful
- mix the types across 10 reels
- order_index goes from 1 to 10
- real knowledge from the book only

"""
    response = client.chat.completions.create(
        model="llama3-70b-8192",
        messages=[{"role":"user","content":prompt}],
        temperature=0.7
    )

    raw = response.choices[0].message.content.strip()
    reels = json.loads(raw)
    return reels
