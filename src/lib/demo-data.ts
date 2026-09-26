import type {
  SleepNight,
  RechargeNight,
  ActivityDay,
  HeartRateSample,
} from "@/types/polar";

export function generateDemoSleep(days: number): SleepNight[] {
  const nights: SleepNight[] = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    const hours = 5.5 + Math.random() * 3;
    const score = Math.min(100, Math.round(50 + hours * 8 + Math.random() * 15));
    nights.push({
      date: dateStr,
      sleep_start_time: `${dateStr}T23:00:00`,
      sleep_end_time: `${dateStr}T${String(Math.floor(6 + Math.random() * 3)).padStart(2, "0")}:${String(Math.floor(Math.random() * 60)).padStart(2, "0")}:00`,
      sleep_time_total: Math.round(hours * 3600),
      sleep_score: score,
    });
  }
  return nights;
}

export function generateDemoRecharge(days: number): RechargeNight[] {
  const nights: RechargeNight[] = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const hrv = 40 + Math.round(Math.random() * 40);
    nights.push({
      date: d.toISOString().split("T")[0],
      heart_rate_variability: hrv,
      ans_charge: Math.round(-10 + Math.random() * 20),
      nightly_recharge_score: Math.round(40 + Math.random() * 50),
      breathing_rate: 12 + Math.round(Math.random() * 6),
      resting_heart_rate: 50 + Math.round(Math.random() * 15),
    });
  }
  return nights;
}

export function generateDemoActivity(days: number): ActivityDay[] {
  const activities: ActivityDay[] = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const isWeekend = d.getDay() === 0 || d.getDay() === 6;
    const steps = isWeekend ? 12000 + Math.round(Math.random() * 8000) : 6000 + Math.round(Math.random() * 6000);
    activities.push({
      date: d.toISOString().split("T")[0],
      steps,
      active_calories: Math.round(steps * 0.04 + Math.random() * 100),
      active_minutes: Math.round(steps * 0.008),
    });
  }
  return activities;
}

export function generateDemoHeartRateSamples(dateStr: string): HeartRateSample[] {
  const samples: HeartRateSample[] = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 5) {
      let hr: number;
      if (h >= 23 || h <= 6) hr = 52 + Math.round(Math.random() * 6);
      else if (h >= 7 && h <= 9) hr = 75 + Math.round(Math.random() * 15);
      else if (h >= 12 && h <= 13) hr = 68 + Math.round(Math.random() * 10);
      else if (h >= 17 && h <= 19) hr = 85 + Math.round(Math.random() * 25);
      else hr = 60 + Math.round(Math.random() * 12);

      samples.push({
        datetime: `${dateStr}T${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:00`,
        "heart-rate": hr,
      });
    }
  }
  return samples;
}

export function generateDemoHRDay(dateStr: string) {
  return {
    date: dateStr,
    samples: generateDemoHeartRateSamples(dateStr),
  };
}
