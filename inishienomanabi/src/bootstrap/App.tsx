import Layout from '@/bootstrap/Layout';
import Home from '@/bootstrap/pages/Home';
import NotFound from '@/bootstrap/pages/NotFound';
import TranslationList from '@/bootstrap/pages/TranslationList';
import TranslationView from '@/bootstrap/pages/TranslationView';
import {
	JapaneseRedirect,
	SearchRedirect,
	YamatokotobaRedirect,
} from '@/shared/redirects';
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

// The stylesheets of inishienomanabi.net, copied to public/bootstrap.
for (const href of ['/bootstrap/bootstrap.min.css', '/bootstrap/style.css']) {
	const link = document.createElement('link');
	link.rel = 'stylesheet';
	link.href = href;
	document.head.appendChild(link);
}

const App = (): React.ReactElement => (
	<BrowserRouter>
		<Routes>
			<Route path="/search" element={<SearchRedirect />} />
			<Route path="/ja-ojp/:query" element={<JapaneseRedirect />} />
			<Route path="/ojp-ja/:query" element={<YamatokotobaRedirect />} />
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
);

export default App;
