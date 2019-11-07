/**
 * Use this to generate dummy user feedback
 * -- @PARAMS: desired number of feedback items 
 */

const LOREM_IPSUM = '';
const DUMMY_DATA = [];

export default function generateDummyUserData(qty) {
  for (let i = 0; i < qty; i++) {
    DUMMY_DATA.push({
      feedback_score: getRandomInt(5),
      additional_feedback: LOREM_IPSUM
    });
  }
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}
