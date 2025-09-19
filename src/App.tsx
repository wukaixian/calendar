import { useState, type ChangeEvent } from 'react';
import CalendarView from './components/CalendarView';
import { useHolidayData } from './hooks/useHolidayData';
import dayjs from './utils/dayjs';

const HOLIDAY_SOURCE = '节假日数据来源：timor.tech（国务院放假安排）';
const MONTH_OPTIONS = Array.from({ length: 12 }, (_, index) => index);
const YEAR_OPTIONS = Array.from({ length: 41 }, (_, index) => 2030 - index);

const App = () => {
  const [focusDate, setFocusDate] = useState(() => dayjs());
  const { data: holidayMap, loading: holidayLoading, error: holidayError } = useHolidayData(focusDate.year());

  const handleShiftMonth = (delta: number) => {
    setFocusDate(prev => prev.add(delta, 'month'));
  };

  const handleSetYearMonth = (year: number, month: number) => {
    setFocusDate(prev => {
      const target = prev.year(year).month(month);
      const clampedDay = Math.min(prev.date(), target.daysInMonth());
      return target.date(clampedDay);
    });
  };

  const handleReset = () => {
    setFocusDate(dayjs());
  };

  const currentYear = focusDate.year();
  const currentMonth = focusDate.month();

  const handleYearSelect = (event: ChangeEvent<HTMLSelectElement>) => {
    const nextYear = Number(event.target.value);
    if (!Number.isNaN(nextYear) && nextYear !== currentYear) {
      handleSetYearMonth(nextYear, currentMonth);
    }
  };

  const handleMonthSelect = (event: ChangeEvent<HTMLSelectElement>) => {
    const nextMonth = Number(event.target.value);
    if (!Number.isNaN(nextMonth) && nextMonth !== currentMonth) {
      handleSetYearMonth(currentYear, nextMonth);
    }
  };

  return (
    <div className="app-shell">
      <div className="calendar-card">
        <header className="app-header">
          <div>
            <h1 className="app-title">日历</h1>
          </div>
          <div className="header-controls">
            <div className="header-selects">
              <label className="select-control">
                <span className="visually-hidden">选择年份</span>
                <select value={currentYear} onChange={handleYearSelect}>
                  {YEAR_OPTIONS.map(year => (
                    <option key={year} value={year}>
                      {year} 年
                    </option>
                  ))}
                </select>
              </label>
              <button
                className="nav-button nav-compact"
                type="button"
                onClick={() => handleShiftMonth(-1)}
                aria-label="上一月"
              >
                &lt;
              </button>
              <label className="select-control">
                <span className="visually-hidden">选择月份</span>
                <select value={currentMonth} onChange={handleMonthSelect}>
                  {MONTH_OPTIONS.map(month => (
                    <option key={month} value={month}>
                      {month + 1} 月
                    </option>
                  ))}
                </select>
              </label>
              <button
                className="nav-button nav-compact"
                type="button"
                onClick={() => handleShiftMonth(1)}
                aria-label="下一月"
              >
                &gt;
              </button>
            </div>
            <button className="ghost-button" type="button" onClick={handleReset}>
              回到今天
            </button>
          </div>
        </header>

        <CalendarView
          focusDate={focusDate}
          holidays={holidayMap}
          holidayLoading={holidayLoading}
          holidayError={holidayError}
          onMonthChange={handleShiftMonth}
        />

        <footer className="app-footer">
          <div className="legend">
            <span className="legend-item legend-holiday">法定节假日</span>
            <span className="legend-item legend-adjusted">调休补班</span>
            <span className="legend-item legend-today">今天</span>
          </div>
          <p className="data-hint">{holidayError ? `节假日数据加载失败：${holidayError}` : HOLIDAY_SOURCE}</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
