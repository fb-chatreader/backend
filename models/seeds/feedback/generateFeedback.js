/**
 * Use this to generate dummy user feedback
 * -- @PARAMS: desired number of feedback items 
 */

const LOREM_IPSUM =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. ';

function generateDummyUserData(qty) {
  const dummyData = [];
  for (let i = 0; i < qty; i++) {
    DUMMY_DATA.push({
      feedback_score: getRandomInt(5),
      additional_feedback: LOREM_IPSUM,
      email: 'ireadrillgud@dummydatadumps.nerds'
    });
  }
  return dummyData;
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

module.exports = generateDummyUserData;
