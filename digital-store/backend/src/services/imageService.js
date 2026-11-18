const fs = require('fs');
const path = require('path');

const UPLOAD_FOLDER = path.join(__dirname, '..', '..', 'public', 'media', 'uploads');

/**
 * Salva uma imagem enviada em base64 e devolve o caminho relativo que vai para o banco.
 * Exemplo de imagem recebida: { type: "image/png", content: "iVBORw0KGgo..." }
 * Se o content já for uma URL (http...), ela é guardada como está.
 */
function saveImage(image) {
  if (image.content.startsWith('http')) {
    return image.content.replace(`${process.env.APP_URL}/`, '');
  }

  const extension = image.type.split('/')[1]; // "image/png" -> "png"
  const fileName = `${Date.now()}-${Math.round(Math.random() * 1e6)}.${extension}`;

  fs.mkdirSync(UPLOAD_FOLDER, { recursive: true });
  fs.writeFileSync(path.join(UPLOAD_FOLDER, fileName), Buffer.from(image.content, 'base64'));

  return `media/uploads/${fileName}`;
}

// Transforma o caminho salvo no banco em uma URL completa para o front
function imageUrl(imagePath) {
  if (imagePath.startsWith('http')) return imagePath;
  return `${process.env.APP_URL}/${imagePath}`;
}

module.exports = { saveImage, imageUrl };
