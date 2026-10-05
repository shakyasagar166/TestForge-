import os
from typing import Optional, Dict, Any
from app.core.config import settings


class LLMService:
    """
    Google Gemini integration for AI Test Generation & Root-Cause Bug Diagnosis,
    with intelligent offline heuristics.
    """

    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY
        self.model_name = settings.GEMINI_MODEL
        self._model = None
        self._is_ready = False
        self._init_llm()

    def _init_llm(self):
        if self.api_key:
            try:
                import google.generativeai as genai
                genai.configure(api_key=self.api_key)
                self._model = genai.GenerativeModel(
                    model_name=self.model_name,
                    system_instruction=(
                        "You are TestForge, an elite QA Automation Architect and Software Testing Specialist. "
                        "You specialize in writing comprehensive API test suites, boundary condition tests, "
                        "security validation checks, and diagnosing root causes of software bugs."
                    )
                )
                self._is_ready = True
                print(f"[LLMService] TestForge Gemini model '{self.model_name}' initialized.")
            except Exception as e:
                print(f"[LLMService] Gemini init failed: {e}")
                self._is_ready = False

    @property
    def is_configured(self) -> bool:
        return self._is_ready

    async def generate_completion(self, prompt: str, temperature: float = 0.3) -> Dict[str, Any]:
        if self._is_ready and self._model:
            try:
                response = self._model.generate_content(
                    prompt,
                    generation_config={"temperature": temperature, "max_output_tokens": 3000}
                )
                return {
                    "text": response.text,
                    "model": self.model_name,
                    "is_fallback": False
                }
            except Exception as e:
                print(f"[LLMService] Gemini call failed: {e}")

        return {
            "text": None,
            "model": "TestForge-Internal-Rule-Engine",
            "is_fallback": True
        }


llm_service = LLMService()
