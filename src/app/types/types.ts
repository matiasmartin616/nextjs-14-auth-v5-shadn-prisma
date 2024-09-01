export interface SendEmailParams {
    email: string;
    sendTo?: string;
    subject: string;
    text: string;
    html?: string;
}