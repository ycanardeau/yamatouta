const path = require('path');
const { RetryChunkLoadPlugin } = require('webpack-retry-chunk-load-plugin');

module.exports = {
	webpack: {
		alias: {
			'@': path.join(__dirname, 'src'),
		},
		plugins: [
			new RetryChunkLoadPlugin({
				cacheBust: `function() {
					return Date.now()
				}`,
				maxRetries: 5,
			}),
		],
	},
};
