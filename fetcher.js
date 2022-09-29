const request = require('request');
const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const site = process.argv.slice(2);

const intervalReference = setInterval(() => {
  process.stdout.write(`.`);
}, 5);

const writeToFile = function () {
  request(site[0], (error, response, body) => {
    if (error) {
      console.log('\nError: Website not found');
      clearInterval(intervalReference);
      process.exit();
    }
    if (response) {
      clearInterval(intervalReference);
      console.log('\nstatusCode:', response && response.statusCode, ' - You are connected!');
      if (fs.existsSync(site[1])) {
        rl.question(`File already exists, do you want to overwrite it? (Y / N) =>  `, (inp) => {
          if (inp === 'Y') {
            fs.writeFile(site[1], body, error => {
              if (error) {
                console.log(error);
              } else {
                console.log('\nFile written successfully');
                console.log(`Downloaded and saved ${body.length} to ${site[1]}`);
                process.exit();
              }
            });
          } else {
            process.exit();
          }
        })
      } else {
        fs.writeFile(site[1], body, error => {
          if (error) {
            console.log(error);
          } else {
            console.log('\nFile written successfully');
            console.log(`Downloaded and saved ${body.length} to ${site[1]}`);
            process.exit();
          }
        });
      }
    }
  });
}

writeToFile();

console.log('Fetching Data');