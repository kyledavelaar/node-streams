const server = require('http').createServer();
const fs = require('fs');
var oppressor = require('oppressor');
const zlib = require('zlib');

//////////////////////////////////////////////////////////
// WRITE A BIG FILE
//////////////////////////////////////////////////////////
const file = fs.createWriteStream('./big.file');
for(let i=0; i<= 1e5; i++) {
  file.write('Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n');
}
file.end();


//////////////////////////////////////////////////////////
// STREAM IT TO USER ON REQUEST
//////////////////////////////////////////////////////////
server.on('request', (req, res) => {
  const readStream = fs.createReadStream('./big.file');
  // stream.pipe(res);
  readStream.pipe(oppressor(req)).pipe(res);

});

// // SAME CODE AS ABOVE BUT SLOWER B/C STREAM NOT USED
// server.on('request', (req, res) => {
//   fs.readFile('./big.file', (err, data) => {
//     if (err) throw err;

//     res.end(data);
//   });
// });


//////////////////////////////////////////////////////////
// STREAM TO CONSOLE ON APP LOAD
//////////////////////////////////////////////////////////
let data = '';
const readStream = fs.createReadStream('./smallfile.txt');
readStream.on('data', chunk => {
  data += chunk;
})

readStream.on('end', () => {
  console.log('data', data);
})

readStream.on('error', err => {
  console.log('err', err.stack);
})


//////////////////////////////////////////////////////////
// WRITE TO FILE ON APP LOAD
//////////////////////////////////////////////////////////
let textToWrite = 'I will write this to file via a stream';
const writeStream = fs.createWriteStream('writeFile.txt');
writeStream.write(textToWrite, 'UTF8');
writeStream.end();

writeStream.on('finish', () => {
  console.log('finished writing')
})

writeStream.on('error', () => {
  console.log('err', err.stack);
})



//////////////////////////////////////////////////////////
// TRANSFER DATA FROM ONE FILE TO ANOTHER ON APP LOAD
//////////////////////////////////////////////////////////
const transferRead = fs.createReadStream('input.txt');
const transferWrite = fs.createWriteStream('output.txt');
transferRead.pipe(transferWrite);


//////////////////////////////////////////////////////////
// CHAIN PIPES TO TRANSFORM DATA
//////////////////////////////////////////////////////////
fs.createReadStream('big.file')
  .pipe(zlib.createGzip())
  .pipe(fs.createWriteStream('big.file.gz'))




server.listen(8000);