import * as tsx from 'vue-tsx-support'
import p from "vue-strict-prop"
import {VNode} from "vue";

interface Events {
    onSuccess: (msg: string) => void
}

const Button = tsx.componentFactoryOf<Events>().create({
    name: 'Button',
    props: {
        text: p(String).required
    },
    render(): VNode {
        return <button onClick={() => this.$emit('success', 'test')}>{this.text}</button>
    }
});

export {Button}