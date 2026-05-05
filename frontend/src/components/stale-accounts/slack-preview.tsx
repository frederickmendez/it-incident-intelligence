import type { SlackRecommendation } from "@/lib/stale-account-cleanup/types";

export function SlackPreview({
  recommendation,
}: {
  recommendation: SlackRecommendation;
}) {
  return (
    <div className="glass-card p-5 animate-in animate-in-delay-3">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="section-title mb-2">Slack Recommendation Preview</p>
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">
            Identity cleanup briefing
          </h2>
        </div>
        <span className="status-dot mock" aria-label="Mock recommendation" />
      </div>

      <div className="rounded-[var(--radius-md)] border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-4">
        <p className="text-sm leading-6 text-[var(--text-primary)]">{recommendation.text}</p>
        <div className="mt-4 space-y-2">
          {recommendation.sections.map((section) => (
            <p className="text-xs text-[var(--text-secondary)]" key={section}>
              • {section}
            </p>
          ))}
        </div>
        {recommendation.highest_risk_accounts.length > 0 ? (
          <div className="mt-4 border-t border-[var(--border-subtle)] pt-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">
              Highest-risk accounts
            </p>
            <div className="space-y-2">
              {recommendation.highest_risk_accounts.map((account) => (
                <p className="font-mono text-xs text-[var(--text-primary)]" key={account}>
                  {account}
                </p>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
