// interface Args {
//   height: number,
//   mass: number
// }

// const parseArguments = (args: Array<string>): Args => {
//   if (args.length < 4) throw new Error('Not enough arguments');
//   if (args.length > 4) throw new Error('Too many arguments');

//   if (!isNaN(Number(args[2])) && !isNaN(Number(args[3]))) {
//     return {
//       height: Number(args[2]),
//       mass: Number(args[3])
//     };
//   } else {
//     throw new Error('Provided values were not numbers!');
//   }
// };

export const calculateBmi = (height: number, mass: number) : string => {
  const heightInMeters = height * 0.01;
  const bmi = mass / (heightInMeters * heightInMeters);

  switch (true) {
    case (bmi <= 15):
      return 'Very severely underweight';
    case (bmi <= 16):
      return 'Severely underweight';
    case (bmi <= 18.5):
      return 'Underweight';
    case (bmi <= 25):
      return 'Normal (healthy weight)';
    case (bmi <= 30):
      return 'Overweight';
    case (bmi <= 35):
      return 'Obese Class I (Moderately obese)';
    case (bmi <= 40):
      return 'Obese Class II (Severely obese)';
    case (bmi > 40):
      return 'Obese Class III (Very severely obese)';
    default:
      return 'Error';
  }
};

// try {
//   const { height, mass } = parseArguments(process.argv);
//   console.log(calculateBmi(height, mass));
// } catch (e) {
//   // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
//   console.log(e.message);
// }
