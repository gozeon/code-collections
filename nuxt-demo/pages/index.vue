<template>
    <div>
        <h1>Hello World</h1>
    </div>
</template>

<script>
    export default {
        layout: 'head',
        head: {
            title: 'Home Page'
        },
        mounted() {
            this.$nextTick(() => {
                this.$nuxt.$loading.start()
                setTimeout(() => this.$nuxt.$loading.finish(), 500)
            })
        }
    }
</script>