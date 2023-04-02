const sequelize = require('./db')
const {DataTypes} = require("sequelize")

const sqlNow = sequelize.fn('now');

const rbStages = sequelize.define('rbStage', {
    id    : {type: DataTypes.INTEGER, primaryKey: true, unique: true, autoIncrement: true, comment: 'Идентификатор записи'},
    code  : {type: DataTypes.STRING,                                                       comment: 'Код статуса'},
    name  : {type: DataTypes.STRING,                                                       comment: 'Наименование статуса'}
}, {
    timestamps : false,
    comment    : 'Справочник стадии пользователя'
})

const Users = sequelize.define('Users', {
    id        : {type: DataTypes.INTEGER, primaryKey: true, unique: true, autoIncrement: true, comment: 'Идентификатор записи'},
    chatId    : {type: DataTypes.STRING,  unique: true, index: 'client_chat_id',               comment: 'Идентификатор чата'},
    lastName  : {type: DataTypes.STRING,                                                       comment: 'Имя пользователя'},
    firstName : {type: DataTypes.STRING,                                                       comment: 'Фамилия пользователя'},
    username  : {type: DataTypes.STRING,                                                       comment: 'Идентификатор пользователя в Telegram'}
}, {
    timestamps : false,
    comment    : 'Пользователи, зарегистрированные в системе розыгрышей'
})
Users.belongsTo(rbStages, {
    foreignKey: 'stage_id'
})

const Lotteries = sequelize.define('Lotteries', {
    id             : {type: DataTypes.INTEGER, primaryKey: true, unique: true, autoIncrement: true, comment: 'Идентификатор записи'},
    createDatetime : {type: DataTypes.DATE,       defaultValue: sqlNow,                             comment: 'Дата создания записи'},
    name           : {type: DataTypes.STRING,                                                       comment: 'Наименования розыгрыша'},
    begDate        : {type: DataTypes.DATE,                                                         comment: 'Дата начала розыгрыша'},
    endDate        : {type: DataTypes.DATE,                                                         comment: 'Дата окончания розыгрыша'},
    isCompleted    : {type: DataTypes.TINYINT(1), defaultValue: 0,                                  comment: 'Розыгрыш завершен'}
}, {
    timestamps : false,
    comment    : 'Проводимые розыгрыши'
})

const Lotteries_GiftsToWinners = sequelize.define('Lotteries_GiftsToWinners', {
    id             : {type: DataTypes.INTEGER, primaryKey: true, unique: true, autoIncrement: true, comment: 'Идентификатор записи'},
    createDatetime : {type: DataTypes.DATE, defaultValue: sqlNow,                                   comment: 'Дата создания записи'},
    master_id      : {type: DataTypes.INTEGER,                                                      comment: 'Идентификатор розыгрыша'},
    place          : {type: DataTypes.INTEGER,                                                      comment: 'Место в соревнованиях'},
    giftName       : {type: DataTypes.STRING,                                                       comment: 'Наименования приза'}
}, {
    timestamps : false,
    comment    : 'Выигрыш по розыгрышу'
})
Lotteries_GiftsToWinners.belongsTo(Lotteries, {
    foreignKey: 'master_id'
})

const Lotteries_Users = sequelize.define('Lotteries_Users', {
    id             : {type: DataTypes.INTEGER, primaryKey: true, unique: true, autoIncrement: true, comment: 'Идентификатор записи'},
    createDatetime : {type: DataTypes.DATE,       defaultValue: sqlNow,                             comment: 'Дата создания записи'},
    master_id      : {type: DataTypes.INTEGER,                                                      comment: 'Идентификатор розыгрыша'},
    user_id        : {type: DataTypes.INTEGER,                                                      comment: 'Идентификатор пользователя'},
    isWinner       : {type: DataTypes.TINYINT(1), defaultValue: 0,                                  comment: 'Победитель'},
    gift_id        : {type: DataTypes.INTEGER,    defaultValue: null,                               comment: 'Выигрыш'},
}, {
    timestamps : false,
    comment    : 'Участники розыгрыша'
})
Lotteries_Users.belongsTo(Lotteries_GiftsToWinners, {
    foreignKey: 'gift_id'
})
Lotteries_Users.belongsTo(Lotteries, {
    foreignKey: 'master_id'
})
Lotteries_Users.belongsTo(Users, {
    foreignKey: 'user_id'
})

const AdPosts = sequelize.define('AdPosts', {
    id             : {type: DataTypes.INTEGER, primaryKey: true, unique: true, autoIncrement: true, comment: 'Идентификатор записи'},
    createDatetime : {type: DataTypes.DATE, defaultValue: sqlNow,                                   comment: 'Дата создания записи'},
    text           : {type: DataTypes.STRING,                                                       comment: 'Текст поста'},
    isSent         : {type: DataTypes.TINYINT(1), defaultValue: 0,                                     comment: 'Статус отправления поста (0 - не отправлен, 1 - отправлен)'}
}, {
    timestamps : false,
    comment    : 'Рекламные посты'
})

const AdPosts_Files = sequelize.define('AdPosts_Files', {
    id             : {type: DataTypes.INTEGER, primaryKey: true, unique: true, autoIncrement: true, comment: 'Идентификатор записи'},
    createDatetime : {type: DataTypes.DATE, defaultValue: sqlNow,                                   comment: 'Дата создания записи'},
    master_id      : {type: DataTypes.INTEGER,                                                      comment: 'Идентификатор рекламного поста'},
    file_path      : {type: DataTypes.STRING,                                                       comment: 'Путь до файла'}
}, {
    timestamps : false,
    comment    : 'Пути до файлов рекламных постов'
})
AdPosts.hasMany(AdPosts_Files, {
    foreignKey: 'master_id'
});
AdPosts_Files.belongsTo(AdPosts, {
    foreignKey: 'master_id'
})

module.exports = {
    rbStages,
    Users,
    Lotteries,
    Lotteries_GiftsToWinners,
    Lotteries_Users,
    AdPosts,
    AdPosts_Files
};