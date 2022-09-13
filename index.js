import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import axios from 'axios';


const ADRESS = 'https://public.radio.co/stations/sdda8682fb/requests/tracks'; // tracks list url

const DIRNAME = path.dirname(new URL(import.meta.url).pathname); // absolute path to save file
const FILENAME = 'tracks.txt'; // save file name


async function request(url) {
    try {
        const response = await axios.get(url);
        
        if(response.status > 299 || response.status < 200) {
            let codeErr = new Error(`Something wrong. Code: ${response.status}`);
            throw codeErr;
        }
        
        return response;
    
    } catch(err) {
        throw err;
    }
}

async function saveTracks(response) {
    const destination = path.join(DIRNAME, FILENAME);

    await fs.writeFile(destination, '');
    
    let counter = 0;

    for( let track of response.data.tracks ) {
        let trackData = `${track.artist} - ${track.title}\n`;
        
        counter++

        await fs.appendFile(destination, trackData);
    }

    return counter;
}

async function parse() {
    try {
        const response = await request(ADRESS);
        let count = await saveTracks(response);
        console.log(`Done! [${count}] tracks saved`);
    
    } catch(err) {
         console.log(`${err.name}: ${err.message}`);    
    }
}

parse();






//axios
//  .get('https://public.radio.co/stations/sdda8682fb/requests/tracks')
//  .then(res => {
//    console.log(`statusCode: ${res.status}`);
//    console.log(res);
//  })
//  .catch(error => {
//    console.error(error);
//  });
