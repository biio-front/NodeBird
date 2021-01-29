const AWS = require('aws-sdk');
const sharp = require('sharp');

const s3 = new AWS.S3();

exports.handler = async (event, context, callback) => {
  const Bucket = event.Records[0].s3.bucket.name; 
  const Key = decodeURIComponent(event.Records[0].s3.object.key); // original/12342.jpg // decode: 한글문제 해결
  console.log(Bucket, Key);
  const filename = Key.split('/')[Key.split('/').length - 1]; // 12342.jpg
  const ext = Key.split('.')[Key.split('.').length - 1].toLowerCase(); // jpg 확장자 소문자로
  const requiredFormat = ext === 'jpg' ? 'jpeg' : ext;
  console.log('filename', filename, 'ext', ext);

  try {
    const s3Object = await s3.getObject({ Bucket, Key }).promise();
    console.log('original', s3Object.Body.length);
    const resizedImage = await sharp(s3Object.Body)
    .resize(400, 400, { fit: 'inside' })
    .toFormat(requiredFormat)  // 다른 확장자는 그대로, jpg는 jpeg로 바꿔주기.
    .toBuffer();
    await s3.putObject({
      Bucket,
      Key: `thumb/${filename}`,
      Body: resizedImage,
    }).promise();
    console.log('put', resizedImage.length);
    return callback(null, `thumb/${filename}`);
  } catch (error) {
    console.error(error)
    return callback(error);
  }
}
//callback(에러, 성공,)