interface EmailData {
    image?: string;
    title?: string;
    body?: string | null;
    year?: number;
}

export const emailDefaultTemplate = (data: EmailData): string => {
    const bodyContent = data.body ? data.body.replace(/\n/g, '<br>') : '';

    return `
        <!DOCTYPE html>
        <html lang="fr">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="font-family: Arial, sans-serif;margin: 0;padding: 0;background-color: #f4f4f4;">
                <div class="container" style="width: 100%;max-width: 600px;margin: 0 auto;background-color: #ffffff;border-radius: 10px;overflow: hidden;box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
                    <div class="header" style="text-align: center;padding: 20px;">
                        <img src="${data?.image}" alt="Image" style="max-width: 100%;height: 100px;border-radius: 10px;">
                    </div>
                    <div class="title" style="text-align: center;font-size: 20px;font-weight: bold;padding: 20px 0;">
                        ${data?.title}
                    </div>
                    <div class="content" style="padding: 20px;background-color: #f9f9f9;border-radius: 10px;margin: 0 20px 20px 20px;">
                        ${bodyContent}
                    </div>
                    <div class="footer" style="text-align: center;padding: 10px;font-size: 12px;color: #777;">
                        &copy; ${data?.year}
                    </div>
                </div>
            </body>
        </html>`;
};