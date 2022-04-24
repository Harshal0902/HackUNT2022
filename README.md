# PACT

## 💡 Inspiration

In the era of a pandemic, it is harder than ever to connect with your co-workers. When things are Zoom it's just an excuse to be just less curious. People pay less attention to Zoom than in in-person meetings. And many companies suffer as a result from a culture and productivity standpoint. To tackle this problem we are creating a new way to connect with your co-workers. Our goal of the project is to overcome poor communication on zoom via interactive media chatroom.

## 💻 What it does

- PACT is a video-conferencing application that occasionally prompts users to answer ML-generated questions based on the meeting topics/discussion
  -PACT is also an automatic note-taker: it listens to and records action items from the meeting
- This will boost teamwork and inclusion among coworkers by ensuring that everyone is paying attention to each other's voices
- This will help the employees to have more engaging small talk with coworkers in virtual meetings.
- This will help employees across the country to get a better understanding of the company culture.

## ⚙️ How we built it

- React.Js: For the frontend
- Node.Js and Express.Js: For the backend
- AssemblyAI: For the speech to text
- Hedera: For smart contract
- Tailwind CSS: For the styling
  -HuggingFace T5: For machine learning (question generation)

## 💼 RESPEC Challenge

For this year's RESPEC challenge, we built a website that prompts users to answer some questions about the content of the meeting to check how attentive they are to their coworkers. This promotes teamwork because, in order for teams to work well together, members must be receptive to each other's ideas, perspectives, and backgrounds. PACT creates a safe space for coworkers to voice concerns and share their thoughts and have confidence that they're not just throwing their words into a void but rather, that their coworkers are hearing them out. Our app also promotes accountability because when a coworker suggests something (ie: "try to walk around the office so that you're not sitting in the same position all day long"), a note gets added to their action items/todo list automatically. As such, PACT encourages coworkers to look out for each other, using action items to keep each other accountable.

## 📚 Research

Research is paramount to gaining a full understanding of the user and their needs. Beyond our own experiences, we needed to dig deeper into the web, outside of our network, and find both organizations that could shed light on how better to help our targeted users as well as to conduct research into other similar applications or products. This was crucial to avoid re-inventing the wheel and wasting valuable time and resources. Here are a few of the resources that were helpful to us:

- https://www.sciencedirect.com/science/article/pii/S2590291120300905

According to this article majority of the students preferred quizzes (75.9%) and assignments (56.3%) at the end of every class for effective learning

## 🔐 Best Blockchain Project Using Hedera - MLH

We are using Hedera’s testnet to make a decentralized **Contract Call and Contract Deploy**. Hedera is a decentralized public network that utilizes the Hashgraph consensus algorithm to overcome the traditional limitations of blockchain and allow one to create the next era of fast, fair, and secure applications.

## 🍻 Dream Big and Create More Cheers with AB InBev - MLH

We dream to make this app available to all people who have limited access and want to learn new things and make their dream come true to learn.

## 🌐 Best Domain Name from Domain.com - MLH

- pact.tech

## 🤖 Best Use of AssemblyAI

We are using AssemblyAI's APIs to convert the speech to text. The user can convert his speech to text in the chatroom. We use the /transcript endpoint to make a call to the API using the audio user generates and sends the transcript back to the frontend of the application. We also use the profanity check API to remove curse words from being displayed on our application. Although we implemented the functionality to use AssemblyAI in the backend, we didn't use it in the frontend because we needed an immediate response which was not possible through the API.

Note ⚠️ - The AssemblyAI was taking some time to process the audio and we had to wait for it to finish before we could send the transcript back to the frontend so we had to use react-speech-recognition for that.

## 🧠 Challenges we ran into

- Due to the difference in the time zone it was a bit difficult to collaborate but we managed to get the project done in time. Complete the project in the given time frame.
- Implementing the speech-to-text and ML prediction feature was a bit tricky but we managed to get it done.

## 🏅 Accomplishments that we're proud of

- Completing the project in the given time frame.
- Implementing the speech-to-text and ML prediction feature.

## 📖 What we learned

- Collaboration with other developers.
- How to build a full-stack application.
- How to implement Hedera

## 🚀 What's next for PACT

- Making a mobile app.
- Improving the accuracy of the speech-to-text feature.
- Deploying the app to the web.
