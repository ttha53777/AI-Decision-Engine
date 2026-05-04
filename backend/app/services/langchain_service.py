import json
import os
from functools import lru_cache
from typing import Any, TypeVar

from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from pydantic import BaseModel

TModel = TypeVar("TModel", bound=BaseModel)


class LangChainService:
    def __init__(self) -> None:
        load_dotenv()
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            raise RuntimeError("OPENAI_API_KEY is not set.")

        self.model = os.getenv("OPENAI_MODEL", "gpt-4.1-mini")
        self.llm = ChatOpenAI(
            model=self.model,
            temperature=0.2,
            api_key=api_key,
        )

    def call_model(self, system_prompt: str, input_payload: dict[str, Any], output_model: type[TModel]) -> TModel:
        last_error: Exception | None = None

        # Small retry loop for occasional schema/format drift.
        for _ in range(2):
            try:
                runnable = self.llm.with_structured_output(output_model)
                result = runnable.invoke(
                    [
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": json.dumps(input_payload)},
                    ]
                )

                # Depending on LangChain version, structured output may return either
                # a Pydantic model instance or a dict. Normalize to Pydantic.
                if isinstance(result, output_model):
                    return result
                return output_model.model_validate(result)
            except Exception as error:  # noqa: BLE001 - intentional boundary
                last_error = error

        raise RuntimeError("LangChain structured output failed.") from last_error


@lru_cache(maxsize=1)
def get_langchain_service() -> LangChainService:
    return LangChainService()

