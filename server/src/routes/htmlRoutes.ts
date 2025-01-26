import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Router } from 'express';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = Router();


router.get('*',(_req, res)=>{
    if(process.env.NODE_ENV === 'production'){
    return res.sendFile(path.join(__dirname, '../../../client/dist/index.htnl'))
    }

    res.send('This is the development server. Use npm run start:dev to start the client and server')
})

// TODO: Define route to serve index.html

export default router;
