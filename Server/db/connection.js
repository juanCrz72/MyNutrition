import mysql from 'mysql2/promise';

export const db = await mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'erenjeager', //Contraseña de la base de datos
    database: 'mynutrit_nutricion', //Nombre de la base de datos
    family: 4
});
