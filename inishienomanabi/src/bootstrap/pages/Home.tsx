import TranslationTable from '@/bootstrap/TranslationTable';
import {
	countTranslations,
	listRandomTranslations,
	listTags,
	listTranslations,
} from '@/data/database';
import {
	categories,
	links,
	siteDescription,
	yamatokotobaCaption,
} from '@/shared/constants';
import { useAsync, useTitle } from '@/shared/hooks';
import React from 'react';
import { Link } from 'react-router-dom';

// views/translations/index.php
const Home = (): React.ReactElement => {
	useTitle();

	const data = useAsync(
		async () => ({
			translationCount: await countTranslations(),
			randomTranslations: await listRandomTranslations(10),
			newTranslations: (await listTranslations('id', 1, 10)).items,
			popularTags: await listTags('popular', 15),
		}),
		[],
	);

	return (
		<div className="row">
			<div className="col-sm-9">
				<h2>いにしえのまなびとは</h2>
				<p>
					{siteDescription}現在、
					{data?.translationCount.toLocaleString() ?? '…'}
					の翻訳が登録されています。
				</p>
				<p>
					{yamatokotobaCaption}は日本固有の美しい言葉です。さあ、
					{yamatokotobaCaption}を使いましょう！
				</p>
				<h2>このサイトの目的</h2>
				<p>
					このサイトは{yamatokotobaCaption}
					を集めることを目的としています。翻訳は誰でも投稿することができます。未検証の翻訳は投票数の多いものから順に管理人の独断と偏見によって承認されます。実際には
					{yamatokotobaCaption}
					ではない単語が含まれているかもしれません。ご注意ください。
				</p>
				{data && data.randomTranslations.length > 0 && (
					<>
						<h2>ランダム表示</h2>
						<TranslationTable
							translations={data.randomTranslations}
						/>
					</>
				)}
				{data && data.newTranslations.length > 0 && (
					<>
						<h2>
							新しく登録された翻訳
							<span className="pull-right">
								<small>
									<Link to="/translations/newest">
										もっと見る
									</Link>
								</small>
							</span>
						</h2>
						<TranslationTable translations={data.newTranslations} />
					</>
				)}
			</div>
			<div className="col-sm-3">
				<h2>タグから探す</h2>
				<ul className="list-unstyled">
					{data?.popularTags.map((tag) => (
						<li key={tag.name}>
							<Link
								to={`/translations/tagged/${encodeURIComponent(
									tag.name,
								)}`}
								className="label label-default"
							>
								{tag.name}
							</Link>{' '}
							<small>x {tag.count}</small>
						</li>
					))}
				</ul>
				<Link to="/tags">すべてのタグを見る</Link>
				<h2>品詞から探す</h2>
				<ul className="list-unstyled">
					{categories.map((category) => (
						<li key={category}>
							<Link
								to={`/search?${new URLSearchParams({
									q: `category:${category}`,
								})}`}
							>
								{category}
							</Link>
						</li>
					))}
				</ul>
				<h2>リンク</h2>
				<ul className="list-unstyled">
					<li>
						<a
							href="http://kotodama.xn--9oq386cb2a.com/"
							target="_blank"
							rel="noreferrer"
						>
							<img
								src="/images/links/kotodama.gif"
								alt="言霊-日本の物語を語り継ぐ-"
								title="言霊-日本の物語を語り継ぐ-"
							/>
						</a>
					</li>
					{links.map((link) => (
						<li key={link.url}>
							<a href={link.url} target="_blank" rel="noreferrer">
								{link.title}
							</a>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
};

export default Home;
