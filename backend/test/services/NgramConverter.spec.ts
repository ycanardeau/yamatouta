import { Test, TestingModule } from '@nestjs/testing';

import { NgramConverter } from '../../src/services/NgramConverter';

describe('NgramConverter', () => {
	let ngramConverter: NgramConverter;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [NgramConverter],
		}).compile();

		ngramConverter = module.get<NgramConverter>(NgramConverter);
	});

	test('padEnd', () => {
		expect(ngramConverter.padEnd('い')).toBe('い豔豔豔');
		expect(ngramConverter.padEnd('大和')).toBe('大和豔豔');
		expect(ngramConverter.padEnd('大和言葉')).toBe('大和言葉');
	});

	test('toNgramFullTextArray', () => {
		expect(ngramConverter.toNgramFullTextArray('い', 2)).toStrictEqual([
			'い豔豔豔',
		]);

		expect(ngramConverter.toNgramFullTextArray('大和', 2)).toStrictEqual([
			'大和豔豔',
			'和豔豔豔',
		]);

		expect(
			ngramConverter.toNgramFullTextArray('大和言葉', 2),
		).toStrictEqual(['大和豔豔', '和言豔豔', '言葉豔豔', '葉豔豔豔']);

		expect(
			ngramConverter.toNgramFullTextArray('やまとことば', 2),
		).toStrictEqual([
			'やま豔豔',
			'まと豔豔',
			'とこ豔豔',
			'こと豔豔',
			'とば豔豔',
			'ば豔豔豔',
		]);
	});

	test('toNgramFullText', () => {
		expect(ngramConverter.toNgramFullText('い', 2)).toBe('い豔豔豔');

		expect(ngramConverter.toNgramFullText('大和', 2)).toBe(
			'大和豔豔 和豔豔豔',
		);

		expect(ngramConverter.toNgramFullText('大和言葉', 2)).toBe(
			'大和豔豔 和言豔豔 言葉豔豔 葉豔豔豔',
		);

		expect(ngramConverter.toNgramFullText('やまとことば', 2)).toBe(
			'やま豔豔 まと豔豔 とこ豔豔 こと豔豔 とば豔豔 ば豔豔豔',
		);
	});

	test('toNgramQueryArray', () => {
		expect(ngramConverter.toNgramQueryArray('い', 2)).toStrictEqual([
			'+い*',
		]);

		expect(ngramConverter.toNgramQueryArray('大和', 2)).toStrictEqual([
			'+大和豔豔',
		]);

		expect(ngramConverter.toNgramQueryArray('大和言葉', 2)).toStrictEqual([
			'+大和豔豔',
			'+和言豔豔',
			'+言葉豔豔',
		]);

		expect(
			ngramConverter.toNgramQueryArray('やまとことば', 2),
		).toStrictEqual([
			'+やま豔豔',
			'+まと豔豔',
			'+とこ豔豔',
			'+こと豔豔',
			'+とば豔豔',
		]);
	});

	test('toNgramQuery', () => {
		expect(ngramConverter.toNgramQuery('い', 2)).toBe('+い*');

		expect(ngramConverter.toNgramQuery('大和', 2)).toBe('+大和豔豔');

		expect(ngramConverter.toNgramQuery('大和言葉', 2)).toBe(
			'+大和豔豔 +和言豔豔 +言葉豔豔',
		);

		expect(ngramConverter.toNgramQuery('やまとことば', 2)).toBe(
			'+やま豔豔 +まと豔豔 +とこ豔豔 +こと豔豔 +とば豔豔',
		);
	});

	test('split', () => {
		expect(ngramConverter.split('　　い　　')).toStrictEqual(['い']);

		expect(
			ngramConverter.split('　　いろはにほへと　　ちりぬるを　　'),
		).toStrictEqual(['いろはにほへと', 'ちりぬるを']);
	});

	test('toFulltextArray', () => {
		expect(ngramConverter.toFullTextArray('い', 2)).toStrictEqual([
			['い豔豔豔'],
		]);

		expect(
			ngramConverter.toFullTextArray('いろはにほへと ちりぬるを', 2),
		).toStrictEqual([
			[
				'いろ豔豔',
				'ろは豔豔',
				'はに豔豔',
				'にほ豔豔',
				'ほへ豔豔',
				'へと豔豔',
				'と豔豔豔',
			],
			['ちり豔豔', 'りぬ豔豔', 'ぬる豔豔', 'るを豔豔', 'を豔豔豔'],
		]);
	});

	test('toFulltext', () => {
		expect(ngramConverter.toFullText('い', 2)).toBe('い豔豔豔');

		expect(ngramConverter.toFullText('いろはにほへと ちりぬるを', 2)).toBe(
			'いろ豔豔 ろは豔豔 はに豔豔 にほ豔豔 ほへ豔豔 へと豔豔 と豔豔豔 ちり豔豔 りぬ豔豔 ぬる豔豔 るを豔豔 を豔豔豔',
		);
	});

	test('toQueryArray', () => {
		expect(ngramConverter.toQueryArray('い', 2)).toStrictEqual([['+い*']]);

		expect(
			ngramConverter.toQueryArray('いろはにほへと ちりぬるを', 2),
		).toStrictEqual([
			[
				'+いろ豔豔',
				'+ろは豔豔',
				'+はに豔豔',
				'+にほ豔豔',
				'+ほへ豔豔',
				'+へと豔豔',
			],
			['+ちり豔豔', '+りぬ豔豔', '+ぬる豔豔', '+るを豔豔'],
		]);
	});

	test('toQuery', () => {
		expect(ngramConverter.toQuery('い', 2)).toBe('+い*');

		expect(ngramConverter.toQuery('いろはにほへと ちりぬるを', 2)).toBe(
			'+いろ豔豔 +ろは豔豔 +はに豔豔 +にほ豔豔 +ほへ豔豔 +へと豔豔 +ちり豔豔 +りぬ豔豔 +ぬる豔豔 +るを豔豔',
		);
	});
});
