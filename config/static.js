/**
 * Токен Telegram-бота
 * @type {string}
 */
const token = '6014795408:AAGHVxo-ngKJxZS5a8XkZgo8TZB_MjwTBwQ';

/**
 * Подключение к базе данных
 * @type {{dbUser: string, db: string, dbPassword: string, dbHostParam: {dialect: string, port: string, host: string}}}
 */
const dbConnection = {
    db          : 'lottery',
    dbUser      : 'dbuser',
    dbPassword  : 'dbpassword',
    dbHostParam : {
        host    : 'localhost',
        port    : '3306',
        dialect : 'mysql'
    }
}

/**
 * Первоначальные команды бота
 * @type {[{description: string, command: string},{description: string, command: string},{description: string, command: string},{description: string, command: string}]}
 */
const botCommands = [
    {command: '/start',    description: 'Начало работы с ботом'},
    {command: '/info',     description: 'Информация об организаторе'},
];

/**
 * Флаг, говорящий о том, что надо удалять сообщения
 */
let removeMessageWhenSelectOption = false;

module.exports = {
    token,
    dbConnection,
    botCommands,
    removeMessageWhenSelectOption
}