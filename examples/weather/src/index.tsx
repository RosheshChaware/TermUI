import { caps } from "@termuijs/core";
import { app, row, col, gauge, text, status, spacer } from "@termuijs/quick";

// Usage: bun run dev -- --lat=<latitude> --lon=<longitude> --city=<name>
// Example: bun run dev -- --lat=21.25 --lon=81.63 --city=Raipur
// Default: Purnea (lat=25.6, lon=87.5)

const args = process.argv.slice(2);
const getArg = (name: string) => {
  const value = args
    .find((a: string) => a.startsWith(`--${name}=`))
    ?.split("=")[1]
    ?.trim();

  return value || undefined;
};

let lat = getArg("lat") ?? "25.6";
let lon = getArg("lon") ?? "87.5";
let city = getArg("city") ?? "Purnea";

const PRESET_CITIES = [
  { name: "Purnea", lat: "25.6", lon: "87.5" },
  { name: "Raipur", lat: "21.25", lon: "81.63" },
  { name: "Delhi", lat: "28.61", lon: "77.20" },
  { name: "Mumbai", lat: "19.07", lon: "72.87" },
  { name: "Bangalore", lat: "12.97", lon: "77.59" },
  { name: "Kolkata", lat: "22.57", lon: "88.36" }
];

let currentCityIndex = 0;
const initialCityIndex = PRESET_CITIES.findIndex(c => c.name.toLowerCase() === city.toLowerCase());
if (initialCityIndex >= 0) {
  currentCityIndex = initialCityIndex;
} else {
  PRESET_CITIES.push({ name: city, lat, lon });
  currentCityIndex = PRESET_CITIES.length - 1;
}

const getAPI = () => `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,wind_direction_10m,weather_code&timezone=auto`;

let weather: any = null;
let lastFetch = 0;
let lastLatency = 0;

function getTemperatureSeverity(temp: number) {
  if (temp < 20) return { label: "Cool", emoji: "🟢", color: { type: "named" as const, name: "green" as const } };
  if (temp <= 30) return { label: "Moderate", emoji: "🟡", color: { type: "named" as const, name: "yellow" as const } };
  return { label: "Hot", emoji: "🔴", color: { type: "named" as const, name: "red" as const } };
}

function getHumiditySeverity(humidity: number) {
  if (humidity < 40) return { label: "Dry", emoji: "🟢", color: { type: "named" as const, name: "green" as const } };
  if (humidity <= 70) return { label: "Moderate", emoji: "🟡", color: { type: "named" as const, name: "yellow" as const } };
  return { label: "Humid", emoji: "🔴", color: { type: "named" as const, name: "red" as const } };
}

function getWindSeverity(wind: number) {
  if (wind < 10) return { label: "Calm", emoji: "🟢", color: { type: "named" as const, name: "green" as const } };
  if (wind <= 25) return { label: "Breezy", emoji: "🟡", color: { type: "named" as const, name: "yellow" as const } };
  return { label: "Windy", emoji: "🔴", color: { type: "named" as const, name: "red" as const } };
}

function getWeatherInsights(temp: number, humidity: number, wind: number): string[] {
  const insights: string[] = [];

  const tempSev = getTemperatureSeverity(temp);
  const humSev = getHumiditySeverity(humidity);
  const windSev = getWindSeverity(wind);

  // Humidity insights
  if (humidity > 70) {
    insights.push("High humidity detected.");
  } else if (humidity < 40) {
    insights.push("Dry air conditions detected.");
  }

  // Temperature insights
  if (temp > 30) {
    insights.push("Stay hydrated.");
  } else if (temp < 20) {
    insights.push("Chilly weather - dress warmly.");
  }

  // Wind insights
  if (wind > 25) {
    insights.push("Strong winds expected.");
  }

  // Comfort conditions
  if (
    tempSev.color.name === "yellow" &&
    humSev.color.name === "yellow" &&
    windSev.color.name !== "red"
  ) {
    insights.push("Comfortable outdoor conditions.");
  }

  if (insights.length === 0) {
    insights.push("Weather conditions are stable.");
  }

  return insights;
}

function weatherIcon(code: number) {
  if (code >= 95) return "🌧️";
  if (code >= 80) return "🌦️";
  if (code >= 60) return "🌧️";
  if (code >= 40) return "⛅";
  if (code >= 20) return "☁️";
  return "☀️";
}

function getConditionName(code: number): string {
  if (code === 0) return "Clear Sky";
  if (code === 1) return "Mainly Clear";
  if (code === 2) return "Partly Cloudy";
  if (code === 3) return "Overcast";
  if (code === 45 || code === 48) return "Foggy";
  if (code >= 51 && code <= 55) return "Drizzle";
  if (code >= 61 && code <= 65) return "Rainy";
  if (code >= 71 && code <= 77) return "Snowy";
  if (code >= 80 && code <= 82) return "Showers";
  if (code >= 95) return "Thunderstorm";
  return "Cloudy";
}

function getWeatherArt(code: number): string[] {
  if (code >= 95) {
    return [
      "   _`\"`_   ",
      "  (  _  )  ",
      "  ⚡ ⚡ ⚡  ",
      "  // // // "
    ];
  }
  if (code >= 60) {
    return [
      "   _`\"`_   ",
      "  (  _  )  ",
      "  || || || ",
      "  // // // "
    ];
  }
  if (code >= 40) {
    return [
      "  \\  .---. ",
      " --(     )",
      "  / (     )",
      "     `---' "
    ];
  }
  if (code >= 20) {
    return [
      "     .---. ",
      "    (     )",
      "   (       )",
      "    `-----' "
    ];
  }
  return [
    "    \\   /  ",
    "     .-.   ",
    "   -(   )- ",
    "    /   \\  "
  ];
}

function getWeatherArtColor(code: number) {
  if (code >= 95) return { type: "named" as const, name: "red" as const };
  if (code >= 60) return { type: "named" as const, name: "blue" as const };
  if (code >= 40) return { type: "named" as const, name: "cyan" as const };
  if (code >= 20) return { type: "named" as const, name: "white" as const };
  return { type: "named" as const, name: "yellow" as const };
}

function compass(direction: number) {
  const points = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  const index = Math.round(direction / 45) % 8;
  return points[index];
}

function timeAgo(now: number) {
  const diff = Math.max(0, Math.floor((now - lastFetch) / 1000));
  return diff < 60 ? `${diff}s ago` : `${Math.floor(diff / 60)}m ago`;
}

function calculateDewPoint(t: number, rh: number): number {
  return t - ((100 - rh) / 5);
}

async function fetchWeather() {
  const now = Date.now();
  if (weather && now - lastFetch < 5000 && lastFetch !== 0) return;

  const started = performance.now();
  try {
    const res = await fetch(getAPI());
    lastLatency = Math.round(performance.now() - started);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    weather = await res.json();
    lastFetch = now;
  } catch (_error) {
    lastLatency = Math.round(performance.now() - started);
    weather = null;
    lastFetch = now;
  }
}

setInterval(fetchWeather, 5000);
fetchWeather();

// Explicit any with inline comment to access private _color property on Gauge widget dynamically
let tempGauge: any;
// Explicit any with inline comment to access private _color property on Gauge widget dynamically
let humidityGauge: any;
// Explicit any with inline comment to access private _color property on Gauge widget dynamically
let windGauge: any;

tempGauge = gauge("Temp", () => {
  const t = weather?.current?.temperature_2m ?? 0;
  const sev = getTemperatureSeverity(t);
  if (tempGauge) {
    tempGauge._color = sev.color;
  }
  return Math.min(Math.max((t + 20) / 60, 0), 1);
}, { color: { type: "named", name: "green" } });

humidityGauge = gauge("Humidity", () => {
  const h = weather?.current?.relative_humidity_2m ?? 0;
  const sev = getHumiditySeverity(h);
  if (humidityGauge) {
    humidityGauge._color = sev.color;
  }
  return h / 100;
}, { color: { type: "named", name: "green" } });

windGauge = gauge("Wind", () => {
  const w = weather?.current?.wind_speed_10m ?? 0;
  const sev = getWindSeverity(w);
  if (windGauge) {
    windGauge._color = sev.color;
  }
  return Math.min(w / 100, 1);
}, { color: { type: "named", name: "green" } });

// Explicit any with inline comment to access private style property on Text widget dynamically
let artLine1: any;
// Explicit any with inline comment to access private style property on Text widget dynamically
let artLine2: any;
// Explicit any with inline comment to access private style property on Text widget dynamically
let artLine3: any;
// Explicit any with inline comment to access private style property on Text widget dynamically
let artLine4: any;

artLine1 = text(() => {
  const code = weather?.current?.weather_code ?? 0;
  if (artLine1) artLine1.style.fg = getWeatherArtColor(code);
  return `  ${getWeatherArt(code)[0]}`;
});
artLine2 = text(() => {
  const code = weather?.current?.weather_code ?? 0;
  if (artLine2) artLine2.style.fg = getWeatherArtColor(code);
  return `  ${getWeatherArt(code)[1]}`;
});
artLine3 = text(() => {
  const code = weather?.current?.weather_code ?? 0;
  if (artLine3) artLine3.style.fg = getWeatherArtColor(code);
  return `  ${getWeatherArt(code)[2]}`;
});
artLine4 = text(() => {
  const code = weather?.current?.weather_code ?? 0;
  if (artLine4) artLine4.style.fg = getWeatherArtColor(code);
  return `  ${getWeatherArt(code)[3]}`;
});

function getInsight(index: number): string {
  if (!weather) return index === 0 ? "  ⏳ Loading insights..." : "";
  const t = weather.current?.temperature_2m ?? 0;
  const h = weather.current?.relative_humidity_2m ?? 0;
  const w = weather.current?.wind_speed_10m ?? 0;
  const insights = getWeatherInsights(t, h, w);
  if (insights[index]) {
    return `  • ${insights[index]}`;
  }
  return "";
}

app(caps.unicode ? `🌤 Weather Dashboard • ${city}, India` : `* Weather Dashboard • ${city}, India`)
  .rows(
    row(
      text(() => {
        const icon = weather ? weatherIcon(weather.current?.weather_code ?? 0) : "⏳";
        return `${icon} Weather Dashboard • ${city}, India`;
      }, { bold: true, color: { type: "named", name: "cyan" } })
    ),

    row(
      text(() => `  [q] Quit  •  [r] Refresh  •  [c] Cycle Cities (${city})`, { dim: true })
    ),

    spacer(1),

    row(
      tempGauge,
      humidityGauge,
      windGauge
    ),

    spacer(1),

    row(
      text("  CURRENT CONDITIONS", { bold: true, color: { type: "named", name: "cyan" } })
    ),

    row(
      col(
        text(() => {
          if (!weather) return "  Condition: --";
          const code = weather.current?.weather_code ?? 0;
          const cond = getConditionName(code);
          return `  Condition: ${cond}`;
        }),
        text(() => {
          if (!weather) return "  Temp: --  |  Feels Like: --";
          const t = weather.current?.temperature_2m ?? 0;
          const feels = weather.current?.apparent_temperature ?? t;
          const sev = getTemperatureSeverity(t);
          return `  Temp: ${t.toFixed(1)}°C (${sev.label})  |  Feels: ${feels.toFixed(1)}°C`;
        }),
        text(() => {
          if (!weather) return "  Wind: --";
          const w = weather.current?.wind_speed_10m ?? 0;
          const dir = weather.current?.wind_direction_10m ?? 0;
          const sev = getWindSeverity(w);
          return `  Wind Speed: ${w} km/h (${sev.label})  |  Direction: ${compass(dir)} (${dir}°)`;
        }),
        text(() => {
          if (!weather) return "  Humidity: --  |  Dew Point: --";
          const h = weather.current?.relative_humidity_2m ?? 0;
          const t = weather.current?.temperature_2m ?? 0;
          const sev = getHumiditySeverity(h);
          const dp = calculateDewPoint(t, h);
          return `  Humidity: ${h}% (${sev.label})  |  Dew Point: ${dp.toFixed(1)}°C`;
        })
      ),
      col(
        artLine1,
        artLine2,
        artLine3,
        artLine4
      )
    ),

    spacer(1),

    row(
      text("  WEATHER INSIGHTS", { bold: true, color: { type: "named", name: "yellow" } })
    ),

    row(
      text(() => getInsight(0))
    ),
    row(
      text(() => getInsight(1))
    ),
    row(
      text(() => getInsight(2))
    ),

    spacer(1),

    row(
      status("API Status", () => weather !== null, {
        upColor: { type: "named", name: "green" },
        downColor: { type: "named", name: "red" },
      }),
      text(() => `Latency: ${lastLatency || 0} ms`),
      text(() => `Sync: ${weather ? timeAgo(Date.now()) : "waiting"}`),
      text(() => `Updated: ${weather ? timeAgo(Date.now()) : "never"}`)
    )
  )
  .keys({
    q: "quit",
    r: () => {
      lastFetch = 0;
      fetchWeather();
    },
    c: () => {
      currentCityIndex = (currentCityIndex + 1) % PRESET_CITIES.length;
      const preset = PRESET_CITIES[currentCityIndex];
      city = preset.name;
      lat = preset.lat;
      lon = preset.lon;
      weather = null;
      lastFetch = 0;
      fetchWeather();
    }
  })
  .refresh("5s")
  .run();