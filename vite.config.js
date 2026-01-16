import vue from '@vitejs/plugin-vue';

export default {
    plugins: [vue()],
    build: {
        outDir: 'dist',
        assetsDir: '',
        cssCodeSplit: true,
        rollupOptions: {
            input: {
                app: 'resources/js/app.js',
                styles: 'resources/js/styles.js',
                'styles-dark': 'resources/js/styles-dark.js'
            },
            output: {
                entryFileNames: '[name].js',
                chunkFileNames: '[name].[hash].js',
                assetFileNames: '[name].[ext]',
            },
        },
    },
    resolve: {
        alias: {
            '@': '/resources/js',
        },
    },
};
