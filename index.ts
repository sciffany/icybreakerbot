import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
} from "firebase/firestore";
import { db } from "./src/firebase";
import { Telegraf } from "telegraf";
require("dotenv").config();

const bot = new Telegraf(process.env.TELEGRAM_API_KEY as string);

bot.help((ctx) =>
  ctx.reply(
    "I help break the ice 🧊 by asking trivia questions about a person. To add a person, type /join <name>. To start the game, type /start. I will ask questions, and you can each guess trivia about the chosen person. Don't forget to use spoilers for your answer!"
  )
);
bot.launch();

bot.hears(/\/join (.*)$/, async (ctx) => {
  const name = ctx.match[1];

  const chatId = ctx.chat.id;

  await setDoc(doc(db, `chats/${chatId}/people/${ctx.message.from.id}`), {
    name,
  });

  await ctx.reply(`Added ${name} to the game!`);
});

bot.hears(/\/award (.*)$/, async (ctx) => {
  const name = ctx.match[1];

  const chatId = ctx.chat.id;
  const peopleDocs = query(collection(db, `chats/${chatId}/people`));
  const querySnapshot = await getDocs(peopleDocs);
  const peopleList = querySnapshot.docs;
  const person = peopleList.find(
    (person) => person.data().name.toLowerCase() === name.toLowerCase()
  );

  if (!person) {
    await ctx.reply(`Could not find ${name} in the game.`);
    return;
  }

  const personRef = doc(db, `chats/${chatId}/scores/${person.id}`);
  const personDoc = await getDoc(personRef);
  const score = personDoc.exists() ? personDoc.data().score : 0;

  await setDoc(personRef, { score: score + 100 }, { merge: true });

  await ctx.reply(`Awarded 100 points to ${name}!`);

  const scoresDocs = query(collection(db, `chats/${chatId}/scores`));
  const scoresQuerySnapshot = await getDocs(scoresDocs);
  const scoresList = scoresQuerySnapshot.docs;
  const scores = scoresList.map((score) => {
    return `💎 ${
      peopleList.find((person) => person.id === score.id)?.data().name
    } - ${score.data().score}`;
  });

  await ctx.reply(`Scores:\n${scores.join("\n")}`);
});

bot.hears(/\/scores$/, async (ctx) => {
  const chatId = ctx.chat.id;
  const peopleDocs = query(collection(db, `chats/${chatId}/people`));
  const querySnapshot = await getDocs(peopleDocs);
  const peopleList = querySnapshot.docs;

  const scoresDocs = query(collection(db, `chats/${chatId}/scores`));
  const scoresQuerySnapshot = await getDocs(scoresDocs);
  const scoresList = scoresQuerySnapshot.docs;
  const scores = scoresList.map((score) => {
    return `💎 ${
      peopleList.find((person) => person.id === score.id)?.data().name
    } - ${score.data().score}`;
  });

  await ctx.reply(`Scores:\n${scores.join("\n")}`);
});

bot.hears(/\/start$/, async (ctx) => {
  const chatId = ctx.chat.id;
  const q = query(collection(db, `chats/${chatId}/people`));
  const querySnapshot = await getDocs(q);
  const peopleList = querySnapshot.docs;

  const sequenceNumberRef = await getDoc(doc(db, `chats/${chatId}`));
  if (!sequenceNumberRef.data().hasOwnProperty("number")) {
    await setDoc(doc(db, `chats/${chatId}`), { number: 0 }, { merge: true });
  } else {
    if ((sequenceNumberRef.data().number || 0) + 1 >= peopleList.length) {
      await setDoc(doc(db, `chats/${chatId}`), { number: 0 }, { merge: true });
    }
    await setDoc(
      doc(db, `chats/${chatId}`),
      { number: (sequenceNumberRef.data().number || 0) + 1 },
      { merge: true }
    );
  }
  const sequenceNumberRef2 = await getDoc(doc(db, `chats/${chatId}`));
  const person = peopleList[sequenceNumberRef2.data().number];

  const question =
    listOfQuestions[Math.floor(Math.random() * listOfQuestions.length)];

  await ctx.reply(
    `Everybody guess: ${question.replace(
      "{person}",
      person.data().name
    )} Make sure to use spoilers.`
  );
});

// Enable graceful stop
process.once("SIGINT", () => {
  bot.stop("SIGINT");
});
process.once("SIGTERM", () => {
  bot.stop("SIGTERM");
});

const listOfQuestions = `Who is {person}'s favorite anime character?
What is {person}'s favorite anime?
What would {person} likely go to jail for?
What would {person} be likely to be famous for?
Does {person} like their current job?
What is {person}'s love language?
What side hustle did {person} think about doing or did?
What is {person}'s future career goal?
What does {person} often wear to work?
What are three adjectives people would use to describe {person}?
How would {person} describe their younger siblings if any? 
How would {person} describe their older siblings if any? 
What is a memory {person} had with their grandparents?
What type of humor never fails to make {person} laugh?
Does {person} collect anything?
What is the last concert {person} has gone to if any?
What cause is {person} most passionate about?
What is one brave thing {person} has done?
What is {person}'s enneagram type?
What are musical instruments {person} can play if any?
What simple thing does {person} derive joy in?
What app does {person} use the most other than social/utility/reference apps?
What is {person}'s fave junk food?
What is {person}'s best recipe?
How does {person} calm themselves down? 
What does {person} nerd out about?
What podcast does {person} listen to?
What is {person}'s fave type of cuisine?
Is {person} a morning person or night owl?
What is {person}'s favorite type of music?
What is {person}'s least favorite type of music?
What is {person}'s favorite band?
What is {person}'s MBTI?
If {person} could eat one thing for the rest of their life, what would it be?
What did {person} want to be when they were seven years old?
What did {person} want to be at fourteen years old?
What major would {person} have pursued if not their current one?
What job would {person} be bad at?
What is {person}'s first job?
What is {person}'s worst job?
What is the most recent show {person} watched? 
What was {person}'s childhood movie on repeat?
What is {person}'s fave genre of show?
What is {person}'s least favorite genre of show?
What does {person} eat for breakfast?
What does {person} most often do in their free time?
How many languages does {person} speak?
What language does {person} most want to learn right now?
What is the latest thing {person} tried to learn?
What is {person} looking forward to this weekend?
How did {person} spend the last weekend?
How did {person} spend their last holiday?
What is {person} going to do over the weekend?
What is the most recent dream {person} could remember?
Where was is {person}'s earliest memory?
What is {person}'s favorite city?
Where is {person}'s next travel plan?
Where was {person}'s previous travel destination?
How many cellphones has {person} had in their lifetime?
What is {person}'s fave ice cream flavor?
What is {person}'s fave cake flavor?
What is {person}'s favorite movie?
What is one movie {person} didn't like?
What is {person}'s favorite book?
What is {person}'s favorite color?
What is {person}'s second favorite color?
What is {person}'s favorite animal?
What is {person}'s favorite sport?
What sport does {person} most often play/do?
What extra activity did {person} used to have in school?
Who is {person}'s favorite celebrity?
What is {person}'s favorite holiday destination?
What is {person}'s favorite season?
What is {person}'s favorite subject in school?
What is {person}'s favorite restaurant?
What is {person}'s favorite song?
What is {person}'s favorite quote?
Who is {person}'s role model?
What is {person}'s dream job (that is different from their current job)?
What is {person}'s favorite board game?
What is {person}'s favorite video game?
What is {person}'s favorite outdoor activity?
What is {person}'s favorite indoor activity?
What is {person}'s favorite activity to do when traveling?
What is {person}'s favorite drink?
What is {person}'s favorite fruit?
What is {person}'s favorite vegetable?
What is {person}'s favorite snack?
What is {person}'s favorite dessert?
What is {person}'s least favorite food?
What is {person}'s hidden talent?
What is one of {person}'s embarrassing moments?
What is {person}'s proudest achievement?
What is {person}'s biggest fear?
What is {person}'s biggest pet peeve?
What is {person}'s favorite childhood memory?
What is {person}'s favorite thing about themselves?
What is {person} known for among friends?
What is {person}'s dream vacation destination?
What is {person}'s favorite car brand?
What is {person}'s favorite type of weather?
What is {person}'s favorite scent?
What is {person}'s favorite clothing brand?
What is {person}'s favorite type of footwear?
What is {person}'s favorite accessory?
What is {person}'s favorite fictional character?
What is {person}'s favorite cartoon show?
What is {person}'s biggest goal in life?
What would {person} save in a fire besides their devices?
What would {person} bring to a deserted island besides devices?
Who is {person}'s best friend?
What is one of {person}'s regrets?
What is {person}'s greatest accomplishment?
What is {person}'s biggest challenge right now?
What is {person}'s go-to karaoke song?
What is {person}'s dream house like?
What is {person}'s favorite childhood memory?
What does {person} consider their greatest strength?
What does {person} consider their greatest weakness?
What was the most adventurous thing {person} has ever done?
What is {person}'s most important value?
What is {person}'s most unusual habit?
What is {person}'s favorite family tradition?
What was {person}'s best birthday ever?
What was {person}'s best birthday present ever?
What is {person}'s favorite way to spend time with friends?
What is {person}'s favorite thing about their job?
What is {person}'s least favorite thing about their job?
How does {person} usually spend their weekend?
What is one of {person}'s best school experiences?
What is one of {person}'s worst school experiences?
What is {person}'s go-to comfort food?
What is {person}'s fave day of the week?
How many siblings does {person} have?
What is {person}'s type?
Does {person} have any pets?
What was the first pet {person} had?
How did {person} first get into their fave hobby?
What was the last thing {person} read?
What is {person}'s fave dog breed`.split("\n");
