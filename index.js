const path = require('path')
const fs = require('fs')
var http = require('http');
let request = require('request');
let indexHtml = fs.readFileSync('index.html')

let mainJs = fs.readFileSync('main.js')

let cssFile = fs.readFileSync('style.css')
let htmlFile = fs.readFileSync('index.html')
let imgUrl = fs.readdirSync(__dirname + '/img')
let imgMass = []
let imgDesc = JSON.parse(fs.readFileSync('imgDesc.json'))


for (i = 0; i < imgUrl.length; i++) {
    imgMass.push(fs.readFileSync(`img/${imgUrl[i]}`))

}





http.createServer(function (req, res) {

    if (/img[0-9]+\.jpg/.test(req.url)) {
        let imgNumber = req.url.match(/\d+/)[0]

        res.end(imgMass[imgNumber])

    } else

    if (req.url == '/') {
        res.write(htmlFile)
        res.end()
    } else

    if (req.url == '/main.js') {
        res.write(mainJs)
        res.end()
    } else

    if (req.url == '/style.css') {
        res.write(cssFile)
        res.end()
    } else


    if (req.url == '/imgUrl') {
        res.write(JSON.stringify(imgUrl))
        res.end()
    }
    if (req.url == '/imgDesc') {
        res.write(JSON.stringify(imgDesc))
        res.end()
    }




}).listen(80)

var download = function (uri, filename, callback) {
    request.head(uri, function (err, res, body) {
        //  console.log('content-type:', res.headers['content-type']);
        // console.log('content-length:', res.headers['content-length']);

        request(uri).pipe(fs.createWriteStream(`img/${filename}`)).on('close', function() {
            imgUrl = fs.readdirSync(__dirname + '/img')
            imgMass.push(fs.readFileSync(`img/${imgUrl[imgUrl.length-1]}`))
           

        });
    });
};



var TelegramBot = require('node-telegram-bot-api');
var token = '1309347504:AAGnJUd0sNikS6lN5PhUxq641h8Lfwh2TEQ';

var bot = new TelegramBot(token, {
    polling: true
});

let peopleStatus = {};
let peoplePhoto = {}
let peopleDesc = {}



bot.on('message', async function (data) {




    //  console.log(data)
    let writerId = data.from.id;
    let writerText = data.text;

    if (peopleStatus.hasOwnProperty(writerId)) {


    } else {
        peopleStatus[writerId] = 0
    }



    if (data.photo && data.photo[0]) {

        peoplePhoto[writerId] = data;


        peopleStatus[writerId] = 1;
        bot.sendMessage(writerId, "Name?")

    } else {
        if (peopleStatus[writerId] == 0) {
            bot.sendMessage(writerId, "Send Photo")

        } else
        if (peopleStatus[writerId] == 1) {
            bot.sendMessage(writerId, "Description...")
            peopleStatus[writerId] = 2;
            peopleDesc[writerId] = [];
            peopleDesc[writerId][0] = writerText;

        } else
        if (peopleStatus[writerId] == 2) {
            bot.sendMessage(writerId, "All done!")
            peopleStatus[writerId] = 0;
            peopleDesc[writerId][1] = writerText;


            function downloadImage(dataSaved) {

                request(`https://api.telegram.org/bot${token}/getFile?file_id=${dataSaved.photo[0].file_id}`, function (error, response, body) {
                    let filePath = JSON.parse(body).result.file_path;
                    let url = `https://api.telegram.org/file/bot${token}/${filePath}`;
                    download(url, `img${imgUrl.length}.jpg`)


                    
                    //console.log(`THIS IS FOR REQUEST https://api.telegram.org/bot${token}/getFile?file_id=${data.photo[0].file_id}`)
                });
            }

          //  console.log(peoplePhoto[writerId])
            downloadImage(peoplePhoto[writerId]);




            imgDesc.title.push(peopleDesc[writerId][0]);
            imgDesc.desc.push(peopleDesc[writerId][1]);
            let _write = JSON.stringify(imgDesc)
            fs.writeFileSync('imgDesc.json',_write , () =>{
             
            })
            
          

        }




    }

})