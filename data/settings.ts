import * as SQLite from 'expo-sqlite'
import { Title } from './types'

export interface BookSettings {
  bookSlug: string; // How the book is identified in Sefaria's API
  location: string; // Where in the book we last read
  label: Title | null; // Label to use when showing history
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
  label TEXT,
  commentaries TEXT,
  last_read NUMERIC
  );`

const bookSettingsCreateIndexSQL = 'create index if not exists settings_bookslug_index on book_settings(book_slug);'

export async function initializeDB() {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      //tx.executeSql('drop table book_settings')
      tx.executeSql(bookSettingsCreateSQL)
      tx.executeSql(bookSettingsCreateIndexSQL)
    },
    (error) => { console.log('db error creating tables'); console.log(error); reject(error) },
    () => { resolve('success') },
    )
  })
}

function rowToBookSettings(row) : BookSettings {
  let label: Title | null = null
  if (row.label) {
    try {
      label = JSON.parse(row.label)
    } catch(error) {
      console.warn('Error parsing booksettings.label', row.label)
      label = null
    }
  }
  const retval = {
    bookSlug: row.book_slug as string,
    location: row.location as string,
    commentaries: (row.commentaries as string).split('\t'),
    label: label,
    lastRead: new Date(row.last_read as number),
  }
  return retval
}

export function getBookSettings(bookSlug: string) : Promise<BookSettings | null > {
  return new Promise<BookSettings>( (resolve, reject) => {
    db.transactionAsync(tx => {
      return tx.executeSqlAsync('select * from book_settings where book_slug = ?', [bookSlug])
        .then( results => {
          if (results.rows) {
            if (results.rows.length > 0) {
              resolve(rowToBookSettings(results.rows[0]))
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
  const titleJSON = JSON.stringify(settings.label)
  const values = [settings.location, titleJSON, settings.commentaries.join('\t'), settings.lastRead.getTime(), settings.bookSlug]
  return db.transactionAsync(tx =>{
    return tx.executeSqlAsync('update book_settings set location = ?, label = ?, commentaries = ?, last_read = ? where book_slug = ?',
      values,
    ).then(result => {
      if(result.rowsAffected < 1) {
        // No rows updated. Must mean we need to insert
        tx.executeSqlAsync('insert into book_settings(location, label, commentaries, last_read, book_slug) values (?, ?, ?, ?, ?)', values)
      }
    })
  })
}

export function getHistory() : Promise<BookSettings[]> {
  return new Promise<BookSettings[]>( (resolve, reject) => {
    db.transactionAsync(tx => {
      return tx.executeSqlAsync('SELECT * from book_settings order by last_read DESC')
        .then( results => {
          if (results.rows) {
            const history = results.rows.map( row => rowToBookSettings(row))
            resolve(history)
          }
          else {
            reject('No history rows found')
          }
        })
    })
  })
}
