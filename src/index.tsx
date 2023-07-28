import {Hono} from 'hono'
import {serveStatic} from 'hono/cloudflare-workers'
import {etag} from 'hono/etag'
import {ApplicationBindings} from './types';
import {handleIndex, handleNay, handleGenreSelection, handleYay, handleView} from "./handlers";

const app = new Hono<ApplicationBindings>()

app.get('/', handleIndex);
app.get('/:id', handleView);
app.post('/:id', handleGenreSelection)
app.patch('/:id/yay', handleYay);
app.patch('/:id/nay',  handleNay);

// server static assets
app.get('/*', etag(), serveStatic({root: './'}))

export default app
