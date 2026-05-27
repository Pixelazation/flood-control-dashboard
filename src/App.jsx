import { useEffect, useMemo, useRef, useState } from "react";
import * as d3 from "d3";
import Papa from "papaparse";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from "recharts";
import "./App.css";

const PROVINCE_FILES = [
  "ph.autonomous-region-of-muslim-mindanao-armm.basilan.any.any.geo.json",
  "ph.autonomous-region-of-muslim-mindanao-armm.lanao-del-sur.any.any.geo.json",
  "ph.autonomous-region-of-muslim-mindanao-armm.maguindanao.any.any.geo.json",
  "ph.autonomous-region-of-muslim-mindanao-armm.shariff-kabunsuan.any.any.geo.json",
  "ph.autonomous-region-of-muslim-mindanao-armm.sulu.any.any.geo.json",
  "ph.autonomous-region-of-muslim-mindanao-armm.tawi-tawi.any.any.geo.json",
  "ph.bicol-region-region-v.albay.any.any.geo.json",
  "ph.bicol-region-region-v.camarines-norte.any.any.geo.json",
  "ph.bicol-region-region-v.camarines-sur.any.any.geo.json",
  "ph.bicol-region-region-v.catanduanes.any.any.geo.json",
  "ph.bicol-region-region-v.masbate.any.any.geo.json",
  "ph.bicol-region-region-v.sorsogon.any.any.geo.json",
  "ph.cagayan-valley-region-ii.batanes.any.any.geo.json",
  "ph.cagayan-valley-region-ii.cagayan.any.any.geo.json",
  "ph.cagayan-valley-region-ii.isabela.any.any.geo.json",
  "ph.cagayan-valley-region-ii.nueva-vizcaya.any.any.geo.json",
  "ph.cagayan-valley-region-ii.quirino.any.any.geo.json",
  "ph.calabarzon-region-iv-a.batangas.any.any.geo.json",
  "ph.calabarzon-region-iv-a.cavite.any.any.geo.json",
  "ph.calabarzon-region-iv-a.laguna.any.any.geo.json",
  "ph.calabarzon-region-iv-a.quezon.any.any.geo.json",
  "ph.calabarzon-region-iv-a.rizal.any.any.geo.json",
  "ph.caraga-region-xiii.agusan-del-norte.any.any.geo.json",
  "ph.caraga-region-xiii.agusan-del-sur.any.any.geo.json",
  "ph.caraga-region-xiii.dinagat-islands.any.any.geo.json",
  "ph.caraga-region-xiii.surigao-del-norte.any.any.geo.json",
  "ph.caraga-region-xiii.surigao-del-sur.any.any.geo.json",
  "ph.central-luzon-region-iii.aurora.any.any.geo.json",
  "ph.central-luzon-region-iii.bataan.any.any.geo.json",
  "ph.central-luzon-region-iii.bulacan.any.any.geo.json",
  "ph.central-luzon-region-iii.nueva-ecija.any.any.geo.json",
  "ph.central-luzon-region-iii.pampanga.any.any.geo.json",
  "ph.central-luzon-region-iii.tarlac.any.any.geo.json",
  "ph.central-luzon-region-iii.zambales.any.any.geo.json",
  "ph.central-visayas-region-vii.bohol.any.any.geo.json",
  "ph.central-visayas-region-vii.cebu.any.any.geo.json",
  "ph.central-visayas-region-vii.negros-oriental.any.any.geo.json",
  "ph.central-visayas-region-vii.siquijor.any.any.geo.json",
  "ph.cordillera-administrative-region-car.abra.any.any.geo.json",
  "ph.cordillera-administrative-region-car.apayao.any.any.geo.json",
  "ph.cordillera-administrative-region-car.benguet.any.any.geo.json",
  "ph.cordillera-administrative-region-car.ifugao.any.any.geo.json",
  "ph.cordillera-administrative-region-car.kalinga.any.any.geo.json",
  "ph.cordillera-administrative-region-car.mountain-province.any.any.geo.json",
  "ph.davao-region-region-xi.compostela-valley.any.any.geo.json",
  "ph.davao-region-region-xi.davao-del-norte.any.any.geo.json",
  "ph.davao-region-region-xi.davao-del-sur.any.any.geo.json",
  "ph.davao-region-region-xi.davao-oriental.any.any.geo.json",
  "ph.eastern-visayas-region-viii.biliran.any.any.geo.json",
  "ph.eastern-visayas-region-viii.eastern-samar.any.any.geo.json",
  "ph.eastern-visayas-region-viii.leyte.any.any.geo.json",
  "ph.eastern-visayas-region-viii.northern-samar.any.any.geo.json",
  "ph.eastern-visayas-region-viii.samar.any.any.geo.json",
  "ph.eastern-visayas-region-viii.southern-leyte.any.any.geo.json",
  "ph.ilocos-region-region-i.ilocos-norte.any.any.geo.json",
  "ph.ilocos-region-region-i.ilocos-sur.any.any.geo.json",
  "ph.ilocos-region-region-i.la-union.any.any.geo.json",
  "ph.ilocos-region-region-i.pangasinan.any.any.geo.json",
  "ph.mimaropa-region-iv-b.marinduque.any.any.geo.json",
  "ph.mimaropa-region-iv-b.occidental-mindoro.any.any.geo.json",
  "ph.mimaropa-region-iv-b.oriental-mindoro.any.any.geo.json",
  "ph.mimaropa-region-iv-b.palawan.any.any.geo.json",
  "ph.mimaropa-region-iv-b.romblon.any.any.geo.json",
  "ph.national-capital-region.metropolitan-manila.any.any.geo.json",
  "ph.northern-mindanao-region-x.bukidnon.any.any.geo.json",
  "ph.northern-mindanao-region-x.camiguin.any.any.geo.json",
  "ph.northern-mindanao-region-x.lanao-del-norte.any.any.geo.json",
  "ph.northern-mindanao-region-x.misamis-occidental.any.any.geo.json",
  "ph.northern-mindanao-region-x.misamis-oriental.any.any.geo.json",
  "ph.soccsksargen-region-xii.north-cotabato.any.any.geo.json",
  "ph.soccsksargen-region-xii.sarangani.any.any.geo.json",
  "ph.soccsksargen-region-xii.south-cotabato.any.any.geo.json",
  "ph.soccsksargen-region-xii.sultan-kudarat.any.any.geo.json",
  "ph.western-visayas-region-vi.aklan.any.any.geo.json",
  "ph.western-visayas-region-vi.antique.any.any.geo.json",
  "ph.western-visayas-region-vi.capiz.any.any.geo.json",
  "ph.western-visayas-region-vi.guimaras.any.any.geo.json",
  "ph.western-visayas-region-vi.iloilo.any.any.geo.json",
  "ph.western-visayas-region-vi.negros-occidental.any.any.geo.json",
  "ph.zamboanga-peninsula-region-ix.zamboanga-del-norte.any.any.geo.json",
  "ph.zamboanga-peninsula-region-ix.zamboanga-del-sur.any.any.geo.json",
  "ph.zamboanga-peninsula-region-ix.zamboanga-sibugay.any.any.geo.json",
];

const REGION_FILES = [
  "ph.autonomous-region-of-muslim-mindanao-armm.any.any.any.geo.json",
  "ph.bicol-region-region-v.any.any.any.geo.json",
  "ph.cagayan-valley-region-ii.any.any.any.geo.json",
  "ph.calabarzon-region-iv-a.any.any.any.geo.json",
  "ph.caraga-region-xiii.any.any.any.geo.json",
  "ph.central-luzon-region-iii.any.any.any.geo.json",
  "ph.central-visayas-region-vii.any.any.any.geo.json",
  "ph.cordillera-administrative-region-car.any.any.any.geo.json",
  "ph.davao-region-region-xi.any.any.any.geo.json",
  "ph.eastern-visayas-region-viii.any.any.any.geo.json",
  "ph.ilocos-region-region-i.any.any.any.geo.json",
  "ph.mimaropa-region-iv-b.any.any.any.geo.json",
  "ph.national-capital-region.any.any.any.geo.json",
  "ph.northern-mindanao-region-x.any.any.any.geo.json",
  "ph.soccsksargen-region-xii.any.any.any.geo.json",
  "ph.western-visayas-region-vi.any.any.any.geo.json",
  "ph.zamboanga-peninsula-region-ix.any.any.any.geo.json",
];

const MAP_WIDTH = 900;
const MAP_HEIGHT = 700;

const METRICS = {
  gap: {
    key: "Disparity_Index",
    label: "Funding Gap Score",
    shortLabel: "Funding Gap",
    description:
      "Funding Gap Score = funding rank minus damage rank. Negative means underfunded.",
  },
  moneyGap: {
    key: "Monetary_Gap",
    label: "Cost/Damage Ratio",
    shortLabel: "Cost/Damage Ratio",
    description:
      "Cost/Damage Ratio = if damage > cost: -(damage / cost), else cost / damage.",
  },
  monetaryGap: {
    key: "Monetary_Delta",
    label: "Monetary Gap",
    shortLabel: "Monetary Gap",
    description:
      "Monetary Gap = flood funding minus typhoon damage (PHP). Negative means underfunded.",
  },
  rbai: {
    key: "RBAI_Category",
    label: "RBAI Category",
    shortLabel: "RBAI",
    description:
      "RBAI = budget share divided by damage share. 1.0 aligned, >1 over-allocated, <1 under-allocated.",
  },
  damage: {
    key: "Total_Damage_PhP",
    label: "Typhoon Damage",
    shortLabel: "Typhoon Damage",
    description: "Estimated total typhoon damage in Philippine pesos.",
  },
  funding: {
    key: "ABC",
    label: "Flood Funding",
    shortLabel: "Flood Funding",
    description: "Total flood control budget allocation in Philippine pesos.",
  },
};

const RBAI_CATEGORY_ORDER = [
  "Over-Allocated / Low-Risk Spending",
  "Appropriate Priority",
  "Under-Funded / High Vulnerability",
  "Baseline Maintenance",
];

const RBAI_CATEGORY_COLORS = {
  "Over-Allocated / Low-Risk Spending": "#C0392B",
  "Appropriate Priority": "#1E8449",
  "Under-Funded / High Vulnerability": "#F39C12",
  "Baseline Maintenance": "#95A5A6",
};

const normalizeName = (value = "") =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();

const normalizeRbaiCategory = (value = "") =>
  String(value)
    .replace(/^[^A-Za-z]+/, "")
    .trim();

const parseNumber = (value) => {
  if (value === null || value === undefined) return null;
  const cleaned = String(value).replace(/,/g, "").trim();
  if (!cleaned) return null;
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? parsed : null;
};

const formatNumber = (value) => {
  if (value === null || value === undefined) return "No data";
  return new Intl.NumberFormat("en-US").format(value);
};

const formatBillions = (value) => {
  if (value === null || value === undefined) return "No data";
  const billions = value / 1_000_000_000;
  return `PHP ${billions.toFixed(1)}B`;
};

const scoreToVerdict = (score) => {
  if (score === null || score === undefined) {
    return {
      label: "No data",
      className: "badge-neutral",
    };
  }
  if (score <= -40) {
    return { label: "Most Likely Underfunded", className: "badge-critical" };
  }
  if (score <= -15) {
    return { label: "Possibly Underfunded", className: "badge-warning" };
  }
  if (score <= 15) {
    return { label: "Balanced", className: "badge-neutral" };
  }
  if (score <= 40) {
    return { label: "Possibly Overfunded", className: "badge-info" };
  }
  return { label: "Most Likely Overfunded", className: "badge-strong" };
};

const moneyGapToVerdict = (value) => {
  if (!Number.isFinite(value)) {
    return { label: "No data", className: "badge-neutral" };
  }
  const nearBalance = Math.abs(Math.abs(value) - 1) <= 0.1;
  if (nearBalance) {
    return { label: "Balanced", className: "badge-neutral" };
  }
  return value < 0
    ? { label: "Damage > Cost", className: "badge-critical" }
    : { label: "Cost > Damage", className: "badge-info" };
};

const monetaryGapToVerdict = (value, damage) => {
  if (!Number.isFinite(value)) {
    return { label: "No data", className: "badge-neutral" };
  }
  const tolerance = Number.isFinite(damage) ? Math.abs(damage) * 0.1 : 0;
  if (Math.abs(value) <= tolerance) {
    return { label: "Balanced", className: "badge-neutral" };
  }
  return value < 0
    ? { label: "Underfunded", className: "badge-critical" }
    : { label: "Overfunded", className: "badge-strong" };
};

const rbaiCategoryToVerdict = (category) => {
  if (!category) {
    return { label: "No data", className: "badge-neutral" };
  }
  if (category === "Over-Allocated / Low-Risk Spending") {
    return { label: "Over-Allocated", className: "badge-critical" };
  }
  if (category === "Under-Funded / High Vulnerability") {
    return { label: "Under-Funded", className: "badge-warning" };
  }
  if (category === "Appropriate Priority") {
    return { label: "Appropriate Priority", className: "badge-strong" };
  }
  return { label: "Baseline Maintenance", className: "badge-neutral" };
};

const buildRbaiSentence = (category) => {
  if (!category) {
    return "This province does not have an RBAI classification yet.";
  }
  return `RBAI classification: ${category}.`;
};

const metricToVerdict = (metric, value, row, bands) => {
  if (metric === "gap") {
    return scoreToVerdict(value);
  }
  if (metric === "moneyGap") {
    return moneyGapToVerdict(value);
  }
  if (metric === "monetaryGap") {
    return monetaryGapToVerdict(value, row?.Total_Damage_PhP ?? null);
  }
  if (metric === "rbai") {
    return rbaiCategoryToVerdict(value);
  }
  if (metric === "damage" || metric === "funding") {
    const band = bands?.[metric];
    if (!band || !Number.isFinite(value)) {
      return { label: "No data", className: "badge-neutral" };
    }
    if (value <= band.low) {
      return { label: "Low", className: "badge-neutral" };
    }
    if (value <= band.high) {
      return { label: "Moderate", className: "badge-warning" };
    }
    return { label: "High", className: "badge-strong" };
  }
  return { label: "No data", className: "badge-neutral" };
};

const buildRatioSentence = (row) => {
  if (!row) {
    return "This province does not have enough data for a ratio assessment.";
  }
  const damage = row.Total_Damage_PhP;
  const funding = row.ABC;
  if (
    !Number.isFinite(damage) ||
    !Number.isFinite(funding) ||
    funding <= 0 ||
    damage <= 0
  ) {
    return "Damage or cost data are incomplete, so the ratio assessment is limited.";
  }
  if (damage > funding) {
    return `Damage is ${(damage / funding).toFixed(2)}x the project costs.`;
  }
  return `Project costs are ${(funding / damage).toFixed(2)}x the damage.`;
};

const buildVerdictSentence = (row) => {
  if (!row) {
    return "This province does not have enough data for a funding gap assessment.";
  }
  const damage = row.Total_Damage_PhP;
  const funding = row.ABC;
  const projects = row.Total_Projects;
  if (damage === null || funding === null) {
    return "Funding and damage data are incomplete, so the gap assessment is limited.";
  }
  const gap = funding - damage;
  const direction = gap >= 0 ? "above" : "below";
  const gapValue = formatBillions(Math.abs(gap));
  const projectText = projects
    ? `${formatNumber(projects)} projects`
    : "few projects";
  return `Funding sits ${direction} estimated typhoon damage by ${gapValue}, supported by ${projectText}.`;
};

const resolveYearlyValue = (row, keys) => {
  for (const key of keys) {
    if (row[key] !== undefined) {
      const parsed = parseNumber(row[key]);
      if (parsed !== null) return parsed;
    }
  }
  return null;
};

const MapToggle = ({ value, onChange, variant = "full" }) => {
  const options = [
    { id: "gap", label: METRICS.gap.shortLabel },
    { id: "monetaryGap", label: METRICS.monetaryGap.shortLabel },
    { id: "moneyGap", label: METRICS.moneyGap.shortLabel },
    { id: "rbai", label: METRICS.rbai.shortLabel },
    { id: "damage", label: METRICS.damage.shortLabel },
    { id: "funding", label: METRICS.funding.shortLabel },
  ];

  return (
    <div className={`toggle-group ${variant === "compact" ? "compact" : ""}`}>
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          className={`toggle-button ${value === option.id ? "is-active" : ""}`}
          onClick={() => onChange(option.id)}
          aria-pressed={value === option.id}
        >
          {option.id === "gap" ||
          option.id === "moneyGap" ||
          option.id === "monetaryGap" ||
          option.id === "rbai" ? (
            <span className="toggle-with-info">
              {option.label}
              <span
                className="info-dot"
                title={METRICS[option.id].description}
                aria-label={`${METRICS[option.id].label} information`}
              >
                ?
              </span>
            </span>
          ) : (
            option.label
          )}
        </button>
      ))}
    </div>
  );
};

const Legend = ({ metric }) => {
  if (metric === "gap") {
    return (
      <div className="legend-block">
        <div className="legend-title">{METRICS[metric].label}</div>
        <div className="legend-bar legend-gap"></div>
        <div className="legend-labels">
          <span>Underfunded</span>
          <span>Balanced</span>
          <span>Overfunded</span>
        </div>
      </div>
    );
  }
  if (metric === "monetaryGap") {
    return (
      <div className="legend-block">
        <div className="legend-title">{METRICS[metric].label}</div>
        <div className="legend-bar legend-gap"></div>
        <div className="legend-labels">
          <span>Underfunded</span>
          <span>Balanced</span>
          <span>Overfunded</span>
        </div>
      </div>
    );
  }
  if (metric === "moneyGap") {
    return (
      <div className="legend-block">
        <div className="legend-title">{METRICS[metric].label}</div>
        <div className="legend-bar legend-gap"></div>
        <div className="legend-labels">
          <span>Negative</span>
          <span>Balanced</span>
          <span>Positive</span>
        </div>
      </div>
    );
  }
  if (metric === "rbai") {
    return (
      <div className="legend-block">
        <div className="legend-title">{METRICS[metric].label}</div>
        <div className="legend-list">
          {RBAI_CATEGORY_ORDER.map((category) => (
            <div className="legend-item" key={category}>
              <span
                className="legend-swatch"
                style={{ background: RBAI_CATEGORY_COLORS[category] }}
              ></span>
              <span>{category}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return (
    <div className="legend-block">
      <div className="legend-title">{METRICS[metric].label}</div>
      <div
        className={`legend-bar ${metric === "damage" ? "legend-damage" : "legend-funding"}`}
      ></div>
      <div className="legend-labels">
        <span>Low</span>
        <span>High</span>
      </div>
    </div>
  );
};

const MiniChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="mini-chart-empty">No yearly data for this province.</div>
    );
  }

  return (
    <div className="mini-chart">
      <ResponsiveContainer width="100%" height={180}>
        <LineChart
          data={data}
          margin={{ top: 10, right: 8, left: -10, bottom: 0 }}
        >
          <XAxis dataKey="year" tick={{ fontSize: 11 }} />
          <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
          <RechartsTooltip
            formatter={(value, name) => [
              value === null || value === undefined
                ? "No data"
                : `${Number(value).toFixed(1)}%`,
              name === "damage" ? "Damage" : "Funding",
            ]}
          />
          <Line
            type="monotone"
            dataKey="damage"
            stroke="#E67E22"
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="funding"
            stroke="#1E8449"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

function App() {
  const mapWrapRef = useRef(null);
  const svgRef = useRef(null);
  const mapLayerRef = useRef(null);
  const zoomBehaviorRef = useRef(null);
  const tooltipRef = useRef(null);
  const tooltipFrameRef = useRef(null);
  const tooltipPosRef = useRef({ x: -9999, y: -9999 });
  const hoveredProvinceRef = useRef(null);
  const isDraggingRef = useRef(false);
  const [selectedMetric, setSelectedMetric] = useState("gap");
  const [provinceFeatures, setProvinceFeatures] = useState([]);
  const [regionFeatures, setRegionFeatures] = useState([]);
  const [provinceRows, setProvinceRows] = useState([]);
  const [rbaiMap, setRbaiMap] = useState(() => new Map());
  const [yearlyRows, setYearlyRows] = useState([]);
  const [yearlyStatus, setYearlyStatus] = useState("idle");
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [tooltipContent, setTooltipContent] = useState({
    visible: false,
    name: "",
    value: "",
  });
  const [regionFilter, setRegionFilter] = useState("All Regions");
  const [loadError, setLoadError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        const [csvResponse, provinceJsons, regionJsons] = await Promise.all([
          fetch("/data/main.csv").then((res) => res.text()),
          Promise.all(
            PROVINCE_FILES.map((file) =>
              fetch(`/data/geojson_province/${file}`).then((res) => res.json()),
            ),
          ),
          Promise.all(
            REGION_FILES.map((file) =>
              fetch(`/data/geojson_region/${file}`).then((res) => res.json()),
            ),
          ),
        ]);

        if (!isMounted) return;

        const parsed = Papa.parse(csvResponse, {
          header: true,
          skipEmptyLines: true,
        });

        const numericColumns = [
          "Damage to Infrastructure (PhP)",
          "Damage to Agriculture + Fisheries (PhP)",
          "Affected",
          "Deaths",
          "Total_Cyclones",
          "ABC",
          "ContractCost",
          "Total_Projects",
          "Avg_Slippage_Days",
          "Total_Damage_PhP",
          "Damage_Rank",
          "Funding_Rank",
          "Disparity_Index",
        ];

        const cleanedRows = parsed.data.map((row) => {
          const next = { ...row };
          numericColumns.forEach((key) => {
            next[key] = parseNumber(row[key]);
          });
          const funding = next.ABC;
          const damage = next.Total_Damage_PhP;
          next.Monetary_Gap =
            funding !== null &&
            funding !== undefined &&
            funding > 0 &&
            damage !== null &&
            damage !== undefined &&
            damage > 0
              ? damage > funding
                ? -(damage / funding)
                : funding / damage
              : null;
          next.Monetary_Delta =
            funding !== null &&
            funding !== undefined &&
            damage !== null &&
            damage !== undefined
              ? funding - damage
              : null;
          return next;
        });

        const provinceFeatureList = provinceJsons.flatMap((json) => {
          if (json?.type === "FeatureCollection") return json.features;
          if (json?.type === "Feature") return [json];
          return [];
        });

        const regionFeatureList = regionJsons.flatMap((json) => {
          if (json?.type === "FeatureCollection") return json.features;
          if (json?.type === "Feature") return [json];
          return [];
        });

        setProvinceRows(cleanedRows);
        setProvinceFeatures(provinceFeatureList);
        setRegionFeatures(regionFeatureList);
        setIsLoading(false);

        try {
          const rbaiResponse = await fetch("/data/rbai.csv");
          if (!rbaiResponse.ok) throw new Error("RBAI data not found");
          const rbaiText = await rbaiResponse.text();
          const parsedRbai = Papa.parse(rbaiText, {
            header: true,
            skipEmptyLines: true,
          });
          const nextRbaiMap = new Map();
          parsedRbai.data.forEach((row) => {
            const name = row.Province || row.province || row.PROVINCE;
            const category = normalizeRbaiCategory(
              row.Category || row.category || row.CATEGORY,
            );
            if (name && category) {
              nextRbaiMap.set(normalizeName(name), category);
            }
          });
          if (isMounted) {
            setRbaiMap(nextRbaiMap);
          }
        } catch (error) {
          if (isMounted) {
            setRbaiMap(new Map());
          }
        }

        try {
          const yearlyResponse = await fetch("/data/yearly.csv");
          if (!yearlyResponse.ok) throw new Error("Yearly data not found");
          const yearlyText = await yearlyResponse.text();
          const parsedYearly = Papa.parse(yearlyText, {
            header: true,
            skipEmptyLines: true,
          });
          if (isMounted) {
            setYearlyRows(parsedYearly.data);
            setYearlyStatus("ready");
          }
        } catch (error) {
          if (isMounted) {
            setYearlyStatus("failed");
          }
        }
      } catch (error) {
        if (isMounted) {
          setLoadError("Failed to load the dashboard data.");
          setIsLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  const provinceCollection = useMemo(() => {
    return {
      type: "FeatureCollection",
      features: provinceFeatures,
    };
  }, [provinceFeatures]);

  const projection = useMemo(() => {
    if (!provinceFeatures.length) return null;
    return d3
      .geoMercator()
      .fitSize([MAP_WIDTH, MAP_HEIGHT], provinceCollection);
  }, [provinceCollection, provinceFeatures.length]);

  const pathGenerator = useMemo(() => {
    if (!projection) return null;
    return d3.geoPath(projection);
  }, [projection]);

  const provinceDataMap = useMemo(() => {
    const map = new Map();
    provinceRows.forEach((row) => {
      if (row.Province) {
        map.set(normalizeName(row.Province), row);
      }
    });
    return map;
  }, [provinceRows]);

  useEffect(() => {
    if (!provinceRows.length || !provinceFeatures.length) return;
    const dataSet = new Set(
      provinceRows.map((row) => normalizeName(row.Province)),
    );
    const featureSet = new Set(
      provinceFeatures.map((feature) =>
        normalizeName(feature.properties?.province_name || ""),
      ),
    );
    const missingGeo = [...dataSet].filter((name) => !featureSet.has(name));
    const missingData = [...featureSet].filter((name) => !dataSet.has(name));
    if (missingGeo.length || missingData.length) {
      console.warn("Unmatched provinces", { missingGeo, missingData });
    }
  }, [provinceFeatures, provinceRows]);

  const regionNames = useMemo(() => {
    const names = regionFeatures
      .map((feature) => feature.properties?.region_name)
      .filter(Boolean);
    return Array.from(new Set(names)).sort();
  }, [regionFeatures]);

  const provinceGeometry = useMemo(() => {
    if (!pathGenerator) return [];
    return provinceFeatures.map((feature) => {
      const name = feature.properties?.province_name || "Unknown";
      const regionName = feature.properties?.region_name || "";
      const normalized = normalizeName(name);
      return {
        id: normalized,
        name,
        regionName,
        path: pathGenerator(feature),
      };
    });
  }, [pathGenerator, provinceFeatures]);

  const regionGeometry = useMemo(() => {
    if (!pathGenerator) return [];
    return regionFeatures.map((feature, index) => ({
      id: feature.properties?.region_name || `region-${index}`,
      path: pathGenerator(feature),
    }));
  }, [pathGenerator, regionFeatures]);

  useEffect(() => {
    if (!svgRef.current || !mapLayerRef.current) return;
    const svg = d3.select(svgRef.current);
    const zoomBehavior = d3
      .zoom()
      .scaleExtent([1, 6])
      .on("start", () => {
        isDraggingRef.current = true;
        svg.classed("is-dragging", true);
        setTooltipContent((prev) =>
          prev.visible ? { ...prev, visible: false } : prev,
        );
      })
      .on("end", () => {
        window.setTimeout(() => {
          isDraggingRef.current = false;
          svg.classed("is-dragging", false);
        }, 0);
      })
      .on("zoom", (event) => {
        d3.select(mapLayerRef.current).attr("transform", event.transform);
      });

    zoomBehaviorRef.current = zoomBehavior;
    svg.call(zoomBehavior);

    return () => {
      svg.on(".zoom", null);
    };
  }, []);

  useEffect(() => {
    if (!pathGenerator || !zoomBehaviorRef.current || !svgRef.current) return;
    const svg = d3.select(svgRef.current);
    if (regionFilter === "All Regions") {
      svg
        .transition()
        .duration(600)
        .call(zoomBehaviorRef.current.transform, d3.zoomIdentity);
      return;
    }
    const target = regionFeatures.find(
      (feature) => feature.properties?.region_name === regionFilter,
    );
    if (!target) return;
    const bounds = pathGenerator.bounds(target);
    const dx = bounds[1][0] - bounds[0][0];
    const dy = bounds[1][1] - bounds[0][1];
    if (!dx || !dy) return;
    const scale = Math.min(MAP_WIDTH / dx, MAP_HEIGHT / dy) * 0.92;
    const x = MAP_WIDTH / 2 - ((bounds[0][0] + bounds[1][0]) / 2) * scale;
    const y = MAP_HEIGHT / 2 - ((bounds[0][1] + bounds[1][1]) / 2) * scale;
    const transform = d3.zoomIdentity.translate(x, y).scale(scale);
    svg
      .transition()
      .duration(700)
      .call(zoomBehaviorRef.current.transform, transform);
  }, [pathGenerator, regionFeatures, regionFilter]);

  const gapRanks = useMemo(() => {
    const valid = provinceRows.filter((row) => row.Disparity_Index !== null);
    const sorted = [...valid].sort(
      (a, b) => (b.Disparity_Index || 0) - (a.Disparity_Index || 0),
    );
    const map = new Map();
    sorted.forEach((row, index) => {
      map.set(normalizeName(row.Province), index + 1);
    });
    return { map, total: sorted.length };
  }, [provinceRows]);

  const nationalStats = useMemo(() => {
    const valid = provinceRows.filter((row) => row.Disparity_Index !== null);
    if (!valid.length) return null;
    const sorted = [...valid].sort(
      (a, b) => (a.Disparity_Index || 0) - (b.Disparity_Index || 0),
    );
    const mostNeglected = sorted[0];
    const mostOverfunded = sorted[sorted.length - 1];
    const avgSlip = d3.mean(
      provinceRows,
      (row) => row.Avg_Slippage_Days ?? null,
    );
    return {
      mostNeglected,
      mostOverfunded,
      avgSlip: avgSlip ? avgSlip.toFixed(1) : "No data",
    };
  }, [provinceRows]);

  const metricScale = useMemo(() => {
    if (!provinceRows.length) return null;
    const metricKey = METRICS[selectedMetric].key;
    const values = provinceRows
      .map((row) => row[metricKey])
      .filter((value) => Number.isFinite(value));
    if (!values.length) return null;

    if (selectedMetric === "gap" || selectedMetric === "monetaryGap") {
      const min = d3.min(values) ?? 0;
      const max = d3.max(values) ?? 0;
      const maxAbs = Math.max(Math.abs(min), Math.abs(max)) || 1;
      return d3
        .scaleDiverging()
        .domain([-maxAbs, 0, maxAbs])
        .interpolator(
          d3.interpolateRgbBasis(["#C0392B", "#F0F0F0", "#2471A3"]),
        );
    }

    if (selectedMetric === "moneyGap") {
      const maxAbs = 10;
      return d3
        .scaleDiverging()
        .domain([-maxAbs, 0, maxAbs])
        .clamp(true)
        .interpolator(
          d3.interpolateRgbBasis(["#C0392B", "#F0F0F0", "#2471A3"]),
        );
    }

    const min = d3.min(values) ?? 0;
    const max = d3.max(values) ?? 1;

    if (selectedMetric === "damage") {
      return d3
        .scaleSequential()
        .domain([min, max])
        .interpolator(d3.interpolateRgb("#FDEBD0", "#E67E22"));
    }

    return d3
      .scaleSequential()
      .domain([min, max])
      .interpolator(d3.interpolateRgb("#E9F7EF", "#1E8449"));
  }, [provinceRows, selectedMetric]);

  const metricBands = useMemo(() => {
    const buildBands = (key) => {
      const values = provinceRows
        .map((row) => row[key])
        .filter((value) => Number.isFinite(value))
        .sort((a, b) => a - b);
      if (!values.length) return null;
      return {
        low: d3.quantile(values, 0.33) ?? values[0],
        high: d3.quantile(values, 0.66) ?? values[values.length - 1],
      };
    };

    return {
      damage: buildBands(METRICS.damage.key),
      funding: buildBands(METRICS.funding.key),
    };
  }, [provinceRows]);

  const provinces = useMemo(() => {
    if (!provinceGeometry.length) return [];
    const metricKey = METRICS[selectedMetric].key;
    return provinceGeometry.map((province) => {
      const row = provinceDataMap.get(province.id);
      const rbaiCategory = rbaiMap.get(province.id) || null;
      const dimmed =
        regionFilter !== "All Regions" && province.regionName !== regionFilter;

      if (selectedMetric === "rbai") {
        const isNoData = province.id === "basilan" || !rbaiCategory;
        const fill = isNoData
          ? "url(#no-data-hatch)"
          : RBAI_CATEGORY_COLORS[rbaiCategory] || "#E0E0E0";
        return {
          ...province,
          row,
          rbaiCategory,
          fill,
          dimmed,
          isNoData,
        };
      }
      const metricValue = row ? row[metricKey] : null;
      const isNoData =
        province.id === "basilan" || !row || metricValue === null;
      const fill = isNoData
        ? "url(#no-data-hatch)"
        : metricScale
          ? metricScale(metricValue)
          : "#E0E0E0";

      return {
        ...province,
        row,
        rbaiCategory,
        fill,
        dimmed,
        isNoData,
      };
    });
  }, [
    provinceGeometry,
    provinceDataMap,
    rbaiMap,
    selectedMetric,
    metricScale,
    regionFilter,
  ]);

  const selectedYearlySeries = useMemo(() => {
    if (!selectedProvince || yearlyStatus !== "ready") return null;
    const selectedName = normalizeName(selectedProvince.name);
    const filtered = yearlyRows.filter(
      (row) => normalizeName(row.Province) === selectedName,
    );
    if (!filtered.length) return [];
    const structured = filtered
      .map((row) => {
        const year = row.Year || row.year || row.YEAR;
        const damage = resolveYearlyValue(row, [
          "Total_Damage_PhP",
          "Damage",
          "Typhoon_Damage",
        ]);
        const funding = resolveYearlyValue(row, [
          "ABC",
          "Funding",
          "Flood_Funding",
        ]);
        if (!year) return null;
        return {
          year: String(year),
          damage,
          funding,
        };
      })
      .filter(Boolean);

    const maxValue =
      d3.max(structured, (row) =>
        Math.max(row.damage || 0, row.funding || 0),
      ) || 1;
    return structured.map((row) => ({
      year: row.year,
      damage: row.damage !== null ? (row.damage / maxValue) * 100 : null,
      funding: row.funding !== null ? (row.funding / maxValue) * 100 : null,
    }));
  }, [selectedProvince, yearlyRows, yearlyStatus]);

  const handleProvinceClick = (province) => {
    if (province.isNoData) {
      setSelectedProvince({
        name: province.name,
        row: province.row,
        regionName: province.regionName,
      });
      return;
    }
    setSelectedProvince({
      name: province.name,
      row: province.row,
      regionName: province.regionName,
    });
  };

  const handleBackgroundClick = (event) => {
    if (event?.defaultPrevented || isDraggingRef.current) return;
    setSelectedProvince(null);
  };

  const getTooltipValue = (province) => {
    const metricKey = METRICS[selectedMetric].key;
    const metricValue = province.row ? province.row[metricKey] : null;
    if (province.isNoData) return "No data available";
    if (selectedMetric === "gap") {
      return metricValue !== null
        ? `${metricValue.toFixed(1)}`
        : "No data available";
    }
    if (selectedMetric === "moneyGap") {
      return metricValue !== null
        ? `${metricValue.toFixed(2)}x`
        : "No data available";
    }
    if (selectedMetric === "monetaryGap") {
      return metricValue !== null
        ? formatBillions(metricValue)
        : "No data available";
    }
    if (selectedMetric === "rbai") {
      return province.rbaiCategory || "No data available";
    }
    return formatBillions(metricValue);
  };

  const handleMouseEnter = (province, event) => {
    if (isDraggingRef.current) return;
    hoveredProvinceRef.current = province;
    setTooltipContent({
      visible: true,
      name: province.name,
      value: getTooltipValue(province),
    });
    if (event) {
      handleMouseMove(event);
    }
  };

  const handleMouseLeave = () => {
    hoveredProvinceRef.current = null;
    if (!isDraggingRef.current) {
      setTooltipContent((prev) => ({ ...prev, visible: false }));
    }
  };

  const handleMouseMove = (event) => {
    if (isDraggingRef.current) return;
    if (!mapWrapRef.current || !tooltipRef.current) return;
    const rect = mapWrapRef.current.getBoundingClientRect();
    tooltipPosRef.current = {
      x: event.clientX - rect.left + 12,
      y: event.clientY - rect.top + 12,
    };
    if (tooltipFrameRef.current) return;
    tooltipFrameRef.current = window.requestAnimationFrame(() => {
      const next = tooltipPosRef.current;
      if (tooltipRef.current) {
        tooltipRef.current.style.transform = `translate(${next.x}px, ${next.y}px)`;
      }
      tooltipFrameRef.current = null;
    });
  };

  useEffect(() => {
    if (!tooltipContent.visible || !hoveredProvinceRef.current) return;
    const province = hoveredProvinceRef.current;
    setTooltipContent({
      visible: true,
      name: province.name,
      value: getTooltipValue(province),
    });
  }, [selectedMetric]);

  const detailRow = selectedProvince?.row;
  const detailScore = detailRow?.Disparity_Index ?? null;
  const selectedRbaiCategory = selectedProvince
    ? rbaiMap.get(normalizeName(selectedProvince.name)) || null
    : null;
  const selectedMetricValue =
    selectedMetric === "rbai"
      ? selectedRbaiCategory
      : detailRow
        ? detailRow[METRICS[selectedMetric].key]
        : null;
  const verdict = metricToVerdict(
    selectedMetric,
    selectedMetricValue,
    detailRow,
    metricBands,
  );
  const verdictSentence =
    selectedMetric === "moneyGap"
      ? buildRatioSentence(detailRow)
      : selectedMetric === "rbai"
        ? buildRbaiSentence(selectedRbaiCategory)
        : buildVerdictSentence(detailRow);
  const detailRank = detailRow
    ? gapRanks.map.get(normalizeName(detailRow.Province))
    : null;

  if (loadError) {
    return <div className="status-card">{loadError}</div>;
  }

  if (isLoading) {
    return <div className="status-card">Loading dashboard data...</div>;
  }

  return (
    <div className="dashboard-shell">
      <div className="dashboard-grid">
        <aside className="sidebar rise-in">
          <div className="title-block">
            <h1>Flood Money vs. Flood Risk</h1>
            <p>
              Comparing typhoon damage against flood control funding across
              Philippine provinces.
            </p>
          </div>

          <div className="control-block">
            <div className="control-label">Map mode</div>
            <MapToggle value={selectedMetric} onChange={setSelectedMetric} />
          </div>

          <div className="control-block">
            <div className="control-label">Filter by region</div>
            <select
              className="region-select"
              value={regionFilter}
              onChange={(event) => setRegionFilter(event.target.value)}
            >
              <option>All Regions</option>
              {regionNames.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          <Legend metric={selectedMetric} />

          <div className="stats-block">
            <div className="stat-pill">
              <span className="stat-label">Most neglected</span>
              <span className="stat-value">
                {nationalStats?.mostNeglected?.Province || "No data"}
              </span>
            </div>
            <div className="stat-pill">
              <span className="stat-label">Most overfunded</span>
              <span className="stat-value">
                {nationalStats?.mostOverfunded?.Province || "No data"}
              </span>
            </div>
            <div className="stat-pill">
              <span className="stat-label">Avg slippage days</span>
              <span className="stat-value">
                {nationalStats?.avgSlip ?? "No data"}
              </span>
            </div>
          </div>
        </aside>

        <main className="map-area rise-in">
          <div className="map-toolbar">
            <MapToggle
              value={selectedMetric}
              onChange={setSelectedMetric}
              variant="compact"
            />
          </div>

          <div className="map-shell" ref={mapWrapRef}>
            <svg
              ref={svgRef}
              viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
              onClick={handleBackgroundClick}
              className="map-svg"
            >
              <defs>
                <pattern
                  id="no-data-hatch"
                  width="8"
                  height="8"
                  patternUnits="userSpaceOnUse"
                >
                  <rect width="8" height="8" fill="#E6E6E6" />
                  <path d="M0 8 L8 0" stroke="#B0B0B0" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width={MAP_WIDTH} height={MAP_HEIGHT} fill="#F6F1E8" />
              <g ref={mapLayerRef}>
                {provinces.map((province) => (
                  <path
                    key={province.id}
                    d={province.path}
                    data-province={province.id}
                    className={`map-province ${province.dimmed ? "is-dimmed" : ""}`}
                    fill={province.fill}
                    onMouseEnter={(event) => handleMouseEnter(province, event)}
                    onMouseLeave={handleMouseLeave}
                    onMouseMove={handleMouseMove}
                    onClick={(event) => {
                      event.stopPropagation();
                      handleProvinceClick(province);
                    }}
                  />
                ))}
                {regionGeometry.map((feature) => (
                  <path
                    key={feature.id}
                    d={feature.path}
                    className="region-border"
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.5)"
                    strokeWidth={1}
                  />
                ))}
              </g>
            </svg>
            <div
              ref={tooltipRef}
              className={`map-tooltip ${tooltipContent.visible ? "is-visible" : ""}`}
            >
              <div className="tooltip-title">{tooltipContent.name}</div>
              <div className="tooltip-value">
                {METRICS[selectedMetric].label}: {tooltipContent.value}
              </div>
            </div>
          </div>

          <div className="map-hint">
            Click a province to open the detail panel.
          </div>
        </main>

        <aside
          className={`detail-panel ${
            selectedProvince ? "detail-panel-open" : "detail-panel-closed"
          }`}
          aria-hidden={!selectedProvince}
        >
          {selectedProvince && (
            <div className="detail-content">
              <button
                type="button"
                className="close-button"
                onClick={() => setSelectedProvince(null)}
                aria-label="Close details"
              >
                X
              </button>
              <h2>{selectedProvince.name}</h2>
              <div className={`badge ${verdict.className}`}>
                {verdict.label}
              </div>
              <p className="verdict-text">{verdictSentence}</p>

              <div className="stat-grid">
                <div className="stat-card">
                  <span className="stat-title">Funding Gap Score</span>
                  <span className="stat-main">
                    {detailScore !== null ? detailScore.toFixed(1) : "No data"}
                  </span>
                  <span className="stat-sub">
                    {detailRank
                      ? `Rank ${detailRank} of ${gapRanks.total}`
                      : ""}
                  </span>
                </div>
                <div className="stat-card">
                  <span className="stat-title">Total Typhoon Damage</span>
                  <span className="stat-main">
                    {formatBillions(detailRow?.Total_Damage_PhP ?? null)}
                  </span>
                </div>
                <div className="stat-card">
                  <span className="stat-title">Total Flood Budget</span>
                  <span className="stat-main">
                    {formatBillions(detailRow?.ABC ?? null)}
                  </span>
                </div>
                <div className="stat-card">
                  <span className="stat-title">Total Projects</span>
                  <span className="stat-main">
                    {formatNumber(detailRow?.Total_Projects ?? null)}
                  </span>
                </div>
                <div className="stat-card">
                  <span className="stat-title">Avg Slippage Days</span>
                  <span className="stat-main">
                    {detailRow?.Avg_Slippage_Days !== null &&
                    detailRow?.Avg_Slippage_Days !== undefined
                      ? `${detailRow.Avg_Slippage_Days.toFixed(1)} days`
                      : "No data"}
                  </span>
                </div>
                <div className="stat-card">
                  <span className="stat-title">Deaths + Affected</span>
                  <span className="stat-main">
                    {detailRow &&
                    (detailRow.Deaths !== null || detailRow.Affected !== null)
                      ? `${formatNumber(detailRow.Deaths ?? 0)} deaths / ${formatNumber(
                          detailRow.Affected ?? 0,
                        )} affected`
                      : "No data"}
                  </span>
                </div>
              </div>

              <div className="chart-block">
                <div className="chart-title">
                  Yearly damage vs. funding (normalized)
                </div>
                {yearlyStatus === "failed" ? (
                  <div className="mini-chart-empty">
                    Yearly data not loaded.
                  </div>
                ) : (
                  <MiniChart data={selectedYearlySeries} />
                )}
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

export default App;
