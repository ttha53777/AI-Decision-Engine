import { KeyboardEvent, useMemo, useState } from "react";

function normalizeToken(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

interface PriorityChipsInputProps {
  label?: string;
  value: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
  maxItems?: number;
}

export function PriorityChipsInput({
  label = "Priorities",
  value,
  onChange,
  placeholder = "Type a priority and press Enter (e.g. money)",
  maxItems = 5
}: PriorityChipsInputProps) {
  const [draft, setDraft] = useState("");
  const canAddMore = value.length < maxItems;

  const helperText = useMemo(() => {
    if (value.length === 0) return "Add 2–5 priorities. Put the most important first.";
    if (!canAddMore) return `Max ${maxItems} priorities. Remove one to add another.`;
    return "Press Enter or comma to add. Backspace removes the last priority.";
  }, [canAddMore, maxItems, value.length]);

  const addToken = (raw: string) => {
    const token = normalizeToken(raw);
    if (!token) return;
    const deduped = value.some((existing) => existing.toLowerCase() === token.toLowerCase());
    if (deduped) return;
    if (!canAddMore) return;
    onChange([...value, token]);
    setDraft("");
  };

  const removeToken = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      addToken(draft);
      return;
    }
    if (event.key === "Backspace" && draft.length === 0 && value.length > 0) {
      event.preventDefault();
      removeToken(value.length - 1);
    }
  };

  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-ink">{label}</label>

      <div className="flex flex-wrap items-center gap-2 rounded-lg border border-borderSubtle bg-surface p-2 focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/20">
        {value.map((token, index) => (
          <span
            key={`${token}-${index}`}
            className="inline-flex items-center gap-2 rounded-full bg-surfaceMuted px-3 py-1 text-xs font-medium text-ink"
          >
            {token}
            <button
              type="button"
              onClick={() => removeToken(index)}
              className="rounded-full px-1 text-inkMuted hover:text-ink"
              aria-label={`Remove priority ${token}`}
            >
              ×
            </button>
          </span>
        ))}

        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={onKeyDown}
          placeholder={canAddMore ? placeholder : ""}
          disabled={!canAddMore}
          className="min-w-[180px] flex-1 border-0 bg-transparent px-2 py-1 text-sm text-ink outline-none placeholder:text-inkMuted/70 disabled:cursor-not-allowed"
        />
      </div>

      <p className="mt-2 text-xs text-inkMuted">{helperText}</p>
    </div>
  );
}

