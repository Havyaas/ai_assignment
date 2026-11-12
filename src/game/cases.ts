import { SuspectProfile } from '../types/interrogation';

export const CASE_FILES: SuspectProfile[] = [
  {
    id: 'case_marcus',
    name: 'Marcus Cole',
    job: 'Art Dealer & Gallery Director',
    crime: 'Theft of the $4,000,000 "Midnight Star" Sapphire Necklace from the gallery vault',
    story: 'Claims he was enjoying dinner with his wife on the rooftop terrace from 8:00 PM until midnight, and only learned about the break-in when the police arrived.',
    truth: 'Marcus is deeply in debt. At 10:15 PM, he slipped down the fire exit stairs, used his manager keycard to shut down the vault alarm, stole the necklace, and hid it in the spare tire of his red sports car.',
    guilt: 'guilty',
    personality: ['Polite', 'Charming', 'Arrogant', 'Defensive when cornered'],
    baseStress: 20,
    panicThreshold: 70,
    breakdownThreshold: 90,
    baseHeartRate: 72,
    weakSpots: ['fire exit', 'rooftop dinner', 'waiter', 'manager keycard', 'red sports car', 'spare tire'],
    difficulty: 'Easy',
    hiddenSecrets: [
      {
        id: 'sec_dinner_alibi',
        title: 'Fake Dinner Alibi',
        description: 'The rooftop waiter testified that Marcus left his table for over 50 minutes between 10:00 PM and 11:00 PM.',
        unlocked: false,
        contradiction: 'He claimed he never left the dinner table, but staff saw his seat empty.',
        evidenceIdRequired: 'ev_waiter'
      },
      {
        id: 'sec_keycard_log',
        title: 'Manager Keycard Swiped',
        description: 'The vault door recorded his personal manager keycard at 10:22 PM.',
        unlocked: false,
        contradiction: 'He claimed he was upstairs, but the electronic lock recorded his keycard.',
        evidenceIdRequired: 'ev_keycard'
      },
      {
        id: 'sec_camera_footage',
        title: 'Fire Escape Security Video',
        description: 'Security camera footage captured a man in Marcus’s distinctive grey suit hurrying down the fire escape with a duffel bag.',
        unlocked: false,
        contradiction: 'Video proof showing him running down the stairs during the exact time of the heist.',
        evidenceIdRequired: 'ev_video'
      }
    ],
    evidenceList: [
      {
        id: 'ev_waiter',
        title: 'Waiter Statement',
        category: 'witness',
        description: 'The head waiter confirms Marcus left the rooftop dinner table alone at 10:05 PM and did not return until almost 11:00 PM.',
        secretTriggerId: 'sec_dinner_alibi',
        hint: 'Directly catches him in a lie about staying at dinner the entire evening.'
      },
      {
        id: 'ev_keycard',
        title: 'Vault Door Keycard Log',
        category: 'document',
        description: 'Electronic access log: "10:22:14 PM - Manager Keycard #04 (Assigned to: Marcus Cole) - Vault Door Unlocked".',
        secretTriggerId: 'sec_keycard_log',
        hint: 'Proves his personal keycard was used inside the vault while he was supposed to be eating dinner.'
      },
      {
        id: 'ev_video',
        title: 'Rear Fire Escape Camera Video',
        category: 'video',
        description: 'Surveillance tape at 10:28 PM shows a tall man in a tailored silver-grey suit carrying a black gym bag out to the parking alley.',
        secretTriggerId: 'sec_camera_footage',
        hint: 'Matches the exact suit Marcus is wearing right now in the interview room.'
      }
    ]
  },
  {
    id: 'case_victoria',
    name: 'Victoria Vance',
    job: 'Heiress & Investment Socialite',
    crime: 'Attempted poisoning of her wealthy uncle Arthur Vance during Sunday family dinner',
    story: 'Claims she had a headache and stayed upstairs in the guest room all evening, never touching any drinks or entering the kitchen.',
    truth: 'Victoria was facing bankruptcy from secret sports betting. She purchased toxic rat poison from a rural farm supply store, slipped it into Arthur’s vintage cognac decanter, but accidentally dropped her gold earring behind the bar cabinet.',
    guilt: 'guilty',
    personality: ['Cold', 'Formal', 'Dismissive of police', 'Panics when confronted with physical proof'],
    baseStress: 25,
    panicThreshold: 68,
    breakdownThreshold: 88,
    baseHeartRate: 76,
    weakSpots: ['cognac decanter', 'guest room', 'farm supply store', 'gold earring', 'gambling debt', 'headache'],
    difficulty: 'Medium',
    hiddenSecrets: [
      {
        id: 'sec_earring',
        title: 'Dropped Gold Earring',
        description: 'Her custom gold pearl earring was recovered directly behind the liquor cabinet where the poisoned drink was poured.',
        unlocked: false,
        contradiction: 'She claimed she never stepped foot downstairs near the bar cabinet.',
        evidenceIdRequired: 'ev_earring'
      },
      {
        id: 'sec_receipt',
        title: 'Farm Supply Receipt',
        description: 'A store receipt from Thursday shows Victoria purchased high-strength concentrated strychnine rat poison.',
        unlocked: false,
        contradiction: 'Matches the exact toxic substance found in her uncle’s hospital toxicology report.',
        evidenceIdRequired: 'ev_receipt'
      },
      {
        id: 'sec_text_messages',
        title: 'Debt Collector Text Messages',
        description: 'Urgent messages demanding $250,000 by Monday morning or her car and condo would be repossessed.',
        unlocked: false,
        contradiction: 'Reveals her motive: her uncle Arthur had just promised her a $500,000 inheritance.',
        evidenceIdRequired: 'ev_texts'
      }
    ],
    evidenceList: [
      {
        id: 'ev_earring',
        title: 'Gold Pearl Earring',
        category: 'photo',
        description: 'Found under the liquor trolley in the dining room. Victoria is currently only wearing one earring in her right ear.',
        secretTriggerId: 'sec_earring',
        hint: 'Proves she was standing right at the bar decanter where the poison was mixed.'
      },
      {
        id: 'ev_receipt',
        title: 'Farm Supply Store Receipt',
        category: 'receipt',
        description: 'Credit card receipt from "Valley Agriculture Supplies" dated 3 days ago for bottle of liquid rodenticide.',
        secretTriggerId: 'sec_receipt',
        hint: 'Destroys any claim that she had no access to the chemical used.'
      },
      {
        id: 'ev_texts',
        title: 'Confiscated Cell Phone Messages',
        category: 'document',
        description: 'Messages from a private lender: "Final warning, Victoria. Pay the quarter million by Monday or we freeze your assets."',
        secretTriggerId: 'sec_text_messages',
        hint: 'Proves she was desperate for her uncle’s estate money immediately.'
      }
    ]
  },
  {
    id: 'case_bobby',
    name: 'Bobby Rivera',
    job: 'Night Security Guard at First City Bank',
    crime: 'Aided armed robbers in clearing out $2 Million in cash from the main bank vault',
    story: 'Claims he was totally innocent: armed robbers ambushed him at the rear door, put a gun to his head, and tied him up tightly.',
    truth: 'Bobby is NOT a violent robber and never wanted anyone hurt. The robbery gang kidnapped his younger brother and threatened to shoot him unless Bobby used his guard code to unlock the alley security doors. He was a coerced accomplice who acted under extreme distress.',
    guilt: 'accomplice',
    personality: ['Nervous', 'Guilt-ridden', 'Scared for family', 'Wants to protect his brother'],
    baseStress: 40,
    panicThreshold: 72,
    breakdownThreshold: 88,
    baseHeartRate: 88,
    weakSpots: ['robbers', 'tied up', 'rear door code', 'brother', 'hostage', 'ransom call'],
    difficulty: 'Hard',
    hiddenSecrets: [
      {
        id: 'sec_loose_ropes',
        title: 'Ropes Were Tied Loosely',
        description: 'Forensics noted the ropes around his wrists were tied with loose slip-knots and had zero struggle marks.',
        unlocked: false,
        contradiction: 'Indicates he was allowed to untie himself easily after the robbers escaped.',
        evidenceIdRequired: 'ev_ropes'
      },
      {
        id: 'sec_ransom_voicemail',
        title: 'Threatening Voicemail About Brother',
        description: 'Audio message received at 11:30 PM: "Open the bank door tonight, Bobby, or you will never see your brother Leo again."',
        unlocked: false,
        contradiction: 'Proves Bobby was coerced and was not the mastermind or a greedy thief.',
        evidenceIdRequired: 'ev_audio'
      },
      {
        id: 'sec_security_pin',
        title: 'Manual Door Disarm',
        description: 'Alarm panel shows Bobby entered his personal security PIN calmly without triggering the duress alarm.',
        unlocked: false,
        contradiction: 'Shows he cooperated with the entry, confirming his role as an accomplice.',
        evidenceIdRequired: 'ev_alarm_log'
      }
    ],
    evidenceList: [
      {
        id: 'ev_ropes',
        title: 'Police Crime Scene Photo (Ropes)',
        category: 'photo',
        description: 'Shows the ropes found at Bobby’s chair. The knots were simple slipknots and Bobby’s wrists had no rope burns or bruises.',
        secretTriggerId: 'sec_loose_ropes',
        hint: 'Questions whether he was truly helpless or had an arrangement with the robbers.'
      },
      {
        id: 'ev_audio',
        title: 'Recorded Voicemail on Bobby’s Phone',
        category: 'document',
        description: 'Caller says: "We have Leo. Follow instructions at the bank tonight and nobody gets hurt."',
        secretTriggerId: 'sec_ransom_voicemail',
        hint: 'Reveals the real reason he cooperated—his brother was being held hostage!'
      },
      {
        id: 'ev_alarm_log',
        title: 'Alarm Company Keypad Log',
        category: 'document',
        description: 'Guard PIN entered at 1:15 AM with standard code instead of the silent emergency 911 alert code.',
        secretTriggerId: 'sec_security_pin',
        hint: 'Proves he intentionally allowed the robbers inside without alerting police.'
      }
    ]
  }
];
