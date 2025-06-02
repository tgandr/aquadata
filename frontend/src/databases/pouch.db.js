import PouchDB from 'pouchdb';
import pouchDbFind from 'pouchdb-find'

PouchDB.plugin(pouchDbFind)

let localDb = null
let remoteDb = null

export function getDbName(email){
    return 'userdb-'+Buffer.from(email).toString('hex')
}

const remoteDbURL = "http://localhost:5984/"

export default async function initDb(email, password) {
    if (localDb) return localDb
    const dbName = getDbName(email)
    localDb = new PouchDB(dbName)
    remoteDb = new PouchDB(remoteDbURL+dbName, {auth: {
        username: email,
        password
    }})
    localDb.sync(remoteDb, {live: true, retry: true})
    return localDb
}


