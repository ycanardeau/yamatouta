import {
	EuiLink,
	EuiMarkdownFormat,
	EuiMarkdownFormatProps,
	euiMarkdownLinkValidator,
	EuiMarkdownLinkValidatorOptions,
	getDefaultEuiMarkdownParsingPlugins,
	getDefaultEuiMarkdownProcessingPlugins,
} from '@elastic/eui';
import React from 'react';
import visit from 'unist-util-visit';

import { Link } from './Link';

interface LinkOrTextNode {
	type: string;
	url?: string;
	title?: string | null;
	value?: string;
	children?: Array<{ value: string }>;
}

// Code from: https://github.com/elastic/eui/blob/47e869ea9667135b284ab0ee1f1fba0c2fdcfd07/src/components/markdown_editor/plugins/markdown_link_validator.tsx#L38.
const mutateLinkToText = (node: LinkOrTextNode): LinkOrTextNode => {
	// this is an upsupported url, convert to a text node
	node.type = 'text';

	// and, if the link text matches the url there's only one value to show
	// otherwise render as the markdown syntax so both text & url remain, unlinked
	const linkText = node.children?.[0]?.value || '';
	const linkUrl = node.url ?? '';
	if (linkText === linkUrl) {
		node.value = linkText;
	} else {
		node.value = `[${linkText}](${node.url})`;
	}

	delete node.children;
	delete node.title;
	delete node.url;
	return node;
};

// Code from: https://github.com/elastic/eui/blob/47e869ea9667135b284ab0ee1f1fba0c2fdcfd07/src/components/markdown_editor/plugins/markdown_link_validator.tsx#L58
const validateUrl = (
	url: string,
	{ allowRelative, allowProtocols }: EuiMarkdownLinkValidatorOptions,
): boolean => {
	// relative captures both relative paths `/` and protocols `//`
	const isRelative = url.startsWith('/') || url.startsWith('#');
	if (isRelative) {
		return allowRelative;
	}

	try {
		const parsedUrl = new URL(url);
		return allowProtocols.indexOf(parsedUrl.protocol) !== -1;
	} catch (e) {
		// failed to parse input as url
		return false;
	}
};

// Code from https://github.com/elastic/eui/blob/47e869ea9667135b284ab0ee1f1fba0c2fdcfd07/src/components/markdown_editor/plugins/markdown_link_validator.tsx#L24.
const markdownLinkValidator = (options: EuiMarkdownLinkValidatorOptions) => {
	return (ast: any): void => {
		visit(ast, 'link', (_node: unknown) => {
			const node = _node as LinkOrTextNode;

			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			if (!validateUrl(node.url!, options)) {
				mutateLinkToText(node);
				return;
			}

			if (node.url && node.url.charAt(0) === '#') {
				const fragment = node.url.slice(1);

				if (fragment.match(/^[あ-ん]+$/g)) {
					node.url = `/hashtags/${fragment}/quotes`;
					_node = node;
				}
			}
		});
	};
};

export const parsingPluginList = getDefaultEuiMarkdownParsingPlugins().map(
	([plugin, config]: any) => {
		const isValidationPlugin = plugin === euiMarkdownLinkValidator;
		if (isValidationPlugin) {
			return [
				markdownLinkValidator,
				{
					allowRelative: true,
					allowProtocols: ['https:', 'http:', 'mailto:'],
				} as EuiMarkdownLinkValidatorOptions,
			];
		} else {
			return [plugin, config] as any;
		}
	},
);

// Code from: https://github.com/remarkjs/react-markdown/issues/29#issuecomment-231556543.
const RouterLink = (props: any): React.ReactElement => {
	return props.href.match(/^(https?:)?\/\//) ? (
		<EuiLink href={props.href} target="_blank">
			{props.children}
		</EuiLink>
	) : (
		<Link to={props.href}>{props.children}</Link>
	);
};

export const processingPluginList: any[] =
	getDefaultEuiMarkdownProcessingPlugins();
processingPluginList[1][1].components.a = RouterLink;

export const Markdown = (props: EuiMarkdownFormatProps): React.ReactElement => {
	return (
		<EuiMarkdownFormat
			parsingPluginList={parsingPluginList}
			processingPluginList={processingPluginList}
			{...props}
		/>
	);
};
