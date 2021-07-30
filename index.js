const TelegramApi = require('node-telegram-bot-api');
const {gameOptions, againOptions} = require('./options.js')
const token = '1911080723:AAEmgxEBnGbP80PJvJDRsukEoJPN4iDsZNg';

const bot = new TelegramApi(token, {polling:true});

const chats = {};

const startGame = async (chatId) => {
    await bot.sendMessage(chatId,'Сейчас я загадаю число от 0 до 9');
    const randomNumb = Math.floor(Math.random() * 10);
    chats[chatId] = randomNumb;
    await  bot.sendMessage(chatId,'Отгадывай',gameOptions);
}

const start = () => {

    bot.setMyCommands([
        {command: '/start',description:'Приветствие'},
        {command: '/info',description:'Получить информацию о боте'},
        {command: '/game',description:'Игра отгадай цифру'}
    ])
    
    bot.on('message',async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;
        
        if(text === '/start') {
           return bot.sendMessage(chatId,'Добро пожаловать гандон')
           return bot.sendSticker(chatId,'https://cdn.tlgrm.ru/stickers/dc7/a36/dc7a3659-1457-4506-9294-0d28f529bb0a/192/1.webp')
        }
        if(text === '/info'){
           return   bot.sendMessage(chatId,`Тебя зовут ${msg.from.first_name }  ${msg.from.last_name}`)
        }
        if(text === '/game'){
           return startGame(chatId);
        }
        return bot.sendMessage(chatId,'I dont understand you!');
    })

    bot.on('callback_query',msg => {
        const data= msg.data;
        const chatId = msg.message.chat.id;
        if(data == '/again') {
            return startGame(chatId);
        }
        if (data === chats[chatId]){
            return bot.sendMessage(chatId,`Поздравляю ты отгадал цифру ${chats[chatId]}`,againOptions);
        }
        else{
            return bot.sendMessage(chatId,`К сожалению ты не угадал, я загадал цифру ${chats[chatId]}`,againOptions);
        }
    })
}

start()