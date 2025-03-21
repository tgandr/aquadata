import { createRoot } from 'react-dom/client'
import './index.css'
// import "reflect-metadata";
import App from './App.jsx'
import { StrictMode } from 'react';

// customElements.define('jeep-sqlite', JeepSqlite);
// const initializeDataSources = async () => {
//   //check sqlite connections consistency
//   await sqliteParams.connection.checkConnectionsConsistency()
//   .catch((e) => {
//     console.log(e);
//     return {};
//   });

//   // Loop through the DataSources
//   for (const mDataSource of [userDataSource]) {
//     // initialize
//     await mDataSource.dataSource.initialize();
//     if (mDataSource.dataSource.isInitialized) {
//       // run the migrations
//       await mDataSource.dataSource.runMigrations();
//     }
//     if(sqliteParams.platform === 'web') {
//       await sqliteParams.connection.saveToStore(mDataSource.dbName);
//     }                    
//   }     
// }

// if (sqliteParams.platform !== "web") {
//   initializeDataSources();
//   // Now depending on the Framework render your APP
// } else {
//   window.addEventListener('DOMContentLoaded', async () => {
//       const jeepEl = document.createElement("jeep-sqlite");
//       document.body.appendChild(jeepEl);
//       customElements.whenDefined('jeep-sqlite').then(async () => {
//         await sqliteParams.connection.initWebStore();
//         await initializeDataSources();
//         // Now depending on the Framework render your APP
//      })
//       .catch ((err) => {
//         console.log(`Error: ${err}`);
//         throw new Error(`Error: ${err}`)
//     });
//   });
// }''

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)