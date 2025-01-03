import { Test } from "../../src/entities/test"

describe('Test Entity', () => {
    beforeAll(async () => {
    })
    afterAll(async () => {
    })

    describe('Hello World', () => {
        it('constructor', async () => {
            const test = new Test()
            expect(test !== null).toBeTruthy()
        })
    })
})