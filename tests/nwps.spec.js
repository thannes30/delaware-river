import { describe, it, expect } from 'vitest';
import { parseFloodInfo, parseObserved } from '../app/lib/nwps';

describe('parseFloodInfo', () => {
  it('orders categories by stage and nulls missing values', () => {
    const info = parseFloodInfo({
      stageUnits: 'ft',
      flowUnits: 'cfs',
      categories: {
        major: { stage: 31, flow: -9999 },
        action: { stage: 23, flow: -9999 },
        minor: { stage: 25, flow: 131120 },
      },
    });
    expect(Object.keys(info)).toEqual(['action', 'minor', 'major']);
    expect(info.action.flow).toBeNull();
    expect(info.minor).toEqual({ stage: 25, flow: 131120, stageUnit: 'ft', flowUnit: 'cfs' });
  });
});

describe('parseObserved', () => {
  it('keeps hourly readings and converts kcfs to cfs', () => {
    const rows = parseObserved({
      secondaryUnits: 'kcfs',
      data: [
        { validTime: '2026-10-23T14:00:00Z', primary: 3.03, secondary: 1.21 },
        { validTime: '2026-10-23T14:15:00Z', primary: 3.04, secondary: 1.22 },
        { validTime: '2026-10-23T15:00:00Z', primary: -9999, secondary: -9999 },
      ],
    });
    expect(rows).toEqual([
      { time: '2026-10-23T14:00:00Z', stage: 3.03, flow: 1210 },
      { time: '2026-10-23T15:00:00Z', stage: null, flow: null },
    ]);
  });
});
