import type { ReactNode } from "react";

export function SectionPanel({
  title,
  eyebrow,
  action,
  children,
}: {
  title: string;
  eyebrow?: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="min-w-0 rounded-lg border border-[var(--nexus-border-subtle)] bg-[var(--nexus-panel)] p-4 shadow-[var(--panel-glow)] sm:p-5">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          {eyebrow ? (
            <p className="break-words font-mono text-[10px] uppercase leading-5 tracking-[0.14em] text-[var(--nexus-text-muted)]">
              {eyebrow}
            </p>
          ) : null}
          <h3 className="mt-2 break-words text-base font-semibold leading-6 text-[var(--nexus-text)]">
            {title}
          </h3>
        </div>
        {action ? <div>{action}</div> : null}
      </div>
      {children}
    </section>
  );
}
