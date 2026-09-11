const scenarios = [
  { id: 'injunction', context: 'At 4:45 p.m., a client learns that a competitor will launch a product tomorrow using confidential designs. The court registry closes soon and the commercial relationship may still be salvageable.' },
  { id: 'fintech', context: 'A student-built fintech suddenly attracts thousands of users. Its founders want investment next week, but its privacy notice is vague and one founder wrote most of the code before the company existed.' },
  { id: 'eviction', context: 'Residents of a waterfront community receive 48-hour demolition notices. Some have allocation papers, many do not, and a new development has already been announced for the land.' },
  { id: 'deepfake', context: 'Hours before a student-union election, a convincing audio clip appears to show a candidate offering bribes. The candidate denies it, the platform will not remove it, and voting has started.' },
  { id: 'music', context: 'An emerging musician is offered a career-changing record deal. The advance is attractive, but the contract assigns masters, likeness rights and income from work not yet created.' },
  { id: 'oilspill', context: 'A fishing community reports polluted water after a pipeline leak. The operator disputes the source, regulators have incomplete records, and families need immediate support.' },
  { id: 'cyberattack', context: 'A bank discovers that attackers accessed customer records. The breach is contained, but customers, regulators and the board may all need different information within hours.' },
  { id: 'wrongfularrest', context: 'A teenager has been held for three days after being mistaken for someone in a grainy video. The family has little money and the station record contains inconsistencies.' },
  { id: 'merger', context: 'Two regional companies plan a cross-border merger. The deal could save jobs, but lenders, minority shareholders and competition regulators want conflicting protections.' },
  { id: 'climatebill', context: 'A proposed climate bill promises cleaner cities but may impose costs that small transport businesses cannot absorb. Legislators want a workable amendment before the next sitting.' },
  { id: 'discipline', context: 'A university accuses a final-year student of examination misconduct based on software detection. The hearing is tomorrow and the student has not seen the full report.' },
  { id: 'healthdata', context: 'A health app wants to use patient histories to train a diagnostic model. The research could save lives, but the original consent form never mentioned artificial intelligence.' },
  { id: 'inheritance', context: 'Three siblings inherit a family business. One kept it running for years, another needs an urgent sale, and their late parent left two documents that appear inconsistent.' },
  { id: 'marketplace', context: 'A dominant online marketplace changes its rules so independent sellers must use its payment service. Consumers may benefit from convenience, but smaller rivals are disappearing.' },
  { id: 'procurement', context: 'A civil servant shares documents suggesting that a public contract was tailored for one bidder. The documents are incomplete and revealing the source could end a career.' },
  { id: 'sportsdeal', context: 'A young athlete is offered a sponsorship before a major tournament. The brand wants exclusivity, constant social posts and the right to end the deal after any controversy.' },
  { id: 'refugeeclinic', context: 'A legal clinic meets a family facing removal within a week. Their documents are scattered across countries and one child has urgent medical needs.' },
  { id: 'constitution', context: 'A constitutional reform committee must propose a new system for appointing senior judges. Public trust is low, political leaders demand accountability and judges fear interference.' },
];

const decisionAngles = [
  { id: 'first-move', prompt: 'You are brought in first. Which contribution would you instinctively take ownership of?', options: [
    ['Prepare the urgent argument, anticipate the other side and decide what relief to seek', { advocacy: 3, public: 1 }],
    ['Map the stakeholders, obligations and deal structure that could resolve the risk', { corporate: 3, research: 1 }],
    ['Meet the people most affected and turn their lived experience into a rights strategy', { rights: 3, advocacy: 1 }],
    ['Identify the novel technical or regulatory issue before choosing a legal route', { technology: 3, research: 2 }],
  ] },
  { id: 'pressure', prompt: 'The facts remain incomplete and the deadline moves closer. What kind of pressure would bring out your best work?', options: [
    ['Thinking on my feet while a decision-maker tests every weakness in the case', { advocacy: 3 }],
    ['Balancing legal exposure with money, timing and the need to keep a project alive', { corporate: 3 }],
    ['Building a defensible position from uncertain evidence and competing authorities', { research: 3, technology: 1 }],
    ['Protecting due process while helping a public institution act responsibly', { public: 3, rights: 1 }],
  ] },
  { id: 'role', prompt: 'A multidisciplinary team is assembled. Which seat at the table feels most natural to you?', options: [
    ['Lead advocate: shape the theory of the case and persuade the final decision-maker', { advocacy: 3 }],
    ['Strategic counsel: negotiate responsibilities and design an agreement people can use', { corporate: 3 }],
    ['Public-interest counsel: keep fairness, access and human consequences central', { rights: 3 }],
    ['Policy adviser: test how the rule will work across institutions and over time', { research: 2, public: 3 }],
  ] },
  { id: 'evidence', prompt: 'You can investigate only one line of evidence before advising. Which would you choose?', options: [
    ['Official records and institutional failures that reveal whether public power was properly used', { public: 3, advocacy: 1 }],
    ['Contracts, financial incentives and the allocation of risk between the parties', { corporate: 3 }],
    ['The unequal impact on individuals who may never reach a courtroom', { rights: 3 }],
    ['The system, data trail or emerging technology that created the legal uncertainty', { technology: 3, research: 2 }],
  ] },
  { id: 'outcome', prompt: 'Months later, which outcome would make you feel your work truly mattered?', options: [
    ['A decisive ruling reached because the strongest argument was clearly presented', { advocacy: 3 }],
    ['A durable arrangement that protects value and prevents the next dispute', { corporate: 3 }],
    ['A remedy that restores dignity and changes what happens to others in the same position', { rights: 3, public: 1 }],
    ['A clearer legal framework that helps future decision-makers handle the issue', { research: 3, technology: 1 }],
  ] },
  { id: 'tradeoff', prompt: 'The obvious solution has a serious downside. Which trade-off would you most want to untangle?', options: [
    ['Swift government action versus due process, accountability and public trust', { public: 3, advocacy: 1 }],
    ['Commercial certainty versus leaving room for the parties to adapt later', { corporate: 3 }],
    ['A broadly useful policy versus the severe harm it may cause a vulnerable minority', { rights: 3, public: 2 }],
    ['Innovation versus privacy, ownership and rules written for an earlier world', { technology: 3, research: 2 }],
  ] },
];

export const careerQuestionBank = scenarios.flatMap((scenario) => decisionAngles.map((angle) => ({
  id: `${scenario.id}-${angle.id}`,
  scenarioId: scenario.id,
  angleId: angle.id,
  scenario: scenario.context,
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

  while (selected.length < count) {
    let added = false;
    for (const angle of shuffled(decisionAngles)) {
      const candidates = shuffled(careerQuestionBank.filter((question) => question.angleId === angle.id && !usedScenarios.has(question.scenarioId)));
      const question = candidates.find(({ id }) => !recent.has(id)) || candidates[0];
      if (!question) continue;
      selected.push(question);
      usedScenarios.add(question.scenarioId);
      added = true;
      if (selected.length === count) break;
    }
    if (!added) break;
  }

  return shuffled(selected);
}
