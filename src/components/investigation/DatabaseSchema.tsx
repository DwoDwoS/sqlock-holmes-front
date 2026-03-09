import { useState, useMemo } from 'react';
import { Database, ChevronDown, Info, Hash, Type, ToggleLeft } from 'lucide-react';
import { SCHEMAS, COLOR_MAP } from './databaseSchemas';
import type { Table, Column } from './databaseSchemas';
import './DatabaseSchema.scss';

function TypeIcon({ type }: { type: string }) {
  const t = type.toUpperCase();
  if (t === 'INTEGER' || t === 'REAL') return <Hash size={11} />;
  if (t === 'BOOLEAN') return <ToggleLeft size={11} />;
  return <Type size={11} />;
}

function TablePreview({ columns, color }: { columns: Column[]; color: string }) {
  const colors = COLOR_MAP[color] ?? COLOR_MAP.cyan;
  return (
    <div className="ds-preview" style={{ '--c': colors.dot } as React.CSSProperties}>
      {columns.slice(0, 4).map((col) => (
        <span key={col.name} className="ds-preview-pill">{col.name}</span>
      ))}
      {columns.length > 4 && (
        <span className="ds-preview-more">+{columns.length - 4}</span>
      )}
    </div>
  );
}

function ColumnRow({ column, isEven, accentColor, badgeColor }: {
  column: Column;
  isEven: boolean;
  accentColor: string;
  badgeColor: string;
}) {
  return (
    <div
      className={`ds-col-row${isEven ? ' ds-col-row--even' : ''}`}
      title={column.description}
      style={{ '--c': accentColor, '--cb': badgeColor } as React.CSSProperties}
      onMouseEnter={e => (e.currentTarget.style.background = `${accentColor}0D`)}
      onMouseLeave={e => (e.currentTarget.style.background = isEven ? 'rgba(15,23,42,0.4)' : 'transparent')}
    >
      <div className="ds-col-info">
        <div className="ds-col-name">{column.name}</div>
        <div className="ds-col-desc">{column.description}</div>
      </div>
      <span className="ds-type-badge">
        <TypeIcon type={column.type} />
        {column.type}
      </span>
    </div>
  );
}

function TableCard({ table, isExpanded, onToggle }: {
  table: Table;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const colors = COLOR_MAP[table.color] ?? COLOR_MAP.cyan;
  const cssVars = { '--c': colors.dot, '--cb': colors.badge } as React.CSSProperties;

  return (
    <div className={`ds-table-card${isExpanded ? ' ds-table-card--expanded' : ''}`} style={cssVars}>
      <button
        className={`ds-table-btn${isExpanded ? ' ds-table-btn--expanded' : ''}`}
        onClick={onToggle}
      >
        <div className="ds-table-btn-left">
          <span className={`ds-table-dot${isExpanded ? ' ds-table-dot--expanded' : ''}`} />
          <span className="ds-table-name">{table.name}</span>
          <span className="ds-table-count">{table.columns.length}</span>
        </div>
        <ChevronDown
          className="ds-table-chevron"
          size={13}
          style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
        />
      </button>

      {!isExpanded && <TablePreview columns={table.columns} color={table.color} />}

      {isExpanded && (
        <div className="ds-expanded">
          <div className="ds-col-header" style={cssVars}>
            <span>Colonne</span>
            <span>Type</span>
          </div>
          {table.columns.map((column, index) => (
            <ColumnRow
              key={column.name}
              column={column}
              isEven={index % 2 === 0}
              accentColor={colors.dot}
              badgeColor={colors.badge}
            />
          ))}
        </div>
      )}
    </div>
  );
}

const SQL_TIPS = [
  { kw: 'SELECT *',  desc: 'Récupère toutes les colonnes'           },
  { kw: 'WHERE',     desc: 'Filtre les lignes selon une condition'   },
  { kw: 'JOIN … ON', desc: 'Croise deux tables via une clé'          },
  { kw: 'LEFT JOIN', desc: 'Conserve les lignes sans correspondance' },
  { kw: 'COUNT(*)',  desc: 'Compte le nombre de lignes'              },
  { kw: 'ORDER BY',  desc: 'Trie les résultats'                      },
  { kw: 'GROUP BY',  desc: "Regroupe avant d'agréger"                },
];

function SqlTips() {
  const [open, setOpen] = useState(true);
  return (
    <div className="ds-tips">
      <button
        className={`ds-tips-btn${open ? ' ds-tips-btn--open' : ''}`}
        onClick={() => setOpen(o => !o)}
      >
        <div className="ds-tips-btn-left">
          <Info size={13} />
          Astuces SQL
        </div>
        <ChevronDown
          size={13}
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}
        />
      </button>
      {open && (
        <div className="ds-tips-body">
          {SQL_TIPS.map(({ kw, desc }) => (
            <div key={kw} className="ds-tip-row">
              <code className="ds-tip-kw">{kw}</code>
              <span className="ds-tip-desc">{desc}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

interface DatabaseSchemaProps {
  investigationId?: number;
}

export function DatabaseSchema({ investigationId }: DatabaseSchemaProps) {
  const schema = useMemo(
    () => (investigationId && SCHEMAS[investigationId]) ? SCHEMAS[investigationId] : SCHEMAS[3],
    [investigationId],
  );

  const [expandedTable, setExpandedTable] = useState<string | null>(
    () => schema.tables[0]?.name ?? null,
  );

  const toggle = (name: string) => setExpandedTable(prev => (prev === name ? null : name));

  return (
    <div className="ds-root">
      <div className="ds-header ds-header--static">
        <div className="ds-header-left">
          <div className="ds-header-icon">
            <Database size={15} />
          </div>
          <div>
            <div className="ds-header-title">Schéma de base de données</div>
            <div className="ds-header-label">{schema.label}</div>
          </div>
        </div>
        <div className="ds-header-right">
          <span className="ds-header-badge">{schema.tables.length} tables</span>
        </div>
      </div>
      <div className="ds-list">
        {schema.tables.map(table => (
          <TableCard
            key={table.name}
            table={table}
            isExpanded={expandedTable === table.name}
            onToggle={() => toggle(table.name)}
          />
        ))}
        <SqlTips />
      </div>
    </div>
  );
}