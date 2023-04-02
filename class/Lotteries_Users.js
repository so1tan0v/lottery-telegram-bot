const { Lotteries_Users: modelLotteries_Users } = require('../Application/models')
const { Users: modelUsers } = require('../Application/models')
const { Lotteries: modelLotteries } = require('../Application/models')
const { Lotteries_GiftsToWinners: modelLotteries_GiftsToWinners } = require('../Application/models')

class Lotteries_Users {
    constructor(data) {
        this.data = data
    }

    static async assignCompetitor (lotteryId, userId) {
        return new Promise(async (resolve) => {
            const data = await modelLotteries_Users.create({
                master_id : lotteryId,
                user_id   : userId
            });
            resolve(new Lotteries_Users(data));
        })
    }

    static async getByIdAndUserId (lotteryId, userId) {
        return new Promise(async (resolve) => {
            const data = await modelLotteries_Users.findAll({
                where: {
                    master_id : lotteryId,
                    user_id   : userId
                },
                include: [
                    {model: modelUsers},
                    {model: modelLotteries}
                ]
            })
            resolve(data);
        })
    }

    static async getByLotteryId (lotteryId, winner = false) {
        return new Promise(async resolve => {
            const data = await modelLotteries_Users.findAll({
                where: {
                    master_id : lotteryId,
                    isWinner  : winner
                                    ? 1
                                    : 0
                },
                include: [
                    {model: modelUsers},
                    {model: modelLotteries},
                    {model: modelLotteries_GiftsToWinners}
                ]
            })
            resolve(data);
        })
    }

    static async getByUserId (userId) {
        return new Promise(async resolve => {
            const data = await modelLotteries_Users.findAll({
                where: {
                    user_id   : userId
                },
                include: [
                    {model: modelUsers},
                    {model: modelLotteries},
                    {model: modelLotteries_GiftsToWinners}
                ]
            })
            resolve(data);
        })
    }
}

module.exports = Lotteries_Users;