export interface SleepNight {
  date?: string;
  sleep_start_time?: string;
  start_time?: string;
  "sleep-start-time"?: string;
  sleep_end_time?: string;
  end_time?: string;
  "sleep-end-time"?: string;
  sleep_time_total?: number;
  "sleep-time-total"?: number;
  total_sleep_time?: number;
  sleep_duration?: number;
  sleep_score?: number;
  score?: number;
  sleep_rating?: number;
  continuity_index?: number;
  continuity?: number;
  sleep_cycles?: number;
  sleep_efficiency?: number;
  deep_sleep?: number;
  light_sleep?: number;
  rem_sleep?: number;
  awake?: number;
}

export interface SleepData {
  nights?: SleepNight[];
}

export interface RechargeNight {
  date?: string;
  heart_rate_variability?: number;
  hrv?: number;
  "heart-rate-variability"?: number;
  ans_charge?: number;
  ans?: number;
  "ans-charge"?: number;
  nightly_recharge_score?: number;
  recharge_score?: number;
  "nightly-recharge-score"?: number;
  breathing_rate?: number;
  breathing?: number;
  "breathing-rate"?: number;
  average_hrv?: number;
  resting_heart_rate?: number;
  rhr?: number;
  "resting-heart-rate"?: number;
}

export interface RechargeData {
  recharges?: RechargeNight[];
  nightly_recharges?: RechargeNight[];
}

export interface ActivityDay {
  date?: string;
  start_time?: string;
  steps?: number;
  active_calories?: number;
  calories?: number;
  active_minutes?: number;
  active_time?: number;
  active_steps?: number;
  distance?: number;
  duration?: number;
}

export interface ActivitySamples {
  date?: string;
  steps?: { samples?: { timestamp?: string; time?: string; steps?: number }[] };
}

export interface ActivityData {
  activities?: ActivityDay[];
}

export interface ActivitySamplesData {
  activities?: ActivitySamples[];
}

export interface HeartRateSample {
  datetime?: string;
  time?: string;
  sample_time?: string;
  "heart-rate"?: number;
  heartRate?: number;
  value?: number;
  heart_rate?: number;
}

export interface HeartRateDay {
  date?: string;
  samples?: HeartRateSample[];
  heart_rate_samples?: HeartRateSample[];
  heart_rates?: { heart_rate_samples?: HeartRateSample[] }[];
}

export interface HeartRateData {
  heart_rates?: HeartRateDay[];
}

export interface CardioLoadData {
  cardio_load?: number;
  load?: number;
  strain?: number;
  tolerance?: number;
  status?: string;
}

export interface ExerciseData {
  id?: string;
  start_time?: string;
  duration?: number;
  sport?: string;
  distance?: number;
  calories?: number;
}
