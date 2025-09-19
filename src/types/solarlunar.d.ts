declare module 'solarlunar' {
  export interface LunarInfo {
    animal: string;
    dayCn: string;
    lunarDay: number;
    lunarMonth: number;
    lunarYear: number;
    monthCn: string;
    gzDay: string;
    gzMonth: string;
    gzYear: string;
    isLeap: boolean;
    term?: string | null;
    festival?: string | null;
    lunarFestival?: string | null;
    solarFestival?: string | null;
  }

  export function solar2lunar(year: number, month: number, day: number): LunarInfo;
}
