import mysql from "mysql2/promise";
import { query_roles_table_create, query_users_table_create } from "./MySQLModel";

// ENV Variables
const MYSQL_HOST = "localhost"
const MYSQL_USER = "root"
const MYSQL_PASSWORD = "digiware"
const MYSQL_DATABASE = "dhl"


let connection: any;
export default async function createMysqlConnection() {
    try {
        if (!connection) {
            connection = await mysql.createConnection({
                host: MYSQL_HOST,
                user: MYSQL_USER,
                password: MYSQL_PASSWORD,
            }).then(async function (connection) {
                await connection.execute(`CREATE DATABASE IF NOT EXISTS ${MYSQL_DATABASE}`);
                return connection
            });
        }
        connection.query(`USE ${MYSQL_DATABASE}`);
        await connection.execute(query_roles_table_create);
        await connection.execute(query_users_table_create);



        console.log('Connected to MySQL database!');
        return connection;
    } catch (error) {
        console.log('Error connecting to MySQL:', error);
        throw error; // Re-throw the error to be handled appropriately
    }
}

// const queries = {
//     getAll: `SELECT * FROM users`,
//     getOne: `SELECT * FROM users WHERE id = ?`,
//     create: `INSERT INTO users (email, password, confirmPassword, role) VALUES (?, ?, ?, ?)`,
//     update: `UPDATE users SET email = ?, password = ?, confirmPassword = ?, role = ? WHERE id = ?`,
//     delete: `DELETE FROM users WHERE id = ?`,
//     getUserByEmail: `SELECT * FROM users WHERE email = ?`,
//     getUserByEmailAndPassword: `SELECT * FROM users WHERE email = ? AND password = ?`,
//     getUserByEmailAndPasswordAndRole: `SELECT * FROM users WHERE email = ? AND password = ? AND role = ?`,
//     getUserByEmailAndPasswordAndRoleAndId: `SELECT * FROM users WHERE email = ? AND password = ? AND role = ? AND id = ?`,
//     getUserByEmailAndPasswordAndRoleAndIdAndIsAdmin: `SELECT * FROM users WHERE email = ? AND password = ? AND role = ? AND id = ? AND isadmin = ?`,
//     getUserByEmailAndPasswordAndRoleAndIdAndIsAdminAndIsActive: `SELECT * FROM users WHERE email = ? AND password = ? AND role = ? AND id = ? AND isadmin = ? AND isactive = ?`,
// }