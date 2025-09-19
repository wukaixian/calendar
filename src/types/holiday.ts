export interface HolidayInfo {
  date: string;
  name: string;
  isHoliday: boolean;
  isAdjustedWorkday: boolean;
  wageMultiplier?: number;
  description?: string;
}

export type HolidayMap = Record<string, HolidayInfo>;
