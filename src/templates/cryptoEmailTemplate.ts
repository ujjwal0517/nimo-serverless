export const generateEmailContent = (cryptoName: string, price: number) => {
    return {
        subject: `Crypto Price Alert: ${cryptoName}`,
        body: `The current price of ${cryptoName} is $${price} usd.`
    }
}