const { RetryChunkLoadPlugin } = require('webpack-retry-chunk-load-plugin');

module.exports = {
	webpack: {
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
