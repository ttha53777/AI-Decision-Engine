from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.decision import router as decision_router


app = FastAPI(title="AI Decision Engine API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"http://(localhost|127\.0\.0\.1|\[::1\]):\d+",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(decision_router)

