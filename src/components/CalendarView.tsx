import { useMemo } from 'react';
import { solar2lunar } from 'solarlunar';
import type { Dayjs } from 'dayjs';
import dayjs from '../utils/dayjs';
import type { HolidayInfo, HolidayMap } from '../types/holiday';

interface CalendarViewProps {
  focusDate: Dayjs;
  holidays: HolidayMap;
  holidayLoading: boolean;
  holidayError?: string;
  onMonthChange: (delta: number) => void;
}

interface CalendarCell {
  date: Dayjs;
  formatted: string;
  isCurrentMonth: boolean;
  isToday: boolean;
  isWeekend: boolean;
  lunarLabel: string;
  highlight?: string;
  holiday?: HolidayInfo;
  tooltip: string;
}

const WEEKDAYS = ['一', '二', '三', '四', '五', '六', '日'];
const TOTAL_GRID_CELLS = 42; // 6 weeks * 7 days

const buildTooltip = (cell: Omit<CalendarCell, 'tooltip'> & { tooltip?: string }): string => {
  const parts: string[] = [cell.date.format('YYYY年M月D日')];

  if (cell.holiday) {
    parts.push(cell.holiday.name);
    if (cell.holiday.description) {
      parts.push(cell.holiday.description);
    }
  }

  if (cell.highlight) {
    parts.push(`节日/节气：${cell.highlight}`);
  }

  return parts.join('\n');
};

const useCalendarCells = (focusDate: Dayjs, holidays: HolidayMap): CalendarCell[] =>
  useMemo(() => {
    const startOfMonth = focusDate.startOf('month');
    const firstGridDay = startOfMonth.subtract((startOfMonth.day() + 6) % 7, 'day');
    const today = dayjs().startOf('day');

    return Array.from({ length: TOTAL_GRID_CELLS }, (_, index) => {
      const cellDate = firstGridDay.add(index, 'day');
      const formatted = cellDate.format('YYYY-MM-DD');
      const holiday = holidays[formatted];

      const lunar = solar2lunar(cellDate.year(), cellDate.month() + 1, cellDate.date());
      const lunarLabel = lunar.dayCn === '初一' ? lunar.monthCn : lunar.dayCn;
      const highlight = lunar.festival || lunar.lunarFestival || lunar.term || undefined;

      const baseCell: Omit<CalendarCell, 'tooltip'> = {
        date: cellDate,
        formatted,
        isCurrentMonth: cellDate.month() === focusDate.month(),
        isToday: cellDate.isSame(today, 'day'),
        isWeekend: cellDate.day() === 0 || cellDate.day() === 6,
        lunarLabel,
        highlight,
        holiday,
      };

      return {
        ...baseCell,
        tooltip: buildTooltip(baseCell),
      };
    });
  }, [focusDate, holidays]);

const CalendarView = ({ focusDate, holidays, holidayLoading, holidayError, onMonthChange }: CalendarViewProps) => {
  const cells = useCalendarCells(focusDate, holidays);
  const quarter = Math.floor(focusDate.month() / 3) + 1;

  return (
    <section className="calendar-view">
      <div className="calendar-toolbar">
        <button className="nav-button" type="button" onClick={() => onMonthChange(-1)} aria-label="上一月">
          &lt;
        </button>
        <div className="toolbar-labels">
          <span className="toolbar-month">{focusDate.format('YYYY 年 M 月')}</span>
          <span className="toolbar-subtext">{focusDate.format('dddd')} · 第 {quarter} 季度</span>
        </div>
        <button className="nav-button" type="button" onClick={() => onMonthChange(1)} aria-label="下一月">
          &gt;
        </button>
      </div>

      {holidayLoading && <div className="inline-hint">正在同步当年节假日信息…</div>}
      {holidayError && !holidayLoading && <div className="inline-hint error">节假日数据加载失败：{holidayError}</div>}

      <div className="calendar-weekdays">
        {WEEKDAYS.map(label => (
          <div key={label} className="weekday" aria-hidden="true">
            周{label}
          </div>
        ))}
      </div>

      <div className="calendar-grid">
        {cells.map(cell => {
          const classes = ['calendar-cell'];

          if (!cell.isCurrentMonth) {
            classes.push('is-outside');
          }

          if (cell.isToday) {
            classes.push('is-today');
          }

          if (cell.isWeekend) {
            classes.push('is-weekend');
          }

          if (cell.holiday?.isHoliday) {
            classes.push('is-holiday');
          }

          if (cell.holiday?.isAdjustedWorkday) {
            classes.push('is-adjusted');
          }

          return (
            <div key={cell.formatted} className={classes.join(' ')} title={cell.tooltip}>
              <div className="cell-header">
                <span className="gregorian">{cell.date.date()}</span>
                {cell.holiday ? (
                  <span className={`tag ${cell.holiday.isHoliday ? 'tag-holiday' : 'tag-adjusted'}`}>
                    {cell.holiday.isHoliday ? cell.holiday.name : '调休'}
                  </span>
                ) : cell.highlight ? (
                  <span className="tag tag-highlight">{cell.highlight}</span>
                ) : null}
              </div>
              <div className="cell-footer">
                <span className="lunar">{cell.lunarLabel}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default CalendarView;
