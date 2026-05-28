import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as d3 from "d3";
import Papa from "papaparse";
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
const MAP_OFFSET_X = 0;
const MAP_OFFSET_Y = 12;

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
  rbaiIndex: {
    key: "RBAI",
    label: "Risk-to-Budget Alignment Index",
    shortLabel: "RBAI Index",
    description:
      "Risk-Budget Allocation Index (RBAI) = budget share divided by damage share. 1.0 aligned, >1 over-allocated, <1 under-allocated.",
  },
  rbaiCategory: {
    key: "RBAI_Category",
    label: "RBAI Classification",
    shortLabel: "RBAI Class",
    description:
      "RBAI category classification by allocation and vulnerability.",
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
    return { label: "Balanced", className: "badge-balanced" };
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
    return { label: "Balanced", className: "badge-balanced" };
  }
  return value < 0
    ? { label: "Damage > Cost", className: "badge-warning" }
    : { label: "Cost > Damage", className: "badge-info" };
};

const monetaryGapToVerdict = (value, damage) => {
  if (!Number.isFinite(value)) {
    return { label: "No data", className: "badge-neutral" };
  }
  const tolerance = Number.isFinite(damage) ? Math.abs(damage) * 0.1 : 0;
  if (Math.abs(value) <= tolerance) {
    return { label: "Balanced", className: "badge-balanced" };
  }
  return value < 0
    ? { label: "Underfunded", className: "badge-warning" }
    : { label: "Overfunded", className: "badge-info" };
};

const rbaiCategoryToVerdict = (category) => {
  if (!category) {
    return { label: "No data", className: "badge-neutral" };
  }
  if (category === "Over-Allocated / Low-Risk Spending") {
    return { label: "Over-Allocated", className: "badge-info" };
  }
  if (category === "Under-Funded / High Vulnerability") {
    return { label: "Under-Funded", className: "badge-warning" };
  }
  if (category === "Appropriate Priority") {
    return { label: "Appropriate Priority", className: "badge-balanced" };
  }
  return { label: "Baseline Maintenance", className: "badge-neutral" };
};

const rbaiIndexToVerdict = (value) => {
  if (!Number.isFinite(value)) {
    return { label: "No data", className: "badge-neutral" };
  }
  if (value < 0.9) {
    return { label: "Under-Allocated", className: "badge-warning" };
  }
  if (value > 1.1) {
    return { label: "Over-Allocated", className: "badge-info" };
  }
  return { label: "Aligned", className: "badge-balanced" };
};

const buildRbaiSentence = (category) => {
  if (!category) {
    return "This province does not have an RBAI classification yet.";
  }
  return `RBAI classification: ${category}.`;
};

const buildRbaiIndexSentence = (value) => {
  if (!Number.isFinite(value)) {
    return "This province does not have an RBAI value yet.";
  }
  return `RBAI value: ${value.toFixed(2)}.`;
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
  if (metric === "rbaiIndex") {
    return rbaiIndexToVerdict(value);
  }
  if (metric === "rbaiCategory") {
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

const MapToggle = ({ value, onChange, variant = "full" }) => {
  const options = [
    { id: "gap", label: METRICS.gap.shortLabel },
    { id: "monetaryGap", label: METRICS.monetaryGap.shortLabel },
    { id: "moneyGap", label: METRICS.moneyGap.shortLabel },
    { id: "rbaiIndex", label: METRICS.rbaiIndex.shortLabel },
    { id: "rbaiCategory", label: METRICS.rbaiCategory.shortLabel },
    { id: "damage", label: METRICS.damage.shortLabel },
    { id: "funding", label: METRICS.funding.shortLabel },
  ];

  return (
    <div className={`toggle-group ${variant === "compact" ? "compact" : ""}`}>
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          className={`toggle-button metric-${option.id} ${
            value === option.id ? "is-active" : ""
          }`}
          onClick={() => onChange(option.id)}
          aria-pressed={value === option.id}
        >
          {option.id === "gap" ||
          option.id === "moneyGap" ||
          option.id === "monetaryGap" ||
          option.id === "rbaiIndex" ||
          option.id === "rbaiCategory" ? (
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
  if (metric === "rbaiCategory") {
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
  if (metric === "rbaiIndex") {
    return (
      <div className="legend-block">
        <div className="legend-title">{METRICS[metric].label}</div>
        <div className="legend-bar legend-gap"></div>
        <div className="legend-labels">
          <span>Under-Allocated</span>
          <span>Aligned (1.0)</span>
          <span>Over-Allocated</span>
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
  const [rbaiIndexMap, setRbaiIndexMap] = useState(() => new Map());
  const [rbaiCategoryMap, setRbaiCategoryMap] = useState(() => new Map());
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
          const nextRbaiIndexMap = new Map();
          const nextRbaiCategoryMap = new Map();
          parsedRbai.data.forEach((row) => {
            const name = row.Province || row.province || row.PROVINCE;
            const category = normalizeRbaiCategory(
              row.Category || row.category || row.CATEGORY,
            );
            const rbaiValue = parseNumber(row.RBAI || row.rbai || row.Rbai);
            if (name && category) {
              nextRbaiCategoryMap.set(normalizeName(name), category);
            }
            if (name && Number.isFinite(rbaiValue) && rbaiValue > 0) {
              nextRbaiIndexMap.set(normalizeName(name), rbaiValue);
            }
          });
          if (isMounted) {
            setRbaiIndexMap(nextRbaiIndexMap);
            setRbaiCategoryMap(nextRbaiCategoryMap);
          }
        } catch {
          if (isMounted) {
            setRbaiIndexMap(new Map());
            setRbaiCategoryMap(new Map());
          }
        }
      } catch {
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
    const base = d3
      .geoMercator()
      .fitSize([MAP_WIDTH, MAP_HEIGHT], provinceCollection);
    const [x, y] = base.translate();
    return base.translate([x + MAP_OFFSET_X, y + MAP_OFFSET_Y]);
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

  const metricScale = useMemo(() => {
    if (!provinceRows.length) return null;
    if (selectedMetric === "rbaiIndex") {
      const values = Array.from(rbaiIndexMap.values()).filter(
        (value) => Number.isFinite(value) && value > 0,
      );
      if (!values.length) return null;
      const logValues = values.map((value) => Math.log10(value));
      const absLogValues = logValues
        .map((value) => Math.abs(value))
        .sort((a, b) => a - b);
      const maxAbs =
        d3.quantile(absLogValues, 0.95) ??
        absLogValues[absLogValues.length - 1] ??
        1;
      return d3
        .scaleDiverging()
        .domain([-maxAbs, 0, maxAbs])
        .clamp(true)
        .interpolator(
          d3.interpolateRgbBasis(["#C0392B", "#F0F0F0", "#2471A3"]),
        );
    }
    if (selectedMetric === "rbaiCategory") {
      return null;
    }
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
  }, [provinceRows, selectedMetric, rbaiIndexMap]);

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

  const rankingLabels = useMemo(() => {
    switch (selectedMetric) {
      case "gap":
      case "monetaryGap":
        return { low: "Most Underfunded", high: "Most Overfunded" };
      case "moneyGap":
        return { low: "Damage > Cost", high: "Cost > Damage" };
      case "rbaiIndex":
      case "rbaiCategory":
        return { low: "Under-Allocated", high: "Over-Allocated" };
      case "damage":
        return { low: "Lowest Damage", high: "Highest Damage" };
      case "funding":
        return { low: "Lowest Funding", high: "Highest Funding" };
      default:
        return { low: "Lowest", high: "Highest" };
    }
  }, [selectedMetric]);

  const rankingItems = useMemo(() => {
    return provinceGeometry
      .map((province) => {
        const row = provinceDataMap.get(province.id);
        const rbaiIndex = rbaiIndexMap.get(province.id) ?? null;
        const rbaiCategory = rbaiCategoryMap.get(province.id) || null;
        const value = (() => {
          switch (selectedMetric) {
            case "gap":
              return row?.Disparity_Index ?? null;
            case "monetaryGap":
              return row?.Monetary_Delta ?? null;
            case "moneyGap":
              return row?.Monetary_Gap ?? null;
            case "damage":
              return row?.Total_Damage_PhP ?? null;
            case "funding":
              return row?.ABC ?? null;
            case "rbaiIndex":
            case "rbaiCategory":
              return rbaiIndex;
            default:
              return row?.[METRICS[selectedMetric].key] ?? null;
          }
        })();

        if (!Number.isFinite(value)) return null;
        return {
          id: province.id,
          name: province.name,
          value,
          category: rbaiCategory,
          row,
        };
      })
      .filter(Boolean);
  }, [
    provinceGeometry,
    provinceDataMap,
    rbaiIndexMap,
    rbaiCategoryMap,
    selectedMetric,
  ]);

  const rankingLists = useMemo(() => {
    if (!rankingItems.length) return { low: [], high: [] };
    const sorted = [...rankingItems].sort((a, b) => a.value - b.value);
    return {
      low: sorted.slice(0, 5),
      high: sorted.slice(-5).reverse(),
    };
  }, [rankingItems]);

  const formatRankingValue = (item) => {
    switch (selectedMetric) {
      case "gap":
        return item.value.toFixed(1);
      case "moneyGap":
        return `${item.value.toFixed(2)}x`;
      case "monetaryGap":
        return formatBillions(item.value);
      case "rbaiIndex":
        return item.value.toFixed(2);
      case "rbaiCategory":
        return item.value.toFixed(2);
      case "damage":
      case "funding":
        return formatBillions(item.value);
      default:
        return String(item.value);
    }
  };

  const getRankingClassName = (item) => {
    const verdict =
      selectedMetric === "rbaiCategory"
        ? rbaiCategoryToVerdict(item.category)
        : metricToVerdict(selectedMetric, item.value, item.row, metricBands);
    return verdict.className
      ? verdict.className.replace("badge-", "rank-")
      : "";
  };

  const histogramColor = useMemo(() => {
    switch (selectedMetric) {
      case "damage":
        return "#E67E22";
      case "funding":
        return "#1E8449";
      case "rbaiCategory":
        return "#7F8C8D";
      default:
        return "#2471A3";
    }
  }, [selectedMetric]);

  const histogramData = useMemo(() => {
    if (selectedMetric === "rbaiCategory") {
      const counts = new Map();
      provinceGeometry.forEach((province) => {
        const category = rbaiCategoryMap.get(province.id);
        if (category) {
          counts.set(category, (counts.get(category) || 0) + 1);
        }
      });
      const bins = RBAI_CATEGORY_ORDER.map((category) => ({
        label: category,
        value: counts.get(category) || 0,
        color: RBAI_CATEGORY_COLORS[category],
      }));
      const maxValue = Math.max(1, ...bins.map((bin) => bin.value));
      return { type: "category", bins, maxValue };
    }

    const values = rankingItems
      .map((item) => item.value)
      .filter((value) => Number.isFinite(value));
    if (!values.length) return null;
    if (selectedMetric === "rbaiIndex") {
      const logValues = values
        .filter((value) => value > 0)
        .map((value) => Math.log10(value));
      if (!logValues.length) return null;
      const min = d3.min(logValues) ?? 0;
      const max = d3.max(logValues) ?? 0;
      const bins = d3.bin().domain([min, max]).thresholds(8)(logValues);
      const maxValue = d3.max(bins, (bin) => bin.length) ?? 1;
      return { type: "numeric", bins, maxValue, min, max, isLog: true };
    }
    const min = d3.min(values) ?? 0;
    const max = d3.max(values) ?? 0;
    const bins = d3.bin().domain([min, max]).thresholds(8)(values);
    const maxValue = d3.max(bins, (bin) => bin.length) ?? 1;
    return { type: "numeric", bins, maxValue, min, max, isLog: false };
  }, [rankingItems, selectedMetric, provinceGeometry, rbaiCategoryMap]);

  const formatHistogramValue = (value) => {
    if (!Number.isFinite(value)) return "No data";
    if (selectedMetric === "moneyGap") {
      return `${value.toFixed(2)}x`;
    }
    if (selectedMetric === "rbaiIndex") {
      return value.toFixed(2);
    }
    if (selectedMetric === "gap") {
      return value.toFixed(1);
    }
    if (
      selectedMetric === "monetaryGap" ||
      selectedMetric === "damage" ||
      selectedMetric === "funding"
    ) {
      return formatBillions(value);
    }
    return value.toFixed(2);
  };

  const formatHistogramRange = (start, end, isLog) => {
    if (!Number.isFinite(start) || !Number.isFinite(end)) return "No data";
    const from = isLog ? Math.pow(10, start) : start;
    const to = isLog ? Math.pow(10, end) : end;
    return `${formatHistogramValue(from)}–${formatHistogramValue(to)}`;
  };

  const provinces = useMemo(() => {
    if (!provinceGeometry.length) return [];
    const metricKey = METRICS[selectedMetric].key;
    return provinceGeometry.map((province) => {
      const row = provinceDataMap.get(province.id);
      const rbaiCategory = rbaiCategoryMap.get(province.id) || null;
      const rbaiIndex = rbaiIndexMap.get(province.id) ?? null;
      const dimmed =
        regionFilter !== "All Regions" && province.regionName !== regionFilter;

      if (selectedMetric === "rbaiCategory") {
        const isNoData = !rbaiCategory;
        const fill = isNoData
          ? "url(#no-data-hatch)"
          : RBAI_CATEGORY_COLORS[rbaiCategory] || "#E0E0E0";
        return {
          ...province,
          row,
          rbaiCategory,
          rbaiIndex,
          fill,
          dimmed,
          isNoData,
        };
      }
      if (selectedMetric === "rbaiIndex") {
        const isNoData = !Number.isFinite(rbaiIndex) || rbaiIndex <= 0;
        const logValue = isNoData ? null : Math.log10(rbaiIndex);
        const fill = isNoData
          ? "url(#no-data-hatch)"
          : metricScale
            ? metricScale(logValue)
            : "#E0E0E0";
        return {
          ...province,
          row,
          rbaiCategory,
          rbaiIndex,
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
        rbaiIndex,
        fill,
        dimmed,
        isNoData,
      };
    });
  }, [
    provinceGeometry,
    provinceDataMap,
    rbaiIndexMap,
    rbaiCategoryMap,
    selectedMetric,
    metricScale,
    regionFilter,
  ]);

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

  const getTooltipValue = useCallback(
    (province) => {
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
      if (selectedMetric === "rbaiIndex") {
        return Number.isFinite(province.rbaiIndex)
          ? province.rbaiIndex.toFixed(2)
          : "No data available";
      }
      if (selectedMetric === "rbaiCategory") {
        return province.rbaiCategory || "No data available";
      }
      return formatBillions(metricValue);
    },
    [selectedMetric],
  );

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
  }, [getTooltipValue, tooltipContent.visible]);

  const detailRow = selectedProvince?.row;
  const detailScore = detailRow?.Disparity_Index ?? null;
  const selectedRbaiCategory = selectedProvince
    ? rbaiCategoryMap.get(normalizeName(selectedProvince.name)) || null
    : null;
  const selectedRbaiIndex = selectedProvince
    ? (rbaiIndexMap.get(normalizeName(selectedProvince.name)) ?? null)
    : null;
  const selectedMetricValue =
    selectedMetric === "rbaiCategory"
      ? selectedRbaiCategory
      : selectedMetric === "rbaiIndex"
        ? selectedRbaiIndex
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
      : selectedMetric === "rbaiCategory"
        ? buildRbaiSentence(selectedRbaiCategory)
        : selectedMetric === "rbaiIndex"
          ? buildRbaiIndexSentence(selectedRbaiIndex)
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

        <aside className="rankings-panel rise-in">
          <div className="rankings-header">
            <div className="rankings-title">Rankings</div>
            <div className="rankings-subtitle">
              {METRICS[selectedMetric].label}
            </div>
          </div>
          {histogramData && (
            <div className="rankings-histogram">
              <div className="histogram-title">Distribution</div>
              <div
                className={`histogram-bars ${
                  histogramData.type === "category" ? "is-category" : ""
                }`}
              >
                {histogramData.type === "category"
                  ? histogramData.bins.map((bin) => (
                      <div
                        key={bin.label}
                        className="histogram-bar"
                        style={{
                          height: `${(bin.value / histogramData.maxValue) * 100}%`,
                          background: bin.color,
                        }}
                        title={`${bin.label}: ${bin.value}`}
                      >
                        <span className="histogram-bar-label">{bin.value}</span>
                      </div>
                    ))
                  : histogramData.bins.map((bin, index) => (
                      <div
                        key={`bin-${index}`}
                        className="histogram-bar"
                        style={{
                          height: `${(bin.length / histogramData.maxValue) * 100}%`,
                          background: histogramColor,
                        }}
                        title={`${formatHistogramRange(
                          bin.x0,
                          bin.x1,
                          histogramData.isLog,
                        )} • ${bin.length}`}
                      ></div>
                    ))}
              </div>
              {histogramData.type === "numeric" && (
                <div className="histogram-axis">
                  <span>
                    {formatHistogramValue(
                      histogramData.isLog
                        ? Math.pow(10, histogramData.min ?? 0)
                        : (histogramData.min ?? 0),
                    )}
                  </span>
                  <span>
                    {formatHistogramValue(
                      histogramData.isLog
                        ? Math.pow(10, histogramData.max ?? 0)
                        : (histogramData.max ?? 0),
                    )}
                  </span>
                </div>
              )}
              {histogramData.type === "category" && (
                <div className="histogram-axis">
                  <span>0</span>
                  <span>{histogramData.maxValue}</span>
                </div>
              )}
            </div>
          )}
          <div className="rankings-grid">
            <div className="rankings-column">
              <div className="rankings-label">{rankingLabels.low}</div>
              <ol className="rankings-list">
                {rankingLists.low.map((item) => (
                  <li
                    className={`ranking-item ${getRankingClassName(item)}`}
                    key={`low-${item.id}`}
                  >
                    <span className="ranking-name">{item.name}</span>
                    <span className="ranking-value">
                      {formatRankingValue(item)}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
            <div className="rankings-column">
              <div className="rankings-label">{rankingLabels.high}</div>
              <ol className="rankings-list">
                {rankingLists.high.map((item) => (
                  <li
                    className={`ranking-item ${getRankingClassName(item)}`}
                    key={`high-${item.id}`}
                  >
                    <span className="ranking-name">{item.name}</span>
                    <span className="ranking-value">
                      {formatRankingValue(item)}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </aside>
      </div>
      {selectedProvince && (
        <div
          className="modal-backdrop"
          role="presentation"
          onClick={() => setSelectedProvince(null)}
        >
          <section
            className="modal-card"
            role="dialog"
            aria-modal="true"
            aria-label={`${selectedProvince.name} details`}
            onClick={(event) => event.stopPropagation()}
          >
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
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

export default App;
