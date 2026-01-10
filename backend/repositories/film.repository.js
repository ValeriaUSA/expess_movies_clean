import connection from '../config/db.js'


// SELECT ALL
// const findAll = async () => {
//     const SELECT = "SELECT * FROM films"
//     try {
//         const resultat = await connection.query(SELECT)
//         console.log("DB query result:", resultat); //to see if data exists
//         return resultat[0]

//     } catch (error) {
//         console.log(error);
//         return null
//     }
// }
const findAll = async () => {
    const SELECT = "SELECT * FROM films";
    try {
        const resultat = await connection.query(SELECT); // original query
        console.log('Raw query result:', resultat);

        // If using mysql2/promise, usually query() returns [rows, fields]
        const rows = resultat[0]; 
        // console.log('Rows extracted:', rows);
        // console.log('Type of rows:', typeof rows);
        // console.log('Is rows an array?', Array.isArray(rows));

        return rows; // return the array of film objects
    } catch (error) {
        console.log(error);
        return [];
    }
};

const saveNewFilm = async (newFilm) => {
    const INSERT = "INSERT INTO films (titre, image, description, dateSortie, genre) VALUES (?, ?, ?, NOW(), ?)"
  try {
    const result =await connection.query(INSERT,[newFilm.titre, newFilm.image, newFilm.description, newFilm.genre])
    newFilm.id = result[0].insertId
    return { success: true, id: result.insertId };

  } catch (error) {

    if (error.code == "ER_DUP_ENTRY") {
      // Title already exists
      console.warn("Duplicate film:", newFilm.titre);
      return { success: false, reason:"Duplicate" };
  }
 console.error("Error inserting film:", error);
    return { success: false, reason: "DB error" };
}
}
export default { findAll, saveNewFilm }