

export type RefData = {
    id: number,
    name: string
}

export type GenreTotal = {
    genre: string,
    total: number
}

export type GenreTotalWithPct = GenreTotal & {
    pct: number
}

export type YayNayTotal = {
    yays: number,
    nays: number
}

export type Bindings = {
    DB: D1Database
}


export type ApplicationBindings = { Bindings: Bindings }
