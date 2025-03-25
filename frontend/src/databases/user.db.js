import PouchDB from 'pouchdb';

const remoteDbURL = "http://localhost:5984/"

function getDbName(userEmail){
    return 'userdb-'+Buffer.from(userEmail).toString('hex')
}

export default function getDbByEmail(userEmail, token) {
    const dbName = getDbName(userEmail)
    const localDb = new PouchDB(dbName)
    const remoteDb = new PouchDB(remoteDbURL+dbName, {fetch: (url, opts) => {
        opts.headers.set('Authorization', `Bearer ${token}`)
        return PouchDB.fetch(url,opts)
    }})
    localDb.sync(remoteDb, {live: true, retry: true})
    return localDb
}
