import nodemailer from "nodemailer";
export async function posaljiMail(primatelj, naslov, sadrzaj, konfObj) {
    const konf = konfObj.dajKonf();
    const transporter = nodemailer.createTransport({
        host: konf.smtpHost,
        port: Number(konf.smtpPort),
        secure: false,
        auth: {
            user: konf.smtpUser,
            pass: konf.smtpPass,
        },
    });
    await transporter.sendMail({
        from: konf.smtpUser,
        to: primatelj,
        subject: naslov,
        text: sadrzaj,
    });
}
//# sourceMappingURL=mail.js.map