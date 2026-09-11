const scenarios = [
  { id: 'injunction', context: 'It is almost closing time. A client says a rival company stole their secret design and plans to launch it tomorrow. You have very little time to act.' },
  { id: 'fintech', context: 'Your friends build a payment app and it suddenly becomes popular. An investor is ready, but the app collects user data and nobody is sure who owns the code.' },
  { id: 'eviction', context: 'A community is told to leave their homes within 48 hours. Some families have land papers, others do not, and builders are already waiting nearby.' },
  { id: 'deepfake', context: 'On election day, a fake-looking audio clip spreads online. It seems to show a student candidate offering bribes, but the candidate says it was made with AI.' },
  { id: 'music', context: 'A young musician gets an exciting record deal. The money looks good, but the label wants to own the music, the artist’s image and even future songs.' },
  { id: 'oilspill', context: 'Oil has entered the water used by a fishing village. The company says it is not responsible, while families have lost food and income.' },
  { id: 'cyberattack', context: 'Hackers break into a bank and see customer information. The attack has stopped, but the bank must decide what to tell customers and the government.' },
  { id: 'wrongfularrest', context: 'Police arrest a teenager because he looks like someone in a blurry video. He has been held for three days, and parts of the police story do not match.' },
  { id: 'merger', context: 'Two large companies want to join together. The deal may save jobs, but smaller businesses fear that the new company will become too powerful.' },
  { id: 'climatebill', context: 'A new clean-air law could make cities healthier. But bus and taxi owners say the cost may force many of them out of work.' },
  { id: 'discipline', context: 'A university says a final-year student cheated because computer software flagged an exam. The hearing is tomorrow, but the student has not seen the full report.' },
  { id: 'healthdata', context: 'A health app wants to use patient records to teach an AI system. It could help doctors, but patients never agreed to this use of their information.' },
  { id: 'inheritance', context: 'Three siblings inherit the family business. One wants to keep it, one wants to sell it, and their late parent left two different documents.' },
  { id: 'marketplace', context: 'A huge shopping app tells every seller to use its own payment service. Shopping becomes easier, but small payment companies begin to disappear.' },
  { id: 'procurement', context: 'A government worker finds papers suggesting that a public contract was fixed for one company. Speaking up could expose the truth but may cost the worker their job.' },
  { id: 'sportsdeal', context: 'A young athlete gets a major sponsorship offer before a big tournament. The brand wants full control of social posts and can cancel after any bad publicity.' },
  { id: 'refugeeclinic', context: 'A family may be sent out of the country in one week. Their papers are missing, and one of the children needs urgent medical care.' },
  { id: 'constitution', context: 'Nigeria wants a fairer way to choose senior judges. Politicians want a say, while judges worry that politics could control the courts.' },
];

const scenarioArt = {
  injunction: ['3d', 0], fintech: ['3d', 1], eviction: ['3d', 2], oilspill: ['3d', 3], wrongfularrest: ['3d', 4], climatebill: ['3d', 5], inheritance: ['3d', 6], sportsdeal: ['3d', 7], constitution: ['3d', 8],
  deepfake: ['anime', 0], music: ['anime', 1], cyberattack: ['anime', 2], merger: ['anime', 3], discipline: ['anime', 4], healthdata: ['anime', 5], marketplace: ['anime', 6], procurement: ['anime', 7], refugeeclinic: ['anime', 8],
};

const decisionAngles = [
  { id: 'first-move', prompt: 'What would you want to do first?', options: [
    ['Build a strong argument and prepare to defend it', { advocacy: 3, public: 1 }],
    ['Bring everyone together and work out a practical deal', { corporate: 3, research: 1 }],
    ['Speak with the people affected and find out what they need', { rights: 3, advocacy: 1 }],
    ['Understand the technology and the new legal problem it creates', { technology: 3, research: 2 }],
  ] },
  { id: 'pressure', prompt: 'The clock is ticking. Which challenge sounds most exciting?', options: [
    ['Answering tough questions and defending my side on the spot', { advocacy: 3 }],
    ['Finding a solution that makes legal and business sense', { corporate: 3 }],
    ['Digging through the facts until the real answer becomes clear', { research: 3, technology: 1 }],
    ['Helping the government act quickly without treating anyone unfairly', { public: 3, rights: 1 }],
  ] },
  { id: 'role', prompt: 'A team is formed to solve the problem. Which role would you pick?', options: [
    ['The speaker who presents the case and wins people over', { advocacy: 3 }],
    ['The negotiator who helps everyone reach a useful agreement', { corporate: 3 }],
    ['The person who makes sure nobody is ignored or treated unfairly', { rights: 3 }],
    ['The adviser who improves the rules so the problem does not happen again', { research: 2, public: 3 }],
  ] },
  { id: 'evidence', prompt: 'You have time to check only one thing. What do you choose?', options: [
    ['Government records showing who made each decision and why', { public: 3, advocacy: 1 }],
    ['The contracts and money behind the problem', { corporate: 3 }],
    ['How the problem is affecting real people every day', { rights: 3 }],
    ['The phone, app, data or technology at the centre of the story', { technology: 3, research: 2 }],
  ] },
  { id: 'outcome', prompt: 'Which ending would make you feel proudest?', options: [
    ['Winning the case because my argument changed the decision', { advocacy: 3 }],
    ['Creating a deal that works and prevents another fight', { corporate: 3 }],
    ['Helping the people harmed and protecting others like them', { rights: 3, public: 1 }],
    ['Creating a clearer rule that people can use in the future', { research: 3, technology: 1 }],
  ] },
  { id: 'tradeoff', prompt: 'Every answer has a downside. Which hard choice would you enjoy solving?', options: [
    ['Letting the government act fast while keeping the process fair', { public: 3, advocacy: 1 }],
    ['Making a clear deal while leaving room for future changes', { corporate: 3 }],
    ['Helping many people without badly hurting a smaller group', { rights: 3, public: 2 }],
    ['Supporting new technology without losing privacy or ownership rights', { technology: 3, research: 2 }],
  ] },
];

export const careerQuestionBank = scenarios.flatMap((scenario) => decisionAngles.map((angle) => ({
  id: `${scenario.id}-${angle.id}`,
  scenarioId: scenario.id,
  angleId: angle.id,
  scenario: scenario.context,
  art: scenarioArt[scenario.id],
  text: angle.prompt,
  options: angle.options,
})));

function shuffled(items) {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
}

export function selectCareerQuestions(count = 12, recentIds = []) {
  const recent = new Set(recentIds);
  const selected = [];
  const usedScenarios = new Set();
  const firstStyle = Math.random() < 0.5 ? '3d' : 'anime';

  while (selected.length < count) {
    let added = false;
    for (const angle of shuffled(decisionAngles)) {
      const desiredStyle = selected.length % 2 === 0 ? firstStyle : firstStyle === '3d' ? 'anime' : '3d';
      const candidates = shuffled(careerQuestionBank.filter((question) => question.angleId === angle.id && question.art[0] === desiredStyle && !usedScenarios.has(question.scenarioId)));
      const question = candidates.find(({ id }) => !recent.has(id)) || candidates[0];
      if (!question) continue;
      selected.push(question);
      usedScenarios.add(question.scenarioId);
      added = true;
      if (selected.length === count) break;
    }
    if (!added) break;
  }

  return selected;
}
