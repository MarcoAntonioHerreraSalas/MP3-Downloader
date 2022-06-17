var fs = require('fs');


fs.readFile('./directorio.txt', 'utf-8', async (err, data) =>  {
    if(err) {console.log('error: ', err);} 
    else {
       let directorio = data;
        
        fs.readdir(directorio, function (err, folders) {
            if (err) { console.log('Unable to scan directory: ' + err);}else{

                folders.forEach(function (folder) {
                    
                    //console.log(folder); 
                    
                    let folderPath  = (directorio+folder+"/").replace(/\\/g, "/");

                    fs.readdir(folderPath, function (err, files) {
                        if (err) {return console.log('Unable to scan directory: ' + err);} 
            
                        files.forEach(function (file) {
                            
                            //console.log(file); 
                            // fileName = file.replace(/%20/g, " ").replace(/%29/g, ")")
                            // .replace(/%28/g, "(").replace(/.mp3/g, "") +".mp3";

                            fileName =  decodeURI(file).replace(/.mp3/g, "" )  +".mp3" ;
                            fs.rename(folderPath +file, folderPath + fileName, function(err) {
                                if ( err ) console.log('ERROR: ' + err);
                            });
                            
                        });
                    });
    
    
                });
            } 
            
        });
    }
});