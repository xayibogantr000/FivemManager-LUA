const Discord = require('discord.js');
const client = new Discord.Client;
const config = require('./config.json');
let CurrentChannel = false;
let changedMember = [];

client.on('ready', () => {
     console.log('^1 [xayibogantr] Bot hazir!')
     exports['xayibogantr-db'].GetConfig(config);
     if (config.discord_whitelist.active) {
          on('playerConnecting', (name, setCallback, deferrals) => {
               memberList = client.guilds.members
               const guild = client.guilds.get(config.discord_whitelist.server_id);
               const src = global.source;
               deferrals.defer();
               const player = exports['xayibogantr-db'].GetDiscordFromId(src)
               deferrals.update('Discord whitelist kontrol ediliyor, lütfen bekleyiniz.')
               setTimeout(() => {
                    const discordId = player[0]
                    if (!discordId) return deferrals.done('Discord tespit edilemedi. Discordunuzu bağlayınız.');
                    const existMember = guild.members.get(discordId)
                    if (!existMember) return deferrals.done(`Lütfen discordumuza katılın.! ${config.discord_link}`);
                    const existWhitelistRole = existMember.roles.get(config.discord_whitelist.role_id)
                    const checkChangedMember = changedMember.find(member => member === discordId)
                    if (!existWhitelistRole && !checkChangedMember?.exist) return deferrals.done('Whitelist rolü bulunamadı.');
                    return deferrals.done();
               }, 1000)
          })
     }
})

client.on('guildMemberUpdate', (oldMember, newMember) => { 
     const existWhitelist = newMember.roles.has(config.discord_whitelist.role_id)
     const existChangedMember = changedMember.find(member => member.id === newMember.user.id)
     if (existChangedMember) return existChangedMember.exist = existWhitelist;
     changedMember.push({
          id: newMember.user.id,
          exist: existWhitelist
     })
})

client.on('message', msg => {
     CurrentChannel = msg.channel;
     const embed = new Discord.MessageEmbed().setFooter('xayibogantr ❤️ CityLive')
     if (msg.content.startsWith(config.prefix)) {
          const args = msg.content.substring().split(" ");
          if (msg.member.roles.find((search) => search.id == config.admin_roleid)) {
               if (args[0] == config.prefix + 'ban') {
                    if (args[1] && args[2] && args[3]) {
                         emit('xayibogantr-db:Ban', msg.member.user, args[1], args, (Number(args[2]) && args[2] || 0))
                         return false;
                    } else {
                         embed
                              .setColor('#ff0000')
                              .addField('ID', 'Lütfen kullanıcı ID`si belirtiniz.', true)
                              .addField('ZAMAN', 'Saniye cinsinden.', true)
                              .addField('SEBEP', 'Sebep giriniz.', true)
                              .setTitle('ÖRNEK \n!ban `1` `3600` `xayibogantr`')
                              .setAuthor('Yanlış Komut Kullanımı')
                         msg.channel.send(embed)
                         return false;
                    }
               } else if (args[0] == config.prefix + 'kick') {
                    if (args[1] && args[2]) {
                         emit('xayibogantr-db:Kick', msg.member.user, args[1], args)
                         return false;
                    } else {
                         embed
                              .setColor('#ff0000')
                              .setTitle('Kullanım: !kick `ID` `Sebep`')
                              .setAuthor('Yanlış Komut Kullanımı')
                         msg.channel.send(embed)
                         return false;
                    }
               } else if (args[0] == config.prefix + 'envanter') {
                    if (args[1]) {
                         return exports['xayibogantr-db'].GetInventory(args[1]);
                    } else {
                         embed
                              .setColor('#ff0000')
                              .setTitle('Kullanım: !envanter `ID` ')
                              .setAuthor('Yanlış Komut Kullanımı')
                         msg.channel.send(embed)
                         return false;
                    }
               } else if (args[0] == config.prefix + 'skriptbaşlat') {
                    if (args[1]) {
                         return exports['xayibogantr-db'].start(args[1]);
                    } else {
                         embed
                              .setColor('#ff0000')
                              .setTitle('Kullanım: !skriptbaşlat `Skript Adı`')
                              .setAuthor('Yanlış Komut Kullanımı')
                         msg.channel.send(embed)
                         return false;
                    }
               } else if (args[0] == config.prefix + 'skriptdurdur') {
                    if (args[1]) {
                         return exports['xayibogantr-db'].stop(args[1]);
                    } else {
                         embed
                              .setColor('#ff0000')
                              .setTitle('Kullanım: !skriptdurdur `Skript İsmi`')
                              .setAuthor('Yanlış Komut Kullanımı.')
                         msg.channel.send(embed)
                         return false;
                    }
               } else if (args[0] == config.prefix + 'skriptrefresh') {
                    return exports['xayibogantr-db'].refresh(args[1]);
               } else if (args[0] == config.prefix + 'kordinatbelirle') {
                    if (args[1] && args[2] && args[3] && args[4] && Number(args[2]) && Number(args[3]) && Number(args[4])) {
                         return exports['xayibogantr-db'].SetCoords(args[1], args[2], args[3], args[4]);
                    } else {
                         embed
                              .setColor('#ff0000')
                              .setTitle('Kullanım: !kordinatbelirle `ID` `x` `y` `z` Örnek: !kordinatbelirle 1 123 123 462')
                              .setAuthor('Yanlış Komut Kullanımı')
                         msg.channel.send(embed)
                         return false;
                    }
               } else if (args[0] == config.prefix + 'parabilgi') {
                    if (args[1]) {
                         return exports['xayibogantr-db'].GetMoney(args[1]);
                    } else {
                         embed
                              .setColor('#ff0000')
                              .setTitle('Kullanım: !parabilgi `ID`')
                              .setAuthor('Yanlış Komut Kullanımı')
                         msg.channel.send(embed)
                         return false;
                    }
               } else if (args[0] == config.prefix + 'paraver') {
                    if (args[1] && args[2] && args[3]) {
                         if (args[2] == 'money' || args[2] == 'bank' || (args[2] == 'black_money' || args[2] == 'crypto')) {
                              return exports['xayibogantr-db'].AddMoney(args[1], args[2], (Number(args[3]) && args[3] || 0));
                         } else {
                              embed
                                   .setColor('#ff0000')
                                   .addField('ID', 'Lütfen kullanıcı ID`si belirle.', true)
                                   .addField('STIL', 'bank, money veya black_money || crypto', true)
                                   .addField('MIKTAR', 'Miktar gir.', true)
                                   .setTitle('ÖRNEK \n!paraver `1` `bank` `31`')
                                   .setAuthor('Yanlış Komut Kullanımı')
                              msg.channel.send(embed)
                              return false;
                         }
                    } else {
                         embed
                              .setColor('#ff0000')
                              .addField('ID', 'Lütfen kullanıcı ID`si belirle.', true)
                              .addField('STIL', '**bank, money veya black_money || crypto**', true)
                              .addField('MIKTAR', 'Miktar gir.', true)
                              .setTitle('ÖRNEK \n!paraver `1` `bank` `31`')
                              .setAuthor('Yanlış Komut Kullanımı')
                         msg.channel.send(embed)
                         return false;
                    }
               } else if (args[0] == config.prefix + 'eşyaver') {
                    if (args[1] && args[2] && args[3]) {
                         if (Number(args[3]) != null) {
                              return exports['xayibogantr-db'].GiveItem(args[1], args[2], Number(args[3]));
                         } else {
                              embed
                                   .setColor('#ff0000')
                                   .setTitle('!eşyaver `ID` `Eşya` `Miktar` \nÖrnek \n!eşyaver `1` `phone` `1`')
                                   .setAuthor('Yanlış Komut Kullanımı')
                              msg.channel.send(embed)
                              return false;
                         }
                    } else {
                         embed
                              .setColor('#ff0000')
                              .setTitle('!eşyaver `ID` `Eşya` `Miktar` \nÖrnek \n!eşyaver `1` `phone` `1`')
                              .setAuthor('Yanlış Komut Kullanımı')
                         msg.channel.send(embed)
                         return false;
                    }
               } else if (args[0] == config.prefix + 'meslekver') {
                    if (args[1] && args[2] && args[3]) {
                         if (Number(args[3]) != null) {
                              return exports['xayibogantr-db'].SetJob(args[1], args[2], Number(args[3])); 
                         } else {
                              embed
                                   .setColor('#ff0000')
                                   .setTitle('!meslekver `ID ` `Meslek` `Seviye` \nÖrnek \n!meslekver `1` `police` `2`')
                                   .setAuthor('Yanlış Komut Kullanımı')
                              msg.channel.send(embed)
                              return false;
                         }
                    } else {
                         embed
                              .setColor('#ff0000')
                              .setTitle('!meslekver `ID` `Meslek` `Seviye` \nÖrnek \n!meslekver `1` `police` `2`')
                              .setAuthor('Yanlış Komut Kullanımı')
                         msg.channel.send(embed)
                         return false;
                    } 
               } else if (args[0] == config.prefix + 'parasil') {
                    if (args[1] && args[2] && args[3]) {
                         if (args[2] == 'money' || args[2] == 'bank' || args[2] == 'black_money') {
                              return exports['xayibogantr-db'].RemoveMoney(args[1], args[2], (Number(args[3]) && args[3] || 0));
                         } else {
                              embed
                                   .setColor('#ff0000')
                                   .addField('ID', 'Lütfen kullanıcı ID`si belirle.', true)
                                   .addField('STIL', 'bank, money veya black_money', true)
                                   .addField('MIKTAR', 'Miktar giriniz.', true)
                                   .setTitle('Örnek \n!parasil `1` `bank` `31`')
                                   .setAuthor('Yanlış Komut Kullanımı')
                              msg.channel.send(embed)
                              return false;
                         }
                    } else {
                         embed
                              .setColor('#ff0000')
                              .addField('ID', 'Lütfen kullanıcı ID`si belirle.', true)
                              .addField('STIL', 'bank, money or black_money', true)
                              .addField('MIKTAR', 'Miktar giriniz.', true)
                              .setTitle('Örnek \n!parasil `1` `bank` `31`')
                              .setAuthor('Yanlış Komut Kullanımı')
                         msg.channel.send(embed)
                         return false;
                    }
               } else if (args[0] == config.prefix + 'bankontrol') {
                    if (args[1]) {
                         return exports['xayibogantr-db'].GetBannedPlayer(args[1])
                    } else {
                         embed
                              .setColor('#ff0000')
                              .setTitle('Kullanım: !bankontrol `STEAM HEX`')
                              .setAuthor('Yanlış Komut Kullanımı.')
                         msg.channel.send(embed)
                         return false;
                    }
               } else if (args[0] == config.prefix + 'unban') {
                    if (args[1]) {
                         emit('xayibogantr-db:Unban', args[1])
                         return false;
                    } else {
                         embed
                              .setColor('#ff0000')
                              .setTitle('Kullanım:: !unban `STEAM HEX`')
                              .setAuthor('Yanlış Komut Kullanımı')
                         msg.channel.send(embed)
                         return false;
                    }
               } else if (args[0] == config.prefix + 'reviveall') {
                    return exports['xayibogantr-db'].ReviveAll(); 
                                   } else if (args[0] == config.prefix + 'wlver') { //
                    const member = msg.mentions.members.first();
                    if (!member) {
                         embed
                         .setColor('#ff0000')
                         .setTitle('Kullanım: !wlver `@xayibogantr`')
                         .setAuthor('Yanlış Komut Kullanımı')
                         msg.channel.send(embed)
                         return;
                    }
                    const existRole = member.roles.get(config.discord_whitelist.role_id)
                    if (existRole) {
                         embed
                         .setColor('#ff0000')
                         .setTitle('Bu kullanıcı zaten whitelist`e sahip.')
                         .setAuthor('HATA')
                         msg.channel.send(embed)
                         return;
                    }
                    member.roles.add(config.discord_whitelist.role_id)
                    embed
                         .setColor('#0094ff')
                         .setTitle(`Kullanıcı whitelist listesine eklendi.`)
                         .setAuthor('Whitelist verildi.')
                         msg.channel.send(embed)
                         return; //
                    } else if (args[0] == config.prefix + 'wlsil') { //
                         const member = msg.mentions.members.first();
                         if (!member) {
                              embed
                              .setColor('#ff0000')
                              .setTitle('Kullanım: !wlsil `@xayibogantr`')
                              .setAuthor('Yanlış Komut Kullanımı')
                              msg.channel.send(embed)
                              return;
                         }
                         const existRole = member.roles.remove(config.discord_whitelist.role_id)
                         if (existRole) {
                              embed
                              .setColor('#0094ff')
                              .setTitle(`Kullanıcı whitelist listesinden kaldırıldı.`)
                              .setAuthor('Whitelist silindi.')
                              msg.channel.send(embed)
                              return;
                         }
                         member.roles.remove(config.discord_whitelist.role_id)
                         embed
                              .setColor('#0094ff')
                              .setTitle(`Kullanıcı whitelist listesinden kaldırıldı.`)
                              .setAuthor('Whitelist silindi.')
                              msg.channel.send(embed)
                              return; //
                         
                         
               } else if (args[0] == config.prefix + 'revive') {
                    if (args[1]) {
                         return exports['xayibogantr-db'].Revive(args[1]);
                    } else {
                         embed
                              .setColor('#ff0000')
                              .setTitle('Kullanım: !revive `ID`')
                              .setAuthor('Yanlış Komut Kullnımı')
                         msg.channel.send(embed)
                         return false;
                    } ///
               } else if (args[0] == config.prefix + 'wlsil') { //
                    const member = msg.mentions.members.first();
                    if (!member) {
                         embed
                         .setColor('#ff0000')
                         .setTitle('Kullanım: !removewl `@xayibogantr`')
                         .setAuthor('Yanlış Komut Kullanımı')
                         msg.channel.send(embed)
                         return;
                    }
                    const existRole = member.roles.remove(config.discord_whitelist.role_id)
                    if (existRole) {
                         embed
                         .setColor('#ff0000')
                         .setTitle('Bu kullanıcı zaten whitelist`e sahip.')
                         .setAuthor('HATA')
                         msg.channel.send(embed)
                         return;
                    }
                    member.roles.remove(config.discord_whitelist.role_id)
                    embed
                         .setColor('#0094ff')
                         .setTitle(`Kullanıcı whitelist listesinden kaldırıldı.`)
                         .setAuthor('Whitelist silindi.')
                         msg.channel.send(embed)
                         return;
               } else if (args[0] == config.prefix + 'revive') {
                    if (args[1]) {
                         return exports['xayibogantr-db'].Revive(args[1]);
                    } else {
                         embed
                              .setColor('#ff0000')
                              .setTitle('Kullanım: !revive `ID`')
                              .setAuthor('Yanlış Komut Kullanımı')
                         msg.channel.send(embed)
                         return false;
                    } 
               } else if (args[0] == config.prefix + 'yardım') {
                    embed.setColor('0094ff')
                         .addField('envanter', '**Oyuncu envanteri gösterir.**', true)
                         .addField('parabilgi', '**Oyuncu para kontrolü yapar.**', true)
                         .addField('ban', '**Oyuncu yasaklar.**', true)
                         .addField('kick', '**Oyuncu kickler.**', true)
                         .addField('banliste', '**Ban listesi.**', true)
                         .addField('bankontrol', '**Bir üyenin ban durumunu kontrol eder.**', true)
                         .addField('paraver', '**Para vermek.**', true)
                         .addField('parasil', '**Para silmek.**', true)
                         .addField('oyuncular', '**Aktif oyuncuları listeler.**', true)
                         .addField('meslekver', '**Oyuncuya meslek vermek.**', true)
                         .addField('revive', '**Oyuncuyu canlandır.**', true)
                         .addField('reviveall', '**Herkesi canlandır.**', true)
                         .addField('unban', '**Oyuncu yasak kaldırma.**', true)
                         .addField('eşyaver', '**Oyuncuya eşya ver.**', true)
                         .addField('wlver', '**Oyuncuya wl verme.**', true)
                         .addField('wlsil', '**Oyuncudan wl silme.**', true)
                         .addField('kordinatbelirle', '**Oyuncunun anlık kordinatını belirler.**', true)
                         .addField('skriptbaşlat', '**Skript başlatır.**', true)
                         .addField('skriptdurdur', '**Skript durdurur.**', true)
                         .addField('skriptrefresh', '**Skript yeniler.**', true)
                         .addField('arabaver', '**Oyuncuya araba ver.**', true)
                         .addField('allarabaver', '**Herkese bir araç verme**', true)
                    msg.channel.send(embed);
                    return false;
               } else if (args[0] == config.prefix + 'banliste') {
                    return exports['xayibogantr-db'].GetBannedPlayers();
               } else if (args[0] == config.prefix + 'oyuncular') {
                    return exports['xayibogantr-db'].GetPlayers();
               } else if (args[0] == config.prefix + 'arabaver') {
                    if (args[1] && args[2]) {
                         return exports['xayibogantr-db'].spawnCar(args[1], args[2]);
                    } else {
                         embed
                              .setColor('#ff0000')
                              .setTitle('kullanım: !arabaver `ID` `İsim`')
                              .setAuthor('Yanlış Komut Kullanımı')
                         msg.channel.send(embed)
                         return false;
                    }
               } else if (args[0] == config.prefix + 'allarabaver') {
                    if (args[1]) {
                         return exports['xayibogantr-db'].spawnAllPlayersCar(args[1]);
                    } else {
                         embed
                              .setColor('#ff0000')
                              .setTitle('Kullanım: !allarabaver `ISIM`')
                              .setAuthor('Yanlış Komut Kullanımı')
                         msg.channel.send(embed)
                         return false;
                    }
               } else if (args[0] == config.prefix + 'silahver') {
                    if (args[1] && args[2] && args[3]) {
                         return exports['xayibogantr-db'].giveWeapon(args[1], args[2], args[3]);
                    } else {
                         embed
                              .setColor('#ff0000')
                              .setTitle('Kullanım !silahver `ID` `ISIM` `MIKTAR`')
                              .setAuthor('Yanlış Komut Kullanımı')
                         msg.channel.send(embed)
                         return false;
                    }
               }
          } else {
               embed
                    .setColor('#ff0000')
                    .setDescription('Herhangi bir yetkin yok. xayibogantr`e ulaş.')
                    .setAuthor('HATA')
               msg.channel.send(embed)
               return false;
          }
     }
})

RegisterNetEvent('xayibogantr-db:SendEmbed')
on('xayibogantr-db:SendEmbed', embed => CurrentChannel?.send(SendEmbed(embed)));

SendEmbed = (embed) => {
     const CreateEmbed = new Discord.MessageEmbed().setFooter('xayibogantr')
     embed.description && CreateEmbed.setDescription(embed.description)
     embed.author && CreateEmbed.setAuthor(embed.author)
     embed.color && CreateEmbed.setColor(embed.color)
     embed.title && CreateEmbed.setTitle(embed.title)
     if (embed.fields) {
          for (x in embed.fields) CreateEmbed.addField(embed.fields[x].name, embed.fields[x].value, embed.fields[x].inline || false);
     }
     return CreateEmbed
}

(() => {
     if (config.token === '') return console.log('Lütfen token giriniz.')
     client.login(config.token)
})()
