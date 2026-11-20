"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

type ButtonTone = "primary" | "secondary" | "dark" | "ghost" | "danger";
type ButtonSize = "default" | "lg" | "sm";

const TONE_MAP: Record<ButtonTone, string> = {
  primary: "border-asphalt bg-signal text-asphalt hover:bg-[#e0a900] active:translate-y-px",
  secondary: "border-asphalt bg-transparent text-asphalt hover:bg-surface active:translate-y-px",
  dark: "border-asphalt bg-asphalt text-chalk hover:bg-[#263140] active:translate-y-px",
  ghost: "border-transparent bg-transparent text-asphalt hover:bg-chalk",
  danger: "border-danger bg-danger text-white hover:bg-[#931c13]",
};

const SIZE_MAP: Record<ButtonSize, string> = {
  default: "min-h-[44px] px-5 py-2.5 text-sm",
  lg: "min-h-[48px] px-6 py-3.5 text-base",
  sm: "min-h-[38px] px-3.5 py-1.5 text-xs",
};

export interface EpButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonTone;
  size?: ButtonSize;
  asChild?: boolean;
}

export function Button({
  className,
  variant = "primary",
  size = "default",
  asChild = false,
  ...rest
}: EpButtonProps) {
  const Tag = asChild ? Slot : "button";
  return (
    <Tag
      className={cn(
        "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded border-2 font-semibold transition-colors duration-150 disabled:pointer-events-none disabled:opacity-50",
        TONE_MAP[variant],
        SIZE_MAP[size],
        className,
      )}
      {...rest}
    />
  );
}

export function FieldInput({ className, ...rest }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "flex min-h-[44px] w-full rounded border-[1.5px] border-asphalt bg-surface px-3.5 py-2 text-base sm:text-sm text-asphalt placeholder:text-mute transition-colors focus:border-sign focus:outline-none focus-visible:border-sign focus-visible:outline-none aria-[invalid=true]:border-danger aria-[invalid=true]:focus:border-danger disabled:cursor-not-allowed disabled:bg-chalk disabled:opacity-60",
        className,
      )}
      {...rest}
    />
  );
}

export function FieldTextarea({ className, ...rest }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "flex min-h-[96px] w-full rounded border-[1.5px] border-asphalt bg-surface px-3.5 py-2.5 text-base sm:text-sm text-asphalt placeholder:text-mute transition-colors focus:border-sign focus:outline-none focus-visible:border-sign focus-visible:outline-none aria-[invalid=true]:border-danger aria-[invalid=true]:focus:border-danger disabled:cursor-not-allowed disabled:bg-chalk disabled:opacity-60",
        className,
      )}
      {...rest}
    />
  );
}

interface ExtractedOption {
  value: string;
  label: string;
  disabled?: boolean;
}

function extractSelectOptions(children: React.ReactNode): ExtractedOption[] {
  const out: ExtractedOption[] = [];
  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) return;
    if (child.type === React.Fragment) {
      out.push(...extractSelectOptions((child.props as { children?: React.ReactNode }).children));
      return;
    }
    if (child.type === "option") {
      const props = child.props as React.OptionHTMLAttributes<HTMLOptionElement>;
      const rawLabel = Array.isArray(props.children) ? props.children.join("") : String(props.children ?? "");
      const value = props.value !== undefined ? String(props.value) : rawLabel;
      out.push({ value, label: rawLabel, disabled: props.disabled });
    }
  });
  return out;
}

export function FieldSelect({
  className,
  children,
  value,
  defaultValue,
  onChange,
  disabled,
  id,
  name,
  "aria-label": ariaLabel,
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  const options = React.useMemo(() => extractSelectOptions(children), [children]);
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = React.useState<string>(() =>
    defaultValue !== undefined ? String(defaultValue) : options[0]?.value ?? "",
  );
  const currentValue = isControlled ? String(value) : internalValue;
  const selectedOption = options.find((o) => o.value === currentValue) ?? options[0];

  const [open, setOpen] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState<number>(-1);
  const rootRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (!open) return;
    function onPointerDown(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  function selectValue(nextVal: string) {
    if (!isControlled) setInternalValue(nextVal);
    onChange?.({
      target: { value: nextVal, name: name ?? "" },
      currentTarget: { value: nextVal, name: name ?? "" },
    } as unknown as React.ChangeEvent<HTMLSelectElement>);
    setOpen(false);
  }

  function handleTriggerKeyDown(e: React.KeyboardEvent<HTMLButtonElement>) {
    if (disabled) return;
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (!open) {
        const idx = Math.max(0, options.findIndex((o) => o.value === currentValue));
        setActiveIndex(idx);
        setOpen(true);
      } else {
        const delta = e.key === "ArrowDown" ? 1 : -1;
        setActiveIndex((prev) => (prev + delta + options.length) % Math.max(1, options.length));
      }
    } else if (e.key === "Enter" || e.key === " ") {
      if (open && activeIndex >= 0 && options[activeIndex] && !options[activeIndex].disabled) {
        e.preventDefault();
        selectValue(options[activeIndex].value);
      }
    }
  }

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      {name ? <input type="hidden" name={name} value={currentValue} /> : null}
      <button
        id={id}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        disabled={disabled}
        onClick={() => {
          if (disabled) return;
          setActiveIndex(Math.max(0, options.findIndex((o) => o.value === currentValue)));
          setOpen((v) => !v);
        }}
        onKeyDown={handleTriggerKeyDown}
        className={cn(
          "flex min-h-[44px] w-full items-center justify-between gap-2 rounded border-[1.5px] border-asphalt bg-surface px-3.5 py-2 text-left text-base text-asphalt transition-colors sm:text-sm",
          "focus:border-sign focus:outline-none focus-visible:border-sign focus-visible:outline-none",
          "disabled:cursor-not-allowed disabled:bg-chalk disabled:opacity-60",
          open && "border-sign",
        )}
      >
        <span className="truncate">{selectedOption?.label ?? "—"}</span>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-asphalt transition-transform duration-150",
            open && "rotate-180",
          )}
          aria-hidden="true"
        />
      </button>

      {open ? (
        <ul
          role="listbox"
          tabIndex={-1}
          className="absolute left-0 right-0 z-50 mt-1.5 max-h-64 overflow-y-auto rounded border-2 border-asphalt bg-surface p-1 shadow-[0_12px_28px_rgba(24,32,43,0.16)]"
        >
          {options.map((opt, idx) => {
            const isSelected = opt.value === currentValue;
            const isHighlighted = idx === activeIndex;
            return (
              <li
                key={opt.value}
                role="option"
                aria-selected={isSelected}
                onMouseEnter={() => setActiveIndex(idx)}
                onClick={() => {
                  if (!opt.disabled) selectValue(opt.value);
                }}
                className={cn(
                  "flex cursor-pointer items-center justify-between gap-2 rounded px-3 py-2.5 text-sm transition-colors",
                  opt.disabled && "cursor-not-allowed opacity-45",
                  isSelected
                    ? "bg-signal/25 font-semibold text-asphalt"
                    : isHighlighted
                      ? "bg-chalk text-asphalt"
                      : "text-asphalt hover:bg-chalk",
                )}
              >
                <span className="truncate">{opt.label}</span>
                {isSelected ? <Check className="h-4 w-4 shrink-0 text-asphalt" aria-hidden="true" /> : null}
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}

export function FieldCheckbox({
  checked,
  onCheckedChange,
  id,
  required,
  className,
}: {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  id?: string;
  required?: boolean;
  className?: string;
}) {
  return (
    <CheckboxPrimitive.Root
      id={id}
      required={required}
      checked={checked}
      onCheckedChange={(v) => onCheckedChange(v === true)}
      className={cn(
        "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 border-asphalt bg-surface text-asphalt transition-colors data-[state=checked]:bg-signal",
        className,
      )}
    >
      <CheckboxPrimitive.Indicator>
        <Check className="h-3.5 w-3.5 stroke-[3]" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export function FieldLabel({ className, ...rest }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={cn("block text-sm font-semibold text-asphalt", className)} {...rest} />;
}

export function Panel({
  className,
  strong = false,
  children,
}: {
  className?: string;
  strong?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-lg bg-surface p-5 sm:p-6",
        strong ? "border-2 border-asphalt" : "border border-line",
        className,
      )}
    >
      {children}
    </div>
  );
}

type BadgeTone = "neutral" | "signal" | "ok" | "sign" | "danger";

const BADGE_MAP: Record<BadgeTone, string> = {
  neutral: "border-line bg-chalk text-asphalt",
  signal: "border-asphalt bg-signal text-asphalt",
  ok: "border-ok/30 bg-ok/10 text-ok",
  sign: "border-sign/30 bg-sign/10 text-sign",
  danger: "border-danger/30 bg-danger/10 text-danger",
};

export function StatusTag({
  tone = "neutral",
  className,
  children,
}: {
  tone?: BadgeTone;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded border px-2.5 py-0.5 text-xs font-semibold",
        BADGE_MAP[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function ProgressMeter({
  value,
  tone = "signal",
  label,
}: {
  value: number;
  tone?: "signal" | "ok" | "sign" | "danger";
  label?: string;
}) {
  const clamped = Math.max(0, Math.min(100, value));
  const fill =
    tone === "ok"
      ? "bg-ok"
      : tone === "sign"
        ? "bg-sign"
        : tone === "danger"
          ? "bg-danger"
          : "bg-signal";
  return (
    <div
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
      className="h-2 w-full overflow-hidden rounded-full bg-line"
    >
      <div className={cn("h-full rounded-full transition-[width] duration-200", fill)} style={{ width: `${clamped}%` }} />
    </div>
  );
}

export function NoticeBox({
  tone = "info",
  title,
  children,
  className,
}: {
  tone?: "info" | "warning" | "error" | "success";
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  const styles = {
    info: "border-sign/30 bg-surface text-asphalt",
    warning: "border-asphalt bg-signal/15 text-asphalt",
    error: "border-danger bg-danger/5 text-danger",
    success: "border-ok bg-ok/10 text-ok",
  }[tone];
  return (
    <div className={cn("rounded-lg border p-4 text-sm", styles, className)} role={tone === "error" ? "alert" : undefined}>
      {title ? <p className="mb-1 font-semibold text-asphalt">{title}</p> : null}
      <div className="text-asphalt/90">{children}</div>
    </div>
  );
}
