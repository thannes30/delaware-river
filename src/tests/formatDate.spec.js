import expect from 'expect';
import {formatDate} from '../lib/utils'

describe('formatDate', () => {
	it('should format iso date into human readable date', () => {
		const isoTime = formatDate('2019-02-08T20:30:00-00:00');
		const readableTime = '20:30 - 02/08/2019';
		expect(isoTime).toEqual(readableTime);
	});
});