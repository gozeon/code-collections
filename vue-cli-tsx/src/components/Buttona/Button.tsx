import Component from "vue-class-component";
import * as tsx from "vue-tsx-support";
import {VNode} from "vue";

interface MyComponentProps {
    text: string;
}

interface Events {
    onSuccess: void;
}

@Component({
    props: {
        text: {type: String, required: true}
    }
})
class MyComponent extends tsx.Component<MyComponentProps, Events> {
    render(): VNode {
        return <button onClick={() => this.$emit('success', 'test')}>{this.text}</button>
    }
}

export {MyComponent}