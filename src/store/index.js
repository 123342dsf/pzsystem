import { createStore} from 'vuex'
import menu from './menu'
import createPersistedstate from 'vuex-persistedstate'
export default createStore({
    //key是存储在localStorage中的键名
    plugins: [new createPersistedstate(
        {
            key: 'pz_v3pz',
        }
    )],
    modules:{
        menu
    }
})