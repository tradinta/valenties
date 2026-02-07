import { SendMailClient } from "zeptomail";

const url = "https://api.zeptomail.com/"; // Check region if needed (e.g., .eu)
const token = process.env.ZEPTOMAIL_TOKEN || "";

export const mailClient = new SendMailClient({ url, token });

export const sendTrapNotification = async (
    to: string,
    creatorName: string,
    partnerName: string,
    stats: any
) => {
    try {
        const client = new SendMailClient({ url, token });
        const result = await client.sendMail({
            from: {
                address: "noreply@yourdomain.com", // Replace with verified sender
                name: "Valentine Trap"
            },
            to: [
                {
                    email_address: {
                        address: to,
                        name: creatorName
                    }
                }
            ],
            subject: `${partnerName} said YES! ❤️`,
            htmlbody: `
                <div>
                    <h1>Hooray! ${partnerName} said YES!</h1>
                    <p>It took them ${stats.timeToYes} seconds and ${stats.attempts} attempts to click No (which they failed at!).</p>
                    <p>Happy Valentine's Day!</p>
                </div>
            `,
        });
        return result;
    } catch (error) {
        console.error("Email failed", error);
        return null; // Don't crash app on email fail
    }
}
