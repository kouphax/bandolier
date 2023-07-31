

const VOTE_FOR_GENRE = `
    insert or replace into band_name_genre_counts(band_name_id, genre_id, total)
    values (?1,
            ?2,
            coalesce((select total + 1
                      from band_name_genre_counts
                      where band_name_id = ?1
                        and genre_id = ?2), 1))`
export const voteForGenre = (db: D1Database, bandId: number, genreId: number) =>
    db.prepare(VOTE_FOR_GENRE)
        .bind(bandId, genreId)
        .run()

const INCREMENT_YAY = `
    insert or replace into yay_nays(band_name_id, yay_count, nay_count)
    values (?1,
            coalesce((select yay_count + 1 from yay_nays where band_name_id = ?1), 1),
            coalesce((select nay_count from yay_nays where band_name_id = ?1), 0))`

export const incrementYay = (db: D1Database, bandId: number) =>
    db.prepare(INCREMENT_YAY)
        .bind(bandId)
        .run();

const INCREMENT_NAY = `
    insert or replace into yay_nays(band_name_id, nay_count, yay_count)
    values (?,
            coalesce((select nay_count + 1 from yay_nays where band_name_id = ?), 1),
            coalesce((select yay_count from yay_nays where band_name_id = ?), 0))`

export const incrementNay = (db: D1Database, bandId: number) =>
    db.prepare(INCREMENT_NAY)
        .bind(bandId)
        .run();

const MARK_REAL = `
    update band_names 
    set is_real = is_real + 1 
    where id = ?`

export const markReal = (db: D1Database, bandId: number) =>
    db.prepare(MARK_REAL)
        .bind(bandId)
        .run();
