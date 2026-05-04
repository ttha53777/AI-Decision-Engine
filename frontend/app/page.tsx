"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";

import { DecisionForm } from "@/components/DecisionForm";
import { DecisionResultsSplit } from "@/components/results/DecisionResultsSplit";
import { InsufficientInfoCard } from "@/components/InsufficientInfoCard";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { ErrorCard } from "@/components/ErrorCard";
import { analyzeDecision } from "@/lib/api";
import { DecisionResponse } from "@/lib/types";

interface FormState {
  decision: string;
  optionA: string;
  optionB: string;
  priorities: string[];
}

const initialFormState: FormState = {
  decision: "",
  optionA: "",
  optionB: "",
  priorities: []
};

export default function HomePage() {
  const [form, setForm] = useState<FormState>(initialFormState);
  const [result, setResult] = useState<DecisionResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const resultsRef = useRef<HTMLElement | null>(null);
  const hasEnoughPriorities = useMemo(() => form.priorities.length >= 2, [form.priorities]);

  const isInsufficient =
    result?.recommendation.recommendation === "insufficient_information";

  useEffect(() => {
    if (result && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [result]);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await analyzeDecision({
        decision: form.decision,
        optionA: form.optionA,
        optionB: form.optionB,
        priorities: form.priorities
      });
      setResult(response);
    } catch (submitError) {
      setResult(null);
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unexpected error occurred."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const onRetry = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await analyzeDecision({
        decision: form.decision,
        optionA: form.optionA,
        optionB: form.optionB,
        priorities: form.priorities
      });
      setResult(response);
    } catch (submitError) {
      setResult(null);
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unexpected error occurred."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const onTryExample = () => {
    setError(null);
    setResult(null);
    setForm({
      decision:
        "I’m choosing between two job offers. I want to optimize for long-term career growth, but I also care about stable income and manageable risk.",
      optionA: "Large company role: higher base salary, strong benefits, predictable workload, slower growth.",
      optionB: "Startup role: lower base + meaningful equity, faster learning, higher responsibility, uncertain runway.",
      priorities: ["growth", "money", "stability"]
    });
  };

  const onReset = () => {
    setError(null);
    setResult(null);
    setForm(initialFormState);
  };

  return (
    <main className="min-h-screen px-4 py-8 sm:px-6 sm:py-10">
      <div className="mx-auto max-w-6xl space-y-8">
        <DecisionForm
          form={form}
          setForm={setForm}
          isLoading={isLoading}
          onSubmit={onSubmit}
          onTryExample={onTryExample}
          onReset={onReset}
        />

        {!hasEnoughPriorities ? (
          <section className="panel scroll-mt-28 p-4 text-sm leading-relaxed text-inkMuted shadow-panel">
            Tip: Add at least <span className="font-semibold text-ink">2 priorities</span> to get
            higher-quality output.
          </section>
        ) : null}

        {isLoading ? (
          <div className="scroll-mt-28">
            <LoadingSkeleton />
          </div>
        ) : null}

        {error ? (
          <div className="scroll-mt-28">
            <ErrorCard message={error} onRetry={onRetry} />
          </div>
        ) : null}

        {result ? (
          <section
            ref={resultsRef}
            className="space-y-4 transition-all duration-500 ease-out"
          >
            {isInsufficient ? (
              <InsufficientInfoCard
                reason={result.recommendation.reason}
                nextSteps={result.recommendation.next_steps}
                onUseExample={onTryExample}
              />
            ) : (
              <DecisionResultsSplit
                optionA={form.optionA}
                optionB={form.optionB}
                priorities={form.priorities}
                result={result}
              />
            )}
          </section>
        ) : null}
      </div>
    </main>
  );
}
