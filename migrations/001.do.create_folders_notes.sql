CREATE TABLE noteful_folders (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    title TEXT NOT NULL
);

CREATE TABLE noteful_notes (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    note_name TEXT NOT NULL,
    content TEXT NOT NULL,
    folder_id INTEGER REFERENCES noteful_folders(id) ON DELETE CASCADE,
    modified TIMESTAMP DEFAULT now() NOT NULL
);
