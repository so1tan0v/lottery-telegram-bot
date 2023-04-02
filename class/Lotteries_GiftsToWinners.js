const {Lotteries_GiftsToWinners: modelLotteries_GiftsToWinners} = require('../Application/models');

class Lotteries {
    constructor(data) {
        this.data = data;
    }

    static async getById(id) {
        return new Promise(async (resolve, reject) => {
            try {
                resolve(new Lotteries(await modelLotteries.findOne({
                    where: {
                        id
                    }
                })));
            } catch (e) {
                reject('Отвал');
            }
        })
    }

    static async getByLotteryId (lotteryId) {
        return new Promise(async (resolve) => {
            resolve(await modelLotteries_GiftsToWinners.findAll({
                where: {
                    master_id: lotteryId
                }
            }))
        })
    }
}

module.exports = Lotteries;