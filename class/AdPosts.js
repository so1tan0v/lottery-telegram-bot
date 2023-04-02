const {
    AdPosts: modelAdPosts,
    AdPosts_Files: modelAdPosts_Files
} = require('../Application/models');

class AdPosts {
    constructor(data) {
        this.data = data;
    }

    static async getById(id) {
        return new Promise(async (resolve, reject) => {
            try {
                resolve(new AdPosts(await modelAdPosts.findOne({
                    where: {
                        id
                    }
                })));
            } catch (e) {
                reject('Отвал');
            }
        })
    }

    static async getPosts (isSent = null) {
        return new Promise(async (resolve, reject) => {
            try {
                let condition = {
                    where: {}
                };
                if(isSent !== null)
                    condition.where = {
                        isSent: isSent
                    }

                resolve(await modelAdPosts.findAll({
                    where   : condition?.where,
                    include : [
                        {model: modelAdPosts_Files}
                    ]
                }))
            } catch (e) {
                reject('Отвал')
            }
        })
    }
}

module.exports = AdPosts;