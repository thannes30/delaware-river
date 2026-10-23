import { describe, it, expect } from 'vitest';
import { formatDate, xmlToJson } from '../app/lib/utils';

describe('formatDate', () => {
  it('should format iso date into human readable date', () => {
    expect(formatDate('2019-02-08T20:30:00-00:00')).toEqual('20:30 - 02/08/2019');
  });
});

describe('xmlToJson', () => {
  it('should take xml and return json', () => {
    const json = xmlToJson('<result><site><to>Tester</to><from>Tester Son</from></site></result>');
    expect(json).toEqual({ result: { site: [{ to: ['Tester'], from: ['Tester Son'] }] } });
  });
});
