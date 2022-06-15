var fs = require('fs');
let data = require('./objectRename.json');

data.forEach(element => {
    if (fs.existsSync(element.originPath)){ 
                            
        fs.rename(element.originPath, element.destPath, (err) => {
            if (err) {console.log("Rename Not Complete")}else{
                console.log('Rename complete!');
            };
        });
        
    }
});


setTimeout(() => {
    fs.unlink('./objectRename.json', function (err) {  if (err) {  console.error(err);  } });
}, 5000);

