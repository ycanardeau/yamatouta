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
		expect(ngramConverter.padEnd('い')).toBe('い妛妛妛');
		expect(ngramConverter.padEnd('大和')).toBe('大和妛妛');
		expect(ngramConverter.padEnd('大和言葉')).toBe('大和言葉');
	});

	test('toNgramFullTextArray', () => {
		expect(ngramConverter.toNgramFullTextArray('い', 2)).toStrictEqual([
			'い妛妛妛',
		]);

		expect(ngramConverter.toNgramFullTextArray('大和', 2)).toStrictEqual([
			'大和妛妛',
			'和妛妛妛',
		]);

		expect(
			ngramConverter.toNgramFullTextArray('大和言葉', 2),
		).toStrictEqual(['大和妛妛', '和言妛妛', '言葉妛妛', '葉妛妛妛']);

		expect(
			ngramConverter.toNgramFullTextArray('やまとことば', 2),
		).toStrictEqual([
			'やま妛妛',
			'まと妛妛',
			'とこ妛妛',
			'こと妛妛',
			'とば妛妛',
			'ば妛妛妛',
		]);
	});

	test('toNgramFullText', () => {
		expect(ngramConverter.toNgramFullText('い', 2)).toBe('い妛妛妛');

		expect(ngramConverter.toNgramFullText('大和', 2)).toBe(
			'大和妛妛 和妛妛妛',
		);

		expect(ngramConverter.toNgramFullText('大和言葉', 2)).toBe(
			'大和妛妛 和言妛妛 言葉妛妛 葉妛妛妛',
		);

		expect(ngramConverter.toNgramFullText('やまとことば', 2)).toBe(
			'やま妛妛 まと妛妛 とこ妛妛 こと妛妛 とば妛妛 ば妛妛妛',
		);
	});

	test('toNgramQueryArray', () => {
		expect(ngramConverter.toNgramQueryArray('い', 2)).toStrictEqual([
			'+い*',
		]);

		expect(ngramConverter.toNgramQueryArray('大和', 2)).toStrictEqual([
			'+大和妛妛',
		]);

		expect(ngramConverter.toNgramQueryArray('大和言葉', 2)).toStrictEqual([
			'+大和妛妛',
			'+和言妛妛',
			'+言葉妛妛',
		]);

		expect(
			ngramConverter.toNgramQueryArray('やまとことば', 2),
		).toStrictEqual([
			'+やま妛妛',
			'+まと妛妛',
			'+とこ妛妛',
			'+こと妛妛',
			'+とば妛妛',
		]);
	});

	test('toNgramQuery', () => {
		expect(ngramConverter.toNgramQuery('い', 2)).toBe('+い*');

		expect(ngramConverter.toNgramQuery('大和', 2)).toBe('+大和妛妛');

		expect(ngramConverter.toNgramQuery('大和言葉', 2)).toBe(
			'+大和妛妛 +和言妛妛 +言葉妛妛',
		);

		expect(ngramConverter.toNgramQuery('やまとことば', 2)).toBe(
			'+やま妛妛 +まと妛妛 +とこ妛妛 +こと妛妛 +とば妛妛',
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
			['い妛妛妛'],
		]);

		expect(
			ngramConverter.toFullTextArray('いろはにほへと ちりぬるを', 2),
		).toStrictEqual([
			[
				'いろ妛妛',
				'ろは妛妛',
				'はに妛妛',
				'にほ妛妛',
				'ほへ妛妛',
				'へと妛妛',
				'と妛妛妛',
			],
			['ちり妛妛', 'りぬ妛妛', 'ぬる妛妛', 'るを妛妛', 'を妛妛妛'],
		]);
	});

	test('toFulltext', () => {
		expect(ngramConverter.toFullText('い', 2)).toBe('い妛妛妛');

		expect(ngramConverter.toFullText('いろはにほへと ちりぬるを', 2)).toBe(
			'いろ妛妛 ろは妛妛 はに妛妛 にほ妛妛 ほへ妛妛 へと妛妛 と妛妛妛 ちり妛妛 りぬ妛妛 ぬる妛妛 るを妛妛 を妛妛妛',
		);
	});

	test('toQueryArray', () => {
		expect(ngramConverter.toQueryArray('い', 2)).toStrictEqual([['+い*']]);

		expect(
			ngramConverter.toQueryArray('いろはにほへと ちりぬるを', 2),
		).toStrictEqual([
			[
				'+いろ妛妛',
				'+ろは妛妛',
				'+はに妛妛',
				'+にほ妛妛',
				'+ほへ妛妛',
				'+へと妛妛',
			],
			['+ちり妛妛', '+りぬ妛妛', '+ぬる妛妛', '+るを妛妛'],
		]);
	});

	test('toQuery', () => {
		expect(ngramConverter.toQuery('い', 2)).toBe('+い*');

		expect(ngramConverter.toQuery('いろはにほへと ちりぬるを', 2)).toBe(
			'+いろ妛妛 +ろは妛妛 +はに妛妛 +にほ妛妛 +ほへ妛妛 +へと妛妛 +ちり妛妛 +りぬ妛妛 +ぬる妛妛 +るを妛妛',
		);
	});
});
