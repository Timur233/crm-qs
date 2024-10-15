import { defineConfig } from 'vite';

export default defineConfig({
    build: {
        rollupOptions: {
            input: '/playground/checkerboard-editor/checkerboard-editor.html'
        },
        minify: false
    }
});
