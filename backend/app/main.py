import os
import uuid
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.test_api import router as test_router
from app.api.bug_api import router as bug_router
from app.api.ai_api import router as ai_router
from app.services.report_service import report_service
from app.models.schemas import TestCase, AssertionRule


def seed_initial_test_cases():
    cases = report_service.list_saved_test_cases()
    if len(cases) == 0:
        print("[*] Seeding default API test cases in test_data/test_cases/...")
        sample_cases = [
            TestCase(
                id="tc_get_posts",
                name="GET /posts - Fetch All Blog Posts",
                description="Validates that the posts collection endpoint returns 200 with JSON payload.",
                method="GET",
                url="https://jsonplaceholder.typicode.com/posts",
                headers={"Content-Type": "application/json"},
                assertions=[
                    AssertionRule(type="status_code", target="status", expected=200),
                    AssertionRule(type="response_time_ms", target="latency", expected=2000),
                    AssertionRule(type="header_equals", target="content-type", expected="application/json; charset=utf-8")
                ],
                tags=["smoke", "get", "api"]
            ),
            TestCase(
                id="tc_create_post",
                name="POST /posts - Create New Post Resource",
                description="Validates creation of a new post resource with JSON payload.",
                method="POST",
                url="https://jsonplaceholder.typicode.com/posts",
                headers={"Content-Type": "application/json"},
                body={"title": "TestForge Automation", "body": "Grounded AI Testing Payload", "userId": 1},
                assertions=[
                    AssertionRule(type="status_code", target="status", expected=201),
                    AssertionRule(type="response_time_ms", target="latency", expected=2000),
                    AssertionRule(type="json_equals", target="title", expected="TestForge Automation")
                ],
                tags=["regression", "post", "api"]
            ),
            TestCase(
                id="tc_get_user_not_found",
                name="GET /users/99999 - Validate 404 Behavior",
                description="Validates that requesting a non-existent user returns a 404 status code.",
                method="GET",
                url="https://jsonplaceholder.typicode.com/users/99999",
                headers={"Content-Type": "application/json"},
                assertions=[
                    AssertionRule(type="status_code", target="status", expected=404),
                    AssertionRule(type="response_time_ms", target="latency", expected=2000)
                ],
                tags=["negative", "users", "api"]
            )
        ]
        report_service.save_test_cases(sample_cases)
        print(f"[*] Seeded {len(sample_cases)} test cases.")


@asynccontextmanager
async def lifespan(app: FastAPI):
    print(f"[*] Starting {settings.PROJECT_NAME}...")
    seed_initial_test_cases()
    yield
    print("[*] Stopping TestForge QA Engine...")


app = FastAPI(
    title=settings.PROJECT_NAME,
    description="AI-Driven Software Testing, API QA Automation, and Intelligent Bug Diagnosis Platform",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] if settings.ENVIRONMENT == "development" else settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(test_router, prefix=settings.API_V1_STR)
app.include_router(bug_router, prefix=settings.API_V1_STR)
app.include_router(ai_router, prefix=settings.API_V1_STR)


@app.get("/")
def root():
    return {
        "app": settings.PROJECT_NAME,
        "version": "1.0.0",
        "docs_url": "/docs",
        "health_url": f"{settings.API_V1_STR}/tests/dashboard/stats"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=settings.HOST, port=settings.PORT, reload=True)
