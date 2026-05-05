import type { ReactNode } from "react";

export function ModuleHeader({
  eyebrow,
  title,
  description,
  aside,
}: {
  eyebrow: string;
  title: string;
  description: string;
  aside?: ReactNode;
}) {
  return (
    <section className="rounded-[1.4rem] border border-[var(--nexus-border-focus)] bg-[linear-gradient(135deg,rgba(34,197,94,0.1),rgba(4,10,6,0.92))] p-6 shadow-[var(--floating-glow)]">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
        <div className="max-w-4xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.28em] text-[var(--nexus-green)]">
            {eyebrow}
          </p>
          <h1 className="mt-3 font-heading text-3xl text-[var(--nexus-text)] sm:text-4xl">
            {title}
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--nexus-text-soft)] sm:text-base">
            {description}
          </p>
        </div>
        {aside ? (
          <div className="min-w-[18rem] rounded-[1.2rem] border border-[var(--nexus-border-subtle)] bg-[rgba(4,10,6,0.72)] p-4 shadow-[var(--panel-glow)]">
            {aside}
          </div>
        ) : null}
      </div>
    </section>
  );
}
