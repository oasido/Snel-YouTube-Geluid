'use strict';
var express = require('express');
var router = express.Router();
const youtubedl = require('youtube-dl-exec');
var ffmpeg = require('ffmpeg');
var ffprobe = require('ffprobe');
const app = require('../app');
const fs = require('fs');

var format = '';

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { titleName: 'Snel-YouTube-Geluid', description: 'Download liedjes van YouTube, simpel & veilig' });
});

router.post('/', async function (req, res, next) {
  // TODO: Get the real title & send to
  let inputBox = req.body.input_box;
  format = req.body.format_selection;
  console.log('Format: ' + format);

  if (inputBox == '') {
    res.redirect('/');
    return;
  }

  youtubedl(inputBox, {
    printJson: true,
    // noWarnings: true,
    youtubeSkipDashManifest: true,
    // F: true,
    i: true,
    x: true,
    o: '/downloads/%(title)s.%(ext)s',
    audioFormat: format,
  })
    .then((output) => {
      // console.log(require('path').resolve('./'));
      function getFile(path, timeout = 2000) {
        const intervalObj = setInterval(function () {
          const file = require('path').resolve('./') + '/downloads/' + path + '.' + format;
          const fileExists = fs.existsSync(file);

          console.log('Controleren of bestand bestaat: ', file);
          console.log('Bestaat?: ', fileExists);

          if (fileExists) {
            clearInterval(intervalObj);
            console.log('Bestand gedownload.');
            setTimeout(function () {
              res.download(file);
            }, 2000);
          }
        }, timeout);
      }

      console.log('Downloaden: functie voerd: ' + output.title);
      getFile(output.title);
      return output;
    })
    .then(function (output) {
      setTimeout(function () {
        const fileToDelete = require('path').resolve('./') + '/downloads/' + output.title + '.' + format;
        fs.unlink(fileToDelete, (err) => {
          if (err) {
            console.log('Verwijderen niet gelukt:' + err);
          } else {
            console.log('Bestand verwijdered.');
          }
        });
      }, 15000);
    })
    .catch((err) => console.log(err));
});

module.exports = router;
