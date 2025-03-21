import { CapacitorSQLite, SQLiteConnection } from '@capacitor-community/sqlite'
import {DataSource} from 'typeorm'
import User from '../databases/entities/user'

let dataSource = null

export const getDbConnection = async () => {
    if (dataSource && dataSource.isInitialized)
        return dataSource

    const sqlite = new SQLiteConnection(CapacitorSQLite)
    dataSource = new DataSource({
        type: 'capacitor',
        driver: sqlite,
        database: "aquadata_db",
        entities: [User],
        synchronize: true,
        migrationsRun: false
    })

    await dataSource.initialize()
    return dataSource
}

