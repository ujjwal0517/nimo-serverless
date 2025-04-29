export const generateEmailContent = (crypto: string, price: number) => {
    return {
        subject: `Crypto Price Alert: ${crypto}`,
        body: `The current price of ${crypto} is $${price} usd.`
    }
}