import {
	countTranslations,
	listRandomTranslations,
	listTags,
	listTranslations,
} from '@/data/database';
import Link from '@/eui/Link';
import TranslationTable from '@/eui/TranslationTable';
import {
	categories,
	siteDescription,
	yamatokotobaCaption,
} from '@/shared/constants';
import { useAsync, useTitle } from '@/shared/hooks';
import {
	EuiBadge,
	EuiFlexGroup,
	EuiFlexItem,
	EuiPanel,
	EuiSpacer,
	EuiText,
	EuiTitle,
} from '@elastic/eui';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = (): React.ReactElement => {
	useTitle();
	const navigate = useNavigate();

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
		<EuiFlexGroup>
			<EuiFlexItem grow={3}>
				<EuiText>
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
				</EuiText>
				{data && data.randomTranslations.length > 0 && (
					<>
						<EuiSpacer />
						<EuiTitle size="s">
							<h3>ランダム表示</h3>
						</EuiTitle>
						<TranslationTable
							translations={data.randomTranslations}
						/>
					</>
				)}
				{data && data.newTranslations.length > 0 && (
					<>
						<EuiSpacer />
						<EuiFlexGroup
							justifyContent="spaceBetween"
							alignItems="baseline"
						>
							<EuiFlexItem grow={false}>
								<EuiTitle size="s">
									<h3>新しく登録された翻訳</h3>
								</EuiTitle>
							</EuiFlexItem>
							<EuiFlexItem grow={false}>
								<Link to="/translations/newest">
									もっと見る
								</Link>
							</EuiFlexItem>
						</EuiFlexGroup>
						<TranslationTable translations={data.newTranslations} />
					</>
				)}
			</EuiFlexItem>
			<EuiFlexItem grow={1}>
				<EuiPanel hasBorder>
					<EuiTitle size="xs">
						<h3>タグから探す</h3>
					</EuiTitle>
					<EuiSpacer size="s" />
					<EuiFlexGroup gutterSize="xs" wrap responsive={false}>
						{data?.popularTags.map((tag) => {
							const to = `/translations/tagged/${encodeURIComponent(
								tag.name,
							)}`;
							return (
								<EuiFlexItem key={tag.name} grow={false}>
									<EuiBadge
										onClick={(
											e: React.MouseEvent,
										): void => {
											e.preventDefault();
											navigate(to);
										}}
										onClickAriaLabel={tag.name}
									>
										{tag.name} {tag.count}
									</EuiBadge>
								</EuiFlexItem>
							);
						})}
					</EuiFlexGroup>
					<EuiSpacer size="s" />
					<Link to="/tags">すべてのタグを見る</Link>
				</EuiPanel>
				<EuiSpacer />
				<EuiPanel hasBorder>
					<EuiTitle size="xs">
						<h3>品詞から探す</h3>
					</EuiTitle>
					<EuiSpacer size="s" />
					<EuiText size="s">
						<ul>
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
					</EuiText>
				</EuiPanel>
			</EuiFlexItem>
		</EuiFlexGroup>
	);
};

export default Home;
