import Layout from '@/eui/Layout';
import '@/eui/icons';
import Home from '@/eui/pages/Home';
import NotFound from '@/eui/pages/NotFound';
import TranslationList from '@/eui/pages/TranslationList';
import TranslationView from '@/eui/pages/TranslationView';
import {
	JapaneseRedirect,
	SearchRedirect,
	YamatokotobaRedirect,
} from '@/shared/redirects';
import { EuiProvider } from '@elastic/eui';
import '@elastic/eui/dist/eui_theme_dark.css';
import createCache from '@emotion/cache';
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

// See https://github.com/elastic/eui/issues/5436.
const euiCache = createCache({
	key: 'eui',
	container: document.querySelector('meta[name="eui-style-insert"]') as Node,
});
euiCache.compat = true;

const App = (): React.ReactElement => (
	<EuiProvider colorMode="dark" cache={euiCache}>
		<BrowserRouter>
			<Routes>
				<Route path="/search" element={<SearchRedirect />} />
				<Route path="/ja-ojp/:query" element={<JapaneseRedirect />} />
				<Route
					path="/ojp-ja/:query"
					element={<YamatokotobaRedirect />}
				/>
				<Route element={<Layout />}>
					<Route path="/" element={<Home />} />
					<Route path="/translations" element={<TranslationList />} />
					<Route
						path="/translations/:id/view"
						element={<TranslationView />}
					/>
					<Route path="*" element={<NotFound />} />
				</Route>
			</Routes>
		</BrowserRouter>
	</EuiProvider>
);

export default App;
