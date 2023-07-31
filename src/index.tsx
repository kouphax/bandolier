import {Hono} from 'hono'
import {serveStatic} from 'hono/cloudflare-workers'
import {etag} from 'hono/etag'
import {ApplicationBindings} from './types';
import {handleIndex, handleNay, handleGenreSelection, handleYay, handleView, handleReal} from "./handlers";

const app = new Hono<ApplicationBindings>()

app.get('/static/*', etag(), serveStatic({root: './'}))
app.use('/favicon.ico', serveStatic({ path: './favicon.ico' }))
app.use('/apple-touch-icon.png', serveStatic({ path: './apple-touch-icon.png' }))
app.use('/favicon-32x32.png', serveStatic({ path: '/favicon-32x32.png' }))
app.use('/favicon-16x16.png', serveStatic({ path: './favicon-16x16.png' }))
app.use('/site.webmanifest', serveStatic({ path: './site.webmanifest' }))

app.get('/', handleIndex);
app.get('/:id', handleView);
app.post('/:id', handleGenreSelection)
app.patch('/:id/yay', handleYay);
app.patch('/:id/nay',  handleNay);
app.patch('/:id/real',  handleReal);

export default app
