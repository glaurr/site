import { useId, useMemo, useState, type KeyboardEvent, type Ref } from "react";

import type { Coin } from "@/lib/crypto";
import type { Dictionary } from "@/lib/dictionaries";

type Labels = Dictionary["microapps"]["apps"]["cryptoWatchlist"]["search"];

const MAX_RESULTS = 8;

/*
  A text box with suggestions, following the ARIA combobox pattern: focus
  stays in the input, the arrow keys move through the matches, Enter adds
  one and Escape closes the list. It searches the coins already loaded for
  the table, so typing never sends a request.
*/
export function CoinSearch({
  coins,
  exclude,
  full,
  onSelect,
  inputRef,
  labels,
}: {
  coins: Coin[];
  exclude: string[];
  full: boolean;
  onSelect: (coin: Coin) => void;
  inputRef?: Ref<HTMLInputElement>;
  labels: Labels;
}) {
  const id = useId();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);

  const matches = useMemo(
    () => search(coins, query, exclude),
    [coins, query, exclude],
  );

  const searching = open && query.trim() !== "" && !full;
  const showList = searching && matches.length > 0;
  const listId = `${id}-list`;
  const hintId = `${id}-hint`;
  const optionId = (index: number) => `${id}-option-${index}`;

  function choose(coin: Coin) {
    onSelect(coin);
    setQuery("");
    setActive(-1);
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setOpen(true);
      setActive((index) => Math.min(index + 1, matches.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((index) => Math.max(index - 1, -1));
    } else if (event.key === "Enter") {
      const coin = matches[active] ?? matches[0];
      if (showList && coin) {
        event.preventDefault();
        choose(coin);
      }
    } else if (event.key === "Escape") {
      if (showList) setOpen(false);
      else setQuery("");
      setActive(-1);
    }
  }

  return (
    <div>
      <label htmlFor={id} className="label">
        {labels.label}
      </label>

      <div className="relative">
        <input
          ref={inputRef}
          id={id}
          type="text"
          role="combobox"
          aria-expanded={showList}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={
            showList && active >= 0 ? optionId(active) : undefined
          }
          aria-describedby={hintId}
          aria-disabled={full || undefined}
          readOnly={full || coins.length === 0}
          autoComplete="off"
          spellCheck={false}
          placeholder={labels.placeholder}
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
            setActive(-1);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}
          onKeyDown={onKeyDown}
          className="mt-2 w-full border-b border-ink-soft bg-transparent py-2 outline-none placeholder:text-ink-soft focus:border-accent"
        />

        {showList && (
          <ul
            id={listId}
            role="listbox"
            aria-label={labels.label}
            className="absolute inset-x-0 top-full z-10 mt-1 border border-rule bg-paper"
          >
            {matches.map((coin, index) => (
              <li
                key={coin.id}
                id={optionId(index)}
                role="option"
                aria-selected={index === active}
                onMouseDown={(event) => event.preventDefault()}
                onMouseMove={() => setActive(index)}
                onClick={() => choose(coin)}
                className={`flex cursor-pointer items-baseline justify-between gap-4 px-3 py-2 ${
                  index === active ? "bg-paper-sunk text-accent" : ""
                }`}
              >
                <span>{coin.name}</span>
                <span className="label">{coin.symbol}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <p id={hintId} aria-live="polite" className="label mt-2">
        {full
          ? labels.full
          : searching && matches.length === 0
            ? labels.noMatch
            : labels.hint}
      </p>
    </div>
  );
}

function search(coins: Coin[], query: string, exclude: string[]): Coin[] {
  const needle = query.trim().toLowerCase();
  if (!needle) return [];

  const taken = new Set(exclude);

  return coins
    .flatMap((coin) => {
      if (taken.has(coin.id)) return [];

      const symbol = coin.symbol.toLowerCase();
      const name = coin.name.toLowerCase();
      const score =
        symbol === needle
          ? 0
          : name.startsWith(needle)
            ? 1
            : symbol.startsWith(needle)
              ? 2
              : name.includes(needle)
                ? 3
                : -1;

      return score < 0 ? [] : [{ coin, score }];
    })
    .sort((a, b) => a.score - b.score)
    .slice(0, MAX_RESULTS)
    .map(({ coin }) => coin);
}
