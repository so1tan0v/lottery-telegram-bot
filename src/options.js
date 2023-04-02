const Lotteries_Users = require('../class/Lotteries_Users');

async function getUserHistoryOption(userId) {
    let option = {
        reply_markup: {
            inline_keyboard: []
        }
    }

    const data = await Lotteries_Users.getByUserId(userId);

    for(let item of data) {
        const lottery = item?.Lottery?.dataValues,
              lottery_user = item?.dataValues,
              lottery_gift = item?.Lottery_GiftsToWinners?.dataValues,
              messageText  = `${lottery?.name} - 
                              ${lottery?.isCompleted 
                                    ? `завершен ${+lottery_user.isWinner === 1 
                                                    ? `выиграл - ${lottery_gift?.name}` 
                                                    : 'не выиграл'}` 
                                    : 'не завершен'}`;

        option
            .reply_markup
            .inline_keyboard
            .push([{
                text          : messageText,
                callback_data : `noAction_${lottery?.dataValues?.id}`
            }])
    }

    return option;
}

function getLotteryOption(lotteries) {
    let lotteryOption = {
        reply_markup: {
            inline_keyboard: []
        }
    }

    lotteries.forEach(item => {
        lotteryOption
            .reply_markup
            .inline_keyboard
            .push([{
                text          : `${item?.dataValues?.name}`,
                callback_data : `selectLottery_${item?.dataValues?.id}`
            }])
    })

    return lotteryOption;
}

const navigationButton = {
    reply_markup: JSON.stringify({
        keyboard: [
            [{text: 'Правила'}, {text: 'Отчеты'}],
            [{text: 'Хочу учавствовать в розыгрыше!'}]
        ]
    })
}

const startOption = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{text: 'Правила', callback_data: 'rules'}, {text: 'Отчеты', callback_data: 'reports'}],
            [{text: 'Хочу учавствовать в розыгрыше!', callback_data: 'participateInLottery'}]
        ],

    })
}

module.exports = {
    startOption,
    getLotteryOption,
    getUserHistoryOption,
    navigationButton,
}
