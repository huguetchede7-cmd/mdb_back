interface DemoWelcomeData {
    bodyData: unknown;
    QueryData: unknown;
    paramsData: unknown;
}

interface DemoWelcomeTemplateProps {
    data: DemoWelcomeData;
}

export const demoWelcomeTemplate = (data: DemoWelcomeTemplateProps): string => {
    return `<!DOCTYPE html>
                <html>
                    <head>
                    </head>
                    <body style="font-family: Arial, sans-serif;margin: 0;padding: 0;background-color: #f6f6f6;">
                        <div class="container" style="width: 100%;max-width: 600px;margin: 0 auto;padding: 7px;background-color: #ffffff;border-radius: 5px;box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                            <div class="header" style="text-align: center;">
                                <p>Body Data: </p>
                                <p>${JSON.stringify(data.data.bodyData)}</p>
                            </div>
                            <div class="header" style="text-align: center;">
                                <p>Body QueryData: </p>
                                <p>${JSON.stringify(data.data.QueryData)}</p>
                            </div>
                            <div class="header" style="text-align: center;">
                                <p>Body paramsData: </p>
                                <p>${JSON.stringify(data.data.paramsData)}</p>
                            </div>
                            <div class="content" style="padding: 20px;text-align: center;">
                                <h1>Bienvenue sur YO Business</h1>
                                <p>Nous sommes ravis de vous accueillir. Profitez de notre service.</p>
                            </div>
                        </div>
                    </body>
                </html>`;
};
