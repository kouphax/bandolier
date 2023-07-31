-- Migration number: 0001 	 2023-07-31T07:02:28.019Z
alter table band_names
add is_real integer default 0;
