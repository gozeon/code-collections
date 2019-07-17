import * as tsx from 'vue-tsx-support'
import {VNode} from "vue";
import {Button} from "@/components/Button";

import style from './Title.css'
import {MyComponent} from "@/components/Buttona/Button";

const Title = tsx.component({
    name: 'my-title',
    props: {
        label: {
            type: String,
            required: true as true
        }
    },
    methods: {
        log: (message: string) => {
            console.log(message)
        }
    },
    render(): VNode {
        return (
            <div>
                <MyComponent text="class style"/>
                <h1 class={style.Title}>{this.label}</h1>
                <Button text="click me!" class={style.Button} onSuccess={(msg: string) => this.log(msg)}/>

            </div>
        )
    }
});

export {Title}