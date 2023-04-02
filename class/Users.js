const {Users: modelClient} = require('../Application/models');

class Users {
    constructor(client) {
        this.data = client;
    }

    async update(params) {
        this.data = await this.data.update(params);
    }

    static async getById (id) {
        let client = await modelClient.findOne({where: {id: id}})

        return client
            ? new Users(client)
            : null
    }

    static async getByChatId (chatId) {
        let client = await modelClient.findOne({where: {chatId: chatId}})

        return client
            ? new Users(client)
            : null
    }

    static async getAllUsers () {
        return await modelClient.findAll();
    }

    static async create(params) {
        let client = await modelClient.create(params)

        return new Users(client);
    }


}

module.exports = Users