import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import {Server} from 'tls';

// https://vitejs.dev/config/
export default defineConfig(({command, mode, ssrBuild}) => {
    // if (command == 'dev') {
    return {plugins: [react()], server: {port: 3000, host: '127.0.0.1', hmr: {retry: false}}};
    // }
});
