import { defineConfig } from 'vite';

export default defineConfig({
    build: {
        outDir: 'public',
        emptyOutDir: false,
        rollupOptions: {
            input: 'resources/js/vantage.js',
            output: {
                entryFileNames: 'js/vantage.js',
                assetFileNames: (assetInfo) => {
                    if (assetInfo.name && assetInfo.name.endsWith('.css')) {
                        return 'css/vantage.css';
                    }
                    return 'assets/[name].[ext]';
                },
            },
        },
    },
    css: {
        postcss: './postcss.config.js',
    },
});
