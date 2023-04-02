const {Lotteries: modelLotteries} = require('../Application/models');
const { Op } = require("sequelize");

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

    static async getLotteries (isCompleted = null, readyToPlay = false) {
        return new Promise(async (resolve, reject) => {
            try {
                let condition = {};
                if(isCompleted !== null)
                    condition.where = {
                        isCompleted
                    }
                if(readyToPlay) {
                    condition.where.endDate = {
                        [Op.lte]: new Date()
                    }
                }

                resolve(await modelLotteries.findAll(condition))
            } catch (e) {
                reject('Отвал')
            }
        })
    }
}

module.exports = Lotteries;