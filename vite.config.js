import { defineConfig } from 'vite';
import { crx } from '@crxjs/vite-plugin';
import copy from 'rollup-plugin-copy';

import manifest from './manifest.json';

export default defineConfig({
    plugins: [
        crx({ manifest }),
        copy({
            targets: [
                { src: 'public/*', dest: 'dist/public' },
                { src: 'css/*.css', dest: 'dist' }
            ],
        }),
    ],
});
