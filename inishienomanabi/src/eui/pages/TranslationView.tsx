import { getTranslation } from '@/data/database';
import Link from '@/eui/Link';
import NotFound from '@/eui/pages/NotFound';
import { yamatokotobaCaption } from '@/shared/constants';
import { useAsync, useTitle } from '@/shared/hooks';
import {
	EuiBadge,
	EuiDescriptionList,
	EuiFlexGroup,
	EuiFlexItem,
	EuiLink,
	EuiPageHeader,
	EuiSpacer,
	EuiStat,
} from '@elastic/eui';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const TranslationView = (): React.ReactElement | null => {
	const id = Number(useParams().id);
	const navigate = useNavigate();

	useTitle(`No.${id}を閲覧`);

	const translation = useAsync(
		async () => (await getTranslation(id)) ?? null,
		[id],
	);

	if (translation === undefined) return null;
	if (translation === null) return <NotFound />;

	const tab =
		(to: string) =>
		(e: React.MouseEvent): void => {
			e.preventDefault();
			navigate(to);
		};

	return (
		<>
			<EuiPageHeader
				pageTitle={`${translation.japanese} ↔ ${translation.yamatokotoba}`}
				description={`No.${id}`}
				tabs={[
					{
						label: '閲覧',
						href: `/translations/${id}/view`,
						onClick: tab(`/translations/${id}/view`),
						isSelected: true,
					},
					{
						label: '履歴表示',
						href: `/translations/${id}/revisions`,
						onClick: tab(`/translations/${id}/revisions`),
					},
				]}
			/>
			<EuiSpacer />
			<EuiDescriptionList
				type="column"
				listItems={[
					{
						title: '日本語',
						description: (
							<Link
								to={`/ja-ojp/${encodeURIComponent(
									translation.japanese,
								)}`}
							>
								{translation.japanese}
							</Link>
						),
					},
					...(translation.reading
						? [{ title: '読み', description: translation.reading }]
						: []),
					...(translation.category
						? [{ title: '品詞', description: translation.category }]
						: []),
					{
						title: yamatokotobaCaption,
						description: (
							<EuiFlexGroup
								gutterSize="s"
								responsive={false}
								wrap
							>
								{translation.yamatokotoba
									.split(' ')
									.map((value, index) => (
										<EuiFlexItem key={index} grow={false}>
											<Link
												to={`/ojp-ja/${encodeURIComponent(
													value,
												)}`}
											>
												{value}
											</Link>
										</EuiFlexItem>
									))}
							</EuiFlexGroup>
						),
					},
					...(translation.tags.length > 0
						? [
								{
									title: 'タグ',
									description: (
										<EuiFlexGroup
											gutterSize="xs"
											responsive={false}
											wrap
										>
											{translation.tags.map((tag) => (
												<EuiFlexItem
													key={tag}
													grow={false}
												>
													<EuiBadge>{tag}</EuiBadge>
												</EuiFlexItem>
											))}
										</EuiFlexGroup>
									),
								},
						  ]
						: []),
					...(translation.source
						? [
								{
									title: '出典',
									description: /^https?:\/\//.test(
										translation.source,
									) ? (
										<EuiLink
											href={translation.source}
											target="_blank"
											external
										>
											{translation.source}
										</EuiLink>
									) : (
										translation.source
									),
								},
						  ]
						: []),
					...(translation.description
						? [
								{
									title: '説明',
									description: translation.description,
								},
						  ]
						: []),
				]}
			/>
			<EuiSpacer />
			<EuiFlexGroup responsive={false}>
				<EuiFlexItem grow={false}>
					<EuiStat
						title={translation.upvotes}
						description="高く評価"
						titleSize="s"
						titleColor="primary"
					/>
				</EuiFlexItem>
				<EuiFlexItem grow={false}>
					<EuiStat
						title={translation.downvotes}
						description="低く評価"
						titleSize="s"
						titleColor="danger"
					/>
				</EuiFlexItem>
			</EuiFlexGroup>
		</>
	);
};

export default TranslationView;
