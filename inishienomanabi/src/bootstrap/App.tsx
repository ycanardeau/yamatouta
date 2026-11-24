import Layout from '@/bootstrap/Layout';
import Help from '@/bootstrap/pages/Help';
import Home from '@/bootstrap/pages/Home';
import NotFound from '@/bootstrap/pages/NotFound';
import {
	ReopenedTranslations,
	UnverifiedTranslations,
} from '@/bootstrap/pages/ReviewList';
import TagList from '@/bootstrap/pages/TagList';
import TaggedTranslations from '@/bootstrap/pages/TaggedTranslations';
import {
	NewestTranslations,
	PopularTranslations,
} from '@/bootstrap/pages/TopTranslations';
import TranslationList from '@/bootstrap/pages/TranslationList';
import TranslationRevisions from '@/bootstrap/pages/TranslationRevisions';
import TranslationView from '@/bootstrap/pages/TranslationView';
import UserList from '@/bootstrap/pages/UserList';
import {
	UserProfile,
	UserReviews,
	UserTranslations,
} from '@/bootstrap/pages/UserPages';
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
					path="/translations/unverified"
					element={<UnverifiedTranslations />}
				/>
				<Route
					path="/translations/reopened"
					element={<ReopenedTranslations />}
				/>
				<Route
					path="/translations/popular"
					element={<PopularTranslations />}
				/>
				<Route
					path="/translations/newest"
					element={<NewestTranslations />}
				/>
				<Route
					path="/translations/:id/view"
					element={<TranslationView />}
				/>
				<Route
					path="/translations/:id/revisions"
					element={<TranslationRevisions />}
				/>
				<Route
					path="/translations/tagged/:tagName"
					element={<TaggedTranslations />}
				/>
				<Route path="/tags" element={<TagList />} />
				<Route path="/users" element={<UserList />} />
				<Route
					path="/users/:username/profile"
					element={<UserProfile />}
				/>
				<Route
					path="/users/:username/translations"
					element={<UserTranslations />}
				/>
				<Route
					path="/users/:username/reviews"
					element={<UserReviews />}
				/>
				<Route path="/help" element={<Help />} />
				<Route path="*" element={<NotFound />} />
			</Route>
		</Routes>
	</BrowserRouter>
);

export default App;
