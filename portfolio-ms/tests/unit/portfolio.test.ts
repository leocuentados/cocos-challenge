import { Portfolio } from "../../src/portfolio/portfolio"

describe('Portfolio', () => {
    describe('Instruments', () => {
        it('should create with balance and daily balance', async () => {
            const portfolioCache = {
                userId: '123',
                portfolioId: '123',
                moneyAvailableAmount: 100,
                instruments: [
                    {
                        instrumentId: 1,
                        quantity: 10,
                        originalPrice: 10
                    },
                    {
                        instrumentId: 2,
                        quantity: 10,
                        originalPrice: 10
                    },
                    {
                        instrumentId: 3,
                        quantity: 10,
                        originalPrice: 10
                    }
                ]
            }
            const marketdataList = [
                {
                    id: 1,
                    instrumentId: 1,
                    close: 20,
                    previousClose: 10,
                    high: 30,
                    low: 10,
                    date: new Date(),
                    open: 5
                },
                {
                    id: 2,
                    instrumentId: 2,
                    close: 10,
                    previousClose: 10,
                    high: 30,
                    low: 10,
                    date: new Date(),
                    open: 5
                },
                {
                    id: 3,
                    instrumentId: 3,
                    close: 5,
                    previousClose: 10,
                    high: 30,
                    low: 10,
                    date: new Date(),
                    open: 5
                }
            ]

            const portfolio = new Portfolio(portfolioCache, marketdataList)
            expect(portfolio.getInstrument(1)!.balance).toBe(100)
            expect(portfolio.getInstrument(2)!.balance).toBe(0)
            expect(portfolio.getInstrument(3)!.balance).toBe(-50)
            expect(portfolio.getInstrument(1)!.dailyBalance).toBe(100)
            expect(portfolio.getInstrument(2)!.dailyBalance).toBe(0)
            expect(portfolio.getInstrument(3)!.dailyBalance).toBe(-50)
        })
    })
})