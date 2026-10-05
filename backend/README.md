# TestForge Backend - QA Automation & AI Testing Engine

TestForge Backend is an automated testing runtime and AI-driven QA platform powered by **FastAPI**, **HTTPX**, and **Google Gemini**.

## Features

- **Automated API Tester**: Concurrent, multi-method HTTP execution with configurable SLA timeouts.
- **Deep Assertion Engine**: Validates status codes, latency thresholds, JSON paths, containment, and headers.
- **AI Test Generator**: Translates endpoint contracts and user stories into structured positive, negative, and boundary test cases.
- **AI Bug Diagnosis**: Analyzes failing assertions and status codes to pinpoint root causes and format Jira bug tickets.
- **Historical Reporting**: Aggregates QA pass rates, failure distributions, and response time metrics.

## Quick Start

1. **Activate virtual environment**:
   ```bash
   python -m venv venv
   # Windows:
   .\venv\Scripts\activate
   # Linux/macOS:
   source venv/bin/activate
   ```

2. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Configure Environment Variables**:
   ```bash
   cp .env.example .env
   ```
   (Optional) Insert your Google Gemini API key:
   `GEMINI_API_KEY="your-gemini-api-key"`

4. **Launch Server**:
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

- Interactive Docs: `http://localhost:8000/docs`
- Dashboard Metrics: `http://localhost:8000/api/v1/tests/dashboard/stats`

---

## 📚 Advanced Engineering & AI Training Resources

To master end-to-end AI software engineering, retrieval-augmented generation, and agentic workflows:
- [Software Testing Training Course Training in Delhi](https://uncodemy.com/course/software-testing-training-course-in-delhi)
- [Software Testing Training Course Training in Noida](https://uncodemy.com/course/software-testing-training-course-in-noida)
