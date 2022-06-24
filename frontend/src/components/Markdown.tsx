import { EuiText } from '@elastic/eui';
import React from 'react';
import ReactMarkdown, { uriTransformer } from 'react-markdown';
import { ElementContent } from 'react-markdown/lib/ast-to-react';
import remarkBreaks from 'remark-breaks';
import remarkGfm from 'remark-gfm';

const remarkPlugins = [remarkGfm, remarkBreaks];

const transformHashtagLinkUri = (href: string): string | undefined => {
	if (href.charAt(0) !== '#') return undefined;

	const hashtag = href.slice(1);

	if (!decodeURIComponent(hashtag).match(/^[あ-ん]+$/g)) return undefined;

	return `/hashtags/${hashtag}`;
};

const transformLinkUri = (
	href: string,
	children: ElementContent[],
	title: string | null,
): string => {
	return transformHashtagLinkUri(href) ?? uriTransformer(href);
};

interface MarkdownProps {
	children: string;
}

export const Markdown = ({ children }: MarkdownProps): React.ReactElement => {
	return (
		<EuiText size="s">
			<ReactMarkdown
				children={children}
				remarkPlugins={remarkPlugins}
				transformLinkUri={transformLinkUri}
			/>
		</EuiText>
	);
};
