import type { ReactNode } from "react";

export type DataTableColumn<T> = {
  key: string;
  header: string;
  className?: string;
  headerClassName?: string;
  cell: (row: T) => ReactNode;
};

export function DataTable<T>({
  columns,
  rows,
  getRowKey,
}: {
  columns: DataTableColumn<T>[];
  rows: T[];
  getRowKey: (row: T) => string;
}) {
  return (
    <div className="overflow-hidden rounded-[1rem] border border-[var(--nexus-border-subtle)]">
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-[var(--nexus-border-subtle)] bg-[rgba(4,10,6,0.86)]">
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={[
                    "whitespace-nowrap px-4 py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--nexus-text-muted)]",
                    column.headerClassName ?? "",
                  ].join(" ")}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={getRowKey(row)}
                className="border-b border-[var(--nexus-border-subtle)] bg-[rgba(4,10,6,0.26)] transition hover:bg-[rgba(34,197,94,0.08)]"
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={[
                      "px-4 py-4 align-top text-sm text-[var(--nexus-text-soft)]",
                      column.className ?? "",
                    ].join(" ")}
                  >
                    {column.cell(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
