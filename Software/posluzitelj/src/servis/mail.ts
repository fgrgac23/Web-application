import nodemailer from "nodemailer";
import { Konfiguracija } from "../zajednicko/konfiguracija.js";

export async function posaljiMail(
	primatelj: string,
	naslov: string,
	sadrzaj: string,
	konfObj: Konfiguracija
): Promise<void> {
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
