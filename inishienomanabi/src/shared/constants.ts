export const japaneseCaption = '日本語';
export const yamatokotobaCaption = 'やまとことば';

export const siteDescription = `いにしえのまなびは現代語から${yamatokotobaCaption}を検索できるオンライン辞書です。`;

export const categories = [
	'名詞',
	'動詞',
	'形容詞',
	'形容動詞',
	'副詞',
	'助詞',
	'助動詞',
	'連体詞',
	'接続詞',
	'接頭辞',
	'接尾辞',
	'感動詞',
	'特殊',
];

export const statusLabels: Record<string, string | undefined> = {
	Unverified: '未検証',
	Reopened: '再開',
};

export const links = [
	{
		url: 'http://www7b.biglobe.ne.jp/~neo-kaiwa/explanation1.html',
		title: '大和言葉クイズ',
	},
	{
		url: 'http://academy6.2ch.net/test/read.cgi/kobun/1010239206/',
		title: '外来語を純やまと言葉にくだいてみてね',
	},
	{
		url: 'http://awabi.2ch.net/test/read.cgi/kobun/1286371419/',
		title: '外来語を純やまと言葉にくだいてみてね　第二版',
	},
	{
		url: 'http://yomogi.2ch.net/test/read.cgi/kobun/1396455910/',
		title: '外来語を純大和言葉にくだいてみてね　巻第三',
	},
];

export const pageTitle = (title?: string): string =>
	title
		? `${title} – いにしえのまなび`
		: `いにしえのまなび | ${yamatokotobaCaption}辞書`;
