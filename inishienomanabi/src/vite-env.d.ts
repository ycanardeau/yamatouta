/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_THEME: 'bootstrap' | 'eui';
}

// Icon assets imported directly for the icon cache in src/eui/icons.ts.
declare module '@elastic/eui/es/components/icon/assets/*';
declare module '@elastic/eui/es/components/icon/icon';
