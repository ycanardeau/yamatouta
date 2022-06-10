import { Injectable } from '@nestjs/common';
import _ from 'lodash';

// Code from: https://web.archive.org/web/20210514134917/http://www.tatamilab.jp/rnd/archives/000390.html.
@Injectable()
export class NgramConverter {
	private static readonly FT_MIN_WORD_LEN = 4;

	// See: https://atsumu-t2.hatenadiary.org/entry/20091231/1262252080.
	padEnd(text: string): string {
		return text.padEnd(NgramConverter.FT_MIN_WORD_LEN, '妛');
	}

	toNgramFullTextArray(text: string, n: number): string[] {
		return _.range(0, text.length)
			.map((i) => text.slice(i, i + n))
			.map((ngram) => this.padEnd(ngram));
	}

	toNgramFullText(text: string, n: number): string {
		text = text.trim();

		if (!text) return text;

		return this.toNgramFullTextArray(text, n).join(' ');
	}

	toNgramQueryArray(text: string, n: number): string[] {
		if (text.length < n) return [`+${text}*`];

		return _.range(0, text.length - n + 1)
			.map((i) => text.slice(i, i + n))
			.map((ngram) => `+${this.padEnd(ngram)}`);
	}

	toNgramQuery(text: string, n: number): string {
		text = text.trim();

		if (!text) return '';

		return this.toNgramQueryArray(text, n).join(' ');
	}

	split(text: string): string[] {
		return text.trim().split(/\s+/);
	}

	toFullTextArray(text: string, n: number): string[][] {
		return this.split(text).map((part) =>
			this.toNgramFullTextArray(part, n),
		);
	}

	toFullText(text: string, n: number): string {
		return _.flatten(this.toFullTextArray(text, n)).join(' ');
	}

	toQueryArray(text: string, n: number): string[][] {
		return this.split(text).map((part) => this.toNgramQueryArray(part, n));
	}

	toQuery(text: string, n: number): string {
		return _.flatten(this.toQueryArray(text, n)).join(' ');
	}
}
