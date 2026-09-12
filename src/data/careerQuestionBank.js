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

// Every case has its own possible moves. Keeping these beside the scenario facts
// prevents a generic answer from being paired with a case where it makes no sense.
const scenarioChoices = {
  injunction: [
    ['Ask a judge for an urgent order stopping tomorrow’s launch', 'Messages and design files showing when the idea was created', 'Stopping the launch before the secret is lost', 'Acting fast without making claims the evidence cannot support', { advocacy: 3 }],
    ['Call the rival company and negotiate a short delay', 'The rival’s launch plan and the client’s likely business loss', 'Reaching a deal that protects both businesses', 'Protecting the design without destroying a useful business relationship', { corporate: 3 }],
    ['Interview the designers whose work may have been taken', 'First-hand accounts from the people who built the design', 'Giving the creators proper credit and protection', 'Defending the client while treating innocent workers fairly', { rights: 3, research: 1 }],
    ['Trace the digital files and access history', 'File dates, account logs and copies of the original design', 'Proving exactly how the digital design moved', 'Using technical evidence without exposing more confidential material', { technology: 3, research: 2 }],
  ],
  fintech: [
    ['Prepare the founders to defend who created the product', 'Emails and early files showing who wrote the code', 'Making sure the real creators keep fair ownership', 'Protecting the founders without overstating what each person contributed', { advocacy: 3 }],
    ['Set clear terms with the investor before accepting the money', 'The investment offer, ownership split and business plan', 'Closing a deal that lets the app grow safely', 'Taking investment without giving away too much control', { corporate: 3 }],
    ['Find out whether users understand how their data is used', 'What the app tells users when it collects their information', 'Giving users a real choice about their personal data', 'Improving privacy without making the app impossible to run', { rights: 3 }],
    ['Map every type of data the app collects and where it goes', 'The app permissions, database records and security settings', 'Building privacy rules into the product itself', 'Using useful data without risking privacy or ownership', { technology: 3, research: 2 }],
  ],
  eviction: [
    ['Seek an urgent court order to pause the eviction', 'Notices, land papers and proof of the 48-hour deadline', 'Keeping families in their homes until the case is heard', 'Moving quickly while presenting every family’s position honestly', { advocacy: 3 }],
    ['Negotiate relocation, compensation and more time', 'The builders’ timetable and the cost of moving each household', 'A practical agreement that prevents people becoming homeless', 'Allowing development while giving residents a fair deal', { corporate: 2, rights: 2 }],
    ['Meet the families and record how removal would affect them', 'Residents’ histories, needs and any promises made to them', 'Protecting the community from an unfair removal', 'Helping paperless families without ignoring valid ownership claims', { rights: 3 }],
    ['Check the public land register and approval process', 'Survey plans, title records and government approvals', 'Finding the lawful owner and a fair process', 'Correcting bad records without delaying the answer forever', { public: 3, research: 2 }],
  ],
  deepfake: [
    ['Challenge the recording before it changes the election', 'Witness answers and inconsistencies in the audio', 'Stopping false evidence from deciding the vote', 'Responding quickly without hiding genuine misconduct', { advocacy: 3 }],
    ['Agree on a fair pause and independent review with both campaigns', 'The election timetable and rules accepted by every candidate', 'Keeping the election credible without needless conflict', 'Checking the clip without unfairly delaying the vote', { corporate: 1, public: 3 }],
    ['Protect the candidate from harm while keeping voters informed', 'How the clip is spreading and the harm it is causing', 'Giving voters truthful information and the candidate a fair hearing', 'Correcting misinformation without silencing public debate', { rights: 3 }],
    ['Use audio tools and source records to test whether it was altered', 'The original file, upload history and signs of AI editing', 'Showing clearly whether the recording is real or fake', 'Using detection technology without pretending it is always perfect', { technology: 3, research: 2 }],
  ],
  music: [
    ['Challenge the clauses that take the artist’s image and future songs', 'The exact rights and years covered by the contract', 'Keeping the artist in control of their creative work', 'Pushing firmly without losing a valuable opportunity', { advocacy: 2, rights: 2 }],
    ['Negotiate better royalties, ownership and exit terms', 'Projected earnings, costs and comparable record deals', 'Signing a deal that rewards both artist and label', 'Getting support now without surrendering the artist’s future', { corporate: 3 }],
    ['Explain every clause so the young artist can choose freely', 'What the artist understands and what the label promised', 'Helping the artist make an informed decision', 'Respecting the artist’s choice while warning about serious risks', { rights: 3 }],
    ['Track how music, images and online content will be licensed', 'Copyright records, streaming rights and digital-use clauses', 'Protecting the music across new platforms', 'Allowing promotion without losing control of digital rights', { technology: 3, research: 1 }],
  ],
  oilspill: [
    ['Build a claim requiring the company to clean up and compensate families', 'Water tests, photographs and records of the spill', 'Winning repair and compensation for the village', 'Proving responsibility without relying on anger alone', { advocacy: 3, rights: 1 }],
    ['Negotiate a funded cleanup and income support plan', 'Cleanup costs and the village’s lost fishing income', 'A workable agreement that restores livelihoods quickly', 'Securing immediate help without letting the polluter escape responsibility', { corporate: 2, rights: 2 }],
    ['Document what the polluted water has done to each family', 'Health reports and accounts from fishers and residents', 'Making the affected people central to the solution', 'Helping the whole village while recognising different levels of loss', { rights: 3 }],
    ['Trace the spill source and test the company’s explanation', 'Pipeline records, expert tests and environmental reports', 'Establishing what happened and preventing another spill', 'Using complex science in a way the community can challenge', { research: 3, public: 1 }],
  ],
  cyberattack: [
    ['Prepare the bank to answer regulators and customer claims', 'The attack timeline and decisions made after discovery', 'Giving an honest account while protecting affected customers', 'Defending the bank without hiding preventable mistakes', { advocacy: 2, public: 2 }],
    ['Coordinate the bank, insurers and security contractors', 'Service contracts, insurance terms and likely financial loss', 'Restoring service with clear responsibility for the cost', 'Moving fast without signing away customers’ rights', { corporate: 3 }],
    ['Tell affected customers what happened and what they can do', 'Which people and personal records were exposed', 'Helping customers protect themselves from further harm', 'Being transparent without creating unnecessary panic', { rights: 3 }],
    ['Study the breach logs and close the security weakness', 'Access logs, stolen data types and the route used by attackers', 'Fixing the weakness and meeting data-protection duties', 'Investigating deeply without keeping exposed data longer than needed', { technology: 3, research: 2 }],
  ],
  wrongfularrest: [
    ['Apply for the teenager’s release and test the police story in court', 'The blurry video, custody record and conflicting statements', 'Getting the teenager released through a strong case', 'Challenging the police firmly while checking every fact', { advocacy: 3 }],
    ['Seek a quick agreement for release while preserving a later claim', 'What the police need to reconsider the identification', 'Ending the detention now without giving up accountability', 'Choosing a fast solution without accepting an unfair accusation', { corporate: 1, rights: 3 }],
    ['Speak privately with the teenager and contact their family', 'The teenager’s account, welfare and treatment in custody', 'Protecting the young person’s dignity and freedom', 'Keeping the teenager safe while the facts are still uncertain', { rights: 3 }],
    ['Compare the video carefully with the arrest records and timeline', 'Image quality, location records and identification procedure', 'Showing whether the identification can be trusted', 'Using technology as evidence without treating it as infallible', { research: 3, technology: 1 }],
  ],
  merger: [
    ['Present the strongest case for or against approving the merger', 'Market figures and evidence about likely harm to competition', 'Helping the decision-maker reach a defensible ruling', 'Arguing one side while dealing honestly with contrary evidence', { advocacy: 3 }],
    ['Design deal terms that preserve jobs and limit market power', 'Company finances, proposed ownership and competitor data', 'Completing a deal with safeguards for the market', 'Saving jobs without creating an unfair monopoly', { corporate: 3 }],
    ['Investigate how workers, customers and small firms may be affected', 'Prices, job plans and accounts from smaller businesses', 'Protecting people who could be overlooked in the deal', 'Helping vulnerable groups without blocking every business change', { rights: 3 }],
    ['Study the market and advise the competition authority', 'Market share, barriers to entry and previous merger results', 'Creating conditions that keep competition healthy', 'Using economic predictions without treating them as certain', { public: 3, research: 2 }],
  ],
  climatebill: [
    ['Defend the bill or challenge unfair parts at a public hearing', 'Health data and evidence about the burden on drivers', 'Winning support for a fair and workable law', 'Arguing urgently for clean air without dismissing people’s livelihoods', { advocacy: 3, public: 1 }],
    ['Create grants and a realistic timetable for cleaner vehicles', 'Upgrade costs, driver incomes and available public funding', 'Making cleaner transport affordable for operators', 'Cutting pollution without pushing drivers out of work', { corporate: 2, public: 2 }],
    ['Listen to commuters, drivers and people harmed by dirty air', 'Personal accounts from workers and affected communities', 'Protecting health while keeping transport accessible', 'Helping the majority without abandoning low-income operators', { rights: 3 }],
    ['Compare policy options and measure their likely effects', 'Air-quality studies, cost forecasts and results from other cities', 'Writing a law that can improve as evidence changes', 'Using the best research while admitting what is uncertain', { research: 3, public: 2 }],
  ],
  discipline: [
    ['Demand the report and defend the student at the hearing', 'The exam script, software report and university procedure', 'Securing a hearing based on evidence the student can answer', 'Acting before tomorrow without making unsupported claims', { advocacy: 3 }],
    ['Propose an independent review before any punishment', 'The review rules and a timetable acceptable to both sides', 'Resolving the dispute without an unfair rushed hearing', 'Finding a quick agreement without hiding possible cheating', { corporate: 2, rights: 2 }],
    ['Help the student understand the allegation and tell their side', 'The student’s account and whether they received a fair process', 'Making sure the student is heard before judgment', 'Protecting the student without assuming the software must be wrong', { rights: 3 }],
    ['Test how the software reached its result and how often it fails', 'The full detection report, error rate and comparison method', 'Giving the panel reliable limits for using the software', 'Using detection tools without allowing a machine to decide guilt', { technology: 3, research: 2 }],
  ],
  healthdata: [
    ['Challenge the use of records collected without patient permission', 'Consent forms and the promises made when data was collected', 'Stopping unlawful use until patients have a real choice', 'Protecting patients without blocking valuable medical research', { advocacy: 2, rights: 2 }],
    ['Create a lawful agreement between the app and health providers', 'Who supplies the data, who profits and who carries the risk', 'Building a responsible project with clear accountability', 'Making innovation possible without trading away patient trust', { corporate: 3 }],
    ['Ask patients what uses they would accept and explain the risks', 'Patient expectations and the sensitivity of each record', 'Giving patients meaningful control over their information', 'Seeking useful research while respecting people who say no', { rights: 3 }],
    ['Design anonymisation, access controls and deletion rules', 'The data fields, model process and chance of identifying a patient', 'Training the system without exposing personal identities', 'Using enough data to help doctors while collecting no more than needed', { technology: 3, research: 2 }],
  ],
  inheritance: [
    ['Ask a court to decide which document reflects the parent’s wishes', 'The two documents, signatures and witnesses', 'Getting a clear ruling that the family can rely on', 'Building a strong case without worsening the family conflict', { advocacy: 3 }],
    ['Help the siblings value the company and negotiate a buyout', 'Accounts, ownership records and each sibling’s proposal', 'Keeping value in the business while treating everyone fairly', 'Preserving the company without forcing one sibling to stay', { corporate: 3 }],
    ['Meet each sibling separately and uncover their real concerns', 'Family history and what the parent told each person', 'Finding a solution the family can live with', 'Respecting emotions without ignoring legal rights', { rights: 2, research: 2 }],
    ['Trace how and when both documents were made', 'Drafts, dates, witness accounts and the parent’s capacity', 'Explaining which document is more reliable and why', 'Following the evidence even if the answer disappoints everyone', { research: 3 }],
  ],
  marketplace: [
    ['Challenge the platform rule before the competition authority', 'Seller contracts and evidence that rivals are being shut out', 'Stopping an unfair rule that controls the whole market', 'Opposing market power without punishing genuine convenience', { advocacy: 3 }],
    ['Design a payment choice that still keeps checkout simple', 'Transaction costs, seller needs and platform security concerns', 'Creating a commercial model open to more providers', 'Keeping shopping easy without locking out competitors', { corporate: 3 }],
    ['Collect stories from small sellers and payment companies', 'Lost income, higher fees and barriers faced by smaller firms', 'Protecting small businesses from unfair exclusion', 'Helping smaller firms without guaranteeing them success', { rights: 3 }],
    ['Study the platform algorithm, payment flow and market data', 'Technical integration rules and changes in competitor numbers', 'Giving regulators evidence-based rules for digital platforms', 'Regulating new technology without freezing useful innovation', { technology: 3, public: 2 }],
  ],
  procurement: [
    ['Prepare protected evidence for an investigation or hearing', 'Tender scores, messages and unexplained changes to the award', 'Proving whether the public contract was fixed', 'Exposing wrongdoing without accusing innocent people', { advocacy: 3, public: 1 }],
    ['Find a safe reporting route and protect the worker’s position', 'Employment rules, whistleblower protection and reporting channels', 'Getting the evidence reviewed without needless personal harm', 'Speaking up while managing a real risk to the worker’s job', { corporate: 1, rights: 3 }],
    ['Listen to the worker and plan around their safety and consent', 'The worker’s knowledge, fears and support network', 'Protecting the person who took the risk to reveal the truth', 'Serving the public while respecting what the worker can safely do', { rights: 3 }],
    ['Audit the tender process against procurement rules', 'Bid records, evaluation criteria and approval history', 'Designing a process that is harder to manipulate next time', 'Increasing scrutiny without making public purchasing unworkably slow', { public: 3, research: 2 }],
  ],
  sportsdeal: [
    ['Push back on cancellation and image-control clauses', 'The wording on publicity, conduct and termination', 'Protecting the athlete from one-sided sponsor power', 'Negotiating firmly without losing support before the tournament', { advocacy: 2, rights: 2 }],
    ['Negotiate payment, content duties and a fair exit', 'The athlete’s schedule, brand value and comparable deals', 'Signing a sponsorship both sides can actually keep', 'Taking a major opportunity without giving up all personal control', { corporate: 3 }],
    ['Explain how the deal may affect the young athlete’s daily life', 'The athlete’s goals, comfort and understanding of the obligations', 'Helping the athlete choose freely with full information', 'Respecting ambition while protecting a young person from pressure', { rights: 3 }],
    ['Map ownership of posts, photographs and performance data', 'Social-media rights, usage periods and data clauses', 'Keeping digital rights clear after the campaign ends', 'Giving the sponsor useful content without permanent control', { technology: 3, research: 1 }],
  ],
  refugeeclinic: [
    ['File an urgent challenge to stop removal next week', 'Removal papers, medical records and the family’s account', 'Keeping the family safe while their case is properly heard', 'Acting urgently despite missing documents', { advocacy: 3, rights: 1 }],
    ['Coordinate officials, doctors and support organisations', 'Travel rules, treatment needs and available safe arrangements', 'Creating a lawful plan that protects the child’s health', 'Finding a practical solution without ignoring immigration rules', { corporate: 1, public: 3 }],
    ['Earn the family’s trust and record why returning may harm them', 'Personal histories, medical needs and risks in the destination country', 'Giving the family dignity and a fair chance to explain', 'Checking difficult facts without treating frightened people like suspects', { rights: 3 }],
    ['Research country conditions and routes for replacing documents', 'Official reports, clinic records and identity evidence', 'Building a reliable case despite gaps in the paperwork', 'Reaching a timely answer without lowering evidence standards unfairly', { research: 3, public: 1 }],
  ],
  constitution: [
    ['Present a public case for safeguards against political control', 'Past appointments and examples of improper influence', 'Winning support for an independent selection process', 'Making a forceful case without suggesting judges need no accountability', { advocacy: 3 }],
    ['Negotiate a balanced appointment panel and voting rules', 'Proposals from judges, politicians and civil society', 'Creating a system that different institutions can trust', 'Sharing power without allowing any group to capture the process', { corporate: 2, public: 2 }],
    ['Make room for citizens and overlooked groups in the debate', 'Public concerns and evidence about who is missing from senior courts', 'Building a judiciary that is independent and broadly trusted', 'Improving representation without turning appointments into popularity contests', { rights: 3, public: 1 }],
    ['Compare appointment systems and test each proposed safeguard', 'Constitutional rules, international examples and local history', 'Designing clear rules that resist future abuse', 'Learning from other countries without copying systems that do not fit Nigeria', { research: 3, public: 2 }],
  ],
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

function optionForAngle([action, evidence, outcome, tradeoff, scores], angleId) {
  const labels = {
    'first-move': action,
    pressure: `Taking responsibility for this: ${action.charAt(0).toLowerCase()}${action.slice(1)}`,
    role: `The teammate who would ${action.charAt(0).toLowerCase()}${action.slice(1)}`,
    evidence,
    outcome,
    tradeoff,
  };
  return [labels[angleId], scores];
}

export const careerQuestionBank = scenarios.flatMap((scenario) => decisionAngles.map((angle) => ({
  id: `${scenario.id}-${angle.id}`,
  scenarioId: scenario.id,
  angleId: angle.id,
  scenario: scenario.context,
  art: scenarioArt[scenario.id],
  text: angle.prompt,
  options: scenarioChoices[scenario.id].map((choice) => optionForAngle(choice, angle.id)),
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
