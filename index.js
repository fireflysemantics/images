var fs = require("fs");
const globby = require("globby");
const del = require('delete');
const jimp = require("jimp");

const JPG_PATTERN = "**/*.jpg";
const PNG_PATTERN = "**/*.png";

const IGNORE_PNG_PATTERN = "**/*.min.png";
const IGNORE_JPG_PATTERN = "**/*.min.jpg";

const model = {}
model.images = []
const paths = globby.sync([PNG_PATTERN, JPG_PATTERN], {ignore: [IGNORE_PNG_PATTERN, IGNORE_JPG_PATTERN, 'node_modules/**/*.*']});
console.log(paths);
paths.forEach(path => {
  const resizePath = resize(path)
  model.images.push(path)
  model.images.push(resizePath)
});

fs.writeFileSync('model.json', JSON.stringify(model))

/**
 * Get the file extension
 *
 * @param {*} path
 */
function getExtension(path) {
  return path.split(".").pop();
}

function resize(path) {
  const extension = getExtension(path);
  const outputPath = path.replace(extension, `min.${extension}`);
  del.sync(outputPath)

  jimp.read(path, (err, img) => {
    if (err) throw err;
    img
      .resize(64, 36) // resize 16/9
      .quality(20) // set JPEG quality
      .greyscale() // set greyscale
      .write(outputPath);
  });
  return outputPath
}
