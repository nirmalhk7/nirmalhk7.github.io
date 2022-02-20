import React from "react";

const quoteList = [
  {
    content:
      "Being realistic is the most commonly traveled road to mediocrity.",
    saidby: "Will Smith",
  },
  {
    content:
      "It’s not enough to be against something. You have to be for something better.",
    saidby: "Tony Stark",
  },
  {
    content:
      "If you want to be a winner, then compare yourself to the best and acknowledge that it will never happen without hard work.",
    saidby: "Jamie Dimon",
  },
  {
    content: "Talk is overrated as a means of settling disputes.",
    saidby: "Tom Cruise",
  },
  {
    content:
      "Sometimes it is the people who no one imagines anything of who do the things that no one can imagine.",
    saidby: "Alan Turing",
  },
  {
    content:
      "Good players win. Great ones break records. Legends change the game.",
    saidby: "Anonymous Racer",
  },
];

const RandomQuote = () => {
  const quote = quoteList[Math.floor(Math.random() * quoteList.length)];
  return (
    <section className="bg-white">
      <div className="narrow m-auto text-center text-h4 pb-6 relative">
        <div className="">
          <blockquote>
            <p>{quote.content} </p>
            <cite>{quote.saidby}</cite>
          </blockquote>
        </div>
      </div>
    </section>
  );
};
export default RandomQuote;
