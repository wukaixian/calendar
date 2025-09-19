import { useEffect, useRef, useState } from 'react';
import type { HolidayInfo, HolidayMap } from '../types/holiday';

const API_ENDPOINT = 'https://timor.tech/api/holiday/year';

interface TimorHolidayRaw {
  date: string;
  name: string;
  holiday: boolean;
  wage?: number;
  rest?: number;
  target?: string;
  after?: boolean;
}

interface TimorResponse {
  code: number;
  holiday?: Record<string, TimorHolidayRaw>;
}

interface HolidayState {
  data: HolidayMap;
  loading: boolean;
  error?: string;
}

const describeAdjustment = (item: TimorHolidayRaw): string | undefined => {
  if (!item.target) {
    return '调休工作日';
  }

  const position = item.after === false ? '假期前' : item.after === true ? '假期后' : '';
  return `${position}${position ? '·' : ''}关联假期：${item.target}`;
};

const normalizeHolidayData = (
  _year: number,
  payload?: Record<string, TimorHolidayRaw>,
): HolidayMap => {
  if (!payload) {
    return {};
  }

  const entries = Object.values(payload);
  const result: HolidayMap = {};

  for (const item of entries) {
    const normalized: HolidayInfo = {
      date: item.date,
      name: item.name,
      isHoliday: Boolean(item.holiday),
      isAdjustedWorkday: item.holiday === false,
      wageMultiplier: item.wage,
      description: item.holiday ? undefined : describeAdjustment(item),
    };

    result[item.date] = normalized;
  }

  return result;
};

export const useHolidayData = (year: number): HolidayState => {
  const cacheRef = useRef<Map<number, HolidayMap>>(new Map());
  const [state, setState] = useState<HolidayState>({ data: {}, loading: false });

  useEffect(() => {
    let cancelled = false;
    const cached = cacheRef.current.get(year);

    if (cached) {
      setState({ data: cached, loading: false });
      return;
    }

    const controller = new AbortController();

    setState(prev => ({ ...prev, loading: true, error: undefined }));

    const fetchHolidayData = async () => {
      try {
        const response = await fetch(`${API_ENDPOINT}/${year}`, { signal: controller.signal });

        if (!response.ok) {
          throw new Error(`节假日服务返回错误状态：${response.status}`);
        }

        const body = (await response.json()) as TimorResponse;

        if (body.code !== 0) {
          throw new Error('节假日服务返回异常，请稍后重试');
        }

        const normalized = normalizeHolidayData(year, body.holiday);

        cacheRef.current.set(year, normalized);

        if (cancelled) {
          return;
        }

        setState({ data: normalized, loading: false, error: undefined });
      } catch (error) {
        if ((error as Error).name === 'AbortError' || cancelled) {
          return;
        }

        setState(prev => ({ ...prev, loading: false, error: (error as Error).message }));
      }
    };

    void fetchHolidayData();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [year]);

  return state;
};
