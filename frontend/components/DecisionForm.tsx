import { FormEvent } from "react";

import { PriorityChipsInput } from "@/components/PriorityChipsInput";

interface FormState {
  decision: string;
  optionA: string;
  optionB: string;
  priorities: string[];
}

interface DecisionFormProps {
  form: FormState;
  setForm: (updater: (prev: FormState) => FormState) => void;
  isLoading: boolean;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onTryExample?: () => void;
  onReset?: () => void;
}

const steps = [
  { n: 1, label: "Describe" },
  { n: 2, label: "Options" },
  { n: 3, label: "Priorities" },
  { n: 4, label: "Analyze" }
] as const;

export function DecisionForm({
  form,
  setForm,
  isLoading,
  onSubmit,
  onTryExample,
  onReset
}: DecisionFormProps) {
  return (
    <section id="analyze" className="panel-elevated scroll-mt-28 rounded-2xl p-6 sm:p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">Your decision</h1>
        <p className="mt-2 text-sm leading-relaxed text-inkMuted">
          Walk through the steps below, then run the model. Results open with weighted totals, priority
          mapping, and optional deep metrics.
        </p>
        <ol
          className="mt-5 flex flex-wrap gap-2"
          aria-label="Steps to complete before analyzing"
        >
          {steps.map((s) => (
            <li
              key={s.label}
              className="inline-flex items-center gap-2 rounded-full border border-borderSubtle bg-surfaceMuted px-3 py-1.5 text-xs font-semibold text-inkMuted"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-ink text-[11px] text-white">
                {s.n}
              </span>
              {s.label}
            </li>
          ))}
        </ol>
      </div>

      <form onSubmit={onSubmit} className="space-y-5">
        <div>
          <label
            htmlFor="decision"
            className="mb-2 block text-sm font-medium text-ink"
          >
            Decision Description
          </label>
          <textarea
            id="decision"
            required
            value={form.decision}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, decision: event.target.value }))
            }
            placeholder="Describe the decision context..."
            className="focus-ring min-h-28 w-full rounded-lg border border-borderSubtle bg-surface px-3 py-2 text-sm text-ink outline-none transition focus:border-brand"
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label
              htmlFor="optionA"
              className="mb-2 block text-sm font-medium text-ink"
            >
              Option A
            </label>
            <input
              id="optionA"
              required
              value={form.optionA}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, optionA: event.target.value }))
              }
              placeholder="e.g. Stay at current company"
              className="focus-ring w-full rounded-lg border border-borderSubtle bg-surface px-3 py-2 text-sm text-ink outline-none transition focus:border-brand"
            />
          </div>
          <div>
            <label
              htmlFor="optionB"
              className="mb-2 block text-sm font-medium text-ink"
            >
              Option B
            </label>
            <input
              id="optionB"
              required
              value={form.optionB}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, optionB: event.target.value }))
              }
              placeholder="e.g. Join an early-stage startup"
              className="focus-ring w-full rounded-lg border border-borderSubtle bg-surface px-3 py-2 text-sm text-ink outline-none transition focus:border-brand"
            />
          </div>
        </div>

        <PriorityChipsInput
          label="Priorities"
          value={form.priorities}
          onChange={(next) => setForm((prev) => ({ ...prev, priorities: next }))}
          placeholder="money, growth, stability"
        />

        <div className="grid gap-3 sm:grid-cols-3">
          <button
            type="submit"
            disabled={isLoading}
            className="sm:col-span-2 w-full rounded-lg bg-ink px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isLoading ? "Analyzing decision..." : "Analyze Decision"}
          </button>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-1">
            <button
              type="button"
              onClick={onTryExample}
              className="w-full rounded-lg border border-borderSubtle bg-surface px-3 py-2.5 text-sm font-medium text-ink transition hover:bg-surfaceMuted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2"
            >
              Try example
            </button>
            <button
              type="button"
              onClick={onReset}
              className="w-full rounded-lg border border-borderSubtle bg-surface px-3 py-2.5 text-sm font-medium text-ink transition hover:bg-surfaceMuted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2"
            >
              Reset
            </button>
          </div>
        </div>
      </form>

      <div
        id="how-scoring"
        className="mt-8 scroll-mt-28 rounded-xl border border-borderSubtle bg-surfaceMuted/50 p-4 text-sm leading-relaxed text-inkMuted"
      >
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-inkMuted">How scoring works</p>
        <p className="mt-2">
          The model produces <span className="font-medium text-ink">rubric scores</span> (roughly 0–10 per
          dimension for each option) and combines them with your stated{" "}
          <span className="font-medium text-ink">priority weights</span> into a single{" "}
          <span className="font-medium text-ink">weighted total</span> per option. The recommendation reflects
          that total plus narrative checks—use it as structured input, not a guarantee.
        </p>
      </div>
    </section>
  );
}

