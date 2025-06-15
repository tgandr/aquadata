import PouchDB from 'pouchdb';
import pouchDbFind from 'pouchdb-find'

PouchDB.plugin(pouchDbFind)

let localDb = null;
let remoteDb = null;
let replicationHandler = null;

export function getDbName(email){
    return 'userdb-'+Buffer.from(email).toString('hex')
}

const remoteDbURL = "http://localhost:5984/"

export default async function initDb(db, email, password) {
    if (localDb) return localDb;
    const dbName = getDbName(db);
    localDb = new PouchDB(dbName);
    remoteDb = new PouchDB(remoteDbURL+dbName, {auth: {
        username: email,
        password
    }});
    replicationHandler = localDb.sync(remoteDb, {live: true, retry: true})
    return localDb
}

export function closeDb() {
    if (!localDb) return;
    replicationHandler.cancel()
}


