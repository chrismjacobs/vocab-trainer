import tourism1 from '../assets/json/tourism1.json'
import tourism from '../assets/json/tourism.json'
import digital1 from '../assets/json/digital1.json'
import culinary1 from '../assets/json/culinary1.json'
import culinary2 from '../assets/json/culinary2.json'
import generalY from '../assets/json/generalY.json'
import generalW from '../assets/json/generalW.json'
import generalD from '../assets/json/generalD.json'
import generalV from '../assets/json/generalV.json'
import generalT from '../assets/json/generalT.json'
import generalG from '../assets/json/generalG.json'
import generalJW1 from '../assets/json/generalJW1.json'
import generalBell from '../assets/json/generalBell.json'
import generalAlice from '../assets/json/generalAlice.json'
import japanBasic from '../assets/json/japanBasic.json'
import japanPersonal from '../assets/json/japanPersonal.json'
import LNC1 from '../assets/json/LNCV.json'
import Presentation from '../assets/json/Presentation.json'
import food from '../assets/json/food.json'
import helpj from '../assets/json/help.json'
// import Bella from '../assets/json/BellaRedo.json'
// import test from '../assets/json/vqc2.json'
// import cul from '../assets/json/cul.json'
export function dictionaries () {
  const dictionaries = {
    'tourism1': tourism1,
    'tourism': tourism,
    'digital1': digital1,
    'culinary1': culinary1,
    'culinary2': culinary2,
    'generalY': generalY,
    'generalW': generalW,
    'generalD': generalD,
    'generalV': generalV,
    'generalT': generalT,
    'generalG': generalG,
    'generalBell': generalBell,
    'generalJW1': generalJW1,
    'generalAlice': generalAlice,
    'LNC1': LNC1,
    'Presentation': Presentation,
    'high': null,
    'food': food,
    'personalJapanese': japanPersonal,
    'basicJapanese': japanBasic,
    'helpj': helpj
  }
  return dictionaries
}
