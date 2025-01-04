import { Portfolio } from "../../src/portfolio/portfolio"

describe('Portfolio', () => {
    describe('Portfolio', () => {
        it('should calculate current price when created', async () => {
            const portfolio = new Portfolio("", "", 100, [
                { instrumentId: "1", quantity: 1, originalPrice: 1, currentPrice: 1 },
                { instrumentId: "2", quantity: 1, originalPrice: 1, currentPrice: 1 },
                { instrumentId: "3", quantity: 1, originalPrice: 1, currentPrice: 1 },
            ])

            expect(portfolio.currentPrice).toBe(103)
        })
    })

    describe('Instrument', () => {
        it('should calculate percentage instrument balance when created', async () => {
            const portfolio = new Portfolio("", "", 0, [
                { instrumentId: "1", quantity: 1, originalPrice: 2, currentPrice: 1 },
                { instrumentId: "2", quantity: 1, originalPrice: 1, currentPrice: 0 },
                { instrumentId: "3", quantity: 1, originalPrice: 2, currentPrice: 3 },
            ])

            expect(portfolio.getInstrument("1")!.balance).toBe(-50)
            expect(portfolio.getInstrument("2")!.balance).toBe(-100)
            expect(portfolio.getInstrument("3")!.balance).toBe(50)
        })
    })
})