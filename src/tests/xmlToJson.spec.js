import expect from 'expect';
import {xmlToJson} from '../lib/utils'

describe('xmlToJson', () => {
	it('should take xml and return json', () => {
		const xml = xmlToJson('<result><site><to>Tester</to><from>Tester Son</from></site></result>');
		const json = {"result": {"site": {"to": "Tester","from": "Tester Son"}}};
		expect(xml).toEqual(json);
	});
});
