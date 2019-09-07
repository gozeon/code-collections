import Vue from 'vue'
import mockData from './mockData'

const HoCmponent = (component, fetchData) => {
    return Vue.component("HoCmponent", {
        render(createElement, context) {
            return createElement(component, {
                props: {
                    returnedData: this.returnedData
                },
                on: { ...this.$listeners }
            })
        },
        data() {
            return {
                returnedData: fetchData(mockData)
            }
        }
    })
}


// import Vue from 'vue'
//     import ComponentExample from '@/components/ComponentExample.vue'

//     const HoComponent = (component) => {
//       return Vue.component('withSubscription', {
//         render(createElement) {
//           return createElement(component)
//         } 
//       }
//     }
// const HoComponentEnhanced = HoComponent(ComponentExample);

export default HoCmponent;
