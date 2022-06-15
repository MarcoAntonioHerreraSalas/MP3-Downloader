const puppeteer = require('puppeteer');
var opn = require('opn');
var fs = require('fs');
var request = require('request');
const inquirer = require('inquirer');
const path = require('path');
const { DownloaderHelper } = require('node-downloader-helper');

const objectRename = [];
let directorio = "";



app();
async function app(){
     fs.readFile('./directorio.txt', 'utf-8', async (err, data) =>  {
        if(err) {console.log('error: ', err);} 
        else {
            directorio = data;

            if(directorio == ''){return false};
            const questions = [
                {
                  type: 'input',
                  name: 'name',
                  message: "Que artista desea descargar? ",
                },
            ];
        
            await inquirer.prompt(questions).then(answers => {
               const artist = answers.name;
               if(artist == null){return false;}
        
               start(artist);
            });
        }
    });
    
    
    

    
    
}


async function start(artist){
    console.log("Se Comenzara a descargar Musica de: "+artist);
    const browser = await puppeteer.launch({handless:false});
    const page = await browser.newPage();
    await page.goto("https://www.youtube.com/results?search_query="+artist+"+lyrics")

    const videos = await page.evaluate(() =>{
        return Array.from(document.querySelectorAll("#video-title"))
        .map(x => ( {href: x.getAttribute("href"),title: x.getAttribute("title")}) );
    })

  
    console.log("Lista Artista Completa");
    download(videos,artist);
    await browser.close();
};


async function download(videos,artist){
    const folder = directorio+"/"+artist+"/";

    if (!fs.existsSync(folder)){ fs.mkdirSync(folder);}
    if(fs.existsSync('./objectRename.json')) {
        fs.unlink('./objectRename.json', function (err) {  if (err) {  console.error(err);  } });
    } 

    const browser = await puppeteer.launch({handless:false});
    const page = await browser.newPage();
    
    console.log("Comenzando descarga de la lista");
    videos.forEach(element => { console.log('\x1b[33m%s\x1b[0m', "  "+element.title);});
    for (const video of videos) {
        if(video){
            
            if(video.href != null){

                await page.goto("https://www.ytmp3.cc")
                await delay(2000);
                await page.type("#input","https://www.youtube.com/"+video.href);
               // await page.screenshot({path: "screenshots/"+video.title +"antes.png"});
                await page.click("#submit");
                await delay(2000);
                //await page.screenshot({path: "screenshots/"+video.title +"despues.png"});
                const urlDownload = await page.evaluate(() => {
                    return document.querySelector("#download").getAttribute("href");
                })

                //opn(urlDownload, {app: 'Chrome'});

 
                try{
                    
                    
                    const dl = new DownloaderHelper(urlDownload, folder);

                    dl.on('error', (err) => console.log('\x1b[31m%s\x1b[0m','Fallo la descarga con el titulo: '+video.title));
                    dl.on('end', (end) => {
                        console.log('\x1b[32m%s\x1b[0m','Se descargo correctamente: '+video.title);
                        objectRename.push({
                            originPath: end.filePath,
                            destPath: folder + video.title + ".mp3"
                        })
                       


                        fs.writeFile('./objectRename.json', JSON.stringify(objectRename), function (err) {
                            if (err) throw err;
                        });

                    });
                    
                    
                    dl.start().catch(err => console.error(""));


                   
                }catch(e){
                    console.log('\x1b[31m%s\x1b[0m',"sucedio un error con el titulo: " + video.title)
                }
                


                await delay(2000);
                //await page.screenshot({path: "screenshots/"+video.title +"descarga.png"});
                

                
            }
        }

    }
    //console.log("Los titulos se estan renderizando espera por favor...");
    await browser.close();

    
    
}


function delay(time) {
    return new Promise(function(resolve) { 
        setTimeout(resolve, time)
    });
 }




