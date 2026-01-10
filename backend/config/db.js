import * as mysql from 'mysql2/promise'

const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT||51501 ,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: {
    rejectUnauthorized: false // Souvent nécessaire pour les certificats auto-signés en mode gratuit
  }
});


connection
    .connect()
    .then(() => console.log(`Connexion établie avec MySQL`))
    .catch(err => console.log(err));


export default connection