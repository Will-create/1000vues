// read the database.sql file and create the database

const fs = Total.Fs;

const filename = PATH.root('database.sql');

// fs.readFile(filename, 'utf8', function(err, data) {
//     if (err) {
//         console.error('Error reading database.sql:', err);
//         return;
//     }
    
//     DATA.query(data).callback(function(err, response) {
//         if (err) {
//             console.error('Error executing database.sql:', err);
//         } else {
//             console.log('Database initialized successfully:', response);
//         }
//     })
// });