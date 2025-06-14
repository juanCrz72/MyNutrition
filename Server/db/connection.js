import mysql from 'mysql2/promise';

export const db = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234', //Contraseña de la base de datos
    database: 'mynutrit_nutricion' //Nombre de la base de datos
});
