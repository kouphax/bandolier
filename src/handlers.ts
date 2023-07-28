import {Context} from "hono";
import {ApplicationBindings, GenreTotal, GenreTotalWithPct, RefData, YayNayTotal} from "./types";
import {main, Opinion, view} from "./views";
import {z} from "zod";

const SelectGenreBodySchema = z.object({
    genre: z.coerce.number()
});

const toPercentages = (numbers: GenreTotal[]): GenreTotalWithPct[] => {
    const largestNumber = Math.max(...numbers.map(n => n.total))
    return numbers.map(number => ({
        ...number,
        pct: Math.round(number.total / largestNumber * 100)
    }));
}

export const handleIndex = async (c: Context<ApplicationBindings>) => {
    // @ts-ignore
    const band: RefData = await c.env.DB.prepare(`
        select id, name
        from band_names
        order by random()
        limit 1`)
        .first<RefData>();

    const {results: genres} = await c.env.DB.prepare(`
        select id, name
        from genres
        order by random()
        limit 5`)
        .all<RefData>();

    return c.html(main(band, genres));
}

export const handleGenreSelection = async (c: Context<ApplicationBindings>) => {
    const body = await c.req.parseBody().then(SelectGenreBodySchema.safeParse)

    if (body.success) {
        const bandId = parseInt(c.req.param('id'), 10)
        const genreId = body.data.genre;
        await c.env.DB.prepare(`
            insert or
            replace into band_name_genre_counts(band_name_id, genre_id, total)
            values (?1,
                    ?2,
                    coalesce((select total + 1
                              from band_name_genre_counts
                              where band_name_id = ?1
                                and genre_id = ?2), 1))`)
            .bind(bandId, genreId)
            .run();
    }

    return c.redirect("/");
}

export const handleYay = async (c: Context<ApplicationBindings>) => {
    const id = parseInt(c.req.param('id'), 10)

    await c.env.DB.prepare(`
        insert or
        replace into yay_nays(band_name_id, yay_count, nay_count)
        values (?1,
                coalesce((select yay_count + 1 from yay_nays where band_name_id = ?1), 1),
                coalesce((select nay_count from yay_nays where band_name_id = ?1), 0))`)
        .bind(id)
        .run();

    return c.html(Opinion(id, false))
}

export const handleNay = async (c: Context<ApplicationBindings>) => {
    const id = parseInt(c.req.param('id'), 10)
    await c.env.DB.prepare(`
        insert or
        replace into yay_nays(band_name_id, nay_count, yay_count)
        values (?,
                coalesce((select nay_count + 1 from yay_nays where band_name_id = ?), 1),
                coalesce((select yay_count from yay_nays where band_name_id = ?), 0))`)
        .bind(id, id, id)
        .run()
    return c.html(Opinion(id, false))
}

export const handleView = async (c: Context<ApplicationBindings>) => {
    const id = parseInt(c.req.param('id'), 10)

    // @ts-ignore
    const band: RefData = await c.env.DB.prepare("select name from band_names where id = ?").bind(id).first();

    const {results: topGenres} = await c.env.DB.prepare(`
        select g.name as genre, bngc.total as total
        from genres g
                 left join band_name_genre_counts bngc
                           on g.id = bngc.genre_id
        where bngc.band_name_id = ?
        order by bngc.total desc
        limit 5`)
        .bind(id)
        .all<GenreTotal>();

    const yayNays: YayNayTotal = await c.env.DB.prepare(`
        select yay_count as yays, nay_count as nays
        from yay_nays
        where band_name_id = ?`)
        .bind(id)
        .first<YayNayTotal>().then(r =>
            r !== null ? r : {
                yays: 0,
                nays: 0
            })

    return c.html(view(band, toPercentages(topGenres), yayNays))
}
