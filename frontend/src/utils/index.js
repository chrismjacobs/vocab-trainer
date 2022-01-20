import router from '../router'
import store from '../store/store'

// jwt =  [HEADER].[PAYLOAD].[SIGNATURE]
// payload contains studentID/time start/expire data as JSON
export function isValidJwt (jwt) {
  if (!jwt || jwt.split('.').length < 3) {
    // console.log('NOT LOGGED IN')
    return false
  }
  const data = JSON.parse(atob(jwt.split('.')[1]))
  const exp = new Date(data.exp * 1000) // JS deals with dates in milliseconds since epoch
  const now = new Date()
  // console.log('VALIDATION DATA', data, exp, now)
  if (now > exp) {
    store.dispatch('saveData')
    store.dispatch('logout')
    alert('Your login has expired')
    router.push('/login')
    return false
  } else {
    return now < exp
  }
}

export function parseLocal (localObject) {
  // console.log(localObject)
  if (localObject) {
    // console.log('LOCAL OBJECT FOUND')
    return JSON.parse(localObject)
  } else {
    // console.log('NO LOCAL OBJECT')
    return false
  }
}
export function imageValidation (fileInput) {
  // console.log('file', fileInput)
  var filePath = fileInput.value
  // console.log(filePath)
  let fileType = filePath.split('.')[1]

  var allowedExtensions = /(\.jpeg|\.png|\.jpg)$/i

  if (fileInput.files[0].size > 8000000) { // 7 mb for video option
    alert('File is too big!')
    fileInput.value = ''
    return false
  } else if (!allowedExtensions.exec(filePath)) {
    alert('Please upload image: .jpeg/.png only.')
    fileInput.value = ''
    return false
  } else {
    // console.dir(fileInput.files[0])
    var url = window.URL.createObjectURL(fileInput.files[0])
    fetch(url)
      .then(function (res) {
        // console.log('blob')
        return res.blob()
      })
      .then(function (savedBlob) {
        var reader = new FileReader()
        reader.readAsDataURL(savedBlob)
        reader.onloadend = function () {
          let image64 = reader.result.split(',')[1]
          // console.log('blob2', image64)
          localStorage.setItem('imageData', JSON.stringify({ 'image64': image64, 'fileType': fileType }))
          return { 'image64': image64, 'fileType': fileType }
        }
      })
  }
}

export function wordFix (string, cut) {
  // Split string so it's a sequence of characters (ex. "Well hi!" => ["W","e","l","l"," ","h","i","!"])
  let characterArray = string.split('')

  // console.log('WordFix', string, cut)
  // let marker = 0
  if (cut === 'showFL') {
    console.log('showFL')

    var newString = ''
    for (let character in characterArray) {
      // console.log(character, characterArray[character])
      if (character === '0') {
        newString += characterArray[character] + '________________'
      } else if (character === (string.length - 1).toString()) {
        newString += characterArray[character]
      }
      // else if (characterArray[character] === '_' || characterArray[character] === '-' ||
      // characterArray[character] === "'" || characterArray[character] === '.' || characterArray[character] === '&') {
      // newString += characterArray[character]
    }
    return newString
  } else if (cut === 'typos') {
    return getTypos(string)
  } else if (cut === 'scramble') {
    let scramble = ''
    let words = string.split(' ')
    for (let word in words) {
      let wordArray = words[word].split('')
      shuffle(wordArray)
      for (let char in wordArray) {
        scramble += wordArray[char]
      }
      scramble += ' '
    }
    return scramble
  } else {
  // Return a new array by subjecting each character to a function via map
    return characterArray.map(character => {
      if (cut === 'vowels' && /[aeiouyAEIOUY]/.test(character)) {
        character = '_'
        return character
      } else if (cut === 'const' && /[bcdfghjklmnpqrstvwxzBCDFGHJKLMNPQRSTVWXZ]/.test(character)) {
        character = '_'
        return character
      } else if (cut === 'blanks' && /[bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZaeiouAEIOU]/.test(character)) {
        character = '_'
        return character
      } else if (cut === 'blanks' && store.state.userProfile.vocab.includes('apan')) {
        character = '_'
        return character
      } else if (/[ ]/.test(character)) {
        character = '&nbsp;&nbsp;'
        return character
      } else {
        // console.log('else', cut, character)
        return character
      }
    }).join(' ')
  }
}

export function getTypos (str) {
  // http://stackoverflow.com/questions/1431094/how-do-i-replace-a-character-at-a-particular-index-in-javascript
  // eslint-disable-next-line no-extend-native
  String.prototype.replaceAt = function (index, char) {
    return this.substr(0, index) + char + this.substr(index + char.length)
  }

  // console.log(str)

  // define proximity arrays
  var arrayProx = []
  arrayProx['a'] = ['q', 'w', 'z', 'x']
  arrayProx['b'] = ['v', 'f', 'g', 'h', 'n']
  arrayProx['c'] = ['x', 's', 'd', 'f', 'v']
  arrayProx['d'] = ['x', 's', 'w', 'e', 'r', 'f', 'v', 'c']
  arrayProx['e'] = ['w', 's', 'd', 'f', 'r']
  arrayProx['f'] = ['c', 'd', 'e', 'r', 't', 'g', 'b', 'v']
  arrayProx['g'] = ['r', 'f', 'v', 't', 'b', 'y', 'h', 'n']
  arrayProx['h'] = ['b', 'g', 't', 'y', 'u', 'j', 'm', 'n']
  arrayProx['i'] = ['u', 'j', 'k', 'l', 'o']
  arrayProx['j'] = ['n', 'h', 'y', 'u', 'i', 'k', 'm']
  arrayProx['k'] = ['u', 'j', 'm', 'l', 'o']
  arrayProx['l'] = ['p', 'o', 'i', 'k', 'm']
  arrayProx['m'] = ['n', 'h', 'j', 'k', 'l']
  arrayProx['n'] = ['b', 'g', 'h', 'j', 'm']
  arrayProx['o'] = ['i', 'k', 'l', 'p']
  arrayProx['p'] = ['o', 'l']
  arrayProx['q'] = ['q']
  arrayProx['r'] = ['e', 'd', 'f', 'g', 't']
  arrayProx['s'] = ['q', 'w', 'e', 'z', 'x', 'c']
  arrayProx['t'] = ['r', 'f', 'g', 'h', 'y']
  arrayProx['u'] = ['y', 'h', 'j', 'k', 'i']
  arrayProx['v'] = ['', 'c', 'd', 'f', 'g', 'b']
  arrayProx['w'] = ['q', 'a', 's', 'd', 'e']
  arrayProx['x'] = ['z', 'a', 's', 'd', 'c']
  arrayProx['y'] = ['t', 'g', 'h', 'j', 'u']
  arrayProx['z'] = ['x', 's', 'a']
  arrayProx['1'] = ['q', 'w']
  arrayProx['2'] = ['q', 'w', 'e']
  arrayProx['3'] = ['w', 'e', 'r']
  arrayProx['4'] = ['e', 'r', 't']
  arrayProx['5'] = ['r', 't', 'y']
  arrayProx['6'] = ['t', 'y', 'u']
  arrayProx['7'] = ['y', 'u', 'i']
  arrayProx['8'] = ['u', 'i', 'o']
  arrayProx['9'] = ['i', 'o', 'p']
  arrayProx['0'] = ['o', 'p']
  arrayProx['-'] = ['-']
  arrayProx['.'] = ['.']
  arrayProx['&'] = ['&']
  arrayProx["'"] = ["'"]

  var arr = []

  for (var a = 0; a < str.length; a++) {
    var temp = arrayProx[str.charAt(a)]
    if (str.charAt(a) !== ' ' && str.charAt(a) !== '-' && str.charAt(a) !== "'" && str.charAt(a) === (str.charAt(a)).toLowerCase()) {
      for (var b = 0; b < temp.length; b++) {
        var typo = str.replaceAt(a, temp[b])
        arr.push(typo)
      }
    }
  }

  shuffle(arr)

  return arr[0]
}

function shuffle (arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1)); // random index from 0 to i
    [arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

export function checkDevice () {
  var report = navigator.userAgent
  // console.log(report)
  var device = null

  if (report.includes('Windows')) {
    device = 'Windows'
  } else if (report.includes('Android')) {
    device = 'Android'
  } else if (report.includes('Macintosh')) {
    device = 'Macintosh'
  } else if (report.includes('iPad')) {
    device = 'iPad'
  } else if (report.includes('iPhone')) {
    device = 'iPhone'
  } else {
    device = report
  }
  // console.log('DEVICE', device)
  return device
}
