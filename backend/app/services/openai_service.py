import json
import os
from functools import lru_cache
from typing import Any

from openai import OpenAI
from pydantic import BaseModel
from dotenv import load_dotenv

from app.services.langchain_service import get_langchain_service


class OpenAIService:
    def __init__(self) -> None:
        load_dotenv()
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            raise RuntimeError("OPENAI_API_KEY is not set.")

        self.model = os.getenv("OPENAI_MODEL", "gpt-4.1-mini")
        self.client = OpenAI(api_key=api_key)

    def call_json(self, system_prompt: str, input_payload: dict[str, Any]) -> dict[str, Any]:
        completion = self.client.chat.completions.create(
            model=self.model,
            temperature=0.2,
            response_format={"type": "json_object"},
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": json.dumps(input_payload)},
            ],
        )

        content = completion.choices[0].message.content
        if not content:
            raise RuntimeError("OpenAI returned an empty response.")

        try:
            return json.loads(content)
        except json.JSONDecodeError as error:
            raise RuntimeError("OpenAI response was not valid JSON.") from error

    def call_model(
        self, system_prompt: str, input_payload: dict[str, Any], output_model: type[BaseModel]
    ) -> BaseModel:
        # Delegate to LangChain structured outputs for improved schema reliability,
        # while keeping the public API identical for all call sites.
        return get_langchain_service().call_model(
            system_prompt=system_prompt,
            input_payload=input_payload,
            output_model=output_model,
        )


@lru_cache(maxsize=1)
def get_openai_service() -> OpenAIService:
    return OpenAIService()
