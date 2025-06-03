import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
    const { type } = await req.json();

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.ALERT_EMAIL_USERNAME,
            pass: process.env.ALERT_EMAIL_PASSWORD,
        },
    });
    console.log(transporter);
    try {
        await transporter.sendMail({
            from: '"WedDesigner Alerts" <lts-admin@lambdatechservices.com>',
            to: 'lts-admin@lambdatechservices.com',
            subject: 'New Alert',
            text: `New ${type} recorded, view immediately`,
        });
        console.log('sent');
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Email send error:', error);
        return NextResponse.json({ success: false, error });
    }
}
