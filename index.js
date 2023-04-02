const {bot} = require('./Application/Application');
const {botCommands} = require('./config/static');
const sequelize = require('./Application/db');
const utils = require('./src/utils');

const messageController = require('./src/messageController');
const optionController = require('./src/optionController');

const start = async () => {

    try {
        await sequelize.authenticate();
        await sequelize.sync();
    } catch (e) {
        throw e;
    }

    await bot.setMyCommands(botCommands);

    bot.on('message', async msg => {
        const chatId = msg.chat.id;

        try {
            return messageController(msg);
        } catch (e) {
            return bot.sendMessage(chatId, 'Произошел отвал, пиши Фарычу: ' + e)
        }
    })

    bot.on('callback_query', async msg => {
        const chatId = msg.message.chat.id;

        try {
            return optionController(msg);
        } catch (e) {
            return bot.sendMessage(chatId, 'Произошел отвал, пиши Фарычу: ' + e)
        }
    })

    await utils.playLottery();
    setInterval(async () => {
        await utils.playLottery();
    }, 60000)

    await utils.sendAdvertising()
    setInterval(async () => {
        await utils.sendAdvertising()
    }, 60000 * 30)
}

start().then(() => console.log('Server starting'));


