const Lotteries = require('../class/Lotteries');
const Lotteries_Users = require('../class/Lotteries_Users');
const Lotteries_GiftsToWinners = require('../class/Lotteries_GiftsToWinners');

const AdPosts = require('../class/AdPosts');

const Users = require('../class/Users');

const {bot} = require('../Application/Application')
/**
 * Получение случайного ключа массива
 * @param arr
 * @return {*}
 */
function arrayRandElement(arr) {
    return Math.floor(Math.random() * arr.length);
}

async function playLottery() {
    const readyToPlayLotteries = await Lotteries.getLotteries(0, true);
    for(let item of readyToPlayLotteries) {
        const gifts = await Lotteries_GiftsToWinners.getByLotteryId(item?.dataValues?.id);
        for(let gift of gifts) {
            let allParticipantNotWinner = await Lotteries_Users.getByLotteryId(item?.dataValues?.id, false);
            const winnerKey = arrayRandElement(allParticipantNotWinner);
            if(allParticipantNotWinner[winnerKey]) {
                await bot.sendMessage(allParticipantNotWinner[winnerKey]?.User?.dataValues?.chatId, `Поздравляю! Ты выиграл! Твой приз ${gift?.dataValues?.giftName}`)
                await allParticipantNotWinner[winnerKey].update({
                    isWinner : 1,
                    gift_id  : gift?.dataValues?.id
                })
            }
        }
        item.update({
            isCompleted: 1
        })
    }
}

async function sendAdvertising () {
    const adsNotSent = await AdPosts.getPosts((0));
    if(adsNotSent.length !== 0) {
        const allUsers   = await Users.getAllUsers();
        for(let adPost of adsNotSent) {
            for(let user of allUsers) {
                let captionSent = false
                if(adPost?.AdPosts_Files.length !== 0) {
                    await bot.sendMediaGroup(
                        user?.dataValues?.chatId,
                        adPost?.AdPosts_Files.map(item => {
                            if(!captionSent) {
                                captionSent = true;
                                return {
                                    type: 'photo',
                                    media: item?.dataValues?.file_path,
                                    caption: adPost?.dataValues?.text,
                                    parse_mode :  'Markdown'
                                }
                            } else {
                                return {
                                    type: 'photo',
                                    media: item?.dataValues?.file_path,
                                }
                            }

                        }), {}
                    );
                } else {
                    await bot.sendMessage(user?.dataValues?.chatId, adPost?.dataValues?.text, {parse_mode :  'Markdown'})
                }
            }
            adPost.update({
                isSent: 1
            });
        }
    }
}



module.exports = {
    playLottery,
    sendAdvertising
}