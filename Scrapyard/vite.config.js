import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default {
    plugins: [react()],
    server: {port: 3000, host: '127.0.0.1', hmr: {retry: false}},
};

// export default defineConfig(({command, mode, ssrBuild}) => {
//     // if (command == 'dev') {
//     return {
//         root: path.join(__dirname, 'src/scripts'),
//         build: {
//             outDir: '../dist',
//         },
//         plugins: [react()],
//         server: {port: 3000, host: '127.0.0.1', hmr: {retry: false}},
//     };
//     // }
// });
