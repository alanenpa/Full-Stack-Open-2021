// interface Args {
//   target: number,
//   values: Array<number>
// }

interface Evaluation {
  periodLength: number,
  trainingDays: number,
  success: boolean,
  rating: number,
  ratingDescription: string,
  target: number,
  average: number
}

// const parseArguments = (args: Array<string>): Args => {
//   if (args.length < 4) throw new Error('Not enough arguments');

//   const data = args.slice(2);
//   if (data.some(n => isNaN(Number(n)))) {
//     throw new Error('Provided values were not numbers!');
//   }
//   const target = data[0];
//     const values = data.slice(1);
//     return {
//       target: Number(target),
//       values: values.map(n => Number(n))
//     };
// };

export const exerciseCalculator = (target: number, array: Array<number>) : Evaluation => {
  const trainingDays = array.filter(n => n > 0);
  const sum = trainingDays.reduce((sum, cur) => {
    return sum + cur;
  });
  const avg = sum / array.length;

  let rating;
  let desc;
  if (avg > target) {
    rating = 3;
    desc = 'that\'s great! keep it up';
  } else if (avg > 1) {
    rating = 2;
    desc = 'you get some exercise but you\'ve yet to reach your target!';
  } else {
    rating = 1;
    desc = 'your body needs more exercise!';
  }

  return { 
    periodLength: array.length,
    trainingDays: trainingDays.length,
    success: array.some(n => n < target) ? false : true,
    rating: rating,
    ratingDescription: desc,
    target: target,
    average: avg
  };
};

// try {
//   const { target, values } = parseArguments(process.argv);
//   console.log(exerciseCalculator(target, values));
// } catch (e) {
//   // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
//   console.log(e.message);
// }