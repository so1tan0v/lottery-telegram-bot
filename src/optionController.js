const {bot}   = require('./../Application/Application');
const options = require('./../src/options');

const Users           = require('../class/Users');
const Lotteries       = require('../class/Lotteries');
const Lotteries_Users = require('../class/Lotteries_Users')

const staticConf = require('./../config/static');


module.exports = async function(msg) {
    const data   = msg.data;
    const chatId = msg.from.id;

    let users    = await Users.getByChatId(chatId),
        userId   = users?.data?.dataValues?.id;

    const buttonType    = data.split('_')[0],
          type          = data.replace(new RegExp(`${data.split('_')[0]}_`, 'g'), ''),
          buttonValue   = type.split('_')[0];

    if(staticConf.removeMessageWhenSelectOption)
        await bot.deleteMessage(chatId, msg.message.message_id);

    try {
        switch (buttonType) {
            case 'deleteMessage':
                await bot.deleteMessage(chatId, msg.message.message_id);
                break;
            case 'noAction':
                // ничего не происходит
                break;
            case 'rules':
                await bot.sendMessage(chatId, 'Сообщения правил')
                break;
            case 'reports':
                await bot.sendMessage(chatId, 'Сообщение отчетов');
                await bot.sendMessage(chatId, 'Вы участвовали в розыгрышах:', await options.getUserHistoryOption(userId));
                break;
            case 'participateInLottery':
                const availableLotteries = await Lotteries.getLotteries(0);
                if(availableLotteries.length === 0) {
                    await bot.sendMessage(chatId, 'Нет доступных розыгрышей.');
                    break;
                }
                if(availableLotteries.length > 1) {
                    await bot.sendMessage(chatId, 'Выберите розыгрыш!', options.getLotteryOption(availableLotteries));
                } else {
                    const lottery = availableLotteries[0].dataValues;
                    const userAssignedInLottery = await Lotteries_Users.getByIdAndUserId(lottery?.id, userId);
                    if(userAssignedInLottery.length > 0) {
                        await bot.sendMessage(chatId, `Вы уже являетесь участником`)
                        break;
                    }
                    await Lotteries_Users.assignCompetitor(lottery?.id, userId);
                    await bot.sendMessage(chatId, `Вы стали участником: ${lottery.name}`)
                }
                break;
            case 'selectLottery':
                const lottery = (await Lotteries.getById(buttonValue))?.data?.dataValues;
                const userAssignedInLottery = await Lotteries_Users.getByIdAndUserId(lottery?.id, userId);
                if(userAssignedInLottery.length > 0) {
                    await bot.sendMessage(chatId, `Вы уже являетесь участником`)
                    break;
                }
                await Lotteries_Users.assignCompetitor(buttonValue, userId);
                await bot.sendMessage(chatId, `Вы стали участником: ${lottery?.name}`)
                break;
            default:
                await bot.sendMessage(chatId, `Прошу прощения, я вас не понял.`);
                return;
        }
    } catch (e) {
        await bot.sendMessage(chatId, 'Произошел отвал. Напиши Фарычу (@so1tan0v)');
    }
}