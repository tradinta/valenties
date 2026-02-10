export interface ZeptoEmailOptions {
    to: { email: string; name?: string }[];
    subject: string;
    html: string;
    from: { email: string; name: string };
}

export const sendZeptoEmail = async (options: ZeptoEmailOptions) => {
    const token = "Zoho-enczapikey wSsVR61+qUT4X6oryWKqJuc8y11UAlygQUR83VfyvievG6vC8sdqkEOdBQbxH6NNGTNvFDcSoe0okUsE1TULjN8uz1EHDSiF9mqRe1U4J3x17qnvhDzPW2RbkBuKJY0OzwpunmNiEcAg+g==";

    const response = await fetch("https://api.zeptomail.com/v1.1/email", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": token
        },
        body: JSON.stringify({
            from: options.from,
            to: options.to.map(t => ({
                email_address: {
                    address: t.email,
                    name: t.name || t.email.split('@')[0]
                }
            })),
            subject: options.subject,
            htmlbody: options.html
        })
    });

    if (!response.ok) {
        const err = await response.json();
        console.error("ZeptoMail Error:", err);
        throw new Error(err.message || "Failed to send email");
    }

    return await response.json();
};
