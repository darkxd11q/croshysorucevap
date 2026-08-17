const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

io.on('connection', (socket) => {
    console.log('Yeni bağlantı:', socket.id);

    // Yayıncı soruyu yayına alır
    socket.on('admin_soru_yayinla', (soruData) => {
        io.emit('izleyiciye_soru_goster', soruData);
    });

    // İzleyici cevap gönderdiğinde sadece admine ilet
    socket.on('izleyici_cevap_gonder', (cevapData) => {
        io.emit('admin_canli_cevap_gor', cevapData);
    });

    // Yayıncı doğru cevabı gösterdiğinde tüm izleyicilere ilet
    socket.on('admin_cevabi_goster', (dogruCevapIndex) => {
        io.emit('izleyiciye_cevabi_goster', dogruCevapIndex);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Sistem http://localhost:${PORT} adresinde çalışıyor.`);
});