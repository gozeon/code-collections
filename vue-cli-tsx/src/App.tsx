import * as tsx from 'vue-tsx-support'
import {VNode} from "vue";
import {Title} from "@/components/Title/Title";


export default tsx.createComponent({
    name: 'App',
    render(): VNode {
        return (
            <div>
                <Title label='title'  />

            </div>
        )
    }
})
