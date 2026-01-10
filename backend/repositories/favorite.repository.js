import connection from '../config/db.js'

// Add to favorites 
const add = async (userId, filmId) => {

const isInTable = "SELECT * FROM favorites WHERE user_id=? AND film_id=?"
const isExist = await connection.query(isInTable, [userId, filmId]);

if (isExist[0].length>0) {
  return {alreadyExists : true}
}
  const INSERT = "INSERT INTO favorites (user_id, film_id) VALUES (?, ?)";
  try {
    const [result] = await connection.query(INSERT, [userId, filmId]);
    return {insertId: result.insertId}
  } catch (error) {
    console.error("Error inserting favorite:", error);
    return null;
  }
};



const favoritesForUser = async (userId) => {
  const SELECT = "SELECT f.id, f.titre, f.image, f.description, f.dateSortie, f.genre FROM favorites fav JOIN films f ON fav.film_id = f.id WHERE fav.user_id = ?"
  try {
    const result = await connection.query(SELECT, [userId]);
    return result[0]; 
  } catch (error) {
    console.error("Error fetching favorites:", error);
    return [];
  }
};

// Remove a favorite
const remove = async (userId, filmId) => {
  const DELETE = "DELETE FROM favorites WHERE user_id = ? AND film_id = ?";
  try {
    const [result] = await connection.query(DELETE, [userId, filmId]);
    return result.affectedRows > 0;
  } catch (error) {
    console.error("Error removing favorite:", error);
    return null;
  }
};

export default { add, favoritesForUser, remove };

