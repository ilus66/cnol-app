import fs from 'fs';
import path from 'path';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import QRCode from 'qrcode';

const posterPath = path.join(process.cwd(), 'public', 'cnol2025-poster.jpg');
const logoPath = path.join(process.cwd(), 'public', 'logo-cnol.png');

// Fonction pour générer un nom de fichier safe à partir du nom complet (utile si besoin)
function makeSafeFileName(name) {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9\-]/g, '');
}

export async function generateBadge(userData) {
  try {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595, 842]); // format A4

    const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const { name, function: userFunction, city, email, userId } = userData;

    // Quart haut gauche : logo + titre + lieu/date
    const titleX = 20;

    // Logo CNOL
    const logoImageBytes = fs.readFileSync(logoPath);
    const logoImage = await pdfDoc.embedPng(logoImageBytes);
    const logoDims = logoImage.scale(0.2);
    page.drawImage(logoImage, {
      x: titleX,
      y: 750,
      width: logoDims.width,
      height: logoDims.height,
    });

    // Titre
    page.drawText('Congrès National d’Optique Lunetterie', {
      x: titleX,
      y: 740,
      size: 14,
      font: fontBold,
      color: rgb(0.1, 0.1, 0.1),
    });

    // Lieu et date
    page.drawText('10 – 12 octobre 2025, Rabat – Fondation Mohammed VI', {
      x: titleX,
      y: 720,
      size: 10,
      font: fontBold,
      color: rgb(0.2, 0.2, 0.2),
    });

    // Quart haut droit : affiche CNOL
    const posterImageBytes = fs.readFileSync(posterPath);
    const posterImage = await pdfDoc.embedJpg(posterImageBytes);
    const posterDims = posterImage.scale(0.21);

    const posterX = 280 + 20;
    const posterY = 840 - 420;

    page.drawImage(posterImage, {
      x: posterX,
      y: posterY,
      width: posterDims.width,
      height: posterDims.height,
    });

    // Quart bas gauche : Infos personnelles
    const infoX = 20;
    const infoY = 100;

    page.drawText(`Nom : ${name}`, {
      x: infoX,
      y: infoY + 580,
      size: 14,
      font: fontBold,
      color: rgb(0, 0, 0),
    });

    page.drawText(`Fonction : ${userFunction}`, {
      x: infoX,
      y: infoY + 560,
      size: 12,
      font: fontBold,
      color: rgb(0, 0, 0),
    });

    page.drawText(`Ville : ${city}`, {
      x: infoX,
      y: infoY + 540,
      size: 12,
      font: fontBold,
      color: rgb(0, 0, 0),
    });

    page.drawText(`Email : ${email}`, {
      x: infoX,
      y: infoY + 520,
      size: 12,
      font: fontBold,
      color: rgb(0, 0, 0),
    });

    // QR Code
    const qrCodeDataUrl = await QRCode.toDataURL(userId);
    const qrImageBytes = qrCodeDataUrl.split(',')[1];
    const qrImage = await pdfDoc.embedPng(Buffer.from(qrImageBytes, 'base64'));

    page.drawImage(qrImage, {
      x: 200,
      y: infoY + 320,
      width: 100,
      height: 100,
    });

    // Quart bas droit : Conditions et Conseils d’utilisation
    const boxX = 340;
    const boxY = 150;
    const lineHeight = 11;

    const conditions = [
      "Ce badge est personnel et non transférable.",
      "Toute reproduction est interdite.",
      "Il est obligatoire pour accéder à l'espace exposition et",
      "aux conférences générales.",
      "Ce badge ne donne pas accès aux ateliers ni aux masterclass.",
      "La participation à l'événement vaut autorisation de captation",
      "photo et vidéo pour la communication du CNOL.",
    ];

    const conseils = [
      "À plier en quatre selon les lignes indiquées.",
      "À conserver visible sur vous pendant l’événement.",
      "Présentez-le à l’entrée et aux contrôles.",
    ];

    page.drawText("Conditions d’utilisation", {
      x: boxX,
      y: boxY + (conditions.length + conseils.length) * lineHeight + 30,
      size: 10,
      font: fontBold,
      color: rgb(0, 0, 0),
    });

    conditions.forEach((line, i) => {
      page.drawText(line, {
        x: boxX,
        y: boxY + (conditions.length + conseils.length - 1 - i) * lineHeight + 10,
        size: 8,
        font: fontRegular,
        color: rgb(0.2, 0.2, 0.2),
      });
    });

    page.drawText("Conseils d’utilisation", {
      x: boxX,
      y: boxY + conseils.length * lineHeight,
      size: 10,
      font: fontBold,
      color: rgb(0, 0, 0),
    });

    conseils.forEach((line, i) => {
      page.drawText(line, {
        x: boxX,
        y: boxY + (conseils.length - 1 - i) * lineHeight - 10,
        size: 8,
        font: fontRegular,
        color: rgb(0.2, 0.2, 0.2),
      });
    });

    // Lignes de pliage
    page.drawLine({
      start: { x: 0, y: 421 },
      end: { x: 595, y: 421 },
      thickness: 0.5,
      color: rgb(0.8, 0.8, 0.8),
    });

    page.drawLine({
      start: { x: 297.5, y: 0 },
      end: { x: 297.5, y: 842 },
      thickness: 0.5,
      color: rgb(0.8, 0.8, 0.8),
    });

    // Générer le buffer PDF
    const pdfBytes = await pdfDoc.save();

    return pdfBytes;
  } catch (error) {
    console.error("❌ Erreur lors de la génération du badge :", error);
    throw error;
  }
}

// Pour tester localement (commenter ou supprimer en production)
/*
(async () => {
  await generateBadge({
    name: 'Jean Barnard',
    function: 'Opticien diplômé',
    city: 'Casablanca',
    email: 'jean.barnard@example.com',
    userId: 'cnol2025-jbarnard',
  });
})();
*/
