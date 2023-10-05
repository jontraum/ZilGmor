import * as SQLite from 'expo-sqlite'

interface BookSettings {
  bookSlug: string; // How the book is identified in Sefaria's API
  location: string; // Where in the book we last read
  commentaries: string[]; // List of commentaries currently being used with the book.
  lastRead?: Date; // When the user last read the book
}

const settingsDBName = 'zilgmor.settings'

const db = SQLite.openDatabase(settingsDBName)

// Translate the bookSettings interface into a SQLite table definition, with commentaries stored as a tab-separated string.
const bookSettingsCreateSQL = `CREATE TABLE IF NOT EXISTS book_settings (
  id INTEGER PRIMARY KEY,
  book_slug TEXT,
  location TEXT,
  commentaries TEXT,
  last_read NUMERIC
  );`

const bookSettingsCreateIndexSQL = 'create index if not exists settings_bookslug_index on book_settings(book_slug);'

export function initializeDB() {
  return db.transactionAsync(tx => {
    return tx.executeSqlAsync(bookSettingsCreateSQL)
      .then( () => tx.executeSqlAsync(bookSettingsCreateIndexSQL) )
      .catch( (err) => {
        console.error('Could not initialize book settings tables', err)
      })
  } )
}

export function getBookSettings(bookSlug: string) : Promise<BookSettings | null > {
  return new Promise<BookSettings>( (resolve, reject) => {
    db.transactionAsync(tx => {
      return tx.executeSqlAsync('select * from book_settings where book_slug = ?', [bookSlug])
        .then( results => {
          if (results.rows) {
            if (results.rows.length > 0) {
              const row = results.rows[0]
              const settings = {
                bookSlug: row.book_slug as string,
                location: row.location as string,
                commentaries: (row.commentaries as string).split('\t'),
                last_read: new Date(row.last_read as number),
              }
              resolve(settings)
            }
            else {
              console.info(`no settings found for book "${bookSlug}"`)
              resolve(null)
            }
          } else { // results object doesn't have rows. Must be an error
            reject(`Error searching for book settings for book "${bookSlug}": {results.error}`)
          }
        })
    }).catch( reason => {
      reject(reason)
    })
  })
}

export function saveBookSettings(settings: BookSettings) {
  const values = [settings.location, settings.commentaries.join('\t'), settings.lastRead.getTime(), settings.bookSlug]
  return db.transactionAsync(tx =>{
    return tx.executeSqlAsync('update book_settings set location = ?, commentaries = ?, last_read = ? where book_slug = ?',
      values,
    ).then(result => {
      if(result.rowsAffected < 1) {
        // No rows updated. Must mean we need to insert
        tx.executeSqlAsync('insert into book_settings(location, commentaries, last_read, book_slug) values (?, ?, ?, ?)', values)
      }
    })
  })
}
