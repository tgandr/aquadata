import { useEffect, useState } from "react"
import getDbByUser from '../databases/user.db';
import { SecureStoragePlugin } from "capacitor-secure-storage-plugin";

const useDatabase = () => {
  const [db,setDb] = useState(null)

  useEffect(() => {
    const initializeDb = async () => {
      const credentials = await SecureStoragePlugin.get({key: 'credentials'})
      const {email, password} = JSON.parse(credentials.value)
      const db = getDbByUser(email,password)
      setDb(db)
    }
    
    initializeDb()
  },[])

  return db
}

export default useDatabase;