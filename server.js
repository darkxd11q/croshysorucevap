const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use(express.static('public'));

let aktifSoru = null;

io.on('connection', (socket) => {
    console.log('Yeni bağlantı sağlandı:', socket.id);

    // ADMİN: Yeni soruyu yayıncıya yollar
    socket.on('admin_soru_yayinla', (soruData) => {
        aktifSoru = soruData;
        io.emit('oyuncuya_soru_goster', soruData);
    });

    // YAYINCI: Şıklardan birine tıklar (Cevap verir)
    socket.on('oyuncu_cevap_gonder', (cevapMetni) => {
        io.emit('admin_canli_cevap_gor', cevapMetni);
    });

    // ADMİN: İpucunu yayıncının ekranında açar
    socket.on('admin_ipucu_goster', () => {
        if(aktifSoru && aktifSoru.ipucu) {
            io.emit('oyuncuya_ipucu_goster', aktifSoru.ipucu);
        }
    });

    // ADMİN: Doğru cevabı yayıncının ekranında patlatır
    socket.on('admin_cevabi_goster', () => {
        if(!aktifSoru) return;
        io.emit('oyuncuya_cevabi_goster', aktifSoru.dogruCevap);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`🚀 Sistem aktif: http://localhost:${PORT}`);
});