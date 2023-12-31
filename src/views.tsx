import {GenreTotal, GenreTotalWithPct, RefData, YayNayTotal} from "./types";


const Layout = (props: { children?: any}) => (
    <html>
    <head>
        <title>bandolier</title>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"/>
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"/>
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"/>
        <link rel="manifest" href="/site.webmanifest"/>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin/>
        <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@300;400;700&display=swap" rel="stylesheet"/>
        <link rel='stylesheet' href='/static/css/style.css'/>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script src="/static/js/htmx.js"></script>
    </head>
    <body>
    <div id="stage">
        <sub>[whats genre of music is this band?]</sub>
        { props.children }
    </div>
    </body>
    </html>
)
export const main = (band: RefData, genres: RefData[]) => (<Layout>
    <h1><a href={`/${band.id}`}>{band.name}</a></h1>
    {Opinion(band.id, true)}
    <div id='genres'>
        {
            genres.map(g => (
                <button hx-post={`/${band.id}`}
                        value={g.id}
                        name="genre"
                        hx-target="body">
                    {g.name}
                </button>
            ))
        }
        <p><a href=''>None of these genres fit</a></p>
        <p><a hx-patch={`/${band.id}/real`} href=''>This is a real band</a></p>
    </div>
</Layout>)

export const view = (band: RefData, topGenres: GenreTotalWithPct[], yayNays: YayNayTotal) => (
    <Layout>
        <h1>{band.name}</h1>
        <p>&#128077; {yayNays.yays} &nbsp;&nbsp; &#128078; {yayNays.nays}</p>
        <h2>Top Genres</h2>
        {
            topGenres.map(tg => (
                <div class="genre-chart">
                    <span class="title">{tg.genre} ({tg.total})</span>
                    <br/>
                    <span class="bar" style={`--width: ${400 * (tg.pct/100)}px`}>&nbsp;</span>
                </div>
            ))
        }
        <p><a href=''>This is a real band</a></p>
    </Layout>
)

export const Opinion = (id: number, enabled: boolean) => (
    enabled
        ? <div id="opinion">
            <button title="i like this name" hx-patch={`/${id}/yay`} hx-target="#opinion">&#128077;</button>
            <button title="i hate this name" hx-patch={`/${id}/nay`} hx-target="#opinion">&#128078;</button>
        </div>
        : <div id="opinion">
            <button disabled>&#128077;</button>
            <button disabled>&#128078;</button>
        </div>)
