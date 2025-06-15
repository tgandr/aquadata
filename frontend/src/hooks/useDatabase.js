import { SecureStoragePlugin } from "capacitor-secure-storage-plugin"
import { useEffect, useState } from "react"
import initDb from "../databases/pouch.db"
import LocalDb from '../databases/local.db'

const useDatabase = () => {
  const [db, setDb] = useState()
  useEffect(() => {
    const userPromise = LocalDb.get('user')
    const credentialsPromise = SecureStoragePlugin.get({key: 'credentials'})
    Promise.all([userPromise, credentialsPromise]).then(values => {
      const user = values[0]
      const credentials = JSON.parse(values[1].value)
      initDb(user.email,credentials.email,credentials.password).then(res =>
        setDb(res)
      )
    })
  }, [])
  return db
}

export default useDatabase;