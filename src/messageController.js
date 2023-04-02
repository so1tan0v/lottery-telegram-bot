const {bot}   = require('./../Application/Application');
const options = require('./../src/options');

const Users    = require('../class/Users');
const Lotteries = require('../class/Lotteries');
const Lotteries_Users = require('../class/Lotteries_Users')

module.exports = async function(msg) {
    const text   = msg.text;
    const chatId = msg.from.id;

    let users    = await Users.getByChatId(chatId),
        userId   = users?.data?.dataValues?.id;

    try {
        switch (text) {
            case '/start':
                const startMessage = `
Здравствуй, дорогой друг. 
Это тестовый стенд бота для розыгрышей. 
Данный бот предусматривает собой: 
1. Отображение правил
2. Отображение твоей статистики
3. Участие в конкурсах
4. Проведение рекламы

*UPD:* Все сообщения представлены в виде просто ключевых фраз, которые отображают смысл отрабатываемого (или в будущем обрабатываем) функционалом 

Все это сделано в тестовом режиме, любые предложения по работе бота можешь писать мне, *@so1tan0v*
Либо связаться со мной через Амира.

*На будущее*: 
Если все пойдет хорошо и заказчику понравится. то я сделаю админку, для заполнения: 
1. Шаблонов фраз
2. Добавление розыгрышей
3. Добавление призов за розыгрыш
4. Добавление рекламных постов
5. Построение отчетов
    `;
                await bot.sendMessage(chatId, startMessage, {parse_mode :  'Markdown'});
                // await bot.sendMessage(chatId, `Сообщение приветствия`, options.navigationButton);
                await bot.sendMessage(chatId, `Выбор`, options.startOption);

                if(!users) {
                    users = await Users.create({
                        lastName  : msg.chat.first_name,
                        firstName : msg.chat.last_name,
                        username  : msg.chat.username,
                        chatId,
                    });
                }
                return;
            case '/info':
                await bot.sendMessage(chatId, 'Здесь информация о конкурсе');
                return;
            case 'Правила':
                await bot.sendMessage(chatId, 'Сообщения правил');
                break;
            case 'Отчеты':
                await bot.sendMessage(chatId, 'Сообщение отчетов');
                await bot.sendMessage(chatId, 'Вы участвовали в розыгрышах:', await options.getUserHistoryOption(userId));
                break;
            case 'Хочу учавствовать в розыгрыше!':
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
            default:
                await bot.sendMessage(chatId, `Прошу прощения, я вас не понял.`)
                return;
        }
    } catch (e) {
        await bot.sendMessage(chatId, 'Произошел отвал. Напиши Фарычу (@so1tan0v)');
    }
}