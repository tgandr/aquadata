import { SecureStoragePlugin } from "capacitor-secure-storage-plugin"
import { useEffect, useState } from "react"
import initDb from "../databases/pouch.db"

const useDatabase = () => {
  const [db, setDb] = useState()
  useEffect(() => {
    SecureStoragePlugin.get({key: 'credentials'}).then(res => {
      const credentials = JSON.parse(res.value)
      initDb(credentials.email, credentials.password).then(res =>
        setDb(res)
      )
    })
  }, [])
  return db
}

export default useDatabase;