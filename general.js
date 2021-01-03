//Check value for forbidden characters or empty strings
// function checkInput(value) {
//   if (
//     value !== null &&
//     CharacterCheck(value) &&
//     value !== "" &&
//     value.length <= 20
//   )
//     return true;
//   else return false;

//   function CharacterCheck(str) {
//     return !/[\s~`!@#$%\^&*+=\-\[\]\\';,/{}|\\":<>\?()\._]/g.test(str);
//   }
// }

function checkInput(str) {
  if (str !== null && Check(str) && str !== "" && str.length <= 20) return true;
  else return false;

  function Check(str) {
    console.log(/^[A-Za-z0-9]+$/.test(str));
    return /^[A-Za-z0-9]+$/.test(str);
  }
}

module.exports = checkInput;
