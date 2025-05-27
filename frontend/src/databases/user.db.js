import PouchDB from 'pouchdb';
import pouchDbFind from 'pouchdb-find'

PouchDB.plugin(pouchDbFind)
const remoteDbURL = "http://localhost:5984/"

function getDbName(email){
    return 'userdb-'+Buffer.from(email).toString('hex')
}

export default function getDbByUser(email, password) {
    const dbName = getDbName(email)
    const localDb = new PouchDB(dbName)
    
    const remoteDb = new PouchDB(remoteDbURL+dbName, {auth: {
        username: email,
        password
    }})
    
    localDb.sync(remoteDb, {live: true, retry: true})
    return localDb
}

