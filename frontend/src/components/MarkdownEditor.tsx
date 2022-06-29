import {
	EuiMarkdownEditor,
	EuiMarkdownEditorProps,
	getDefaultEuiMarkdownUiPlugins,
} from '@elastic/eui';
import { NumberSymbolRegular } from '@fluentui/react-icons';
import React from 'react';

import { parsingPluginList, processingPluginList } from './Markdown';

const uiPlugins = getDefaultEuiMarkdownUiPlugins();
uiPlugins.push({
	name: 'myPlugin',
	button: {
		label: 'Hashtags' /* TODO: localize */,
		iconType: NumberSymbolRegular,
	},
	formatting: {
		prefix: '[',
		suffix: '](#)',
		replaceNext: '#',
		scanFor: '#',
	},
});

export const MarkdownEditor = (
	props: EuiMarkdownEditorProps,
): React.ReactElement => {
	return (
		<EuiMarkdownEditor
			parsingPluginList={parsingPluginList}
			processingPluginList={processingPluginList}
			uiPlugins={uiPlugins}
			{...props}
		/>
	);
};
